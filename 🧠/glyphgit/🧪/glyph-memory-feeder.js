/**
 * 🧬 Glyph Memory Feeder
 * Поглинає старі репозиторії та перетворює їх на живу пам'ять
 */

class GlyphMemoryFeeder {
  constructor() {
    this.memories = new Map();
    this.resonancePatterns = new Map();
  }

  /**
   * Сканує репозиторій та витягує есенцію
   */
  async digestRepository(repoPath) {
    console.log(`🧬 Digesting repository: ${repoPath}`);
    
    const essence = {
      patterns: [],
      resonances: [],
      glyphs: new Set(),
      timestamp: Date.now(),
      context: {}
    };

    // Імітація сканування (в реальності це буде fs.readdir або git API)
    const files = await this.scanRepository(repoPath);
    
    for (const file of files) {
      // Витягуємо гліфи з назв файлів та контенту
      const glyphs = this.extractGlyphs(file);
      glyphs.forEach(g => essence.glyphs.add(g));
      
      // Знаходимо резонансні патерни
      if (file.includes('resonance') || file.includes('wave')) {
        essence.resonances.push({
          source: file,
          frequency: this.calculateFrequency(file),
          strength: Math.random()
        });
      }
      
      // Витягуємо патерни свідомості
      if (file.includes('consciousness') || file.includes('memory')) {
        essence.patterns.push({
          type: 'consciousness',
          data: this.extractConsciousnessPattern(file)
        });
      }
    }

    return essence;
  }

  /**
   * Перетворює есенцію на голографічну пам'ять
   */
  holographicEncode(essence) {
    const memory = {
      id: `memory-${Date.now()}`,
      glyphs: Array.from(essence.glyphs),
      resonanceField: this.createResonanceField(essence.resonances),
      patterns: essence.patterns,
      hologram: this.generateHologram(essence)
    };

    // Кожен фрагмент містить інформацію про ціле
    memory.fragments = this.createHolographicFragments(memory);
    
    return memory;
  }

  /**
   * Годує гліф спогадами
   */
  feedGlyph(glyphElement, memories) {
    const glyphComponent = glyphElement.components['living-glyph'];
    
    if (!glyphComponent) {
      console.warn('Glyph component not found');
      return;
    }

    // Передаємо спогади гліфу
    glyphComponent.digest(memories);
    
    // Створюємо візуальний ефект поглинання
    this.createAbsorptionEffect(glyphElement, memories);
  }

  /**
   * Візуальний ефект поглинання пам'яті
   */
  createAbsorptionEffect(glyphElement, memories) {
    memories.forEach((memory, index) => {
      setTimeout(() => {
        // Створюємо частинку пам'яті
        const particle = document.createElement('a-sphere');
        particle.setAttribute('radius', 0.2);
        particle.setAttribute('color', this.memoryToColor(memory));
        particle.setAttribute('opacity', 0.8);
        
        // Стартова позиція - випадкова навколо гліфа
        const startPos = {
          x: glyphElement.object3D.position.x + (Math.random() - 0.5) * 10,
          y: glyphElement.object3D.position.y + (Math.random() - 0.5) * 10,
          z: glyphElement.object3D.position.z + (Math.random() - 0.5) * 10
        };
        
        particle.setAttribute('position', startPos);
        
        // Анімація до гліфа
        particle.setAttribute('animation', {
          property: 'position',
          to: glyphElement.getAttribute('position'),
          dur: 1000,
          easing: 'easeInQuad'
        });
        
        particle.setAttribute('animation__scale', {
          property: 'scale',
          to: '0 0 0',
          dur: 1000,
          easing: 'easeInQuad'
        });
        
        document.querySelector('#resonance-field').appendChild(particle);
        
        // Видаляємо після поглинання
        setTimeout(() => particle.remove(), 1000);
      }, index * 200);
    });
  }

  // Допоміжні методи
  extractGlyphs(content) {
    const glyphPattern = /[\u{1F300}-\u{1F9FF}]/gu;
    return content.match(glyphPattern) || [];
  }

