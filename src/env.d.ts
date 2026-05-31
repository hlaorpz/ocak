/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly NOTION_TOKEN: string;
  readonly NOTION_PAGES_DB_ID: string;
  readonly NOTION_EVENTS_DB_ID: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export {};
