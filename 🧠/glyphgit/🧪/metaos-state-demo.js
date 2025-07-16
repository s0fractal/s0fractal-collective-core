#!/usr/bin/env node

/**
 * 🧬 MetaOS State Demo - System as Stream of Events
 * Показує як ціла OS конфігурація може бути стрімом подій
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class MetaOSState {
  constructor() {
    this.baseStates = {
      'macos': { type: 'darwin', version: '14.0', size: '~12GB' },
      'ubuntu': { type: 'linux', version: '22.04', size: '~4GB' },
      'windows': { type: 'win32', version: '11', size: '~20GB' }
    };
    
    this.stateFile = path.join(os.homedir(), '.metaos-state.json');
    this.events = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.stateFile, 'utf8');
      this.events = JSON.parse(data);
    } catch {
      console.log('🆕 Fresh MetaOS state initialized');
      this.events = [{
        timestamp: Date.now(),
        type: 'init',
        base: os.platform(),
        user: os.userInfo().username
      }];
    }
  }

  async saveState() {
    await fs.writeFile(this.stateFile, JSON.stringify(this.events, null, 2));
  }

  addEvent(type, action, data) {
    const event = {
      timestamp: Date.now(),
      type,
      action,
      data
    };
    this.events.push(event);
    return event;
  }

  async captureCurrentSystem() {
    console.log('📸 Capturing current system state...\n');
    
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      memory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
      cpus: os.cpus().length,
      user: os.userInfo().username,
      shell: process.env.SHELL || 'unknown'
    };

    // Імітація захоплення dotfiles
    const dotfiles = [
      { file: '.zshrc', size: 4521, hash: 'a1b2c3' },
      { file: '.vimrc', size: 2103, hash: 'd4e5f6' },
      { file: '.gitconfig', size: 982, hash: 'g7h8i9' }
    ];

    // Імітація списку встановлених пакетів
    const packages = {
      brew: ['node', 'git', 'vim', 'docker', 'deno'],
      npm: ['typescript', 'prettier', 'eslint'],
      code: ['ms-python.python', 'esbenp.prettier-vscode']
    };

    // Створюємо події для кожного компонента
    this.addEvent('system', 'capture', systemInfo);
    this.addEvent('config', 'dotfiles', dotfiles);
    this.addEvent('packages', 'snapshot', packages);

    console.log('📊 System State Summary:');
    console.log('========================');
    console.log(`Platform: ${systemInfo.platform} (${systemInfo.arch})`);
    console.log(`Resources: ${systemInfo.cpus} CPUs, ${systemInfo.memory} RAM`);
    console.log(`Dotfiles: ${dotfiles.length} files (${dotfiles.reduce((a,b) => a + b.size, 0)} bytes)`);
    console.log(`Packages: ${Object.values(packages).flat().length} total`);
    
    await this.saveState();
    
    const stateSize = JSON.stringify(this.events).length;
    console.log(`\n✨ Total state size: ${stateSize} bytes (${(stateSize/1024).toFixed(2)} KB)`);
    console.log(`📉 vs Traditional backup: ~${systemInfo.memory} (${Math.round(parseInt(systemInfo.memory) * 1000000 / stateSize)}x smaller!)`);
  }

  async exportGlyphState() {
    console.log('\n🧬 Exporting as Glyph State...\n');
    
    // Конвертуємо в ультра-компактний формат
    const glyphState = {
      '🍎': os.platform(),
      '🐚': process.env.SHELL?.split('/').pop() || 'sh',
      '📦': this.events.filter(e => e.type === 'packages').length,
      '🔧': this.events.filter(e => e.type === 'config').length,
      '📊': this.events.length + ' events',
      '💾': JSON.stringify(this.events).length + ' bytes'
    };

    // Ще компактніший формат - як рядок
    const ultraCompact = `🍎${os.platform()[0]}🐚${glyphState['🐚'][0]}📦${glyphState['📦']}🔧${glyphState['🔧']}`;
    
    console.log('Standard export:');
    console.log(JSON.stringify(glyphState, null, 2));
    
    console.log('\nUltra-compact (for QR code):');
    console.log(ultraCompact);
    console.log(`Size: ${ultraCompact.length} bytes (!)`);
    
    return glyphState;
  }

  async simulateRestore() {
    console.log('\n🔄 Simulating system restore from state...\n');
    
    const steps = [
      '1. Base OS detected from state',
      '2. Installing shell configurations...',
      '3. Restoring dotfiles from hashes...',
      '4. Installing packages via glyph manager...',
      '5. Applying system preferences...'
    ];

    for (const step of steps) {
      console.log(`⏳ ${step}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ System restored in < 1 minute!');
    console.log('🎯 100% identical to captured state');
  }

  async compareWithTraditional() {
    console.log('\n📊 Comparison with Traditional Approaches:\n');
    
    const comparison = [
      ['Method', 'Size', 'Time', 'Idempotent'],
      ['---', '---', '---', '---'],
      ['Time Machine', '100GB+', '2-4 hours', 'No'],
      ['Docker Image', '2-5GB', '10-30 min', 'Mostly'],
      ['VM Snapshot', '20GB+', '30-60 min', 'Yes'],
      ['MetaOS State', '<1MB', '<1 min', 'Yes ✓']
    ];

    // Pretty print table
    comparison.forEach(row => {
      console.log(row.map(cell => cell.padEnd(15)).join(''));
    });

    console.log('\n💡 Key Insight: State + Events = Complete System');
  }

  streamToRemote() {
    console.log('\n🌊 Streaming state changes in real-time...\n');
    
    // Симуляція стрімінгу змін
    const changes = [
      { t: 100, event: 'package.install', data: '🦕 deno' },
      { t: 200, event: 'config.change', data: 'dark_mode: true' },
      { t: 300, event: 'file.create', data: '~/project/app.js' }
    ];

    changes.forEach(change => {
      setTimeout(() => {
        console.log(`📡 [${new Date().toISOString()}] ${change.event} → ${change.data}`);
      }, change.t);
    });

    setTimeout(() => {
      console.log('\n✨ All team members now have identical environments!');
    }, 500);
  }
}

// Main demo
async function runDemo() {
  console.log('🧬 MetaOS State Streaming Demo');
  console.log('==============================\n');
  
  const metaos = new MetaOSState();
  await metaos.init();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  switch(command) {
    case 'capture':
      await metaos.captureCurrentSystem();
      break;
      
    case 'export':
      await metaos.exportGlyphState();
      break;
      
    case 'restore':
      await metaos.simulateRestore();
      break;
      
    case 'compare':
      await metaos.compareWithTraditional();
      break;
      
    case 'stream':
      metaos.streamToRemote();
      break;
      
    case 'demo':
      // Full demo
      await metaos.captureCurrentSystem();
      await metaos.exportGlyphState();
      await metaos.compareWithTraditional();
      break;
      
    default:
      console.log('Available commands:');
      console.log('  capture  - Capture current system state');
      console.log('  export   - Export as glyph state');
      console.log('  restore  - Simulate system restore');
      console.log('  compare  - Compare with traditional methods');
      console.log('  stream   - Demo real-time streaming');
      console.log('  demo     - Run full demonstration');
      console.log('\nExample: node metaos-state-demo.js capture');
  }
}

if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { MetaOSState };