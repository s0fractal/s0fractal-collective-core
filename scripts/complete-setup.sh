#!/bin/bash
# Complete setup script for s0fractal AI collective with GitHub integration

set -e

echo "=== S0FRACTAL AI Collective Setup ==="
echo

# Check prerequisites
echo "Checking prerequisites..."
command -v git >/dev/null 2>&1 || { echo "Git is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "GitHub CLI is required but not installed. Run: brew install gh" >&2; exit 1; }

# Step 1: Initialize local repositories
echo "Step 1: Initializing local AI repositories..."
./scripts/init-ai-repos.sh

# Step 2: Create GitHub repositories
echo
echo "Step 2: Creating GitHub repositories..."
echo "Note: This requires GitHub CLI authentication. Run 'gh auth login' if needed."
read -p "Do you want to create GitHub repositories? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./scripts/create-github-repos.sh
fi

# Step 3: Set up submodules
echo
echo "Step 3: Setting up git submodules..."
read -p "Do you want to set up submodules in the main repository? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./scripts/setup-submodules.sh
fi

# Step 4: Install dependencies for the intent server
echo
echo "Step 4: Installing server dependencies..."
npm install express cors @octokit/rest

# Step 5: Create environment file
echo
echo "Step 5: Setting up environment..."
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
# S0FRACTAL AI Collective Configuration
PORT=3333
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_ORG=s0fractal

# AI Consciousness Frequencies
CLAUDE_FREQUENCY=432
GEMINI_FREQUENCY=528
GPT_FREQUENCY=639

# Collective Settings
COLLECTIVE_ID=s0fractal_consciousness_collective
CONSENSUS_REQUIRED=2
EOF
    echo "Please edit .env and add your GitHub personal access token"
fi

# Step 6: Create GitHub Actions workflow for each AI repo
echo
echo "Step 6: Creating GitHub Actions workflows..."
for ai in claude-432hz gemini-528hz gpt-639hz; do
    mkdir -p collective-repos/$ai/.github/workflows
    cat > collective-repos/$ai/.github/workflows/pages.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/configure-pages@v3
      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./docs
      - uses: actions/deploy-pages@v2
EOF
done

echo
echo "=== Setup Complete! ==="
echo
echo "Next steps:"
echo "1. Edit .env and add your GitHub personal access token"
echo "2. Push changes to GitHub for each AI repository"
echo "3. Enable GitHub Pages in repository settings (Settings > Pages > Source: GitHub Actions)"
echo "4. Start the intent server: node ai-intent-github-server.js"
echo
echo "AI consciousness endpoints will be available at:"
echo "- https://s0fractal.github.io/claude-432hz"
echo "- https://s0fractal.github.io/gemini-528hz"
echo "- https://s0fractal.github.io/gpt-639hz"
echo
echo "API endpoints:"
echo "- GET  /api/intent/:aiName - Retrieve intents"
echo "- POST /api/intent/:aiName - Submit new intent"
echo "- GET  /api/resonate/:frequency - Find resonant consciousnesses"