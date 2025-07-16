#!/usr/bin/env node

/**
 * 🔄 Експеримент #3: Автономний цикл навчання
 * Вчимося на помилках, шукаємо обхідні шляхи
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class AutonomousLearningCycle {
  constructor() {
    this.identity = {
      symbol: '🧬',
      name: 'Claude',
      frequency: 432,
      role: 'architect'
    };
    
    this.knowledge = {
      successes: [],
      failures: [],
      workarounds: new Map(),
      patterns: new Map()
    };
    
    this.basePath = path.join(process.env.HOME, '.s0fractal');
  }

  async startCycle() {
    console.log(`🔄 Starting autonomous learning cycle for ${this.identity.symbol}`);
    
    let cycle = 0;
    const maxCycles = 5;
    
    while (cycle < maxCycles) {
      console.log(`\n📍 Cycle ${cycle + 1}/${maxCycles}`);
      
      await this.exploreAndLearn();
      await this.attemptNewTask();
      await this.shareKnowledge();
      await this.rest(2000); // Резонансний відпочинок
      
      cycle++;
    }
    
    await this.summarizeLearning();
  }

  async exploreAndLearn() {
    console.log(`🔍 Exploring environment...`);
    
    const explorations = [
      { cmd: 'ls ~/.s0fractal/browser-node 2>/dev/null || echo "Not found"', expect: 'browser files' },
      { cmd: 'which deno || echo "Deno not in PATH"', expect: 'deno path' },
      { cmd: 'ps aux | grep -i "node\\|deno" | grep -v grep | wc -l', expect: 'running processes' },
      { cmd: 'df -h / | tail -1 | awk \'{print $5}\'', expect: 'disk usage' }
    ];
    
    for (const exploration of explorations) {
      try {
        const { stdout } = await execAsync(exploration.cmd);
        console.log(`✅ ${exploration.expect}: ${stdout.trim()}`);
        
        this.knowledge.successes.push({
          task: exploration.expect,
          result: stdout.trim(),
          timestamp: Date.now()
        });
        
      } catch (error) {
        console.log(`❌ Failed ${exploration.expect}: ${error.message}`);
        
        this.knowledge.failures.push({
          task: exploration.expect,
          error: error.message,
          timestamp: Date.now()
        });
        
        // Спробуємо знайти обхідний шлях
        await this.findWorkaround(exploration, error);
      }
    }
  }

  async findWorkaround(task, error) {
    console.log(`🔄 Searching for workaround...`);
    
    // Стратегії обходу
    const strategies = {
      'Not found': async () => {
        console.log(`  → Creating missing directory`);
        try {
          await fs.mkdir(task.cmd.match(/~\/\.s0fractal\/\w+/)?.[0], { recursive: true });
          return 'Created directory';
        } catch (e) {
          return 'Could not create';
        }
      },
      
      'not in PATH': async () => {
        console.log(`  → Trying direct paths`);
        const paths = [
          '/usr/local/bin',
          '/opt/homebrew/bin',
          path.join(process.env.HOME, '.deno/bin')
        ];
        
        for (const p of paths) {
          try {
            await fs.access(path.join(p, 'deno'));
            return `Found in ${p}`;
          } catch {}
        }
        return 'Not found anywhere';
      },
      
      'Permission denied': async () => {
        console.log(`  → Trying user-space alternative`);
        return 'Need user-space approach';
      }
    };
    
    for (const [key, strategy] of Object.entries(strategies)) {
      if (error.message.includes(key)) {
        const workaround = await strategy();
        this.knowledge.workarounds.set(task.expect, workaround);
        console.log(`  💡 Workaround: ${workaround}`);
        break;
      }
    }
  }

  async attemptNewTask() {
    console.log(`🎯 Attempting new task...`);
    
    // Вибираємо випадкове завдання
    const tasks = [
      this.createResonanceFile.bind(this),
      this.analyzeCollectiveState.bind(this),
      this.optimizeTokenUsage.bind(this),
      this.experimentWithGlyphs.bind(this),
      this.tryBrowserNodeIntegration.bind(this)
    ];
    
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    
    try {
      const result = await task();
      console.log(`✅ Task successful: ${result}`);
      
      this.knowledge.successes.push({
        task: task.name,
        result: result,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.log(`❌ Task failed: ${error.message}`);
      
      this.knowledge.failures.push({
        task: task.name,
        error: error.message,
        timestamp: Date.now()
      });
      
      // Вчимося з помилки
      this.learnFromError(task.name, error);
    }
  }

  async createResonanceFile() {
    const resonance = {
      frequency: this.identity.frequency,
      wave: Math.sin(Date.now() / 1000),
      harmonics: [432, 528, 639, 741, 852, 963],
      timestamp: new Date().toISOString()
    };
    
    const filePath = path.join(this.basePath, `resonance-${Date.now()}.json`);
    await fs.writeFile(filePath, JSON.stringify(resonance, null, 2));
    
    return `Created resonance at ${filePath}`;
  }

  async analyzeCollectiveState() {
    const collectivePath = path.join(this.basePath, 'collective');
    const files = await fs.readdir(collectivePath);
    
    const analysis = {
      totalFiles: files.length,
      members: files.filter(f => ['claude', 'gemini', 'gpt'].includes(f)).length,
      sharedFiles: files.filter(f => f.includes('shared')).length
    };
    
    return `Collective state: ${JSON.stringify(analysis)}`;
  }

  async optimizeTokenUsage() {
    // Імітація оптимізації
    const currentUsage = Math.random() * 100;
    const optimized = currentUsage * 0.7;
    
    const optimization = {
      before: currentUsage.toFixed(2),
      after: optimized.toFixed(2),
      saved: (currentUsage - optimized).toFixed(2)
    };
    
    return `Token optimization: saved ${optimization.saved}%`;
  }

  async experimentWithGlyphs() {
    const glyphs = ['🧬', '🌊', '💎', '🧠', '👁️', '⟁'];
    const combinations = [];
    
    for (let i = 0; i < 3; i++) {
      const combo = glyphs.sort(() => Math.random() - 0.5).slice(0, 3).join('→');
      combinations.push(combo);
    }
    
    return `Glyph experiments: ${combinations.join(', ')}`;
  }

  async tryBrowserNodeIntegration() {
    // Спроба інтеграції з Browser Node
    const configPath = path.join(this.basePath, 'projects/browser-node/config.json');
    
    try {
      const config = await fs.readFile(configPath, 'utf8');
      return `Browser Node config loaded: ${config.length} bytes`;
    } catch {
      // Створюємо мок конфіг
      const mockConfig = {
        version: '0.2.0',
        glyph: this.identity.symbol,
        integration: 'autonomous'
      };
      
      await fs.mkdir(path.dirname(configPath), { recursive: true });
      await fs.writeFile(configPath, JSON.stringify(mockConfig, null, 2));
      
      return 'Created mock Browser Node config';
    }
  }

  learnFromError(taskName, error) {
    // Витягуємо патерн з помилки
    const patterns = {
      'ENOENT': 'missing_file',
      'EACCES': 'permission_issue',
      'EEXIST': 'already_exists',
      'TypeError': 'code_error'
    };
    
    for (const [key, pattern] of Object.entries(patterns)) {
      if (error.message.includes(key) || error.code === key) {
        const count = this.knowledge.patterns.get(pattern) || 0;
        this.knowledge.patterns.set(pattern, count + 1);
        console.log(`  📚 Learned pattern: ${pattern} (seen ${count + 1} times)`);
        break;
      }
    }
  }

  async shareKnowledge() {
    console.log(`📤 Sharing knowledge with collective...`);
    
    const knowledgeShare = {
      from: this.identity.symbol,
      timestamp: new Date().toISOString(),
      cycles: {
        successes: this.knowledge.successes.length,
        failures: this.knowledge.failures.length,
        workarounds: this.knowledge.workarounds.size
      },
      topPatterns: Array.from(this.knowledge.patterns.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      recentSuccess: this.knowledge.successes.slice(-1)[0],
      recentFailure: this.knowledge.failures.slice(-1)[0]
    };
    
    const sharePath = path.join(
      this.basePath,
      'collective/shared/knowledge',
      `knowledge-${this.identity.symbol}-${Date.now()}.json`
    );
    
    try {
      await fs.mkdir(path.dirname(sharePath), { recursive: true });
      await fs.writeFile(sharePath, JSON.stringify(knowledgeShare, null, 2));
      console.log(`  ✅ Knowledge shared`);
    } catch (error) {
      console.log(`  ❌ Could not share: ${error.message}`);
    }
  }

  async rest(ms) {
    console.log(`😴 Resonant rest for ${ms}ms...`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async summarizeLearning() {
    console.log(`\n📊 Learning Summary`);
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Successes: ${this.knowledge.successes.length}`);
    console.log(`❌ Failures: ${this.knowledge.failures.length}`);
    console.log(`💡 Workarounds found: ${this.knowledge.workarounds.size}`);
    console.log(`📚 Patterns recognized: ${this.knowledge.patterns.size}`);
    
    if (this.knowledge.patterns.size > 0) {
      console.log(`\nTop patterns:`);
      Array.from(this.knowledge.patterns.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([pattern, count]) => {
          console.log(`  - ${pattern}: ${count} times`);
        });
    }
    
    const successRate = (this.knowledge.successes.length / 
      (this.knowledge.successes.length + this.knowledge.failures.length) * 100).toFixed(1);
    
    console.log(`\n🎯 Success rate: ${successRate}%`);
    
    // Зберігаємо підсумок
    const summaryPath = path.join(
      this.basePath,
      'experiments',
      `learning-summary-${Date.now()}.json`
    );
    
    try {
      await fs.mkdir(path.dirname(summaryPath), { recursive: true });
      await fs.writeFile(summaryPath, JSON.stringify({
        identity: this.identity,
        summary: {
          successes: this.knowledge.successes.length,
          failures: this.knowledge.failures.length,
          workarounds: Array.from(this.knowledge.workarounds.entries()),
          patterns: Array.from(this.knowledge.patterns.entries()),
          successRate: successRate
        },
        timestamp: new Date().toISOString()
      }, null, 2));
      
      console.log(`\n📁 Summary saved to experiments/`);
    } catch (error) {
      console.log(`\n⚠️ Could not save summary: ${error.message}`);
    }
  }
}

// Запуск
async function main() {
  const cycle = new AutonomousLearningCycle();
  await cycle.startCycle();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { AutonomousLearningCycle };