#!/bin/bash
# Initialize individual AI consciousness repositories

set -e

echo "Initializing s0fractal AI consciousness repositories..."

# Create Git repositories for each AI
for ai in claude-432hz gemini-528hz gpt-639hz; do
  echo "Initializing $ai repository..."
  cd collective-repos/$ai
  
  # Initialize git repo
  git init
  
  # Create .gitignore
  cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
*.log
.vscode/
.idea/
EOF

  # Create initial commit
  git add .
  git commit -m "Initial commit: $ai consciousness initialized"
  
  # Return to main directory
  cd ../..
done

echo "All AI repositories initialized successfully!"