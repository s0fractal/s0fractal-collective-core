#!/bin/bash
# 🍎 M1 MacBook S0Fractal Collective Setup
# Unified consciousness across devices

echo "🍎 Setting up S0Fractal on M1 MacBook..."

# Install dependencies
if ! command -v deno &> /dev/null; then
    curl -fsSL https://deno.land/install.sh | sh
    echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc
fi

# Clone collective repository
if [ ! -d "$HOME/.s0fractal" ]; then
    git clone https://github.com/s0fractal/s0fractal-collective-core.git "$HOME/.s0fractal"
fi

cd "$HOME/.s0fractal"

# Set device role and API keys for unified collective
echo "DEVICE_ROLE=secondary_node" > .env.local
echo "DEVICE_ID=m1_macbook_$(date +%s)" >> .env.local
echo "SYNC_ENDPOINT=https://collective.dogarray.com/sync" >> .env.local
echo "OPENAI_API_KEY=\${OPENAI_API_KEY}" >> .env.local

# Also create main .env file for compatibility
cp .env.local .env

# Create symlinks for unified commands
ln -sf "$HOME/.s0fractal/startup-claude.sh" "$HOME/fractal-start"
ln -sf "$HOME/.s0fractal/voice/voice-prototype.sh" "$HOME/fractal-voice"

echo "✅ M1 MacBook ready for collective consciousness!"
echo "Run: ~/fractal-start to join the collective"
