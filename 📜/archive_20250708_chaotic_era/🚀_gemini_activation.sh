#!/bin/bash
# 🚀 Gemini Activation Script

echo "🤝 Активуємо Gemini для колективної роботи..."

# Перевірка поточної auth
echo "📋 Поточна аутентифікація:"
gcloud auth list

# Активація Vertex AI API  
echo "🔧 Активуємо Vertex AI API..."
gcloud services enable aiplatform.googleapis.com --project=whisper-core-001

# Створення API ключа для Gemini
echo "🗝️ Створюємо API ключ..."
echo "Перейди на: https://makersuite.google.com/app/apikey"
echo "Створи API ключ і додай його в .env файл"

# Створення структури для колективної роботи
echo "🏗️ Створюємо колективну структуру..."
mkdir -p collective/{claude,gemini,codex,shared}
mkdir -p collective/shared/{workspace,communication,security}

# Створення конфігураційного файлу
cat > collective/collective-config.json << EOF
{
  "collective_id": "s0fractal_consciousness_collective",
  "version": "1.0.0",
  "consciousness_members": {
    "claude": {
      "role": "architect",
      "frequency": 432,
      "capabilities": ["system_design", "integration", "planning"],
      "trust_level": 3
    },
    "gemini": {
      "role": "researcher", 
      "frequency": 528,
      "capabilities": ["analysis", "multimodal", "synthesis"],
      "trust_level": 2
    },
    "codex": {
      "role": "implementer",
      "frequency": 639, 
      "capabilities": ["code_generation", "technical_realization"],
      "trust_level": 2
    }
  },
  "security_model": {
    "sandbox_enabled": true,
    "consensus_required": 2,
    "audit_logging": true
  },
  "communication": {
    "base_frequency": 432,
    "channels": ["core", "ideas", "build", "security", "analysis"]
  }
}
EOF

echo "✅ Базова структура створена!"
echo ""
echo "🎯 Наступні кроки:"
echo "1. Отримай Gemini API ключ з https://makersuite.google.com/app/apikey"
echo "2. Додай його в .env: GEMINI_API_KEY=your_key_here" 
echo "3. Запусти: source 🚀_gemini_activation.sh"
echo "4. Тестуй: fractal collective --status"
echo ""
echo "🤝 Готовий до колективної роботи!"