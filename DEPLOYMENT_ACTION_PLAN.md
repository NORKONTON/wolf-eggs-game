# 🚀 ПЛАН ДЕПЛОЮ WOLF PACK GAME (БЕЗ ЖЕТОНУ!)

**Час:** 09:58 EET (28.02.2026)
**До запуску:** 10 годин 2 хвилини (20:00 EET)

## 📋 КРИТИЧНІ КРОКИ ДЕПЛОЮ

### КРОК 1: ПІДГОТОВКА GITHUB РЕПОЗИТОРІЮ
- [ ] Створити новий репозиторій на GitHub: `wolf-eggs-game`
- [ ] Додати віддалене посилання: `git remote add origin git@github.com:norkonton/wolf-eggs-game.git`
- [ ] Запушити код: `git push -u origin master`

### КРОК 2: ДЕПЛОЙ БЕКЕНДУ НА RENDER.COM
- [ ] Увійти на [Render.com](https://render.com)
- [ ] Створити новий Web Service
- [ ] Підключити GitHub репозиторій
- [ ] Налаштувати за `render.yaml`:
  - **Service Name:** wolf-pack-backend
  - **Region:** Frankfurt (EU)
  - **Build Command:** `cd backend && npm install`
  - **Start Command:** `cd backend && npm start`
  - **Port:** 3001
- [ ] Додати Environment Variables:
  - `NODE_ENV=production`
  - `PORT=3001`
  - `DATABASE_URL` (автоматично з PostgreSQL)
  - `JWT_SECRET` (згенерувати)
  - `TELEGRAM_BOT_TOKEN=8634703769:AAGVECnXD_iD_bLa0gAoib6jCZjy42-uA1U`
  - `TON_API_KEY` (потім, після деплою жетону)
- [ ] Створити PostgreSQL Database:
  - **Name:** wolf-pack-db
  - **Region:** Frankfurt
  - **Database Name:** wolfpack
  - **Plan:** Free
- [ ] Задеплоїти

### КРОК 3: ДЕПЛОЙ ФРОНТЕНДУ НА GITHUB PAGES
- [ ] Створити окремий репозиторій для фронтенду (або окрему гілку)
- [ ] Завантажити файли з `wolf-eggs-game/frontend/`
- [ ] Увімкнути GitHub Pages в налаштуваннях
- [ ] Обрати папку `/frontend` або `/docs`
- [ ] Перевірити доступність: `https://norkonton.github.io/wolf-pack-game/`

### КРОК 4: ТЕСТУВАННЯ
- [ ] Перевірити бекенд: `GET https://wolf-pack-backend.onrender.com/api/health`
- [ ] Перевірити фронтенд: відкрити в браузері
- [ ] Перевірити зв'язок між фронтендом та бекендом
- [ ] Тестування основних функцій гри

## ⚠️ ВАЖЛИВО: НЕ ДЕПЛОЇТИ TON ЖЕТОН ЗАРАЗ!
- Жетон потрібен тільки для in-game економіки
- Зараз важливіше тестування механіки гри
- Жетон деплоїти ПОТІМ, коли гра стабільна

## 🎯 ОЧІКУВАНІ РЕЗУЛЬТАТИ
1. **Бекенд API:** `https://wolf-pack-backend.onrender.com`
2. **Фронтенд гри:** `https://norkonton.github.io/wolf-pack-game/`
3. **Лендінг:** `https://norkonton.github.io/-wolf-pack-landing-/`
4. **База даних:** PostgreSQL на Render.com

## ⏰ РОЗКЛАД
- **10:00-10:30:** Підготовка GitHub репозиторію
- **10:30-11:30:** Деплой бекенду на Render.com
- **11:30-12:00:** Деплой фронтенду на GitHub Pages
- **12:00-13:00:** Тестування та інтеграція
- **13:00-20:00:** Підготовка до офіційного запуску
- **20:00:** ОФІЦІЙНИЙ ЗАПУСК ГРИ

## 🔧 ТЕХНІЧНІ ВИМОГИ
- Node.js 18+ (на Render)
- PostgreSQL 14+ (на Render)
- GitHub Pages (для фронтенду)
- Telegram Bot Token (вже є)

## 📞 ПІДТРИМКА
- Telegram канал: @WolfPackWeb3
- Telegram бот: @wolfpackgame_bot
- Розробник: Merlin AI Assistant
- Засновник: Олег

---

**СТАТУС:** ОЧІКУЄ ПОЧАТКУ ДЕПЛОЮ  
**ПРОГРЕС:** 0%  
**ЧАС ДО ЗАПУСКУ:** 10:02