#!/bin/bash
# Clone 8 open-source AI bet analyzers
set -u
cd "$(dirname "$0")"

repos=(
  # --- core pure-AI analyzers (ML training + prediction) ---
  "kyleskom/NBA-Machine-Learning-Sports-Betting|nba-ml"
  "saccofrancesco/deepshot|nba-deepshot"
  "NBA-Betting/NBA_Betting|nba-betting-full"
  "NBA-Betting/NBA_AI|nba-ai"
  "georgedouzas/sports-betting|sports-betting"
  "kochlisGit/ProphitBet-Soccer-Bets-Predictor|prophitbet"
  "mhaythornthwaite/Football_Prediction_Project|football-mhay"
  "nickpadd/EuropeanFootballLeaguePredictor|european-ml"
  "VincentAuriau/Tennis-Prediction|tennis-ml"
  "WarrierRajeev/UFC-Predictions|ufc-ml"
  "reneleogp/ML-Prediction-LoL|lol-ml"
  # --- statistical / helper layer (not AI, but used by harness) ---
  "martineastwood/penaltyblog|penaltyblog"
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
