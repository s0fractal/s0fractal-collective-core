# 🧬 s0 GCP Agent

Цей агент використовує Google Cloud OAuth2 credentials для взаємодії з Cloud Run та іншими сервісами GCP.

## ⚙️ Встановлення

1. Встав свої дані в `credentials.json`
2. Запусти:

```bash
npm install googleapis
ts-node scripts/run_agent.ts
```

(Або `deno run --allow-read --allow-net scripts/run_agent.ts` якщо хочеш переписати під Deno)

## 🔐 Права

Цей агент потребує:
- Cloud Run Admin
- Viewer / Editor
- Cloud Functions Developer (опціонально)