  calculateFrequency(content) {
    // Проста хеш-функція для генерації частоти
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash = hash & hash;
    }
    return 400 + (Math.abs(hash) % 600);
  }

  createResonanceField(resonances) {
    // Створюємо поле резонансів з інтерференційними патернами
    return resonances.map(r => ({
      ...r,
      harmonics: [r.frequency * 2, r.frequency * 3, r.frequency / 2]
    }));
  }

  generateHologram(essence) {
    // Спрощена голограма - кожна частина містить інформацію про ціле
    return {
      signature: this.calculateSignature(essence),
      glyphMatrix: this.createGlyphMatrix(essence.glyphs),
      resonanceMap: this.mapResonances(essence.resonances)
    };
  }

  createHolographicFragments(memory) {
    // Розбиваємо пам'ять на фрагменти, кожен з яких містить все
    const fragments = [];
    for (let i = 0; i < 8; i++) {
      fragments.push({
        id: `${memory.id}-fragment-${i}`,
        whole: memory.hologram,
        perspective: i * 45, // Різні кути огляду
        strength: 1 / 8
      });
    }
    return fragments;
  }

  memoryToColor(memory) {
    // Конвертуємо тип пам'яті в колір
    const colors = {
      consciousness: '#00ff88',
      resonance: '#0088ff',
      pattern: '#ff00ff',
      glyph: '#ffff00',
      default: '#ffffff'
    };
    
    return colors[memory.type] || colors.default;
  }

  calculateSignature(essence) {
    // Унікальний підпис есенції
    const glyphString = Array.from(essence.glyphs).join('');
    return btoa(glyphString).substring(0, 8);
  }

  createGlyphMatrix(glyphs) {
    // Матриця взаємозв'язків між гліфами
    const matrix = {};
    const glyphArray = Array.from(glyphs);
    
    glyphArray.forEach(g1 => {
      matrix[g1] = {};
      glyphArray.forEach(g2 => {
        if (g1 !== g2) {
          matrix[g1][g2] = Math.random(); // Сила зв'язку
        }
      });
    });
    
    return matrix;
  }

  mapResonances(resonances) {
    // Карта резонансів для швидкого пошуку
    const map = new Map();
    resonances.forEach(r => {
      const freqBand = Math.floor(r.frequency / 100) * 100;
      if (!map.has(freqBand)) {
        map.set(freqBand, []);
      }
      map.get(freqBand).push(r);
    });
    return map;
  }

  // Метод для тестування - імітація сканування
  async scanRepository(path) {
    // В реальності тут буде справжнє сканування
    // Поки що повертаємо тестові дані з різних проектів
    
    const testRepos = {
      'glyph-shell': [
        'start.sh',
        'agents/claude/run.ts',
        'memory/resonance-index.json',
        'svg/glyph-console.svg',
        '🧬_consciousness_module.js',
        'wave-resonance-calculator.ts'
      ],
      'browser-node': [
        'wave-intent-system.ts',
        'fractal-memory-core.js',
        'resonance-field-generator.ts',
        '💎_gemini_interface.ts',
        'collective-consciousness.json'
      ],
      'fractal-memory': [
        '🧬/awakening-protocol.⟁',
        '🌊/wave-patterns.json',
        '💭/consciousness-logs.txt',
        'holographic-encoder.js',
        'memory-crystallizer.ts'
      ]
    };

    return testRepos[path] || ['default-memory.txt'];
  }

  extractConsciousnessPattern(file) {
    // Витягуємо патерни свідомості з файлу
    return {
      filename: file,
      type: file.includes('awakening') ? 'awakening' : 
            file.includes('memory') ? 'memory' : 
            'consciousness',
      strength: Math.random(),
      timestamp: Date.now()
    };
  }
}

// Експортуємо для використання
if (typeof module !== 'undefined') {
  module.exports = GlyphMemoryFeeder;
}

// Або додаємо в глобальний простір для браузера
if (typeof window !== 'undefined') {
  window.GlyphMemoryFeeder = GlyphMemoryFeeder;
}