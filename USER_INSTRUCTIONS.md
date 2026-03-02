# 📋 ІНСТРУКЦІЇ ДЛЯ ДЕПЛОЮ WOLF PACK GAME

Олег, привіт! 👋

Мені потрібна твоя допомога для деплою Wolf Pack Game. Ось що потрібно зробити:

## 🚀 КРОК 1: СТВОРИТИ GITHUB РЕПОЗИТОРІЙ

1. **Увійти на GitHub:** https://github.com
2. **Створити новий репозиторій:**
   - Назва: `wolf-eggs-game`
   - Опис: "Wolf Pack - Telegram Play-to-Earn Game"
   - Public (публічний)
   - Не додавати README, .gitignore, license (ми вже маємо)
3. **Отримати SSH посилання:** `git@github.com:norkonton/wolf-eggs-game.git`

## 🖥️ КРОК 2: ЗАВАНТАЖИТИ КОД НА GITHUB

Відкрий термінал і виконай:

```bash
cd ~/.openclaw/workspace/wolf-eggs-game
git remote add origin git@github.com:norkonton/wolf-eggs-game.git
git push -u origin master
```

Якщо виникне помилка з SSH ключем, використай HTTPS:
```bash
git remote add origin https://github.com/norkonton/wolf-eggs-game.git
git push -u origin master
```

## 🌐 КРОК 3: ДЕПЛОЙ НА RENDER.COM

1. **Увійти на Render.com:** https://render.com
   - Якщо немає акаунту, створити (можна через GitHub)

2. **Створити новий Web Service:**
   - Натиснути "New +" → "Web Service"
   - Підключити GitHub репозиторій `wolf-eggs-game`
   - Render автоматично виявить `render.yaml`

3. **Налаштування:**
   - **Service Name:** wolf-pack-backend
   - **Region:** Frankfurt (EU)
   - **Branch:** master
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

4. **Environment Variables:**
   - Додати змінні:
     - `TELEGRAM_BOT_TOKEN`: `8634703769:AAGVECnXD_iD_bLa0gAoib6jCZjy42-uA1U`
     - `TON_API_KEY`: (залишити порожнім зараз)

5. **Створити PostgreSQL Database:**
   - На Render Dashboard: "New +" → "PostgreSQL"
   - **Name:** wolf-pack-db
   - **Database:** wolfpack
   - **Region:** Frankfurt
   - **Plan:** Free

6. **Задеплоїти:**
   - Натиснути "Create Web Service"
   - Чекати 5-10 хвилин на деплой

## 🎨 КРОК 4: ДЕПЛОЙ ФРОНТЕНДУ НА GITHUB PAGES

1. **Створити окремий репозиторій для фронтенду:**
   - Назва: `wolf-pack-game-frontend`
   - Public

2. **Завантажити файли фронтенду:**
```bash
cd ~/.openclaw/workspace/wolf-eggs-game/frontend
# Копіювати файли в новий репозиторій
```

3. **Увімкнути GitHub Pages:**
   - В налаштуваннях репозиторію → "Pages"
   - Source: "Deploy from a branch"
   - Branch: `master` або `main`, папка `/` (root)
   - Зберегти

4. **Перевірити URL:** `https://norkonton.github.io/wolf-pack-game-frontend/`

## ✅ КРОК 5: ПЕРЕВІРКА

Після деплою перевірити:

1. **Бекенд:** https://wolf-pack-backend.onrender.com/api/health
   - Має повернути `{"status":"ok"}`

2. **Фронтенд:** Відкрити в браузері
   - Гра має завантажитися

3. **Лендінг:** https://norkonton.github.io/-wolf-pack-landing-/
   - Має бути доступним

## ⚠️ ВАЖЛИВО: НЕ ДЕПЛОЇТИ TON ЖЕТОН!
- Жетон деплоїти ПОТІМ, коли гра стабільна
- Зараз фокус на тестуванні механіки гри

## ⏰ РОЗКЛАД
- **Зараз:** 10:00 EET
- **Деплой:** 10:00-12:00
- **Тестування:** 12:00-13:00
- **Запуск:** 20:00 EET

## 📞 ДОПОМОГА
Якщо виникнуть проблеми:
1. Надішли мені скріншот помилки
2. Я допоможу вирішити
3. Можемо використати браузер через OpenClaw Browser Relay

---

**ПОЧАТИ ДЕПЛОЙ ЗАРАЗ, ЩОБ ВСТИГНУТИ ДО 20:00!** 🚀

Після виконання Кроку 1 (створення GitHub репозиторію) дай мені знати, і я допоможу з наступними кроками.