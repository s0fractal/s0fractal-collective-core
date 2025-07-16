#!/bin/bash

# Rename glyph folders to hex format for better IDE support

echo "🔄 Converting glyph folders to hex format..."

# Function to rename if exists
rename_if_exists() {
    local old_name="$1"
    local new_name="$2"
    local base_path="$3"
    
    if [ -d "$base_path/$old_name" ]; then
        echo "  $old_name → $new_name"
        mv "$base_path/$old_name" "$base_path/$new_name"
    fi
}

# Main s0fractal directory
BASE="/Users/chaoshex/.s0fractal"
rename_if_exists "🌊" "G1F30A" "$BASE"
rename_if_exists "💡" "G1F4A1" "$BASE"
rename_if_exists "💻" "G1F4BB" "$BASE"
rename_if_exists "💾" "G1F4BE" "$BASE"
rename_if_exists "📜" "G1F4DC" "$BASE"
rename_if_exists "🧠" "G1F9E0" "$BASE"
rename_if_exists "🧬" "G1F9EC" "$BASE"

# GlyphGit subdirectories
GLYPHGIT="$BASE/G1F9E0/glyphgit"
rename_if_exists "🧪" "G1F9EA" "$GLYPHGIT"
rename_if_exists "🌐" "G1F310" "$GLYPHGIT"
rename_if_exists "🫧" "G1FAE7" "$GLYPHGIT"

echo "✅ Conversion complete!"
echo ""
echo "📝 Add this to your VS Code settings.json:"
echo '
{
  "material-icon-theme.folders.associations": {
    "G1F30A": "ocean",
    "G1F4A1": "idea", 
    "G1F4BB": "computer",
    "G1F4BE": "disk",
    "G1F4DC": "docs",
    "G1F9E0": "brain",
    "G1F9EC": "biology",
    "G1F9EA": "test",
    "G1F310": "global",
    "G1FAE7": "components"
  }
}
'