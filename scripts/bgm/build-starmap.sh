#!/usr/bin/env bash
# Rebuild the main Knowledge Star Map ScoreKit assets.
# Emits Ogg (Chrome/Firefox) + m4a/AAC (Safari/iOS) pairs.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/assets/audio/starmap"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$OUT"

for scene in starmap-theme starmap-click starmap-switch; do
  scorekit --json validate "$HERE/$scene.yaml"
  scorekit --json inspect-instruments "$HERE/$scene.yaml"
done

scorekit build "$HERE/starmap-theme.yaml" -o "$OUT/orbital-library.ogg"
scorekit build "$HERE/starmap-click.yaml" -o "$OUT/star-confirm.ogg" --tail 0.12
scorekit build "$HERE/starmap-switch.yaml" -o "$OUT/atlas-warp.ogg" --tail 0.18

AAC=aac
ffmpeg -hide_banner -encoders 2>/dev/null | grep -q aac_at && AAC=aac_at
for name in orbital-library star-confirm atlas-warp; do
  ffmpeg -v error -y -i "$OUT/$name.ogg" -c:a "$AAC" -b:a 96k -movflags +faststart "$OUT/$name.m4a"
done

echo "done -> $OUT"
