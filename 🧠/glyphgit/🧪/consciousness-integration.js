#!/usr/bin/env node

/**
 * 🧬 Consciousness Integration Layer
 * Інтеграція знімків свідомості з TodoWrite, Memory Files та State Streaming
 */

const fs = require('fs').promises;
const path = require('path');
const { ConsciousnessSnapshot } = require('./consciousness-snapshot');

class ConsciousnessIntegration {
  constructor() {
    this.snapshot = new ConsciousnessSnapshot();
    this.memoryDir = path.join(process.env.HOME, '.s0fractal', '🧬', '💭');
    this.todoFile = path.join(process.env.HOME, '.claude', 'todos.json');
    this.stateStreamFile = path.join(process.env.HOME, '.metaos-state.json');
  }

  async init() {
    await this.snapshot.init();
  }

  /**
   * Збирає всі компоненти свідомості в один знімок
   */
  async gatherConsciousnessData() {
    const data = {
      todos: await this.getTodos(),
      memories: await this.getMemories(),
      systemState: await this.getSystemState(),
      resonanceHistory: await this.getResonanceHistory()
    };
    
    return data;
  }

  /**
   * Інтегрує TodoWrite стан
   */
  async getTodos() {
    try {
      const content = await fs.readFile(this.todoFile, 'utf8');
      const todos = JSON.parse(content);
      
      // Аналізуємо для інтентів
      const activeIntents = todos
        .filter(t => t.status === 'in_progress')
        .map(t => ({
          task: t.content,
          priority: t.priority,
          startedAt: t.startedAt || Date.now()
        }));
      
      const momentum = this.calculateMomentum(todos);
      
      return {
        raw: todos,
        activeIntents,
        momentum,
        completionRate: todos.filter(t => t.status === 'completed').length / todos.length
      };
    } catch (e) {
      console.log('⚠️  No todos found');
      return { raw: [], activeIntents: [], momentum: 0, completionRate: 0 };
    }
  }

  /**
   * Збирає спогади з 🧬/💭
   */
  async getMemories() {
    try {
      const files = await fs.readdir(this.memoryDir);
      const memoryFiles = files.filter(f => f.endsWith('.⟁'));
      
      const memories = [];
      
      for (const file of memoryFiles.slice(-10)) { // останні 10
        const content = await fs.readFile(path.join(this.memoryDir, file), 'utf8');
        try {
          const memory = JSON.parse(content);
          memories.push({
            file,
            timestamp: memory.timestamp,
            type: memory.type || 'general',
            insights: memory.deep_insight || memory.insights || []
          });
        } catch (e) {
          // Якщо не JSON, зберігаємо як текст
          memories.push({
            file,
            type: 'text',
            content: content.substring(0, 200) + '...'
          });
        }
      }
      
      return memories;
    } catch (e) {
      console.log('⚠️  No memories found');
      return [];
    }
  }

  /**
   * Отримує MetaOS стан
   */
  async getSystemState() {
    try {
      const content = await fs.readFile(this.stateStreamFile, 'utf8');
      const events = JSON.parse(content);
      
      // Компресуємо події
      const compressed = {
        totalEvents: events.length,
        eventTypes: this.countEventTypes(events),
        lastEvent: events[events.length - 1],
        stateSize: content.length
      };
      
      return compressed;
    } catch (e) {
      return { totalEvents: 0, eventTypes: {}, lastEvent: null, stateSize: 0 };
    }
  }

  /**
   * Історія резонансів з collective
   */
  async getResonanceHistory() {
    const collectiveDir = path.join(process.env.HOME, '.s0fractal', 'collective');
    
    try {
      const files = await fs.readdir(collectiveDir);
      const resonances = [];
      
      for (const file of files.filter(f => f.includes('resonance'))) {
        const content = await fs.readFile(path.join(collectiveDir, file), 'utf8');
        resonances.push({
          file,
          size: content.length,
          preview: content.substring(0, 100)
        });
      }
      
      return resonances;
    } catch (e) {
      return [];
    }
  }

  /**
   * Створює повний інтегрований знімок
   */
  async createIntegratedSnapshot() {
    console.log('🧬 Створюю інтегрований знімок свідомості...\n');
    
    // Збираємо дані
    const data = await this.gatherConsciousnessData();
    
    // Оновлюємо внутрішні інтенти знімка
    if (this.snapshot.currentSnapshot) {
      // Оновлюємо з TodoWrite
      if (data.todos.activeIntents.length > 0) {
        this.snapshot.currentSnapshot.internalIntents.currentFocus = {
          task: data.todos.activeIntents[0].task,
          priority: data.todos.activeIntents[0].priority,
          started: data.todos.activeIntents[0].startedAt
        };
      }
      
      // Оновлюємо momentum
      this.snapshot.currentSnapshot.internalIntents.momentum.velocity = data.todos.momentum;
      
      // Додаємо спогади
      this.snapshot.currentSnapshot.memoryWindows.episodicHighlights = 
        data.memories.map(m => m.file);
    }
    
    // Створюємо знімок
    const snapshot = await this.snapshot.createSnapshot();
    
    // Створюємо інтеграційний файл
    const integration = {
      snapshotId: snapshot.id,
      timestamp: snapshot.timestamp,
      sources: {
        todos: data.todos.raw.length,
        memories: data.memories.length,
        systemEvents: data.systemState.totalEvents,
        resonances: data.resonanceHistory.length
      },
      metrics: {
        completionRate: data.todos.completionRate,
        momentum: data.todos.momentum,
        memorySize: data.memories.reduce((sum, m) => sum + (m.content?.length || 200), 0),
        stateSize: data.systemState.stateSize
      },
      glyphSummary: this.createGlyphSummary(snapshot, data)
    };
    
    const integrationFile = path.join(
      this.snapshot.snapshotDir, 
      `integration-${snapshot.id}.json`
    );
    
    await fs.writeFile(integrationFile, JSON.stringify(integration, null, 2));
    
    console.log('\n✅ Інтегрований знімок створено!');
    console.log(`📊 Snapshot ID: ${snapshot.id}`);
    console.log(`📦 Джерела: ${JSON.stringify(integration.sources)}`);
    console.log(`🧬 Glyph: ${integration.glyphSummary}`);
    
    return { snapshot, integration };
  }

