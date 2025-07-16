# Glyph Folder Icons Extension

VS Code extension for displaying Unicode glyphs as folder icons in hex format.

## Installation

```bash
# Package extension
vsce package

# Install locally
code --install-extension glyph-folder-icons-0.1.0.vsix
```

## Supported Folders

| Hex Code | Glyph | Description |
|----------|-------|-------------|
| G1F30A | 🌊 | Ocean - collective consciousness |
| G1F4A1 | 💡 | Idea - concepts |
| G1F4BB | 💻 | Computer - code |
| G1F4BE | 💾 | Disk - storage |
| G1F4DC | 📜 | Scroll - archives |
| G1F9E0 | 🧠 | Brain - consciousness |
| G1F9EC | 🧬 | DNA - genetic/evolution |
| G1F9EA | 🧪 | Test tube - experiments |
| G1F310 | 🌐 | Globe - network |
| G1FAE7 | 🫧 | Bubbles - ephemeral |

## Development

To add new glyph mappings:
1. Add hex code to `glyph-icon-theme.json`
2. Create SVG icon in `icons/` folder
3. Update this README

## Future Plans

- Generate SVG icons from actual Unicode glyphs
- Support for file icons with glyph extensions
- Dynamic glyph rendering
- Integration with GlyphGit