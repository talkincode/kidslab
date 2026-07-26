#!/usr/bin/env bash
# Rebuild the Huarong Dao ScoreKit assets.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/src/huarong-dao/audio"

mkdir -p "$OUT"

scorekit --json validate "$HERE/huarong-dao-theme.yaml"
scorekit --json inspect-instruments "$HERE/huarong-dao-theme.yaml"
scorekit build "$HERE/huarong-dao-theme.yaml" -o "$OUT/wooden-gate.ogg"

scorekit --json validate "$HERE/huarong-dao-victory.yaml"
scorekit --json inspect-instruments "$HERE/huarong-dao-victory.yaml"
scorekit build "$HERE/huarong-dao-victory.yaml" -o "$OUT/pass-clear.ogg" --tail 1.5

echo "done -> $OUT"
