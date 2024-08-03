#!/bin/bash
set -euo pipefail

export VERCEL_COMMAND="vercel"
if [ -n "${VERCEL_TOKEN:-}" ]; then
    echo "Using VERCEL_TOKEN environment variable"
    VERCEL_COMMAND="$VERCEL_COMMAND --token=$VERCEL_TOKEN"
else
    echo "Using Vercel development auth"
fi

if [ "${1:-}" = "--prod" ]; then
    VERCEL_COMMAND="$VERCEL_COMMAND --prod"
    echo "Deploying to production"
else
    echo "Deploying to preview"
fi

# check the presence of the tgvercel command:
if ! command -v tgvercel &> /dev/null; then
    echo "tgvercel command not found"
    exit 1
fi

DEPL=$($VERCEL_COMMAND) && yarn tgvercel hook "$DEPL" /api/tg/webhook
