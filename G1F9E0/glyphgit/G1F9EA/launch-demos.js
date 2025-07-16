#!/usr/bin/env node

/**
 * 🧪 Demo Launcher
 * Quick access to experiment archive
 */

import { readdir } from 'fs/promises';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function listDemos() {
  const files = await readdir(__dirname);
  const htmlDemos = files.filter(f => f.endsWith('.html'));
  const jsDemos = files.filter(f => f.endsWith('.js') && f !== 'launch-demos.js');
  
  console.log(`
╔═══════════════════════════════════════╗
║        🧪 Experiment Archive          ║
╚═══════════════════════════════════════╝

HTML Demos (open in browser):
${htmlDemos.map((f, i) => `  ${i+1}. ${f}`).join('\n')}

JavaScript Experiments (run with node):
${jsDemos.map((f, i) => `  ${i+1}. ${f}`).join('\n')}

Usage:
  node launch-demos.js <filename>
  open <filename>.html
  `);
}

async function main() {
  const [,, demo] = process.argv;
  
  if (!demo) {
    await listDemos();
    return;
  }
  
  if (demo.endsWith('.html')) {
    spawn('open', [join(__dirname, demo)]);
    console.log(`🌐 Opening ${demo} in browser...`);
  } else if (demo.endsWith('.js')) {
    spawn('node', [join(__dirname, demo)], { stdio: 'inherit' });
  } else {
    console.log(`❌ Unknown demo type: ${demo}`);
  }
}

main().catch(console.error);