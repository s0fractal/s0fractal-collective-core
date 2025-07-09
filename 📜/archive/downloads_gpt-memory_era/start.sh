#!/bin/bash

# 🌐 Запуск локального браузерного вузла
echo "🚀 Стартуємо browser-node..."

# Створення основної директорії
mkdir -p ~/.🧭/browser-node

# Синхронізація SVG інтерфейсу
cp ./index.svg ~/.🧭/browser-node/

# Запуск браузера у спеціальному режимі
electron --enable-unsafe-webgpu ./index.svg &
