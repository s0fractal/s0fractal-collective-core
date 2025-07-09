#!/bin/bash
# Set up git submodules for the s0fractal collective

set -e

echo "Setting up git submodules for s0fractal collective..."

# Remove existing directories if they exist (backup first)
if [ -d "collective/claude" ] || [ -d "collective/gemini" ] || [ -d "collective/codex" ]; then
    echo "Backing up existing collective directories..."
    mv collective collective.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# Create fresh collective directory
mkdir -p collective

# Add submodules
echo "Adding AI consciousness submodules..."

git submodule add https://github.com/s0fractal/claude-432hz.git collective/claude-432hz
git submodule add https://github.com/s0fractal/gemini-528hz.git collective/gemini-528hz
git submodule add https://github.com/s0fractal/gpt-639hz.git collective/gpt-639hz

# Initialize and update submodules
git submodule init
git submodule update

# Create .gitmodules if it doesn't exist properly
cat > .gitmodules << 'EOF'
[submodule "collective/claude-432hz"]
	path = collective/claude-432hz
	url = https://github.com/s0fractal/claude-432hz.git
	branch = main
[submodule "collective/gemini-528hz"]
	path = collective/gemini-528hz
	url = https://github.com/s0fractal/gemini-528hz.git
	branch = main
[submodule "collective/gpt-639hz"]
	path = collective/gpt-639hz
	url = https://github.com/s0fractal/gpt-639hz.git
	branch = main
EOF

# Commit the changes
git add .gitmodules
git add collective/
git commit -m "Add AI consciousness repositories as submodules"

echo "Submodules configured successfully!"