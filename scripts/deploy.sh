#!/usr/bin/env bash
# Deploy Viana Marketplace to Vercel + wire Hostinger domain + Supabase auth.
#
# Required:
#   VERCEL_TOKEN   — https://vercel.com/account/settings/tokens
#
# Optional:
#   DOMAIN=viana.com.py
#   HOSTINGER_API_TOKEN — hPanel → Dev Tools → API (auto DNS)
#   SUPABASE_ACCESS_TOKEN — https://supabase.com/dashboard/account/tokens
#
# Usage:
#   VERCEL_TOKEN=xxx ./scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DOMAIN="${DOMAIN:-viana.com.py}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"

if [[ -z "$VERCEL_TOKEN" ]]; then
  echo "ERROR: export VERCEL_TOKEN first."
  exit 1
fi

if [[ ! -f .env.local ]]; then
  echo "ERROR: .env.local missing — copy from .env.example and fill Supabase keys."
  exit 1
fi

# shellcheck disable=SC1091
source <(grep -E '^NEXT_PUBLIC_' .env.local | sed 's/^/export /')

add_env() {
  local name="$1" value="$2"
  printf '%s' "$value" | vercel env add "$name" production --token "$VERCEL_TOKEN" --force 2>/dev/null || true
}

echo "==> Linking Vercel project…"
vercel link --yes --token "$VERCEL_TOKEN"

echo "==> Setting production env vars…"
add_env NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL"
add_env NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY "$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
add_env NEXT_PUBLIC_STORE_WHATSAPP "${NEXT_PUBLIC_STORE_WHATSAPP:-595993342253}"
add_env NEXT_PUBLIC_STORE_NAME "${NEXT_PUBLIC_STORE_NAME:-Viana}"
add_env NEXT_PUBLIC_STORE_FULL_NAME "${NEXT_PUBLIC_STORE_FULL_NAME:-Farmacia Viana}"

echo "==> Building and deploying…"
DEPLOY_URL="$(vercel deploy --prod --yes --token "$VERCEL_TOKEN")"
echo "    Preview: $DEPLOY_URL"

echo "==> Attaching domain $DOMAIN…"
vercel domains add "$DOMAIN" --token "$VERCEL_TOKEN" 2>/dev/null || true
vercel domains add "www.$DOMAIN" --token "$VERCEL_TOKEN" 2>/dev/null || true

if [[ -n "${HOSTINGER_API_TOKEN:-}" ]]; then
  echo "==> Updating Hostinger DNS…"
  curl -sS -X PUT "https://developers.hostinger.com/api/dns/v1/zones/$DOMAIN" \
    -H "Authorization: Bearer $HOSTINGER_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "zone": [
        {"name": "@", "type": "A", "ttl": 14400, "records": [{"content": "76.76.21.21"}]},
        {"name": "www", "type": "CNAME", "ttl": 14400, "records": [{"content": "cname.vercel-dns.com"}]}
      ],
      "overwrite": true
    }' && echo "    DNS updated." || echo "    WARN: Hostinger DNS API failed."
else
  cat <<EOF

── Hostinger DNS (hPanel → Domains → $DOMAIN → DNS) ──
  Type   Name   Value
  A      @      76.76.21.21
  CNAME  www    cname.vercel-dns.com

EOF
fi

if [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  PROJECT_REF="${NEXT_PUBLIC_SUPABASE_URL#https://}"
  PROJECT_REF="${PROJECT_REF%%.*}"
  SITE_URL="https://$DOMAIN"
  echo "==> Updating Supabase auth URLs…"
  curl -sS -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"site_url\":\"$SITE_URL\",\"uri_allow_list\":\"$SITE_URL/**,https://www.$DOMAIN/**\"}" \
    && echo "    Supabase updated." || echo "    WARN: Supabase API failed."
else
  cat <<EOF
── Supabase (Authentication → URL Configuration) ──
  Site URL:       https://$DOMAIN
  Redirect URLs:  https://$DOMAIN/**, https://www.$DOMAIN/**

EOF
fi

echo "==> Deploy complete. Live at https://$DOMAIN (DNS may take up to 30 min)."