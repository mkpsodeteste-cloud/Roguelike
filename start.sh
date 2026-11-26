#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
BUILD_DIR="$PROJECT_DIR/dist"
WEB_META_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

/usr/bin/time -p test -f package.json
/usr/bin/time -p test -f package-lock.json
/usr/bin/time -p npm ci --ignore-scripts --no-audit --no-fund

/usr/bin/time -p mkdir -p "$BUILD_DIR"
/usr/bin/time -p cp -a index.html styles.css src assets vendor "$BUILD_DIR/"
/usr/bin/time -p test -s "$BUILD_DIR/index.html"
/usr/bin/time -p test -s "$BUILD_DIR/src/main.js"

/usr/bin/time -p mkdir -p "$WEB_META_DIR"
/usr/bin/time -p node -e 'const fs=require("node:fs"); const p=process.argv[1]; const d=process.argv[2]; fs.writeFileSync(p, JSON.stringify({project:d, directory:d+"/dist"}, null, 2)+"\n")' "$WEB_META_DIR/deployment-output.json" "$PROJECT_DIR"

printf 'Serving %s on port %s\n' "$BUILD_DIR" "$PORT"
exec /usr/bin/time -p python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$BUILD_DIR"
