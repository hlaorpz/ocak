#!/usr/bin/env bash
# skill-sync.sh — docs/skills (kanonik) → CC yüzeyi (symlink) + claude.ai yüzeyi (zip)
# Kanonik kaynak tektir (KARAR 458). Bu betik dağıtır, üretmez.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO/docs/skills"
LINK="$REPO/.claude/skills"
ZIPDIR="$REPO/docs/_uretilen/skill-zip"

[ -d "$SRC" ] || { echo "HATA: $SRC yok" >&2; exit 2; }

md5f() { md5 -q "$1" 2>/dev/null || md5sum "$1" | cut -d' ' -f1; }

# bir skill dizininin içerik parmak izi (dosya adı + md5, sıralı)
parmak() (
  cd "$1"
  find . -type f ! -name '.DS_Store' | sort | while read -r f; do
    printf '%s  %s\n' "$(md5f "$f")" "$f"
  done
)

skills() { find "$SRC" -mindepth 1 -maxdepth 1 -type d | sort; }

link_kur() {
  mkdir -p "$REPO/.claude"
  if [ -L "$LINK" ]; then
    mevcut="$(readlink "$LINK")"
    [ "$mevcut" = "../docs/skills" ] && { echo "symlink yerinde: .claude/skills → $mevcut"; return; }
    echo "HATA: .claude/skills başka yere bakıyor ($mevcut) — DUR" >&2; exit 3
  fi
  [ -e "$LINK" ] && { echo "HATA: .claude/skills var ve symlink değil — DUR" >&2; exit 3; }
  ln -s ../docs/skills "$LINK"
  echo "symlink kuruldu: .claude/skills → ../docs/skills"
}

zip_uret() {
  mkdir -p "$ZIPDIR"
  n=0
  while read -r d; do
    ad="$(basename "$d")"
    parmak "$d" > "$ZIPDIR/$ad.parmak"
    ( cd "$SRC" && rm -f "$ZIPDIR/$ad.zip" && zip -qr "$ZIPDIR/$ad.zip" "$ad" -x '*.DS_Store' )
    n=$((n+1))
    echo "zip: $ad.zip"
  done < <(skills)
  echo "→ $n skill zip'lendi: $ZIPDIR  (claude.ai'ye ELLE yüklenir)"
}

kontrol() {
  ayrisma=0
  while read -r d; do
    ad="$(basename "$d")"
    p="$ZIPDIR/$ad.parmak"
    if [ ! -f "$p" ]; then
      echo "AYRIŞMA: $ad — zip hiç üretilmemiş, claude.ai yüzeyi kurulmamış"; ayrisma=1; continue
    fi
    if ! diff -q <(parmak "$d") "$p" >/dev/null; then
      echo "AYRIŞMA: $ad — docs/skills değişti, zip bayat"; ayrisma=1
    fi
  done < <(skills)
  # symlink tarafı: ayrışma tanım gereği imkânsız, yalnız varlık denetlenir
  if [ -L "$LINK" ] && [ "$(readlink "$LINK")" = "../docs/skills" ]; then
    echo "CC yüzeyi: symlink yerinde (ayrışma yapısal olarak imkânsız)"
  else
    echo "AYRIŞMA: .claude/skills symlink'i yok ya da yanlış hedefte"; ayrisma=1
  fi
  [ "$ayrisma" -eq 0 ] && echo "ayrışma yok" || exit 1
}

case "${1:-sync}" in
  sync)    link_kur; zip_uret ;;
  link)    link_kur ;;
  zip)     zip_uret ;;
  --check) kontrol ;;
  *) echo "kullanım: skill-sync.sh {sync|link|zip|--check}" >&2; exit 1 ;;
esac
