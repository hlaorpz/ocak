// ocak-mcp — OCAK doküman korpusunu MCP üzerinden servis eden uzak sunucu.
//
// Transport: Streamable HTTP (MCP 2026-07-28). SSE-only eski transport
// deprecated; tek endpoint POST+GET.
// Auth: Authorization: Bearer <token> — HER ZAMAN zorunlu. Authless mod yok:
// token yoksa sunucu ayağa kalkmaz, korumasız açılmaz.

import { createServer } from 'node:http';
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
if (!TOKEN || TOKEN.trim() === '') {
  console.error(
    'HATA: OCAK_MCP_TOKEN tanımlı değil. Sunucu korumasız açılmaz.\n' +
      'Railway → Variables → OCAK_MCP_TOKEN. Yerelde: OCAK_MCP_TOKEN=... npm start',
  );
  process.exit(1);
}

// Sabit süreli karşılaştırma — token uzunluğu sızmasın.
function tokenEsit(verilen) {
  const a = Buffer.from(verilen);
  const b = Buffer.from(TOKEN);
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) fark |= a[i] ^ b[i];
  return fark === 0;
}

function yetkili(req) {
  const baslik = req.headers['authorization'];
  if (typeof baslik !== 'string') return false;
  const on = 'Bearer ';
  if (!baslik.startsWith(on)) return false;
  return tokenEsit(baslik.slice(on.length).trim());
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
    onerror: (hata) => console.error('[mcp]', hata?.message ?? hata),
  },
);

const mcpNodeHandler = toNodeHandler(handler, {
  onerror: (hata) => console.error('[adaptör]', hata?.message ?? hata),
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

  if (yol !== MCP_YOLU) {
    jsonYaz(res, 404, { hata: `Bilinmeyen yol. MCP ucu: ${MCP_YOLU}` });
    return;
  }

  if (!yetkili(req)) {
    res.setHeader('www-authenticate', 'Bearer');
    jsonYaz(res, 401, { hata: 'Yetkisiz. Authorization: Bearer <token> gerekli.' });
    return;
  }

  mcpNodeHandler(req, res).catch((hata) => {
    console.error('[istek]', hata?.message ?? hata);
    if (!res.headersSent) jsonYaz(res, 500, { hata: 'Sunucu hatası.' });
  });
});

http.listen(PORT, () => {
  const t = korpusuTara();
  console.log(
    `ocak-mcp ayakta · port=${PORT} · uç=${MCP_YOLU} · commit=${DAMGA.commit} (${DAMGA.commit_kaynak})`,
  );
  console.log(`kök=${KOK}`);
  console.log(
    `korpus: ${t.ozet.toplam} dosya (${t.ozet.canli} canlı · ${t.ozet.arsiv} arşiv)` +
      (t.atlananIkili.length ? ` · ${t.atlananIkili.length} UTF-8 olmayan dosya sayımın dışında` : ''),
  );
  if (DAMGA.commit === 'BELİRLENEMEDİ') {
    console.warn(
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
