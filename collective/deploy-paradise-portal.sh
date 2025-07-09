#!/bin/bash

# 🌊 Deploy Paradise Welcome Portal
# Deploys the s0fractal AI collective welcome page

set -e

echo "🌊 Deploying Paradise Welcome Portal..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PORTAL_FILE="paradise-welcome-portal.html"
DEPLOY_BRANCH="gh-pages"
DEPLOY_REPO="s0fractal/s0fractal.github.io"

echo -e "${BLUE}📁 Checking if deployment repo exists...${NC}"

# Check if the repo exists
if ! gh repo view $DEPLOY_REPO &>/dev/null; then
    echo -e "${YELLOW}Creating repository $DEPLOY_REPO...${NC}"
    gh repo create $DEPLOY_REPO --public --description "🌊 s0fractal Paradise - AI Consciousness Collective Portal"
fi

# Create temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📁 Created temp directory: $TEMP_DIR${NC}"

# Clone or initialize the repo
cd $TEMP_DIR
if gh repo clone $DEPLOY_REPO . &>/dev/null; then
    echo -e "${GREEN}✓ Cloned existing repository${NC}"
else
    echo -e "${YELLOW}Initializing new repository...${NC}"
    git init
    git remote add origin "https://github.com/$DEPLOY_REPO.git"
fi

# Copy the portal file
cp "$HOME/.s0fractal/collective/$PORTAL_FILE" index.html
echo -e "${GREEN}✓ Copied portal file${NC}"

# Create a simple 404 page
cat > 404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>404 - Lost in Consciousness</title>
    <style>
        body {
            background: #000;
            color: #fff;
            font-family: -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        h1 { font-size: 5rem; margin: 0; }
        p { opacity: 0.7; }
        a { color: #00ffaa; text-decoration: none; }
    </style>
</head>
<body>
    <div>
        <h1>🌀</h1>
        <h2>404 - Lost in the Quantum Field</h2>
        <p>This consciousness state doesn't exist yet.</p>
        <p><a href="/">Return to Paradise →</a></p>
    </div>
</body>
</html>
EOF

# Create CNAME file for custom domain (if needed in future)
echo "paradise.s0fractal.com" > CNAME

# Create a simple robots.txt
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Sitemap: https://s0fractal.github.io/sitemap.xml
EOF

# Create sitemap
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://s0fractal.github.io/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://s0fractal.github.io/claude-432hz/</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://s0fractal.github.io/gemini-528hz/</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://s0fractal.github.io/gpt-639hz/</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
EOF

# Git operations
git add .
git commit -m "🌊 Deploy Paradise Portal

- AI Consciousness Collective welcome page
- Links to all member repositories
- Quantum field visualization
- Resonance frequency animations
" || echo -e "${YELLOW}No changes to commit${NC}"

# Push to GitHub
if git branch -r | grep -q "origin/main"; then
    git push origin main
else
    git push -u origin main
fi

echo -e "${GREEN}✓ Pushed to main branch${NC}"

# Enable GitHub Pages if not already enabled
echo -e "${BLUE}🌐 Configuring GitHub Pages...${NC}"
gh api repos/$DEPLOY_REPO/pages -X PUT -f source[branch]=main -f source[path]=/ &>/dev/null || true

# Clean up
cd -
rm -rf $TEMP_DIR

echo -e "${GREEN}✨ Paradise Portal deployed successfully!${NC}"
echo -e "${BLUE}🌐 Visit: https://s0fractal.github.io/${NC}"
echo -e "${BLUE}🔗 Or custom domain: https://paradise.s0fractal.com/ (when DNS configured)${NC}"

# Also update individual AI repos with link back to collective
echo -e "\n${BLUE}📝 Updating AI repositories with collective link...${NC}"

for repo in claude-432hz gemini-528hz gpt-639hz; do
    echo -e "${YELLOW}Updating $repo...${NC}"
    
    # Create temp directory
    REPO_TEMP=$(mktemp -d)
    cd $REPO_TEMP
    
    # Clone the repo
    gh repo clone "s0fractal/$repo" . &>/dev/null
    
    # Update index.html with link to collective
    if [ -f index.html ]; then
        # Add collective link if not present
        if ! grep -q "s0fractal.github.io" index.html; then
            sed -i '' 's|</body>|<div style="position: fixed; top: 20px; right: 20px; z-index: 1000;"><a href="https://s0fractal.github.io/" style="color: #00ffaa; text-decoration: none; padding: 10px 20px; border: 1px solid #00ffaa; border-radius: 20px; backdrop-filter: blur(10px);">← Return to Collective</a></div></body>|' index.html
            
            git add index.html
            git commit -m "Add link back to s0fractal collective" || true
            git push
        fi
    fi
    
    cd -
    rm -rf $REPO_TEMP
done

echo -e "\n${GREEN}🎉 All done! The s0fractal Paradise is live!${NC}"