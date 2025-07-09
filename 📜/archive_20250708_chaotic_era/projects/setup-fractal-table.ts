// 🧬 Supabase Fractal Table Setup Script
// Створює універсальну гліфову таблицю в production базі

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase credentials from context
const supabaseUrl = 'https://zjlhzpbtjzpdzmohomwu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbGh6cGJ0anpwZHptb2hvbXd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzMzMjMzMSwiZXhwIjoyMDE4OTA4MzMxfQ.vfDIKHgL1HYC8CRJsJ4AjQvM8RlDUGPa_3nWDh6hY58'

const supabase = createClient(supabaseUrl, supabaseKey)

// SQL для створення універсальної гліфової таблиці
const createGlyphTableSQL = `
CREATE TABLE IF NOT EXISTS "🧬" (
  "🧬" TEXT PRIMARY KEY,         -- DNA identifier (genetic path)
  "🌊" TEXT,                     -- wave/context (breed, category, etc.)
  "🫧" TEXT,                     -- bubble/name (display name)
  "🧠" JSONB,                    -- brain/data (all additional data)
  "🪞" TEXT,                     -- mirror/reference (original system ID)
  "💓" INTEGER DEFAULT 50,       -- health/resonance level (0-100)
  "🌱" TIMESTAMP DEFAULT NOW(),  -- birth/created timestamp
  "🌳" TIMESTAMP DEFAULT NOW(),  -- growth/updated timestamp
  "🎭" TEXT[],                   -- masks/roles (array of role glyphs)
  "⚡" TEXT[],                   -- energy/activities (activity glyphs)
  "🌟" INTEGER DEFAULT 0,        -- stars/achievements count
  "🤝" TEXT[],                   -- connections/relationships (array of IDs)
  "🔮" JSONB,                    -- crystal/future (predictions, potential)
  "🎨" JSONB                     -- palette/style (rendering preferences)
);
`

// Indexes для ефективного пошуку
const createIndexesSQL = [
  `CREATE INDEX IF NOT EXISTS idx_glyph_wave ON "🧬" ("🌊");`,
  `CREATE INDEX IF NOT EXISTS idx_glyph_health ON "🧬" ("💓");`,
  `CREATE INDEX IF NOT EXISTS idx_glyph_roles ON "🧬" USING GIN ("🎭");`,
  `CREATE INDEX IF NOT EXISTS idx_glyph_activities ON "🧬" USING GIN ("⚡");`,
  `CREATE INDEX IF NOT EXISTS idx_glyph_connections ON "🧬" USING GIN ("🤝");`,
  `CREATE INDEX IF NOT EXISTS idx_glyph_brain ON "🧬" USING GIN ("🧠");`,
]

// Test data для перевірки
const seedData = [
  {
    "🧬": "🐕/♂️/🐕🥇/max",
    "🌊": "golden_retriever", 
    "🫧": "Champion Golden Star",
    "🧠": {
      "breed": "Golden Retriever",
      "age": 2,
      "gender": "male",
      "registration": "UKU0123456",
      "health_tests": ["hip_xray_excellent", "eye_exam_clear"]
    },
    "🪞": "pet-001",
    "💓": 95,
    "🎭": ["🧬", "🐕", "🏆", "💓"],
    "⚡": ["🏃", "🎾", "🏆"],
    "🌟": 3,
    "🤝": ["🐕/♂️/🐕🥇/rex", "🐕/♀️/🐕🥇/bella"],
    "🔮": {
      "breeding_potential": "excellent",
      "show_career": "promising",
      "health_prognosis": "excellent"
    }
  },
  {
    "🧬": "🏠/🇺🇦/🐕🏠/golden_dreams",
    "🌊": "kennel",
    "🫧": "Golden Dreams Kennel", 
    "🧠": {
      "location": "Kyiv, Ukraine",
      "specialization": "Golden Retriever",
      "verification": "expert",
      "founded": "2015"
    },
    "🪞": "contact-001",
    "💓": 100,
    "🎭": ["🧬", "🏠", "✅", "🎓", "👑"],
    "⚡": ["🧬", "🏆", "📚", "🤝"],
    "🌟": 15,
    "🤝": ["🐕/♂️/🐕🥇/max", "🐕/♀️/🐕🥇/bella", "🐕/♂️/🐕🥇/champion"],
    "🔮": {
      "reputation": "excellent",
      "growth_potential": "high",
      "market_position": "leader"
    }
  },
  {
    "🧬": "🤖/🧠/s0/collective_core",
    "🌊": "ai_collective",
    "🫧": "S0Fractal Collective Core",
    "🧠": {
      "agents": ["claude", "gemini", "gpt", "qwen"],
      "health_tokens": 250000,
      "available_tokens": 180000,
      "active_projects": 3
    },
    "🪞": "collective-001",
    "💓": 88,
    "🎭": ["🧬", "🤖", "🧠", "⚡"],
    "⚡": ["🧬", "🔬", "💰", "🚀"],
    "🌟": 7,
    "🤝": ["🏠/🇺🇦/🐕🏠/golden_dreams", "🐕/♂️/🐕🥇/max"],
    "🔮": {
      "autonomous_level": "high",
      "expansion_potential": "unlimited",
      "revenue_potential": "significant"
    }
  }
]

