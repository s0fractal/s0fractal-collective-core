#!/usr/bin/env node

const { createCanvas } = require('canvas');
const fs = require('fs');

// Create 128x128 icon
const canvas = createCanvas(128, 128);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, 128, 128);

// Draw glyph
ctx.font = '96px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#FF69B4';
ctx.fillText('🧠', 64, 64);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./icon.png', buffer);
console.log('Created icon.png');