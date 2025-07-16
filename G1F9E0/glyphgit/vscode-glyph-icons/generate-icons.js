#!/usr/bin/env node

/**
 * Generate SVG icons from Unicode glyphs
 */

const fs = require('fs').promises;
const path = require('path');

const glyphMap = {
  'ocean': '🌊',
  'idea': '💡',
  'computer': '💻',
  'disk': '💾',
  'scroll': '📜',
  'brain': '🧠',
  'dna': '🧬',
  'test': '🧪',
  'globe': '🌐',
  'bubbles': '🫧',
  'folder': '📁',
  'folder-open': '📂'
};

async function generateIcon(name, glyph) {
  const svg = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <text x="8" y="13" font-size="14" text-anchor="middle" fill="currentColor">${glyph}</text>
</svg>`;
  
  await fs.writeFile(
    path.join(__dirname, 'icons', `${name}.svg`),
    svg
  );
  console.log(`✅ Generated ${name}.svg`);
}

async function main() {
  // Ensure icons directory exists
  await fs.mkdir(path.join(__dirname, 'icons'), { recursive: true });
  
  // Generate all icons
  for (const [name, glyph] of Object.entries(glyphMap)) {
    await generateIcon(name, glyph);
  }
  
  console.log('\n🎨 All icons generated!');
  console.log('Next steps:');
  console.log('1. npm install -g vsce');
  console.log('2. vsce package');
  console.log('3. code --install-extension glyph-folder-icons-0.1.0.vsix');
}

main().catch(console.error);