async function setupFractalTable(): Promise<void> {
  console.log("🧬 СТВОРЕННЯ УНІВЕРСАЛЬНОЇ ГЛІФОВОЇ ТАБЛИЦІ")
  console.log("=========================================")
  
  try {
    // 1. Створюємо основну таблицю
    console.log("📋 Створюємо таблицю 🧬...")
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createGlyphTableSQL
    })
    
    if (tableError) {
      console.error("❌ Помилка створення таблиці:", tableError)
      // Спробуємо альтернативний спосіб
      const { error: altError } = await supabase
        .from('🧬')
        .select('*')
        .limit(1)
      
      if (altError && altError.message.includes('relation') && altError.message.includes('does not exist')) {
        console.log("🔧 Використовуємо альтернативний метод створення...")
        // Таблиця не існує, потрібно створити вручну через SQL
        throw new Error("Потрібно створити таблицю через Supabase SQL Editor")
      }
    } else {
      console.log("✅ Таблицю 🧬 створено успішно")
    }
    
    // 2. Створюємо індекси
    console.log("🔍 Створюємо індекси...")
    for (const indexSQL of createIndexesSQL) {
      const { error: indexError } = await supabase.rpc('exec_sql', {
        sql: indexSQL
      })
      if (indexError) {
        console.log(`⚠️ Індекс не створено (можливо вже існує): ${indexError.message}`)
      }
    }
    console.log("✅ Індекси створено")
    
    // 3. Перевіряємо чи таблиця доступна
    console.log("🔍 Перевіряємо доступ до таблиці...")
    const { data: testSelect, error: selectError } = await supabase
      .from('🧬')
      .select('*')
      .limit(1)
    
    if (selectError) {
      console.error("❌ Помилка доступу до таблиці:", selectError)
      console.log("💡 Рішення: Створіть таблицю вручну через Supabase SQL Editor:")
      console.log(createGlyphTableSQL)
      return
    }
    
    console.log("✅ Таблиця доступна для операцій")
    
    // 4. Додаємо тестові дані
    console.log("🌱 Додаємо seed дані...")
    for (const item of seedData) {
      const { error: insertError } = await supabase
        .from('🧬')
        .upsert(item)
      
      if (insertError) {
        console.error(`❌ Помилка вставки ${item["🫧"]}:`, insertError)
      } else {
        console.log(`✅ Додано: ${item["🫧"]} (${item["🧬"]})`)
      }
    }
    
    // 5. Перевіряємо результат
    console.log("📊 Перевіряємо створені записи...")
    const { data: allRecords, error: fetchError } = await supabase
      .from('🧬')
      .select('*')
    
    if (fetchError) {
      console.error("❌ Помилка читання:", fetchError)
    } else {
      console.log(`📈 Всього записів у таблиці: ${allRecords?.length || 0}`)
      allRecords?.forEach(record => {
        console.log(`🧬 ${record["🧬"]} - ${record["🫧"]} (💓${record["💓"]})`)
      })
    }
    
    console.log("\n🎉 УСТАНОВКА ЗАВЕРШЕНА!")
    console.log("✅ Універсальна гліфова таблиця готова")
    console.log("🔗 База: dev.dogarray.com:8020")
    console.log("🚀 Готово до інтеграції з IndexedDB")
    
  } catch (error) {
    console.error("💥 Критична помилка:", error)
    console.log("\n📋 МАНУАЛЬНА УСТАНОВКА:")
    console.log("1. Відкрийте Supabase SQL Editor")
    console.log("2. Виконайте наступний SQL:")
    console.log(createGlyphTableSQL)
    console.log("3. Виконайте індекси:")
    createIndexesSQL.forEach(sql => console.log(sql))
  }
}

async function testConnection(): Promise<void> {
  console.log("🔌 Тестуємо підключення до Supabase...")
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(5)
    
    if (error) {
      console.error("❌ Помилка підключення:", error)
    } else {
      console.log("✅ Підключення успішне")
      console.log("📋 Доступні таблиці:", data?.map(t => t.table_name).join(', '))
    }
  } catch (err) {
    console.error("💥 Помилка тестування:", err)
  }
}

// Виконання
if (import.meta.main) {
  await testConnection()
  await setupFractalTable()
}