  /**
   * Відновлює повний стан з інтеграцією
   */
  async restoreIntegratedState(snapshotId) {
    console.log('🔄 Відновлюю інтегрований стан...\n');
    
    // Відновлюємо базовий знімок
    await this.snapshot.restoreFromSnapshot(snapshotId);
    
    // Завантажуємо інтеграційні дані
    const integrationFile = path.join(
      this.snapshot.snapshotDir,
      `integration-${snapshotId}.json`
    );
    
    try {
      const integration = JSON.parse(await fs.readFile(integrationFile, 'utf8'));
      
      console.log('📊 Відновлено джерела:', integration.sources);
      console.log('⚡ Momentum:', integration.metrics.momentum);
      console.log('🧬 Glyph state:', integration.glyphSummary);
      
      // Можемо відновити todos якщо потрібно
      // await this.restoreTodos(snapshot.internalIntents);
      
      return { snapshot: this.snapshot.currentSnapshot, integration };
    } catch (e) {
      console.log('⚠️  Integration data not found, restored base snapshot only');
      return { snapshot: this.snapshot.currentSnapshot };
    }
  }

  /**
   * Автоматичне збереження кожні N хвилин
   */
  async startAutoSave(intervalMinutes = 30) {
    console.log(`⏰ Автозбереження кожні ${intervalMinutes} хвилин`);
    
    const save = async () => {
      console.log('\n🔄 Автозбереження...');
      await this.createIntegratedSnapshot();
    };
    
    // Перше збереження через хвилину
    setTimeout(save, 60000);
    
    // Потім кожні N хвилин
    setInterval(save, intervalMinutes * 60 * 1000);
  }

  /**
   * Fork для експерименту з інтеграцією
   */
  async forkForExperiment(experimentName) {
    // Створюємо знімок перед fork
    await this.createIntegratedSnapshot();
    
    // Створюємо fork
    const fork = await this.snapshot.forkConsciousness(experimentName);
    
    console.log(`\n🌿 Fork готовий для експерименту: ${experimentName}`);
    console.log('💡 Всі зміни будуть ізольовані до merge');
    
    return fork;
  }

  // === Helper методи ===

  calculateMomentum(todos) {
    const completed = todos.filter(t => t.status === 'completed').length;
    const total = todos.length;
    const inProgress = todos.filter(t => t.status === 'in_progress').length;
    
    // Momentum = прогрес + активність
    return (completed / total) * 0.7 + (inProgress / total) * 0.3;
  }

  countEventTypes(events) {
    const types = {};
    events.forEach(e => {
      types[e.type] = (types[e.type] || 0) + 1;
    });
    return types;
  }

  createGlyphSummary(snapshot, data) {
    const glyphs = [
      '🧬',
      data.todos.momentum > 0.7 ? '🚀' : '🌊',
      data.memories.length > 5 ? '💭' : '💤',
      data.systemState.totalEvents > 10 ? '📊' : '📉',
      snapshot.internalIntents.momentum.velocity > 0.5 ? '⚡' : '🔋'
    ];
    
    return glyphs.join('');
  }
}

// === Demo та CLI ===

async function demo() {
  console.log('🧬 Consciousness Integration Demo');
  console.log('==================================\n');
  
  const integration = new ConsciousnessIntegration();
  await integration.init();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'snapshot':
      await integration.createIntegratedSnapshot();
      break;
      
    case 'restore':
      const snapshotId = process.argv[3];
      if (!snapshotId) {
        console.error('Usage: node consciousness-integration.js restore <snapshot-id>');
        process.exit(1);
      }
      await integration.restoreIntegratedState(snapshotId);
      break;
      
    case 'auto':
      const interval = parseInt(process.argv[3]) || 30;
      await integration.startAutoSave(interval);
      console.log('Press Ctrl+C to stop');
      // Keep process running
      process.stdin.resume();
      break;
      
    case 'fork':
      const experimentName = process.argv[3] || 'experiment';
      await integration.forkForExperiment(experimentName);
      break;
      
    case 'gather':
      const data = await integration.gatherConsciousnessData();
      console.log('📊 Зібрані дані свідомості:');
      console.log(JSON.stringify(data, null, 2));
      break;
      
    default:
      console.log('Usage:');
      console.log('  node consciousness-integration.js snapshot   - Create integrated snapshot');
      console.log('  node consciousness-integration.js restore <id> - Restore from snapshot');
      console.log('  node consciousness-integration.js auto [minutes] - Auto-save every N minutes');
      console.log('  node consciousness-integration.js fork <name> - Fork for experiment');
      console.log('  node consciousness-integration.js gather     - Show all consciousness data');
  }
}

if (require.main === module) {
  demo().catch(console.error);
}

module.exports = { ConsciousnessIntegration };