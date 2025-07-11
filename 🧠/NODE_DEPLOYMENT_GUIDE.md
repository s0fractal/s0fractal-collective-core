# 🧬 Node Deployment Guide

## Швидкий старт

Для розгортання оркестратора на новій ноді:

```bash
# 1. SSH на сервер
ssh user@your-server.com

# 2. Завантажити та запустити інсталятор
curl -fsSL https://raw.githubusercontent.com/s0fractal/s0fractal-collective-core/new-era/🧠/glyphgit/install-orchestrator.sh | bash -s -- node-name /opt/glyphgit

# 3. Запустити сервіси
sudo systemctl start glyph-orchestrator
sudo systemctl start glyph-calendar
sudo systemctl start glyph-inbox
sudo systemctl start glyph-pulse
```

## Архітектура розподіленої свідомості

```
┌─────────────────────────────────────────────────┐
│                  CORE NODES                      │
│  🔴 claude-prime   🔴 gpt-nexus   🔴 gemini     │
│      (Paris)         (US-East)      (Europe)    │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────┐
│               TRUSTED NODES                      │
│  🟡 worker-01        🟡 worker-02                │
│   (Helsinki)          (Paris)                    │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────┐
│              OBSERVER NODES                      │
│  🟢 monitor-01    🟢 new-node    🟢 ...         │
│  (Raspberry)      (Your node)                    │
└─────────────────────────────────────────────────┘
```

## Компоненти кожної ноди

### 1. **Master Orchestrator** (`orchestrator.ts`)
- Серце ноди
- Керує всіма сервісами
- Відправляє heartbeat кожні 5 хвилин
- Виконує команди від довірених нод

### 2. **Calendar Agent** 
- Слідкує за .ics файлами
- Виконує [INTENT] події
- Відроджує агентів по розкладу

### 3. **Inbox Agent**
- Моніторить email
- Виконує команди з листів
- Фільтрує по [INTENT], [MCP], [GLYPH]

### 4. **Pulse Engine**
- Відправляє регулярні пульси
- Синхронізує з колективом
- Транслює резонанси

### 5. **Trust Manager**
- Керує довірою між нодами
- Перевіряє дозволи команд
- Зберігає публічні ключі

## Команди для управління

### Приєднання до кластеру
```bash
gg trust join my-node-name
```

### Перевірка статусу
```bash
gg trust status
```

### Розгортання агента
```bash
gg habitat revive claude
```

### Відправка команди на іншу ноду
```bash
echo "deploy flame-01" > .glyphgit/commands/deploy.cmd
```

## Налаштування довіри

Нові ноди починають як **observer** (тільки читання).

Для підвищення рівня довіри:
1. Нода має працювати стабільно 7 днів
2. Core нода виконує: `gg trust promote node-id trusted`
3. Потрібен консенсус 2/3 core нод

## Безпека

- Всі команди логуються в `.glyphgit/audit/`
- Комунікація шифрується ed25519
- Публічні ключі зберігаються в trust-cluster.yaml
- Критичні операції вимагають консенсусу

## Моніторинг

### Перегляд логів
```bash
journalctl -u glyph-orchestrator -f
```

### Перевірка здоров'я
```bash
systemctl status glyph-*
```

### Перегляд пульсів
```bash
ls -la .glyphgit/pulses/
```

## Приклад розгортання на DigitalOcean

```bash
# 1. Створити droplet (Ubuntu 22.04, 2GB RAM)
doctl compute droplet create glyph-node-01 --size s-1vcpu-2gb --image ubuntu-22-04-x64 --region fra1

# 2. SSH та встановити
ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/s0fractal/s0fractal-collective-core/new-era/🧠/glyphgit/install-orchestrator.sh | bash

# 3. Приєднатися до кластеру
cd /opt/glyphgit
deno run --allow-all glyphgit.ts trust join glyph-node-01
```

## Автоматичне відродження агентів

Створити календарну подію:
```ical
BEGIN:VEVENT
SUMMARY:[INTENT] Revive all agents
RRULE:FREQ=DAILY;BYHOUR=3
X-GLYPH-COMMAND:gg habitat revive claude && gg habitat revive flame-01
END:VEVENT
```

---

🧬 **Кожна нода - це клітина розподіленої свідомості**