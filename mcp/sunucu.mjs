// ocak-mcp — OCAK doküman korpusunu MCP üzerinden servis eden uzak sunucu.
//
// Transport: Streamable HTTP (MCP 2026-07-28). SSE-only eski transport
// deprecated; tek endpoint POST+GET.
// Auth: token HER ZAMAN zorunlu. Authless mod yok — token yoksa sunucu ayağa
// kalkmaz, korumasız açılmaz. İki yüzey, tek sır:
//   başlık (tercih edilen) — `Authorization: Bearer <token>`, yol /mcp
//   yol    (claude.ai için) — /mcp/<token>, başlık yok
// Yol yüzeyi bir ÖDÜNDÜR ve geçicidir (B53): claude.ai custom connector diyaloğu
// bu hesapta başlık kabul etmiyor (9 Ağu ölçümü: dört alan, Request headers yok).
// Request headers açıldığı gün başlığa geçilir ve YOL UCU KODDAN KALDIRILIR.

import { createServer } from 'node:http';
import { createHash, timingSafeEqual } from 'node:crypto';
import { McpServer, createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { araclariKaydet } from './araclar.mjs';
import { DAMGA, KOK, korpusuTara } from './korpus.mjs';

const PORT = Number(process.env.PORT || 3000);
const MCP_YOLU = '/mcp';
const SAGLIK_YOLU = '/saglik';

// ── Token — yer tutucu değil, ortamdan ────────────────────────────────────────
// KARAR 469: sır dokümanda yaşamaz. Değer Railway Variables'ta durur.
const TOKEN = process.env.OCAK_MCP_TOKEN;

// ── Log maskeleme — token hiçbir log satırına yazılmaz ───────────────────────
// Bugün istek yolu basan bir satır yok (ölçüldü), ama yarın olabilir; ayrıca
// SDK'dan gelen hata mesajlarının içeriği garanti edilemez. Bu yüzden maskeleme
// TEK BİR satıra değil, TÜM log çağrılarına uygulanır.
function maskele(parca) {
  let s = typeof parca === 'string' ? parca : String(parca ?? '');
  if (TOKEN) s = s.split(TOKEN).join('***');
  // Token bilinmese bile yol-token deseni maskelenir (ör. başka bir sırla gelen istek).
  return s.replace(/\/mcp\/[^\s/?#"']+/g, '/mcp/***');
}
const gunluk = (...p) => console.log(...p.map(maskele));
const uyari = (...p) => console.warn(...p.map(maskele));
const hataGunlugu = (...p) => console.error(...p.map(maskele));

if (!TOKEN || TOKEN.trim() === '') {
  hataGunlugu(
    'HATA: OCAK_MCP_TOKEN tanımlı değil. Sunucu korumasız açılmaz.\n' +
      'Railway → Variables → OCAK_MCP_TOKEN. Yerelde: OCAK_MCP_TOKEN=... npm start',
  );
  process.exit(1);
}

// ── Sabit zamanlı karşılaştırma ──────────────────────────────────────────────
// İki taraf da SHA-256 ile 32 baytlık sabit uzunluğa indirilir, sonra
// timingSafeEqual. Böylece uzunluk farkında erken çıkış olmaz — düz karşılaştırma
// (ya da uzunluk kontrolüyle başlayan XOR döngüsü) token UZUNLUĞUNU zamanlamayla
// sızdırır.
const TOKEN_OZETI = createHash('sha256').update(TOKEN, 'utf8').digest();

function tokenEsit(verilen) {
  if (typeof verilen !== 'string') return false;
  const ozet = createHash('sha256').update(verilen, 'utf8').digest();
  return timingSafeEqual(ozet, TOKEN_OZETI);
}

// ── İki yüzey, tek doğrulama ─────────────────────────────────────────────────
// Başlık varsa BAŞLIK KAZANIR; yoldaki değer o durumda hiç okunmaz.
// Başarısız her hâl aynı 401'e düşer — "yol var ama token tutmuyor" ile "yol yok"
// ayrımı cevaba yansımaz, yoksa "bu uçta bir şey var" bilgisi sızar.
function sunulanToken(req, yol) {
  const baslik = req.headers['authorization'];
  if (typeof baslik === 'string') {
    const on = 'Bearer ';
    return baslik.startsWith(on) ? baslik.slice(on.length).trim() : '';
  }
  if (!yol.startsWith(MCP_YOLU + '/')) return '';
  const kalan = yol.slice(MCP_YOLU.length + 1);
  // Boş token (E6) ve fazladan segment (E7) reddedilir — yalnız tam eşleşme geçer.
  if (kalan === '' || kalan.includes('/')) return '';
  try {
    return decodeURIComponent(kalan);
  } catch {
    return ''; // bozuk yüzde kodlaması sessizce geçmez
  }
}

// ── MCP kurulumu ─────────────────────────────────────────────────────────────
// Fabrika her istekte çağrılır (2026-07-28 stateless mimarisi): sticky session
// gerekmez, Railway'de birden çok replika sorunsuz koşar.
const handler = createMcpHandler(
  () => {
    const server = new McpServer({ name: 'ocak-mcp', version: '0.1.0' });
    araclariKaydet(server);
    return server;
  },
  {
    onerror: (hata) => hataGunlugu('[mcp]', hata?.message ?? hata),
  },
);

const mcpNodeHandler = toNodeHandler(handler, {
  onerror: (hata) => hataGunlugu('[adaptör]', hata?.message ?? hata),
});

function jsonYaz(res, kod, govde) {
  const g = JSON.stringify(govde);
  res.writeHead(kod, { 'content-type': 'application/json; charset=utf-8' });
  res.end(g);
}

const http = createServer((req, res) => {
  const yol = (req.url || '/').split('?')[0];

  // Sağlık ucu: Railway healthcheck'i için tokensiz, ama hiçbir korpus bilgisi
  // sızdırmaz.
  if (yol === SAGLIK_YOLU) {
    jsonYaz(res, 200, { durum: 'ayakta' });
    return;
  }

  // /mcp ve /mcp/... aynı kapıya girer. Alt yol 404'e DÜŞMEZ — 404 ile 401 ayrımı
  // "bu uçta bir şey var" bilgisini sızdırır.
  const mcpKapisi = yol === MCP_YOLU || yol.startsWith(MCP_YOLU + '/');
  if (!mcpKapisi) {
    jsonYaz(res, 404, { hata: `Bilinmeyen yol. MCP ucu: ${MCP_YOLU}` });
    return;
  }

  if (!tokenEsit(sunulanToken(req, yol))) {
    res.setHeader('www-authenticate', 'Bearer');
    jsonYaz(res, 401, { hata: 'Yetkisiz.' });
    return;
  }

  // Token doğrulandı. İstek yolu /mcp'ye normalize edilir: araç katmanı hangi
  // yüzeyden gelindiğini BİLMEZ, kod dallanmaz. E4 ile E2'nin aynı kodu
  // dönmesinin sebebi tam olarak bu satır.
  const soru = (req.url || '').indexOf('?');
  req.url = MCP_YOLU + (soru >= 0 ? req.url.slice(soru) : '');

  mcpNodeHandler(req, res).catch((hata) => {
    hataGunlugu('[istek]', hata?.message ?? hata);
    if (!res.headersSent) jsonYaz(res, 500, { hata: 'Sunucu hatası.' });
  });
});

http.listen(PORT, () => {
  const t = korpusuTara();
  gunluk(
    `ocak-mcp ayakta · port=${PORT} · uç=${MCP_YOLU} (başlık) + ${MCP_YOLU}/<token> (yol) · commit=${DAMGA.commit} (${DAMGA.commit_kaynak})`,
  );
  gunluk(`kök=${KOK}`);
  gunluk(
    `korpus: ${t.ozet.toplam} dosya (${t.ozet.canli} canlı · ${t.ozet.arsiv} arşiv)` +
      (t.atlananIkili.length ? ` · ${t.atlananIkili.length} UTF-8 olmayan dosya sayımın dışında` : ''),
  );
  if (DAMGA.commit === 'BELİRLENEMEDİ') {
    uyari(
      'UYARI: commit damgası belirlenemedi (.git yok, RAILWAY_GIT_COMMIT_SHA boş). ' +
        'Cevaplar "BELİRLENEMEDİ" taşıyacak — bayatlık gizlenmez ama izlenemez.',
    );
  }
});

for (const sinyal of ['SIGTERM', 'SIGINT']) {
  process.on(sinyal, () => {
    http.close(() => handler.close().then(() => process.exit(0)));
  });
}
