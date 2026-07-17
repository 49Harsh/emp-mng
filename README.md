# Employee Management System

A full-stack Employee Management System built with Next.js 14, Node.js/Express, and MongoDB.

## Features

- **Authentication** — JWT access + refresh tokens, bcrypt password hashing, rate limiting
- **Role-Based Access Control** — Super Admin, HR Manager, Employee roles with granular permissions
- **Employee Management** — Full CRUD, profile images, CSV import, soft delete
- **Organizational Hierarchy** — Reporting tree, circular-chain prevention, direct reportees
- **Dashboard** — Stats cards, bar/pie charts, monthly joining trends
- **Search, Filter & Sort** — By name/email, department, role, status, joining date
- **Pagination** — Server-side pagination on all list views
- **Dark Mode** — System-preference aware with manual toggle
- **Docker** — Multi-container setup with MongoDB
- **CI/CD** — GitHub Actions workflow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State | Redux Toolkit |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh), bcryptjs |
| Validation | Joi (backend), Zod + react-hook-form (frontend) |
| File Upload | Multer |
| Logging | Winston |
| Jobs | node-cron |
| Testing | Jest, Supertest, mongodb-memory-server |
| Infrastructure | Docker, Docker Compose, GitHub Actions |

---

## Prerequisites

- Node.js 20+
- MongoDB 7.0+ (or Docker)
- npm

---

## Quick Start (Local)

### 1. Clone and setup environment

```bash
git clone <your-repo-url>
cd employee-management-system

# Backend env
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend env
cp frontend/.env.example frontend/.env.local
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name ems_mongo mongo:7.0

# Or use your local MongoDB instance
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

This creates:
| Role | Email | Password |
|---|---|---|
| Super Admin | admin@ems.com | Admin@12345 |
| HR Manager | hr@ems.com | Hr@123456 |
| Employee | alice@ems.com | Emp@123456 |

### 5. Start the servers

```bash
# Backend (runs on :5000)
cd backend && npm run dev

# Frontend (runs on :3000)  
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Docker Setup

```bash
# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Build and run all services
docker-compose up --build

# Seed data (in a new terminal)
docker exec ems_backend node scripts/seed.js
```

---

## Running Tests

```bash
# All backend tests
cd backend && npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

---

## Project Structure

```
employee-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, env, roles
│   │   ├── controllers/    # Route handlers
│   │   ├── jobs/           # Cron jobs
│   │   ├── middlewares/    # Auth, RBAC, validation, upload
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers
│   │   └── validators/     # Joi schemas
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── scripts/seed.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── app/            # Next.js App Router pages
│       ├── components/     # React components
│       ├── context/        # Auth, Theme contexts
│       ├── hooks/          # Custom hooks
│       ├── services/       # API service layer
│       ├── store/          # Redux slices
│       └── types/          # TypeScript types
│
├── docker/
├── docs/api/
└── docker-compose.yml
```

---

## API Overview

Full docs in [docs/api/README.md](docs/api/README.md)

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/me | Current user |
| GET | /api/employees | List employees |
| POST | /api/employees | Create employee |
| GET | /api/employees/:id | Get employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Soft delete employee |
| POST | /api/employees/:id/profile-image | Upload photo |
| POST | /api/employees/import/csv | CSV import |
| GET | /api/departments | List departments |
| POST | /api/departments | Create department |
| GET | /api/dashboard | Dashboard stats |
| GET | /api/organization/tree | Org tree |
| GET | /api/organization/:id/reportees | Direct reports |
| PATCH | /api/organization/:id/manager | Update manager |

---

## RBAC Summary

| Permission | Super Admin | HR Manager | Employee |
|---|---|---|---|
| Create employee | ✅ | ✅ | ❌ |
| Edit employee | ✅ | ✅ | Own profile only |
| Delete employee | ✅ | ❌ | ❌ |
| Assign roles | ✅ | ❌ | ❌ |
| Manage departments | ✅ | View only | ❌ |
| View dashboard | ✅ | ✅ | ❌ |
| CSV import | ✅ | ✅ | ❌ |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/employee_management |
| JWT_SECRET | Access token secret | — |
| JWT_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | — |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| FRONTEND_URL | CORS origin | http://localhost:3000 |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_URL | Backend API base URL |
