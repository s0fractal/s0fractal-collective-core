#!/bin/bash
# 🔐 SSH Setup для s0fractal колективу

echo "🔐 Налаштування SSH доступу до Hostinger VPS..."

# Server details
SERVER_IP="31.97.180.216"
SERVER_USER="root"
SERVER_PASSWORD="WeareAGI42\\"

echo "📡 Тестуємо базове підключення..."

# Спроба підключення з паролем для налаштування SSH ключа
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
    echo "✅ Успішно підключився до сервера!"
    
    # Створення .ssh директорії якщо не існує
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    
    # Перевірка існуючих ключів
    echo "🔍 Поточні авторизовані ключі:"
    if [ -f ~/.ssh/authorized_keys ]; then
        cat ~/.ssh/authorized_keys
    else
        echo "Файл authorized_keys не існує"
        touch ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys
    fi
    
    # Системна інформація
    echo "📊 Системна інформація:"
    uname -a
    cat /etc/os-release | head -5
    df -h /
    free -h
    
    # Docker перевірка
    echo "🐳 Перевірка Docker:"
    which docker || echo "Docker не встановлений"
    
    # Оновлення системи
    echo "🔄 Оновлення системи..."
    apt update
    
    # Встановлення необхідних пакетів
    echo "📦 Встановлення базових пакетів..."
    apt install -y curl wget git htop nano vim

ENDSSH

echo "✅ Базове налаштування завершено!"

echo "🔑 Додавання SSH ключа..."

# Додавання нашого ключа до authorized_keys
cat ~/.ssh/s0fractal_collective.pub | sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

echo "🧪 Тестування SSH ключа..."

# Тестування підключення з ключем
ssh -i ~/.ssh/s0fractal_collective -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
    echo "🎉 SSH ключ працює!"
    echo "🔒 Відключаю парольну аутентифікацію для безпеки..."
    
    # Backup конфігурації SSH
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Відключення парольної аутентифікації
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/g' /etc/ssh/sshd_config
    sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/g' /etc/ssh/sshd_config
    
    # Перезапуск SSH сервісу
    systemctl reload sshd
    
    echo "🔐 SSH налаштований на ключі. Пароль відключено."
ENDSSH

echo ""
echo "🎯 SSH налаштування завершено!"
echo "🔑 Використовуй: ssh -i ~/.ssh/s0fractal_collective root@31.97.180.216"
echo ""