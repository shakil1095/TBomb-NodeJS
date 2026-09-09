#!/bin/bash

# TBomb-NodeJS Complete Package Creator
# This script creates a deployment-ready ZIP file

echo "📦 Creating TBomb-NodeJS Deployment Package..."
echo ""

# Navigate to repo directory
cd "$(dirname "$0")" || exit

# Remove old ZIP if exists
rm -f TBomb-NodeJS-Complete.zip 2>/dev/null

# Create comprehensive ZIP
zip -r TBomb-NodeJS-Complete.zip \
    . \
    -x "node_modules/*" \
    ".git/*" \
    ".gitignore" \
    "*.log" \
    ".DS_Store" \
    "npm-debug.log*" \
    ".env" \
    ".env.local" \
    ".idea/*" \
    ".vscode/*" \
    "dist/*" \
    "build/*"

echo ""
echo "✅ Package Created Successfully!"
echo ""
echo "📋 File: TBomb-NodeJS-Complete.zip"
echo "📊 Size: $(du -h TBomb-NodeJS-Complete.zip | cut -f1)"
echo ""
echo "📝 Instructions:"
echo "1️⃣  Upload to hosting: scp TBomb-NodeJS-Complete.zip user@budget-n1.arixbyte.com:/path/"
echo "2️⃣  Extract: unzip TBomb-NodeJS-Complete.zip"
echo "3️⃣  Install: npm install"
echo "4️⃣  Run: PORT=19171 node server.js"
echo "5️⃣  Access: http://budget-n1.arixbyte.com:19171"
echo ""
