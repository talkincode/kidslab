#!/usr/bin/env bash
# 用 scorekit 重建 welcome 页三层 BGM（src/welcome/audio/bgm-{base,mid,epic}.m4a）。
# 依赖: scorekit (https://github.com/talkincode/scorekit) + ffmpeg (aac_at 或 aac 编码器)。
# 场景源码: scripts/bgm/welcome-theme.yaml —— 轨道 0-2=base, 3-5=mid, 6-8=epic。
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/src/welcome/audio"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

scorekit validate "$HERE/welcome-theme.yaml"
scorekit build "$HERE/welcome-theme.yaml" -o "$TMP/theme.wav" --stems

STEMS="$TMP/theme.stems"
AAC=aac; ffmpeg -hide_banner -encoders 2>/dev/null | grep -q aac_at && AAC=aac_at

mix() { # mix <name> <stem1> <stem2> <stem3>
  local name="$1"; shift
  ffmpeg -v error -y \
    -i "$STEMS/$1" -i "$STEMS/$2" -i "$STEMS/$3" \
    -filter_complex "amix=inputs=3:normalize=0,volume=7dB" \
    -c:a "$AAC" -b:a 96k -movflags +faststart "$OUT/bgm-$name.m4a"
}

mkdir -p "$OUT"
mix base 01-music_box.wav 02-harp.wav 03-warm_pad.wav
mix mid  04-slow_strings.wav 05-cello.wav 06-violin.wav
mix epic 07-choir.wav 08-timpani.wav 09-glockenspiel.wav

echo "done → $OUT"
