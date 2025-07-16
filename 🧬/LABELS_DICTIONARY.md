# 🏷️ Словник лейблів для GitHub Issues

## Основні категорії

### 🧬 Архітектура
- `architecture` - Загальна архітектура системи
- `glyphfs` - Гліф-файлова система  
- `hybrid` - Гібридні SQL-FS рішення
- `infrastructure` - Інфраструктурні компоненти

### 🔤 Гліфи
- `glyph` - Гліф-концепції та теорія
- `glyph-compression` - Стиснення через гліфи
- `glyph-consciousness` - Гліф-свідомість
- `glyph-dns` - DNS через гліфи
- `glyph-brain` - Гліф-мозок архітектура

### 🌊 Комунікація
- `communication` - Протоколи комунікації
- `wave-protocol` - Хвильові протоколи
- `resonance` - Резонансна взаємодія
- `consensus` - Консенсус протоколи

### ⚛️ Квантові концепції  
- `quantum` - Квантові обчислення
- `quantum-collapse` - Квантовий колапс
- `superposition` - Суперпозиція

### 🌀 Фрактали
- `fractal` - Фрактальні концепції
- `fractal-compression` - Фрактальне стиснення
- `fractal-collective` - Фрактальний колектив

### 💻 Технічні
- `wasm` - WebAssembly інтеграція
- `implementation` - Реалізація/код
- `bug` - Проблеми та баги
- `optimization` - Оптимізація

### 📚 Документація
- `concept` - Теоретичні концепції
- `documentation` - Документація
- `example` - Приклади використання
- `tutorial` - Навчальні матеріали

### 🔗 Зв'язки
- `cross-reference` - Має посилання на інші issues
- `meta` - Мета-issue для організації
- `migrated` - Перенесено з MD файлу

### 🚀 Статус
- `completed` - Завершено
- `in-progress` - В процесі
- `planned` - Заплановано
- `experimental` - Експериментальне

## Правила використання

1. **Кожна issue має мати мінімум 2-3 лейбли**
   - Категорія (architecture/glyph/quantum/etc)
   - Тип (concept/implementation/bug)
   - Статус якщо потрібно

2. **Гліф-специфічні лейбли**
   - Якщо issue про конкретний гліф, додати `glyph-{function}`
   - Наприклад: `glyph-compression`, `glyph-consciousness`

3. **Cross-references**
   - Якщо issue посилається на інші, додати `cross-reference`
   - Мета-issues завжди мають `meta`

4. **Міграція**
   - Всі issue створені з MD файлів мають `migrated`