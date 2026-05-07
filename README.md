# Система управления IT-инфраструктурой

MERN-приложение для учета оборудования, сотрудников, отделов, поставщиков, инцидентов и обслуживания.

## Возможности

- JWT access token и refresh token в httpOnly cookie
- Роли: `admin`, `manager`, `user`
- CRUD API с soft delete для всех сущностей
- Audit-поля: `createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `deletedAt`
- Dashboard: счетчики, активные инциденты, оборудование по отделам, последние заявки и работы
- React UI: sidebar, protected routes, таблицы, поиск, фильтрация, сортировка, пагинация, формы, toast, modal
- Helmet, CORS config, rate limit, morgan/winston, express-validator
- Swagger: `http://localhost:5000/api/docs`
- Docker Compose с MongoDB
- Jest + Supertest backend tests и frontend smoke test

## Быстрый запуск

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm start
```

Дефолтный пользователь после seed:

```text
login: admin
password: Admin123!
```

## Docker

```bash
cp .env.example .env
cp server/.env.example server/.env
docker compose up --build
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `/api/assets`
- `/api/employees`
- `/api/departments`
- `/api/incidents`
- `/api/maintenance`
- `/api/vendors`

Для CRUD-ресурсов доступны:

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## Тесты

```bash
cd server
npm test
```

Backend test suite включает фаззинг-тесты для auth/assets/incidents и query-параметров списков. Они генерируют случайные некорректные входные данные и проверяют, что API возвращает контролируемые 4xx-ответы вместо 500.

```bash
cd client
npm test
```

## Production build

```bash
cd client
npm run build
```

```bash
cd server
npm start
```

## Деплой

Render/Railway:

- создать MongoDB сервис или подключить MongoDB Atlas
- задать переменные из `server/.env.example`
- backend build command: `npm install`
- backend start command: `npm start`
- frontend build command: `npm install && npm run build`
- frontend publish directory: `build`
- `CORS_ORIGIN` должен указывать на frontend URL
- `REACT_APP_API_URL` должен указывать на backend `/api`

Yandex Cloud:

- поднять MongoDB в Managed Service for MongoDB или VM
- собрать Docker images из `server/Dockerfile` и `client/Dockerfile`
- задать production `.env`
- открыть порты frontend/backend через security groups

## Структура

```text
server/src
  config
  controllers
  docs
  middlewares
  models
  repositories
  routes
  services
  utils
  validators

client/src
  components
  context
  hooks
  pages
  routes
  services
```
