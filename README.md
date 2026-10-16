# TravelAI — Full-Stack Travel Booking & AI Trip Planner Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75C2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

**TravelAI** is a modern, production-grade full-stack travel platform featuring real-time destination exploration, luxury and boutique hotel bookings, autonomous multi-day AI travel itinerary planning with Indian Rupee (INR) cost estimates, role-based authentication, user dashboards, and a complete database-driven administrative analytics portal.

Designed for a **BCA Fresher's Portfolio** to demonstrate industry-level full-stack software engineering, relational database architecture, security controls, AI integration, and automated testing.

---

## 🌟 Key Features

### 1. Public Travel Hub
- **Dynamic Search & Filtering**: Discover destinations across India and worldwide by keyword, travel vibe (Beach, Mountain, Heritage, Nature, Adventure, Urban), and INR budget ranges.
- **Hotel Booking Simulation**: Browse verified hotels with amenities, address, star ratings, and transparent nightly rates in INR with interactive booking confirmation simulation.
- **Interactive Wishlist**: Save destinations to your personal wishlist with instant UI reactivity.

### 2. Autonomous AI Trip Planner (Gemini & Fallback Engine)
- **Multi-Factor Form**: Configure destination, dates, traveler count, budget in INR, travel style, and custom preferences.
- **Day-by-Day Scheduling**: Generates morning, afternoon, and evening activities with specific locations and realistic expense approximations.
- **Meal & Food Suggestions**: Regional breakfast, lunch, and dinner recommendations.
- **Database Hotel Pairing**: Queries PostgreSQL to recommend matching hotels from the platform's database.
- **Transparent Mode Badges**: Features **Live Google Gemini** integration with automatic, high-fidelity **Demo Simulation Engine** fallback when API credentials are absent or quota-limited.
- **Save to Database**: Save generated itineraries directly to PostgreSQL for permanent access.

### 3. User Dashboard
- **Profile Management**: View account role, joined date, and stats.
- **Trip Oversight**: Inspect saved itineraries, view full day-by-day breakdowns, update trip status (`PLANNED`, `COMPLETED`, `CANCELLED`), or delete trips.
- **Wishlist Manager**: View and manage saved destinations.

### 4. Admin Management & Analytics
- **Live PostgreSQL Metrics**: Total registered users, destinations, hotels, and trips.
- **Visual Analytics**: Interactive charts powered by Recharts (Monthly Trips Trend, Destination Distribution by Category).
- **Destination & Hotel CRUD**: Create, edit, and delete catalog records via dedicated validation modals.
- **User Management**: Inspect users, toggle administrator roles, and delete accounts.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Framer Motion, Recharts, Lucide React, Axios, React Hook Form, Zod |
| **Backend** | Node.js, Express.js (v4/v5), TypeScript, Zod, bcryptjs, jsonwebtoken, cors, dotenv |
| **Database & ORM** | PostgreSQL (v18), Prisma ORM (v6) with automated migrations & relational indexing |
| **AI Integration** | Google Gemini Generative AI SDK (`gemini-1.5-flash`) with heuristic fallback demo engine |
| **Testing** | Vitest, Supertest for backend integration tests, React Testing Library + jsdom |

---

## 📁 Repository Structure

```
Project/
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, DestinationCard, HotelCard, Skeletons
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── pages/           # Home, Explore, Hotel, AI Planner, Dashboard, Admin, Login
│   │   ├── services/        # Axios API clients for Auth, Destinations, Hotels, Trips, AI
│   │   ├── types/           # TypeScript interfaces and schemas
│   │   ├── utils/           # Currency, date, and category formatters
│   │   ├── tests/           # Vitest and RTL component tests
│   │   ├── App.tsx          # Router configuration and protected guards
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL Prisma schema (User, Destination, Hotel, Trip...)
│   │   └── seed.ts          # Safe development database seeder
│   ├── src/
│   │   ├── config/          # Environment & Prisma client singleton
│   │   ├── controllers/     # Auth, Destination, Hotel, Trip, AI, Admin controllers
│   │   ├── middleware/      # JWT auth, requireAdmin, Zod validator, Error handler
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Core business logic and database queries
│   │   ├── tests/           # 21 Supertest integration tests
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.ts           # Express setup & CORS configuration
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── .env.example
├── .gitignore
├── package.json             # Root monorepo orchestration
└── README.md
```

---

## ⚡ Windows PowerShell Setup Instructions

### Prerequisites
1. **Node.js**: v18+ or v24+ (`node -v`)
2. **PostgreSQL**: Running locally on port 5432 (`postgresql-x64-18` service)
3. **Git**: Installed and on system PATH

> [!NOTE]
> On Windows PowerShell, if running scripts is disabled by ExecutionPolicy, use `npm.cmd` or run `cmd /c "npm ..."` as demonstrated below.

### Step 1: Clone or Open Workspace
Open Windows PowerShell in the project directory:
```powershell
cd C:\Users\chand\OneDrive\Desktop\Project
```

