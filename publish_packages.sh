#!/bin/bash

echo "🚀 Publishing BulletJS Packages..."

# Order matters for dependencies
PACKAGES=(
  "view"
  "orm"
  "core"
  "cli"
)


OTP=$1

for pkg in "${PACKAGES[@]}"; do
  echo "📦 Publishing @bullet-js/$pkg..."
  cd "packages/$pkg" || exit
  
  if [ -z "$OTP" ]; then
    npm publish --access public
  else
    npm publish --access public --otp="$OTP"
  fi
  
  cd ../../
done

echo "✅ All packages published!"
