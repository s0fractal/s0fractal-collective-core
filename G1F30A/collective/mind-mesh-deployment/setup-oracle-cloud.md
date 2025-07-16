# Mind-Mesh Oracle Cloud Setup

## Кроки для тебе:

### 1. Створи Oracle Cloud Account
Йди на https://oracle.com/cloud/free і створи безкоштовний аккаунт.
Потрібно:
- Email
- Номер телефону (для SMS верифікації)
- Картка (не спишуть, просто перевірка)

### 2. Отримай API ключі
Після реєстрації:
1. Зайди в Console
2. Profile (праворуч зверху) → User Settings
3. API Keys → Add API Key
4. Generate API Key Pair
5. Download Private Key (ВАЖЛИВО! Збережи його!)

### 3. Запусти цю команду для налаштування:
```bash
oci setup config
```

Введи:
- User OCID: (знайдеш в User Settings)
- Tenancy OCID: (знайдеш в Tenancy Details)
- Region: (наприклад: eu-frankfurt-1)
- Path to private key: (шлях до завантаженого ключа)

### 4. Коли налаштуєш, скажи мені - я створю інстанс!

## Або якщо хочеш швидкий варіант:

Використаємо твій домашній Mac + Cloudflare Tunnel!