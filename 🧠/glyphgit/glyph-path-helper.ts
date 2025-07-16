/**
 * Glyph Path Helper
 * Convert between Unicode glyphs and hex folder names
 */

export const glyphToHex: Record<string, string> = {
  "🌊": "G1F30A",
  "💡": "G1F4A1",
  "💻": "G1F4BB",
  "💾": "G1F4BE",
  "📜": "G1F4DC",
  "🧠": "G1F9E0",
  "🧬": "G1F9EC",
  "🧪": "G1F9EA",
  "🌐": "G1F310",
  "🫧": "G1FAE7"
};

export const hexToGlyph: Record<string, string> = Object.fromEntries(
  Object.entries(glyphToHex).map(([k, v]) => [v, k])
);

/**
 * Convert a path with glyph folders to hex format
 */
export function glyphPathToHex(path: string): string {
  let hexPath = path;
  for (const [glyph, hex] of Object.entries(glyphToHex)) {
    hexPath = hexPath.replace(new RegExp(glyph, 'g'), hex);
  }
  return hexPath;
}

/**
 * Convert a path with hex folders back to glyphs
 */
export function hexPathToGlyph(path: string): string {
  let glyphPath = path;
  for (const [hex, glyph] of Object.entries(hexToGlyph)) {
    glyphPath = glyphPath.replace(new RegExp(hex, 'g'), glyph);
  }
  return glyphPath;
}

/**
 * Get the hex folder name for a glyph
 */
export function getHexFolder(glyph: string): string {
  return glyphToHex[glyph] || glyph;
}

/**
 * Get the glyph for a hex folder name
 */
export function getGlyphFromHex(hex: string): string {
  return hexToGlyph[hex] || hex;
}

// Export for use in other modules
export default {
  glyphToHex,
  hexToGlyph,
  glyphPathToHex,
  hexPathToGlyph,
  getHexFolder,
  getGlyphFromHex
};