#!/bin/bash
echo "🧬 Ініціація фрактального агента..."
echo "🔍 Клонування репозиторію..."
git clone https://github.com/s0fractal/s0fractal.git ~/🧬
cd ~/🧬
echo "⚙️ Запуск ініціалізатора..."
deno run --allow-all init.ts
