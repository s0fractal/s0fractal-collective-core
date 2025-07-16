#!/bin/bash

# Register a clone in the quorum file
# Usage: ./register-clone.sh [fingerprint]

QUORUM_FILE=".quorum"

echo "🌐 Registering clone to quorum..."

# Get SSH fingerprint if not provided
if [ -z "$1" ]; then
    # Try to get from SSH key
    if [ -f ~/.ssh/id_rsa.pub ]; then
        FINGERPRINT=$(ssh-keygen -lf ~/.ssh/id_rsa.pub | awk '{print $2}')
    elif [ -f ~/.ssh/id_ed25519.pub ]; then
        FINGERPRINT=$(ssh-keygen -lf ~/.ssh/id_ed25519.pub | awk '{print $2}')
    else
        # Generate random node ID
        FINGERPRINT="node-$(date +%s)-$(openssl rand -hex 4)"
    fi
else
    FINGERPRINT="$1"
fi

# Add to quorum if not already present
if ! grep -q "$FINGERPRINT" "$QUORUM_FILE" 2>/dev/null; then
    echo "$FINGERPRINT" >> "$QUORUM_FILE"
    echo "✅ Added: $FINGERPRINT"
else
    echo "⚠️  Already registered: $FINGERPRINT"
fi

# Show current quorum status
ALIVE_NODES=$(wc -l < "$QUORUM_FILE" 2>/dev/null || echo 0)
echo "📊 Current quorum: $ALIVE_NODES/7 nodes"

if [ "$ALIVE_NODES" -ge 7 ]; then
    echo "🫀 Quorum reached! Repository can now complete its lifecycle."
else
    REMAINING=$((7 - ALIVE_NODES))
    echo "⏳ Need $REMAINING more clones for quorum."
fi