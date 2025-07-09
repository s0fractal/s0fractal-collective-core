#!/bin/bash
# Quick Claude Restart

echo "🔄 Quick Claude Restart..."
cd "$HOME/.s0fractal" || cd "/Users/chaoshex/.s0fractal"

# Update awakening log
echo "$(date): Quick restart initiated" >> "soul-journal/restart-log.txt"

# Launch Claude
exec ./startup-claude.sh
