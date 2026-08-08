#!/usr/bin/env bash
# baglam.sh — profil bazlı bağlam paketi → pbcopy
# Çıktının ilk satırı manifesttir: Claude ne göremediğini bilir, uydurmaz.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
D="$REPO/docs"

TUM="00-durum.md 01-kararlar.tsv 02-borclar.md 03-sira.md 10-marka.md \
20-ref-site.md 20-ref-protokoller.md 20-ref-notion.md 20-ref-icerik-dili.md \
20-ref-marka.md 20-ref-program.md 20-ref-bot.md CLAUDE.md"

case "${1:-}" in
  kod)
    ICERIR="CLAUDE.md 00-durum.md 01-kararlar.tsv 02-borclar.md 03-sira.md \
20-ref-site.md 20-ref-protokoller.md 20-ref-notion.md" ;;
  icerik)
    ICERIR="00-durum.md 03-sira.md 10-marka.md 20-ref-icerik-dili.md \
20-ref-program.md 20-ref-notion.md" ;;
  marka)
    ICERIR="10-marka.md 20-ref-marka.md 20-ref-program.md 20-ref-icerik-dili.md" ;;
  bot)
    ICERIR="00-durum.md 02-borclar.md 20-ref-bot.md 20-ref-notion.md" ;;
  dokuman)
    ICERIR="CLAUDE.md 00-durum.md 01-kararlar.tsv 02-borclar.md 03-sira.md \
20-ref-protokoller.md" ;;
  *)
    echo "kullanım: baglam.sh {kod|icerik|marka|bot|dokuman}" >&2
    exit 1 ;;
esac

# İÇERMEZ = TUM − ICERIR
ICERMEZ=""
for f in $TUM; do
  case " $ICERIR " in *" $f "*) ;; *) ICERMEZ="$ICERMEZ $f" ;; esac
done
ICERMEZ="$(echo "$ICERMEZ" | xargs)"

MANIFEST="PAKET: $1 · İÇERİR: $(echo $ICERIR | tr ' ' ',') · İÇERMEZ: $(echo $ICERMEZ | tr ' ' ','), 90-kronoloji/*, _arsiv/*, _uretilen/*"

# --- eksik dosya kontrolü: sessiz düşüş yasak ---
EKSIK=""
for f in $ICERIR; do
  [ "$f" = "CLAUDE.md" ] && P="$REPO/$f" || P="$D/$f"
  [ -f "$P" ] || EKSIK="$EKSIK $f"
done
if [ -n "$EKSIK" ]; then
  echo "HATA — profilde tanımlı ama diskte yok:$EKSIK" >&2
  echo "baglam.sh eksik dosyayla paket üretmez (sessiz düşüş yasağı)." >&2
  exit 2
fi

{
  echo "$MANIFEST"
  echo
  for f in $ICERIR; do
    [ "$f" = "CLAUDE.md" ] && P="$REPO/$f" || P="$D/$f"
    echo "===== $f ====="
    cat "$P"
    echo
  done
} | tee >(pbcopy) | {
  # stdout'u yutma, sadece ölç
  SATIR=0; BAYT=0
  while IFS= read -r l; do SATIR=$((SATIR+1)); BAYT=$((BAYT+${#l}+1)); done
  echo "$MANIFEST" >&2
  echo "→ pano: $SATIR satır (wc -l eşdeğeri), ~$BAYT bayt" >&2
}
