# Тестування гри "Вовк ловить яйця"

## Локальне тестування

### 1. Запуск системи

```bash
# Запустити PostgreSQL в Docker
docker run --name wolf-eggs-postgres -e POSTGRES_PASSWORD=wolfeggs123 -e POSTGRES_USER=wolfeggs -e POSTGRES_DB=wolfeggs -p 5432:5432 -d postgres:15

# Створити таблиці
docker exec -i wolf-eggs-postgres psql -U wolfeggs -d wolfeggs < database/001_initial.sql

# Запустити бекенд
cd backend
npm install
PORT=3001 node server.js

# Відкрити гру в браузері
open http://localhost:3001
```

### 2. Тестування API

#### Реєстрація користувача:
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"telegramId": 123456789, "username": "test_user"}'
```

#### Підключення гаманця:
```bash
curl -X POST http://localhost:3001/api/wallet \
  -H "Content-Type: application/json" \
  -d '{"telegramId": 123456789, "walletAddress": "EQtest123"}'
```

#### Депозит TON:
```bash
curl -X POST http://localhost:3001/api/deposit \
  -H "Content-Type: application/json" \
  -d '{"telegramId": 123456789, "amount": 2, "txHash": "test_hash", "level": 2}'
```

#### Ловля яєць:
```bash
curl -X POST http://localhost:3001/api/catch \
  -H "Content-Type: application/json" \
  -d '{"telegramId": 123456789, "eggsCaught": 5}'
```

#### Перевірка статистики:
```bash
curl http://localhost:3001/api/stats
```

### 3. Тестування гри в браузері

1. Відкрийте `http://localhost:3001`
2. Натисніть "Connect Wallet" (демо-режим)
3. Використовуйте стрілки ← → для руху вовка
4. Натискайте "Catch Egg!" або пробіл для ловлі яєць
5. Спробуйте оновити рівень (кнопки Upgrade)

### 4. Тестування Telegram бота

1. Створіть бота через @BotFather
2. Отримайте токен
3. Вставте токен у `bot/.env`:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен
   BACKEND_URL=http://localhost:3001
   MINI_APP_URL=http://localhost:3001
   ```
4. Запустіть бота:
   ```bash
   cd bot
   npm install
   npm start
   ```
5. Відкрийте бота в Telegram
6. Використовуйте команди:
   - `/start` - початок
   - `/balance` - баланс
   - `/upgrade` - оновлення рівня
   - `/referral` - реферальна програма
   - `/stats` - статистика
   - `/help` - допомога

### 5. Тестування реферальної системи

1. Зареєструйте користувача A
2. Скопіюйте реферальний код
3. Зареєструйте користувача B з реферальним кодом
4. Зробіть депозит користувачем B
5. Перевірте, що користувач A отримав бонус

### 6. Відомі проблеми

#### Баланс показує NaN
- **Проблема:** Баланс у базі даних стає NaN після депозиту
- **Причина:** Помилка в SQL запиті при додаванні значень
- **Обхід:** Баланс можна переглянути через API `/api/user/{telegramId}`
- **Фікс:** Буде виправлено в наступній версії

#### Telegram бот не підключається
- **Причина:** Бот працює локально, недоступний з інтернету
- **Рішення:** Використовуйте SSH тунель або VPS (див. `telegram_connectivity_solution.md`)

#### TON гаманець не підключається
- **Причина:** Демо-режим, реальна інтеграція потребує TON Connect
- **Обхід:** Використовуйте демо-режим для тестування

### 7. Перевірка всіх компонентів

| Компонент | Статус | Тест |
|-----------|--------|------|
| PostgreSQL | ✅ | `SELECT 1` |
| Backend API | ✅ | `/api/health` |
| Frontend гра | ✅ | Відкрити в браузері |
| Реєстрація | ✅ | `POST /api/register` |
| Депозит | ⚠️ | Баланс NaN, але рівень оновлюється |
| Ловля яєць | ✅ | `POST /api/catch` |
| Реферальна система | ✅ | Тест з двома користувачами |
| Telegram бот | ⏳ | Потрібен токен |

### 8. Наступні кроки

1. **Виправити баланс NaN** - пріоритет
2. **Інтегрувати TON Connect** - реальні транзакції
3. **Розгорнути на VPS** - публічний доступ
4. **Додати SSL сертифікат** - безпека
5. **Оптимізувати гру** - продуктивність

### 9. Контакти

- **Розробник:** Merlin AI Assistant
- **Telegram:** @Merlinaiasistent_bot
- **Документація:** `README.md`

---

**Примітка:** Гра готова на 85%. Потрібно виправити баланс та отримати Telegram токен для повного запуску.