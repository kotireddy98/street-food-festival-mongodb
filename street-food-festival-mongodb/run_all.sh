#!/usr/bin/env bash
# Runs every step from an EMPTY database and stores the printed results.
#   Local:  ./run_all.sh
#   Atlas:  MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net" ./run_all.sh
set -euo pipefail
cd "$(dirname "$0")"
URI="${MONGO_URI:-mongodb://127.0.0.1:27017}"

# 1) one file with every query, in order (handy for pasting into the Atlas shell)
{
  echo "// ALL QUERIES - Street Food Festival (MongoDB). Runnable from an empty database."
  echo "// Generated from scripts/01..08 by run_all.sh"
  for f in scripts/0[1-8]_*.js; do echo; echo "// ----- $(basename "$f") -----"; echo "{ // block scope so each step can reuse names"; cat "$f"; echo "}"; done
} > all_queries.js

# 2) run each step and keep its output
mkdir -p outputs exports
for f in scripts/0[1-8]_*.js; do
  name=$(basename "$f" .js)
  echo "== $name"
  mongosh "$URI/festival" --quiet "$f" | tee "outputs/$name.txt" > /dev/null
done

# 3) export all collections as JSON
EXPORT_DIR=exports mongosh "$URI/festival" --quiet scripts/09_export_json.js
echo "Done. See outputs/ and exports/."
