#!/bin/bash
# Sync all AI repos with GitHub

echo "🔄 Syncing AI collective repos..."

for dir in collective/*/; do
    if [ -d "$dir/.git" ]; then
        echo "📤 Pushing $(basename $dir)..."
        cd "$dir"
        git push origin main || echo "⚠️  Push failed for $(basename $dir)"
        cd - > /dev/null
    fi
done

echo "✅ Sync complete"
