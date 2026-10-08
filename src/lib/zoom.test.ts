import { describe, it, expect, vi, afterEach } from 'vitest';

/**
 * `zoomMeetingOlustur` host segmenti — Zoom host'u env'e taşındı.
 *
 * Önce `users/me/meetings` sabitti: meeting'i her zaman OAuth app'in bağlı
 * olduğu hesabın kendi kullanıcısı açıyordu. Artık host `ZOOM_HOST_EMAIL`
 * env'inden geliyor; env yoksa ya da boşluktan ibaretse eski davranış
 * (`me`) korunuyor ve bir uyarı düşüyor — sessiz host kayması olmasın.
 *
 * ⚠ `import.meta.env` Vite tarafından BUILD ZAMANINDA sabitlenir; testte
 * `vi.stubEnv` ile sonradan değiştirilemez. Bu yüzden modül her senaryoda
 * `vi.resetModules()` + taze `import()` ile yükleniyor — stub import'tan
 * ÖNCE kurulmalı. Desen: `payment-provider.test.ts`.
 *
 * Kapsam yalnız host dalı. Token alma, şifre üretimi, hata türleri bu işin
 * yüzeyi değil — dokunulmadı.
 */

/** Kimlik env'leri dolu, `ZOOM_HOST_EMAIL` verilen değerle taze modül. */
async function modulYukle(hostEmail: string | undefined) {
  vi.resetModules();
  vi.stubEnv('ZOOM_ACCOUNT_ID', 'hesap-1');
  vi.stubEnv('ZOOM_CLIENT_ID', 'istemci-1');
  vi.stubEnv('ZOOM_CLIENT_SECRET', 'sir-1');
  vi.stubEnv('ZOOM_HOST_EMAIL', hostEmail as any);
  return import('./zoom.ts');
}

/**
 * İki yanıtlı fetch sahtesi: token endpoint'i bearer döner, geri kalan her
 * URL meeting yanıtı. Dönen mock'un `calls` dizisi URL denetimi için okunur.
 */
function fetchKur() {
  const f = vi.fn(async (url: string | URL) => {
    if (String(url).startsWith('https://zoom.us/oauth/token')) {
      return new Response(JSON.stringify({ access_token: 'jeton-1' }), { status: 200 });
    }
    return new Response(
      JSON.stringify({ id: 987654321, join_url: 'https://zoom.us/j/987654321', password: 'abc12345' }),
      { status: 200 },
    );
  });
  vi.stubGlobal('fetch', f);
  return f;
}

/** Meeting create çağrısının URL'leri — token çağrıları ayıklanır. */
function meetingUrlleri(f: ReturnType<typeof fetchKur>): string[] {
  return f.mock.calls
    .map((c) => String(c[0]))
    .filter((u) => u.includes('/meetings'));
}

const ARGS = { topic: 'Açık Kapı', startTime: '2026-10-20T19:00:00' };

describe('zoomMeetingOlustur — host segmenti ZOOM_HOST_EMAIL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('1 · env dolu → URL encodeURIComponent\'li e-posta, uyarı yok', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const f = fetchKur();
    const { zoomMeetingOlustur } = await modulYukle('ocak+host@yap.com.tr');

    await zoomMeetingOlustur(ARGS);

    expect(meetingUrlleri(f)).toEqual([
      'https://api.zoom.us/v2/users/ocak%2Bhost%40yap.com.tr/meetings',
    ]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('2 · env tanımsız ya da boşluk → users/me/, uyarı çağrı başına bir kez', async () => {
    for (const bosDeger of [undefined, '   ']) {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const f = fetchKur();
      const { zoomMeetingOlustur } = await modulYukle(bosDeger);

      await zoomMeetingOlustur(ARGS);
      await zoomMeetingOlustur(ARGS);

      expect(meetingUrlleri(f)).toEqual([
        'https://api.zoom.us/v2/users/me/meetings',
        'https://api.zoom.us/v2/users/me/meetings',
      ]);
      // Modül seviyesinde bir kez değil — iki çağrı, iki uyarı.
      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn.mock.calls[0][0]).toBe('[zoom] ZOOM_HOST_EMAIL tanımsız, varsayılan host');

      warn.mockRestore();
    }
  });
});
