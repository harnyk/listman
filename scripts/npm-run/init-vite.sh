#!/bin/bash
set -euo pipefail

# List of environment names
environments=("production" "preview" "development")

# Function to remove an environment variable and suppress "Variable was not found" error
remove_env_var() {
  local env=$1
  echo "Removing VITE_VERCEL_ENV environment variable on $env"

  output=$(vercel env rm VITE_VERCEL_ENV "$env" --yes 2>&1) || {
    if [[ "$output" != *"Variable was not found."* ]]; then
      echo "$output"
      exit 1
    fi
  }
}

# Loop through environments to remove the environment variable
for env in "${environments[@]}"; do
  remove_env_var "$env"
done

# Loop through environments to add the environment variable
for env in "${environments[@]}"; do
  echo -n "$env" | vercel env add VITE_VERCEL_ENV "$env"
done