### Step 2: Install Dependencies
Install all packages for backend, frontend, and monorepo root:
```powershell
# Root monorepo tools
npm.cmd install

# Backend packages
cd backend
npm.cmd install

# Frontend packages
cd ..\frontend
npm.cmd install
cd ..
```

### Step 3: Configure Environment Variables
Copy and verify environment files:
```powershell
# In backend/.env:
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/travelai_app?schema=public"
JWT_SECRET=super_secret_travelai_jwt_key_development_2026
FRONTEND_URL=http://localhost:5173
# Optional: GEMINI_API_KEY (Leave blank to use built-in high-fidelity Demo Mode)
GEMINI_API_KEY=
```

### Step 4: Run Prisma Database Migration & Seed
Create the database tables and populate sample destinations, hotels, and demo users:
```powershell
cd backend
npm.cmd run db:push
npm.cmd run db:seed
cd ..
```

### Step 5: Start Frontend & Backend Concurrently
From the project root:
```powershell
npm.cmd run dev
```

Or run separately in two PowerShell windows:
- **Terminal 1 (Backend)**: `cd backend; npm.cmd run dev` (Runs on `http://localhost:5000`)
- **Terminal 2 (Frontend)**: `cd frontend; npm.cmd run dev` (Runs on `http://localhost:5173`)

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Login Credentials

The seed script initializes two pre-configured accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@travelai.com` | `Admin@TravelAI2026` | Full Admin Portal, Destination/Hotel CRUD, Analytics, User Management |
| **Regular User** | `user@travelai.com` | `User@TravelAI2026` | Public browsing, AI Itinerary Generation, Saved Trips & Wishlist |

> **Tip**: The login page contains **One-Click Demo Buttons** (`Demo Admin` / `Demo User`) to automatically populate credentials!

---

## 🧪 Running Automated Tests

### Backend Integration Tests (21 Tests)
Validates registration, authentication guards, user ownership enforcement, destination & hotel CRUD, AI trip generation, and admin metrics:
```powershell
cd backend
npm.cmd test
```

### Frontend Unit & Component Tests (3 Tests)
Validates `DestinationCard`, `HotelCard`, and `EmptyState` component rendering:
```powershell
cd frontend
npm.cmd test
```

### Production Build Verification
Ensures zero TypeScript compilation errors and builds production artifacts:
```powershell
npm.cmd run build
```

---

## 🌐 REST API Endpoints Reference

### Health Check
- `GET /api/health` — Service uptime, database connectivity, and active AI engine mode.

### Authentication
- `POST /api/auth/register` — Create new account (name, email, password)
- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/logout` — Revoke session
- `GET /api/auth/me` — Authenticated user profile and counts

### Destinations
- `GET /api/destinations` — Search, filter by category/budget, pagination
- `GET /api/destinations/featured` — Top destinations for homepage
- `GET /api/destinations/categories` — Category counts
- `GET /api/destinations/:id` — Destination details with linked hotels & reviews
- `POST /api/destinations` — Admin: Add new destination
- `PUT /api/destinations/:id` — Admin: Update destination
- `DELETE /api/destinations/:id` — Admin: Delete destination

### Hotels
- `GET /api/hotels` — Filter by price, rating, destination, amenities, pagination
- `GET /api/hotels/featured` — Featured stays for homepage
- `GET /api/hotels/:id` — Hotel details
- `POST /api/hotels` — Admin: Add new hotel
- `PUT /api/hotels/:id` — Admin: Update hotel
- `DELETE /api/hotels/:id` — Admin: Delete hotel

### AI Trip Planner
- `POST /api/ai/plan-trip` — Generate full multi-day itinerary with INR cost breakdown, tips, and matching DB hotels.

### Trips (User-Isolated)
- `GET /api/trips` — List user's saved trips
- `GET /api/trips/:id` — Get trip details (strict user ownership check)
- `POST /api/trips` — Save trip to database
- `PUT /api/trips/:id` — Update trip status
- `DELETE /api/trips/:id` — Delete trip

### Admin Portal
- `GET /api/admin/analytics` — KPI counts, monthly trends, category charts
- `GET /api/admin/users` — Paginated user directory with search
- `PUT /api/admin/users/:id/role` — Update user role (USER / ADMIN)
- `DELETE /api/admin/users/:id` — Delete user account
- `GET /api/trips/admin/all` — Inspect all user trips

---

## 🛠️ Troubleshooting

1. **PowerShell execution policy error (`npm.ps1 cannot be loaded`)**:
   Always use `npm.cmd` instead of `npm` in PowerShell, or execute `cmd /c "npm run ..."` to bypass script restrictions safely.

2. **PostgreSQL Connection Error**:
   Verify PostgreSQL service is active in Windows:
   ```powershell
   Get-Service -Name *postgres*
   ```
   Start the service if stopped:
   ```powershell
   Start-Service postgresql-x64-18
   ```

3. **Port Conflict on 5000 or 5173**:
   Change `PORT=5001` in `backend/.env` and update `VITE_API_URL=http://localhost:5001/api` in `frontend/.env`.

---

## 📄 License
MIT License. Built by **Chandrabhan Sharma** as a Full-Stack Engineering Portfolio project.
