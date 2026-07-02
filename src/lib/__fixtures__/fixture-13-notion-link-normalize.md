## section: test-notion-link

Direct internal slug: [Çember sayfası](https://www.notion.so/cember)

Workspace prefix + 32-hex hash (defansif): [Atölye hash'li](https://www.notion.so/workspace/atolye-abc123def456abc123def456abc123de)

Whitelist dışı slug (korunur + warn): [Dış sayfa](https://www.notion.so/external-page-xyz)

Normal external (dokunulmaz): [Normal](https://example.com/sayfa)

Hash fragment (regex match etmez, korunur): [Mektuplar](https://www.notion.so/#mektuplar)

Nested path (regex slug'ı yakalayabilir ama whitelist dışı, korunur): [Yaz kayıt](https://www.notion.so/kayit/yaz-acik-kapi-2026)

ocak.biz canonical (whitelist içi): [Çember sayfası](https://ocak.biz/cember)

ocak.biz www prefix + trailing slash (whitelist içi): [Anadolu](https://www.ocak.biz/anadolu/)

ocak.biz whitelist dışı (korunur + warn): [Eski sayfa](https://ocak.biz/eski-sayfa)

Notion nested basvuru/<slug>-<yıl> (whitelist içi): [Anadolu başvuru notion](https://www.notion.so/basvuru/anadolu-2026)

ocak.biz nested basvuru/<slug>-<yıl> (whitelist içi): [Anadolu başvuru canonical](https://www.ocak.biz/basvuru/anadolu-2026)

ocak.biz nested basvuru/<slug>-<yıl> whitelist dışı (korunur + warn): [Bilinmeyen başvuru](https://ocak.biz/basvuru/unknown-2026)
