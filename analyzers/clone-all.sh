#!/bin/bash
# Clone 8 open-source AI bet analyzers
set -u
cd "$(dirname "$0")"

repos=(
  "kyleskom/NBA-Machine-Learning-Sports-Betting|nba-ml"
  "martineastwood/penaltyblog|penaltyblog"
  "georgedouzas/sports-betting|sports-betting"
  "VincentAuriau/Tennis-Prediction|tennis-ml"
  "NBA-Betting/NBA_AI|nba-ai"
  "WarrierRajeev/UFC-Predictions|ufc-ml"
  "reneleogp/ML-Prediction-LoL|lol-ml"
  "gotoConversion/goto_conversion|goto-conversion"
  "sedemmler/WagerBrain|wagerbrain"
)

for item in "${repos[@]}"; do
  src="${item%%|*}"
  dst="${item##*|}"
  if [ -d "$dst" ]; then
    echo "[skip] $dst already exists"
    continue
  fi
  echo "[clone] https://github.com/$src -> $dst"
  git clone --depth 1 "https://github.com/$src.git" "$dst" 2>&1 | tail -3
done

echo
echo "Done. Listing:"
ls -la | grep '^d' | awk '{print $NF}'
