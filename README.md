# Мікросервіс для транслітерації, перекладу та нормалізації текстів

Курсова робота з дисципліни «Розробка інтернет-комп'ютерних систем і сервісів»

## Технологічний стек

**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, Swagger, Winston  
**Frontend:** Next.js, React, Tailwind CSS, Axios  
**DevOps:** Docker, Docker Compose, GitHub Actions

## Функціонал

- **Транслітерація** — Укр ↔ Латиниця (стандарт КМУ 2010)
- **Переклад** — через LibreTranslate (UK, EN, PL, DE, FR)
- **Нормалізація** — видалення HTML, пробілів, спецсимволів, нижній регістр
- **Визначення мови** — автоматичне визначення мови тексту
- **Авторизація** — реєстрація, вхід, JWT-токени
- **Історія запитів** — збереження та перегляд всіх операцій
- **Адмін панель** — статистика, управління користувачами, логи
- **Swagger UI** — інтерактивна документація API
- **Rate limiting** — захист від зловживань

## Швидкий старт

### Вимоги

- Docker та Docker Compose

### Запуск

```bash
# 1. Клонувати репозиторій
git clone <repo-url>
cd text-processing-microservice

# 2. Запустити всі сервіси
docker compose up --build

# 3. Відкрити у браузері
# Frontend:  http://localhost:3000
# API docs:  http://localhost:5000/api/docs
# Backend:   http://localhost:5000
```

> ⚠️ LibreTranslate при першому запуску завантажує мовні моделі (~1-2 хв).

### Початковий адміністратор

Після запуску виконати seed:
```bash
docker compose exec backend npm run seed
```
- Email: `admin@example.com`
- Пароль: `admin123`

## Структура проєкту

```
project/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Логіка обробки запитів
│   │   │   ├── authController.js
│   │   │   ├── textProcessingController.js
│   │   │   └── adminController.js
│   │   ├── services/             # Бізнес-логіка
│   │   │   ├── transliterationService.js
│   │   │   ├── translationService.js
│   │   │   └── normalizationService.js
│   │   ├── routes/               # REST API маршрути
│   │   │   ├── authRoutes.js
│   │   │   ├── textProcessingRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middlewares/          # JWT, admin, error handling
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   └── app.js               # Express сервер
│   ├── prisma/
│   │   ├── schema.prisma        # Схема БД
│   │   └── seed.js              # Початкові дані
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── pages/
│   │   ├── index.js             # Головна — обробка тексту
│   │   ├── login.js             # Сторінка входу
│   │   ├── register.js          # Реєстрація
│   │   ├── history.js           # Історія запитів
│   │   └── admin/index.js       # Адмін панель
│   ├── components/
│   │   └── Navbar.js            # Навігаційна панель
│   ├── services/
│   │   └── api.js               # Axios клієнт
│   ├── styles/globals.css
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/ci.yml     # CI/CD GitHub Actions
├── docker-compose.yml
└── README.md
```

## API Документація

Swagger UI доступний за адресою: `http://localhost:5000/api/docs`

### Основні ендпоінти

| Метод | URL | Опис |
|-------|-----|------|
| POST | `/api/auth/register` | Реєстрація |
| POST | `/api/auth/login` | Вхід, отримання JWT |
| GET | `/api/auth/me` | Дані поточного користувача |
| POST | `/api/text/transliterate` | Транслітерація |
| POST | `/api/text/translate` | Переклад |
| POST | `/api/text/normalize` | Нормалізація |
| POST | `/api/text/detect` | Визначення мови |
| GET | `/api/text/history` | Історія запитів |
| GET | `/api/admin/users` | Список користувачів (admin) |
| GET | `/api/admin/stats` | Статистика (admin) |

### Приклад запиту

```bash
# Логін
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Транслітерація
curl -X POST http://localhost:5000/api/text/transliterate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Привіт світ","direction":"uk-lat"}'
```

## База даних

### Таблиці

**users** — користувачі системи  
**requests** — журнал всіх запитів  
**logs** — системні логи

### Схема ER

```
users (id, email, password, name, role, isBlocked, createdAt)
  |
  └─< requests (id, userId, operationType, sourceText, resultText, createdAt)

logs (id, level, message, createdAt)
```

## Безпека

- JWT авторизація (7 днів)
- bcrypt хешування паролів (salt rounds: 12)
- Helmet.js — захист HTTP заголовків
- Rate limiting — 100 запитів / 15 хв
- CORS — лише з дозволеного фронтенду
- SQL Injection захист через Prisma ORM

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`):

1. Запуск PostgreSQL сервісу
2. Встановлення залежностей
3. Міграція бази даних
4. Перевірка запуску backend
5. (main) Збірка Docker образів
