import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // TZ=UTC — Vercel production ortamıyla aynı (KARAR 385, B23). Kaan'ın
    // makinesi Europe/Istanbul; TZ sabitlenmezse server-yerel tarih hataları
    // yerelde SESSİZCE geçer, yalnız production'da patlar. Suite üretimin
    // koştuğu saat diliminde koşar.
    env: { TZ: 'UTC' },
    snapshotFormat: {
      printBasicPrototype: false,
    },
  },
});
