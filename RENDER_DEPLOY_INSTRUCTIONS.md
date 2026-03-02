# 🚀 ІНСТРУКЦІЯ ДЛЯ ДЕПЛОЮ НА RENDER.COM

## 📋 ЩО ВЖЕ ГОТОВО:
1. ✅ **Лендінг сторінка:** https://norkonton.github.io/-wolf-pack-landing-/
2. ✅ **Код бекенду:** Повністю готовий у папці `/backend`
3. ✅ **Конфігурація:** `render.yaml` для автоматичного деплою
4. ✅ **Telegram бот токен:** `8634703769:AAGVECnXD_iD_bLa0gAoib6jCZjy42-uA1U`

## 🎯 КРОКИ ДЛЯ ДЕПЛОЮ:

### КРОК 1: СТВОРИТИ GITHUB РЕПОЗИТОРІЙ
1. Увійти на https://github.com
2. Створити новий репозиторій: **wolf-eggs-game**
3. Скопіювати SSH посилання: `git@github.com:norkonton/wolf-eggs-game.git`

### КРОК 2: ЗАВАНТАЖИТИ КОД НА GITHUB
```bash
cd ~/.openclaw/workspace/wolf-eggs-game
git remote add origin git@github.com:norkonton/wolf-eggs-game.git
git push -u origin master
```

### КРОК 3: ДЕПЛОЙ НА RENDER.COM
1. Увійти на https://render.com
2. Натиснути "New +" → "Web Service"
3. Підключити GitHub репозиторій `wolf-eggs-game`
4. Render автоматично визначить конфігурацію з `render.yaml`
5. Налаштувати:
   - **Name:** `wolf-pack-backend`
   - **Region:** `Frankfurt` (Європа)
   - **Branch:** `master`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`

### КРОК 4: ДОДАТИ ENVIRONMENT VARIABLES
У налаштуваннях сервісу додати:
- `TELEGRAM_BOT_TOKEN` = `8634703769:AAGVECnXD_iD_bLa0gAoib6jCZjy42-uA1U`
- `NODE_ENV` = `production`
- `PORT` = `3001`

### КРОК 5: СТВОРИТИ БАЗУ ДАНИХ
1. У Render.com натиснути "New +" → "PostgreSQL"
2. Налаштувати:
   - **Name:** `wolf-pack-db`
   - **Database:** `wolfpack`
   - **Region:** `Frankfurt`
   - **Plan:** `Free`
3. Підключити базу до веб-сервісу

### КРОК 6: ЗАДЕПЛОЇТИ
Натиснути "Create Web Service" і чекати завершення деплою (5-10 хвилин)

## 🔗 ОЧІКУВАНІ ПОСИЛАННЯ ПІСЛЯ ДЕПЛОЮ:
- **Бекенд API:** `https://wolf-pack-backend.onrender.com`
- **Лендінг:** `https://norkonton.github.io/-wolf-pack-landing-/` (вже працює)
- **База даних:** PostgreSQL на Render.com

## ⚠️ ВАЖЛИВО:
- **НЕ ДЕПЛОЇТИ TON ЖЕТОН** - залишити на потім
- Перевірити, що бекенд відповідає на `/api/health`
- Телеграм бот вже налаштований на цей бекенд

## 🕐 ЧАС ВИКОНАННЯ:
- Створення репозиторію: 5 хв
- Завантаження коду: 2 хв
- Деплой на Render: 15 хв
- Тестування: 10 хв
- **Всього:** ~30-45 хвилин

## 📞 ДОПОМОГА:
Якщо виникнуть проблеми:
1. Перевірити логи в Render Dashboard
2. Переконатися, що Telegram токен вірний
3. Перевірити підключення до бази даних

---

**ПОЧАТИ ДЕПЛОЙ ЗАРАЗ!** 🚀
Час до запуску: 20:00 EET (через ~9 годин)