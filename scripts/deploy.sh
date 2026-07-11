#!/usr/bin/env bash
# Build and deploy Viana Marketplace to Cloudflare Workers.
# Authenticate once with `npx wrangler login`, then run this script.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  echo "ERROR: .env.local missing — copy from .env.example and fill Supabase keys."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

npm run typecheck
npm run test
npm run deploy
