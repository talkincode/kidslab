#!/usr/bin/env bash
# Rebuild the main Knowledge Star Map ScoreKit assets.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/assets/audio/starmap"

mkdir -p "$OUT"

for scene in starmap-theme starmap-click starmap-switch; do
  scorekit --json validate "$HERE/$scene.yaml"
  scorekit --json inspect-instruments "$HERE/$scene.yaml"
done

scorekit build "$HERE/starmap-theme.yaml" -o "$OUT/orbital-library.ogg"
scorekit build "$HERE/starmap-click.yaml" -o "$OUT/star-confirm.ogg" --tail 0.12
scorekit build "$HERE/starmap-switch.yaml" -o "$OUT/atlas-warp.ogg" --tail 0.18

echo "done -> $OUT"
