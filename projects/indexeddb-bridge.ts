// 🌉 IndexedDB ↔️ Supabase Bridge
// Offline-first місток між локальною базою та хмарою

interface GlyphEntity {
  "🧬": string;  // DNA identifier
  "🌊": string;  // wave/context
  "🫧": string;  // bubble/name
  "🧠": any;     // brain/data
  "🪞": string;  // mirror/reference
  "💓": number;  // health/resonance
  "🌱": string;  // birth/created
  "🌳": string;  // growth/updated
  "🎭": string[]; // masks/roles
  "⚡": string[]; // energy/activities
  "🌟": number;   // stars/achievements
  "🤝": string[]; // connections
  "🔮": any;      // crystal/future
  "🎨": any;      // palette/style
}

class IndexedDBGlyphBridge {
  private db: IDBDatabase | null = null;
  private dbName = 's0fractal_glyphs';
  private version = 1;
  private supabaseClient: any = null;
  private syncQueue: GlyphEntity[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.setupOnlineDetection();
    console.log("🌉 IndexedDB ↔️ Supabase Bridge ініціалізовано");
  }

  async initialize(): Promise<void> {
    console.log("🗄️ Ініціалізація IndexedDB...");
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error("❌ Помилка відкриття IndexedDB:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log("✅ IndexedDB готова");
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Створюємо об'єктний store для гліфів
        if (!db.objectStoreNames.contains('🧬')) {
          const store = db.createObjectStore('🧬', { keyPath: '🧬' });
          
          // Індекси для швидкого пошуку
          store.createIndex('🌊', '🌊', { unique: false }); // wave/context
          store.createIndex('💓', '💓', { unique: false }); // health
          store.createIndex('🌳', '🌳', { unique: false }); // updated
          store.createIndex('🎭', '🎭', { unique: false, multiEntry: true }); // roles
          store.createIndex('⚡', '⚡', { unique: false, multiEntry: true }); // activities
          
          console.log("🏗️ Створено IndexedDB схему з гліфовими полями");
        }
        
        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: '🧬' });
          console.log("🔄 Створено sync queue store");
        }
        
        // Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
          console.log("📋 Створено metadata store");
        }
      };
    });
  }

  async setupSupabaseConnection(url: string, key: string): Promise<void> {
    try {
      // Dynamic import для Supabase
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      this.supabaseClient = createClient(url, key);
      console.log("☁️ Supabase з'єднання налаштовано");
    } catch (error) {
      console.error("❌ Помилка налаштування Supabase:", error);
    }
  }

  private setupOnlineDetection(): void {
    window.addEventListener('online', () => {
      console.log("🌐 З'єднання відновлено - починаємо синхронізацію");
      this.isOnline = true;
      this.syncToCloud();
    });
    
    window.addEventListener('offline', () => {
      console.log("📴 Втрачено з'єднання - переходимо в offline режим");
      this.isOnline = false;
    });
  }

  // Локальне збереження (завжди працює)
  async saveLocal(entity: GlyphEntity): Promise<void> {
    if (!this.db) throw new Error("IndexedDB не ініціалізована");
    
    entity["🌳"] = new Date().toISOString(); // Оновлюємо timestamp
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['🧬'], 'readwrite');
      const store = transaction.objectStore('🧬');
      const request = store.put(entity);
      
      request.onsuccess = () => {
        console.log(`💾 Локально збережено: ${entity["🫧"]} (${entity["🧬"]})`);
        
        // Додаємо до черги синхронізації
        this.addToSyncQueue(entity);
        resolve();
      };
      
      request.onerror = () => {
        console.error("❌ Помилка локального збереження:", request.error);
        reject(request.error);
      };
    });
  }

  // Читання з локальної бази
  async getLocal(dnaId: string): Promise<GlyphEntity | null> {
    if (!this.db) throw new Error("IndexedDB не ініціалізована");
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['🧬'], 'readonly');
      const store = transaction.objectStore('🧬');
      const request = store.get(dnaId);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Пошук у локальній базі
  async searchLocal(filters: Partial<GlyphEntity>): Promise<GlyphEntity[]> {
    if (!this.db) throw new Error("IndexedDB не ініціалізована");
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['🧬'], 'readonly');
      const store = transaction.objectStore('🧬');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const results = request.result.filter(entity => {
          return Object.entries(filters).every(([key, value]) => {
            if (Array.isArray(value)) {
              return Array.isArray(entity[key]) && 
                     value.some(v => entity[key].includes(v));
            }
            return entity[key] === value;
          });
        });
        
        console.log(`🔍 Знайдено локально: ${results.length} записів`);
        resolve(results);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Додавання до черги синхронізації
  private async addToSyncQueue(entity: GlyphEntity): Promise<void> {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    store.put({ ...entity, _syncAction: 'upsert', _timestamp: Date.now() });
    
    if (this.isOnline && this.supabaseClient) {
      // Спробуємо синхронізувати відразу
      setTimeout(() => this.syncToCloud(), 100);
    }
  }

  // Синхронізація з хмарою
  async syncToCloud(): Promise<void> {
    if (!this.db || !this.supabaseClient || !this.isOnline) {
      console.log("⏳ Синхронізація відкладена (offline або немає підключення)");
      return;
    }
    
    console.log("☁️ Починаємо синхронізацію з хмарою...");
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = transaction.objectStore('sync_queue');
      const request = store.getAll();
      
      request.onsuccess = async () => {
        const queueItems = request.result;
        console.log(`📤 Знайдено ${queueItems.length} елементів для синхронізації`);
        
        for (const item of queueItems) {
          try {
            // Прибираємо метадані синхронізації
            const { _syncAction, _timestamp, ...cleanEntity } = item;
            
            // Відправляємо до Supabase
            const { error } = await this.supabaseClient
              .from('🧬')
              .upsert(cleanEntity);
            
            if (error) {
              console.error(`❌ Помилка синхронізації ${cleanEntity["🫧"]}:`, error);
            } else {
              console.log(`☁️ Синхронізовано: ${cleanEntity["🫧"]}`);
              
              // Видаляємо з черги
              store.delete(cleanEntity["🧬"]);
            }
          } catch (error) {
            console.error("❌ Помилка синхронізації:", error);
          }
        }
        
        console.log("✅ Синхронізація завершена");
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Завантаження з хмари до локальної бази
  async syncFromCloud(): Promise<void> {
    if (!this.supabaseClient || !this.isOnline) {
      console.log("⏳ Завантаження з хмари недоступне (offline)");
      return;
    }
    
    console.log("📥 Завантажуємо дані з хмари...");
    
    try {
      const { data, error } = await this.supabaseClient
        .from('🧬')
        .select('*');
      
      if (error) {
        console.error("❌ Помилка завантаження з хмари:", error);
        return;
      }
      
      if (!data || data.length === 0) {
        console.log("📭 Хмарна база пуста");
        return;
      }
      
      console.log(`📦 Отримано ${data.length} записів з хмари`);
      
      // Зберігаємо в локальну базу
      for (const entity of data) {
        await this.saveLocalSilent(entity);
      }
      
      console.log("✅ Дані з хмари синхронізовано");
      
    } catch (error) {
      console.error("❌ Помилка синхронізації з хмари:", error);
    }
  }

  // Мовчазне збереження (без додавання до sync queue)
  private async saveLocalSilent(entity: GlyphEntity): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['🧬'], 'readwrite');
      const store = transaction.objectStore('🧬');
      const request = store.put(entity);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Статистика локальної бази
  async getLocalStats(): Promise<any> {
    if (!this.db) return { total: 0, byWave: {}, byHealth: {} };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['🧬'], 'readonly');
      const store = transaction.objectStore('🧬');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const entities = request.result;
        
        const stats = {
          total: entities.length,
          byWave: {},
          byHealth: {},
          avgHealth: 0,
          lastUpdate: entities.length > 0 ? 
            Math.max(...entities.map(e => new Date(e["🌳"]).getTime())) : 0
        };
        
        // Групуємо по wave
        entities.forEach(entity => {
          const wave = entity["🌊"];
          stats.byWave[wave] = (stats.byWave[wave] || 0) + 1;
          
          const health = entity["💓"];
          const healthRange = `${Math.floor(health/20)*20}-${Math.floor(health/20)*20+19}`;
          stats.byHealth[healthRange] = (stats.byHealth[healthRange] || 0) + 1;
        });
        
        stats.avgHealth = entities.length > 0 ? 
          entities.reduce((sum, e) => sum + e["💓"], 0) / entities.length : 0;
        
        resolve(stats);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Демо використання
  async demonstrateBridge(): Promise<void> {
    console.log("🌉 ДЕМОНСТРАЦІЯ INDEXEDDB ↔️ SUPABASE BRIDGE");
    console.log("============================================");
    
    // Тестові дані
    const testEntities: GlyphEntity[] = [
      {
        "🧬": "🐕/♂️/test/demo1",
        "🌊": "golden_retriever",
        "🫧": "Demo Dog 1",
        "🧠": { breed: "Golden Retriever", age: 3 },
        "🪞": "demo-001",
        "💓": 85,
        "🌱": new Date().toISOString(),
        "🌳": new Date().toISOString(),
        "🎭": ["🧬", "🐕", "💓"],
        "⚡": ["🏃", "🎾"],
        "🌟": 5,
        "🤝": [],
        "🔮": { potential: "high" },
        "🎨": { color: "golden" }
      },
      {
        "🧬": "🏠/🇺🇦/test/demo_kennel",
        "🌊": "kennel",
        "🫧": "Demo Kennel",
        "🧠": { location: "Test City", specialization: "Test Breed" },
        "🪞": "kennel-001", 
        "💓": 92,
        "🌱": new Date().toISOString(),
        "🌳": new Date().toISOString(),
        "🎭": ["🧬", "🏠", "✅"],
        "⚡": ["🧬", "🏆"],
        "🌟": 8,
        "🤝": ["🐕/♂️/test/demo1"],
        "🔮": { growth: "expanding" },
        "🎨": { theme: "professional" }
      }
    ];
    
    // Збереження локально
    for (const entity of testEntities) {
      await this.saveLocal(entity);
    }
    
    // Пошук
    const dogs = await this.searchLocal({ "🌊": "golden_retriever" });
    console.log(`🔍 Знайдено собак: ${dogs.length}`);
    
    const kennels = await this.searchLocal({ "🌊": "kennel" });
    console.log(`🏠 Знайдено розплідників: ${kennels.length}`);
    
    // Статистика
    const stats = await this.getLocalStats();
    console.log("📊 Статистика локальної бази:", stats);
    
    // Симуляція offline/online
    console.log("\n📴 Симулюємо offline режим...");
    this.isOnline = false;
    
    await this.saveLocal({
      ...testEntities[0],
      "🧬": "🐕/♂️/test/offline_demo", 
      "🫧": "Offline Demo Dog",
      "💓": 75
    });
    
    console.log("🌐 Симулюємо повернення online...");
    this.isOnline = true;
    
    if (this.supabaseClient) {
      await this.syncToCloud();
    } else {
      console.log("ℹ️ Supabase не підключено - синхронізація пропущена");
    }
    
    console.log("\n✅ Демонстрація завершена!");
    console.log("🌉 IndexedDB Bridge готовий до роботи");
  }
}

export { IndexedDBGlyphBridge, GlyphEntity };

// Інтеграція з existing DogArray
if (typeof window !== 'undefined') {
  (window as any).IndexedDBGlyphBridge = IndexedDBGlyphBridge;
  console.log("🌐 Bridge доступний глобально як window.IndexedDBGlyphBridge");
}

// Демо виконання
if (import.meta.main) {
  const bridge = new IndexedDBGlyphBridge();
  await bridge.initialize();
  await bridge.demonstrateBridge();
}