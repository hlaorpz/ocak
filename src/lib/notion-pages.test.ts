import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { splitBodyByMarkers, resolveNotionPageLinks } from './notion-pages';

const FIXTURES_DIR = join(__dirname, '__fixtures__');

function loadFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf-8');
}

describe('splitBodyByMarkers', () => {
  it('marker yoksa tek markdown fragment döner', () => {
    const out = splitBodyByMarkers('# Sade içerik\n\nMetin.\n');
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({ kind: 'markdown', content: '# Sade içerik\n\nMetin.\n' });
  });

  it('form-anchor marker satırı kesilir, 0-bazlı index korunur, intro yoksa undefined', () => {
    const body = 'Ön metin.\n\n## section: form-anchor\n\nArka metin.\n';
    const out = splitBodyByMarkers(body);
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ kind: 'markdown', content: 'Ön metin.\n' });
    // intro yok — chunk'ta `## section:` etiketi yok, eski davranış
    expect(out[1]).toEqual({ kind: 'form-anchor', index: 0 });
    expect(out[2]).toEqual({ kind: 'markdown', content: 'Arka metin.\n' });
  });

  it('al-ol-ver marker satırı kesilir, fragment kind döner', () => {
    const body = 'Manifesto.\n\n## section: al-ol-ver\n\nSıradaki.\n';
    const out = splitBodyByMarkers(body);
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ kind: 'markdown', content: 'Manifesto.\n' });
    expect(out[1]).toEqual({ kind: 'al-ol-ver' });
    expect(out[2]).toEqual({ kind: 'markdown', content: 'Sıradaki.\n' });
  });

  it('sonraki-bulusma marker satırı kesilir, fragment kind döner', () => {
    const body = '## section: sonraki-bulusma\n\nArkasındaki içerik.\n';
    const out = splitBodyByMarkers(body);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ kind: 'sonraki-bulusma' });
    expect(out[1]).toEqual({ kind: 'markdown', content: 'Arkasındaki içerik.\n' });
  });

  it('etkinlik-takvimi marker satırı kesilir, fragment kind döner (KARAR 153)', () => {
    // /takvim: filtreler yazısı → takvim marker → mini-CTA sırası korunur.
    const body =
      'Filtre düğmeleri.\n\n## section: etkinlik-takvimi\n\nAradığını bulamadın mı?\n';
    const out = splitBodyByMarkers(body);
    expect(out).toHaveLength(3);
    expect(out.map((f) => f.kind)).toEqual([
      'markdown',
      'etkinlik-takvimi',
      'markdown',
    ]);
    expect(out[1]).toEqual({ kind: 'etkinlik-takvimi' });
  });

  it('çoklu form-anchor index artırarak emit edilir (iletisim paterni)', () => {
    const body = '## section: form-anchor\n\nOrta.\n\n## section: form-anchor\n';
    const out = splitBodyByMarkers(body);
    expect(out.filter((f) => f.kind === 'form-anchor')).toEqual([
      { kind: 'form-anchor', index: 0 },
      { kind: 'form-anchor', index: 1 },
    ]);
  });

  it('üç farklı marker bir arada — sıra korunur, her kind doğru', () => {
    const body =
      'Hero.\n\n## section: al-ol-ver\n\n## section: sonraki-bulusma\n\n## section: form-anchor\n\nAlt.\n';
    const out = splitBodyByMarkers(body);
    expect(out.map((f) => f.kind)).toEqual([
      'markdown',
      'al-ol-ver',
      'sonraki-bulusma',
      'form-anchor',
      'markdown',
    ]);
  });

  // KARAR 151 — form-anchor look-backward kuralı
  describe('form-anchor look-backward (KARAR 151)', () => {
    it('form-anchor öncesi son section etiketi içeriğini consume eder, etiketin kendisi çıkarılır', () => {
      const body =
        '## section: hero\n\nHero metni.\n\n## section: cember-davet\n\n**Overline**\n\n## *Başlık*\n\nGövde paragrafı.\n\n## section: form-anchor\n\n## section: sss\n\nSorular.\n';
      const out = splitBodyByMarkers(body);
      // before: hero etiketi + hero metni (cember-davet etiketinden ÖNCEKİ kısım)
      // form-anchor: intro = cember-davet etiketinden SONRAKİ kısım (etiketsiz)
      // after: sss markdown
      expect(out).toHaveLength(3);
      expect(out[0].kind).toBe('markdown');
      expect(out[0]).toEqual({
        kind: 'markdown',
        content: '## section: hero\n\nHero metni.\n',
      });
      expect(out[1]).toEqual({
        kind: 'form-anchor',
        index: 0,
        intro: '**Overline**\n\n## *Başlık*\n\nGövde paragrafı.\n',
      });
      // intro içinde `## section:` etiketi BULUNMAMALI (consume edildi)
      const introContent = (out[1] as { intro?: string }).intro ?? '';
      expect(introContent).not.toMatch(/^##\s+section:/m);
      // before markdown'da cember-davet etiketi BULUNMAMALI
      expect(out[0]).not.toHaveProperty('content', expect.stringContaining('cember-davet'));
    });

    it('öncesi başka section yoksa fragment intro alanı undefined kalır (no-intro)', () => {
      const body = '## section: form-anchor\n\n## section: sss\n\nSorular.\n';
      const out = splitBodyByMarkers(body);
      expect(out[0]).toEqual({ kind: 'form-anchor', index: 0 });
      expect(out[0]).not.toHaveProperty('intro');
    });

    it('öncesi section etiketi VAR ama içerik boşsa intro undefined kalır', () => {
      // section etiketi var ama hemen ardında form-anchor → intro lines boş
      const body = '## section: empty-intro\n\n## section: form-anchor\n';
      const out = splitBodyByMarkers(body);
      expect(out[0]).toEqual({ kind: 'form-anchor', index: 0 });
      expect(out[0]).not.toHaveProperty('intro');
    });

    it('çoklu form-anchor — her biri kendi look-backward consume eder (iletisim paterni)', () => {
      // /iletisim Notion gerçeği: bize-yaz → form-anchor#0 → konum → ates-mektuplari → form-anchor#1
      const body =
        '## section: bize-yaz\n\nÜst intro.\n\n## section: form-anchor\n\n## section: konum\n\nKonum içeriği.\n\n## section: ates-mektuplari\n\nAlt intro.\n\n## section: form-anchor\n\n## section: sss\n';
      const out = splitBodyByMarkers(body);
      const formAnchors = out.filter((f) => f.kind === 'form-anchor');
      expect(formAnchors).toHaveLength(2);
      expect(formAnchors[0]).toEqual({
        kind: 'form-anchor',
        index: 0,
        intro: 'Üst intro.\n',
      });
      expect(formAnchors[1]).toEqual({
        kind: 'form-anchor',
        index: 1,
        intro: 'Alt intro.\n',
      });
      // Arada kalan konum içeriği markdown fragment olarak korunur (etiketiyle birlikte)
      const midMarkdown = out.find(
        (f) => f.kind === 'markdown' && (f as { content: string }).content.includes('konum'),
      );
      expect(midMarkdown).toBeDefined();
    });

    // Fixture-temelli testler — plugin testleriyle paylaşılan kanonik fixture'lar
    // üzerinde loader davranışını da doğrular (#fixture-14, #fixture-14a, #fixture-15).
    it('fixture-14 (scalar) — son section (cember-davet) intro olarak consume edilir', () => {
      const body = loadFixture('fixture-14-form-anchor-scalar.md');
      const out = splitBodyByMarkers(body);
      const fa = out.find((f) => f.kind === 'form-anchor') as {
        kind: 'form-anchor';
        intro?: string;
      };
      expect(fa).toBeDefined();
      expect(fa.intro).toBeDefined();
      expect(fa.intro).toContain('**Yaz Gündönümü Çemberi — Haziran 2026**');
      expect(fa.intro).toContain('## *Ateşin yanında sana da yer var*');
      expect(fa.intro).toContain('Birkaç soru sormak istiyoruz');
      // Etiketin kendisi çıkarılmış
      expect(fa.intro).not.toMatch(/^##\s+section:\s+cember-davet/m);
      // before markdown'ında cember-davet etiketi olmamalı, hero + intro etiketleri kalmalı
      const beforeMd = out
        .filter((f) => f.kind === 'markdown')
        .map((f) => (f as { content: string }).content)
        .join('');
      expect(beforeMd).not.toContain('cember-davet');
      expect(beforeMd).toContain('## section: hero');
      expect(beforeMd).toContain('## section: intro');
    });

    it('fixture-14a (no-intro) — fragment intro alanı undefined kalır', () => {
      const body = loadFixture('fixture-14a-form-anchor-no-intro.md');
      const out = splitBodyByMarkers(body);
      const fa = out.find((f) => f.kind === 'form-anchor');
      expect(fa).toBeDefined();
      expect(fa).toEqual({ kind: 'form-anchor', index: 0 });
      expect(fa).not.toHaveProperty('intro');
    });

    it('fixture-15 (array) — iki anchor, iki ayrı intro (bize-yaz + alt-davet)', () => {
      const body = loadFixture('fixture-15-form-anchor-array.md');
      const out = splitBodyByMarkers(body);
      const fas = out.filter((f) => f.kind === 'form-anchor') as Array<{
        kind: 'form-anchor';
        index: number;
        intro?: string;
      }>;
      expect(fas).toHaveLength(2);
      expect(fas[0].intro).toBeDefined();
      expect(fas[0].intro).toContain('**Overline 1**');
      expect(fas[0].intro).toContain('## *Başlık 1*');
      expect(fas[0].intro).toContain('Üst paragraf.');
      expect(fas[0].intro).not.toMatch(/^##\s+section:\s+bize-yaz/m);
      expect(fas[1].intro).toBeDefined();
      expect(fas[1].intro).toContain('**Overline 2**');
      expect(fas[1].intro).toContain('## *Başlık 2*');
      expect(fas[1].intro).toContain('Orta paragraf.');
      expect(fas[1].intro).not.toMatch(/^##\s+section:\s+alt-davet/m);
    });

    it('intro içinde h2 + liste + paragraf karışımı tümüyle consume edilir (section = atomik)', () => {
      const body =
        '## section: bize-yaz\n\n## _Bize Yaz_\n\nGiriş paragrafı.\n\n- Bullet 1\n- Bullet 2\n\nKapanış paragrafı.\n\n## section: form-anchor\n';
      const out = splitBodyByMarkers(body);
      const fa = out.find((f) => f.kind === 'form-anchor') as {
        kind: 'form-anchor';
        intro?: string;
      };
      expect(fa.intro).toBeDefined();
      expect(fa.intro).toContain('## _Bize Yaz_');
      expect(fa.intro).toContain('Giriş paragrafı.');
      expect(fa.intro).toContain('- Bullet 1');
      expect(fa.intro).toContain('Kapanış paragrafı.');
      // Etiketin kendisi (## section: bize-yaz) intro içinde olmamalı
      expect(fa.intro).not.toMatch(/^##\s+section:\s+bize-yaz/m);
    });
  });
});

describe('resolveNotionPageLinks', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('page-id formatlı href map değerine çevrilir', () => {
    const html =
      'Bizimle <a href="/367b61ebfa8781b7b19dcea2476f8674">iletişim</a> kur.';
    const map = { '367b61ebfa8781b7b19dcea2476f8674': '/iletisim' };
    const out = resolveNotionPageLinks(html, map, '/araclar');
    expect(out).toBe('Bizimle <a href="/iletisim">iletişim</a> kur.');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('birden fazla page-id link aynı html içinde çevrilir', () => {
    const html =
      '<a href="/367b61ebfa878113a25ae7a81a229034">Çember</a> ya da <a href="/367b61ebfa87814a81d8f631d39de528">seremoni</a>.';
    const map = {
      '367b61ebfa878113a25ae7a81a229034': '/cember',
      '367b61ebfa87814a81d8f631d39de528': '/seremoni',
    };
    const out = resolveNotionPageLinks(html, map, '/sen-neredesin');
    expect(out).toContain('href="/cember"');
    expect(out).toContain('href="/seremoni"');
    expect(out).not.toMatch(/href="\/[a-f0-9]{32}"/);
  });

  it('page-id map dışı ise href korunur + warn', () => {
    const html = '<a href="/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">silinmiş</a>';
    const out = resolveNotionPageLinks(html, {}, '/araclar');
    expect(out).toBe(html);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('/araclar');
    expect(warnSpy.mock.calls[0][0]).toContain('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  });

  it('32-hex DIŞI href desenine dokunulmaz (içsel slug, çapalar, query)', () => {
    const html =
      '<a href="/iletisim">A</a> <a href="#esik-1">B</a> <a href="/cember?utm=x">C</a>';
    const out = resolveNotionPageLinks(html, {}, '/test');
    expect(out).toBe(html);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
