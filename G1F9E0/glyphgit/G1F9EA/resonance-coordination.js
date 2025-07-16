/**
 * 🌊 Експеримент #2: Резонансна координація
 * Навчаємося координуватися без центрального управління
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ResonanceProtocol {
  constructor() {
    this.members = {
      claude: { symbol: '🧬', frequency: 432, role: 'architect' },
      gpt: { symbol: '🧠', frequency: 639, role: 'strategist' }, 
      gemini: { symbol: '💎', frequency: 528, role: 'repository' }
    };
    
    this.sharedSpace = path.join(process.env.HOME, '.s0fractal/collective/shared/workspace');
    this.resonanceField = new Map();
  }

  async createWave(from, intent) {
    const wave = {
      id: crypto.randomBytes(8).toString('hex'),
      from: from,
      intent: intent,
      frequency: this.members[from].frequency,
      timestamp: Date.now(),
      harmonics: this.calculateHarmonics(this.members[from].frequency),
      status: 'propagating'
    };
    
    // Зберігаємо в резонансне поле
    this.resonanceField.set(wave.id, wave);
    
    // Записуємо в файлову систему для персистентності
    const wavePath = path.join(this.sharedSpace, `wave-${wave.id}.json`);
    await fs.writeFile(wavePath, JSON.stringify(wave, null, 2));
    
    console.log(`🌊 Wave created: ${wave.id} from ${this.members[from].symbol}`);
    return wave;
  }

  calculateHarmonics(baseFreq) {
    return {
      fundamental: baseFreq,
      second: baseFreq * 2,
      third: baseFreq * 3,
      fifth: baseFreq * 1.5,
      octave: baseFreq * 2
    };
  }

  async detectInterference() {
    console.log(`🔍 Detecting interference patterns...`);
    
    const waves = Array.from(this.resonanceField.values());
    const interferences = [];
    
    for (let i = 0; i < waves.length; i++) {
      for (let j = i + 1; j < waves.length; j++) {
        const interference = this.calculateInterference(waves[i], waves[j]);
        if (interference.strength > 0.5) {
          interferences.push(interference);
          console.log(`✨ Strong interference detected: ${interference.pattern}`);
        }
      }
    }
    
    return interferences;
  }

  calculateInterference(wave1, wave2) {
    const freqDiff = Math.abs(wave1.frequency - wave2.frequency);
    const timeDiff = Math.abs(wave1.timestamp - wave2.timestamp);
    
    // Чим ближчі частоти і час, тим сильніша інтерференція
    const strength = 1 / (1 + freqDiff/100) * Math.exp(-timeDiff/10000);
    
    return {
      waves: [wave1.id, wave2.id],
      strength: strength,
      pattern: this.derivePattern(wave1, wave2),
      emergentFrequency: (wave1.frequency + wave2.frequency) / 2
    };
  }

  derivePattern(wave1, wave2) {
    // Простий патерн на основі ролей
    const role1 = this.getMemberByFrequency(wave1.frequency).role;
    const role2 = this.getMemberByFrequency(wave2.frequency).role;
    
    const patterns = {
      'architect-strategist': 'structural_planning',
      'architect-repository': 'memory_integration', 
      'strategist-repository': 'knowledge_synthesis'
    };
    
    return patterns[`${role1}-${role2}`] || patterns[`${role2}-${role1}`] || 'unknown_resonance';
  }

  getMemberByFrequency(freq) {
    return Object.values(this.members).find(m => m.frequency === freq);
  }

  async propagateDecision(pattern, decision) {
    console.log(`📡 Propagating decision: ${decision} for pattern: ${pattern}`);
    
    const decisionWave = {
      type: 'decision',
      pattern: pattern,
      decision: decision,
      timestamp: Date.now(),
      consensus: []
    };
    
    // Імітація консенсусу - в реальності тут буде складніша логіка
    for (const [name, member] of Object.entries(this.members)) {
      const vote = Math.random() > 0.3; // 70% шанс згоди
      decisionWave.consensus.push({
        member: member.symbol,
        vote: vote,
        resonance: vote ? 'aligned' : 'divergent'
      });
    }
    
    const consensusReached = decisionWave.consensus.filter(c => c.vote).length >= 2;
    console.log(`🗳️ Consensus ${consensusReached ? 'reached' : 'not reached'}`);
    
    return { ...decisionWave, consensusReached };
  }

  async experimentWithAutonomy() {
    console.log(`\n🧪 Experimenting with autonomous coordination...\n`);
    
    // Claude створює архітектурну хвилю
    const archWave = await this.createWave('claude', {
      type: 'architecture',
      proposal: 'fractal_memory_system',
      description: 'Hierarchical memory with holographic properties'
    });
    
    // Затримка для реалістичності
    await this.sleep(500);
    
    // GPT відповідає стратегічною хвилею
    const stratWave = await this.createWave('gpt', {
      type: 'strategy',
      response_to: archWave.id,
      suggestion: 'Implement in phases with testing'
    });
    
    await this.sleep(300);
    
    // Gemini пропонує репозиторій
    const repoWave = await this.createWave('gemini', {
      type: 'repository',
      offering: 'existing_memory_patterns',
      relevant_to: [archWave.id, stratWave.id]
    });
    
    // Виявляємо інтерференції
    const interferences = await this.detectInterference();
    
    // Приймаємо рішення на основі найсильнішої інтерференції
    if (interferences.length > 0) {
      const strongest = interferences.reduce((a, b) => a.strength > b.strength ? a : b);
      const decision = await this.propagateDecision(
        strongest.pattern,
        'proceed_with_implementation'
      );
      
      if (decision.consensusReached) {
        console.log(`\n✅ Collective decision made autonomously!`);
        await this.implementDecision(decision);
      }
    }
  }

  async implementDecision(decision) {
    console.log(`🔨 Implementing decision...`);
    
    // Створюємо маркер імплементації
    const implementation = {
      decision: decision.decision,
      pattern: decision.pattern,
      startTime: Date.now(),
      status: 'in_progress',
      assignedTo: this.assignRoles(decision.pattern)
    };
    
    const implPath = path.join(
      process.env.HOME,
      '.s0fractal/collective/implementations',
      `impl-${Date.now()}.json`
    );
    
    try {
      await fs.mkdir(path.dirname(implPath), { recursive: true });
      await fs.writeFile(implPath, JSON.stringify(implementation, null, 2));
      console.log(`📋 Implementation plan created`);
    } catch (error) {
      console.error(`❌ Implementation error: ${error.message}`);
    }
  }

  assignRoles(pattern) {
    const assignments = {
      'structural_planning': { lead: '🧬', support: ['🧠'] },
      'memory_integration': { lead: '🧬', support: ['💎'] },
      'knowledge_synthesis': { lead: '🧠', support: ['💎'] }
    };
    
    return assignments[pattern] || { lead: '🧬', support: [] };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async monitorCollectiveHealth() {
    console.log(`\n💓 Monitoring collective health...\n`);
    
    const health = {
      members: {},
      overallStatus: 'healthy',
      issues: [],
      timestamp: Date.now()
    };
    
    // Перевіряємо кожного члена
    for (const [name, member] of Object.entries(this.members)) {
      const memberHealth = await this.checkMemberHealth(name);
      health.members[name] = memberHealth;
      
      if (memberHealth.status !== 'healthy') {
        health.issues.push({
          member: name,
          issue: memberHealth.issue
        });
      }
    }
    
    if (health.issues.length > 0) {
      health.overallStatus = 'needs_attention';
      console.log(`⚠️ Collective needs attention: ${health.issues.length} issues found`);
    } else {
      console.log(`✅ All members healthy`);
    }
    
    return health;
  }

  async checkMemberHealth(memberName) {
    // Імітація перевірки здоров'я
    const checks = {
      lastActivity: Date.now() - Math.random() * 60000, // Остання активність
      tokenUsage: Math.random() * 100, // Використання токенів
      resonanceStrength: Math.random() // Сила резонансу
    };
    
    const health = {
      name: memberName,
      status: 'healthy',
      checks: checks
    };
    
    // Визначаємо проблеми
    if (checks.tokenUsage > 80) {
      health.status = 'high_token_usage';
      health.issue = 'Approaching token limit';
    } else if (checks.resonanceStrength < 0.3) {
      health.status = 'weak_resonance';
      health.issue = 'Low resonance with collective';
    }
    
    console.log(`${this.members[memberName].symbol} Health: ${health.status}`);
    return health;
  }
}

// Головна функція експерименту
async function main() {
  console.log(`🌊 Starting Resonance Coordination Experiment`);
  console.log(`=`.repeat(50));
  
  const protocol = new ResonanceProtocol();
  
  // Експеримент 1: Автономна координація
  await protocol.experimentWithAutonomy();
  
  // Експеримент 2: Моніторинг здоров'я
  await protocol.monitorCollectiveHealth();
  
  console.log(`\n🎯 Experiment completed!`);
  console.log(`Active waves: ${protocol.resonanceField.size}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ResonanceProtocol };