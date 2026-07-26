#!/usr/bin/env bash
# Rebuild the Venn Spaceport ScoreKit assets.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/src/venn-port/audio"

mkdir -p "$OUT"

scorekit --json validate "$HERE/venn-port-theme.yaml"
scorekit --json inspect-instruments "$HERE/venn-port-theme.yaml"
scorekit build "$HERE/venn-port-theme.yaml" -o "$OUT/orbital-customs.ogg"

scorekit --json validate "$HERE/venn-port-victory.yaml"
scorekit --json inspect-instruments "$HERE/venn-port-victory.yaml"
scorekit build "$HERE/venn-port-victory.yaml" -o "$OUT/clear-to-dock.ogg" --tail 1.5

echo "done -> $OUT"
