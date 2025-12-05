# book-a-bus

A web app comprising a Next.js backend and a React frontend for booking bus rides.

## Running locally

Prerequisites
- Node.js 18+ (or LTS)
- npm or yarn
- PostgreSQL (or supported DB) running locally / reachable

Quick start (typical monorepo with `booking-backend/` and `booking-frontend/`)
1. Clone repository and install deps
    - git clone <repo>
    - cd book-a-bus
2. Backend
    - cd booking-backend
    - cp .env.example .env and set environment variables (see below)
    - npm install
    - run migrations (example): npm run migrate
    - npm run dev
    - Backend should be available at http://localhost:4000 (or configured port)
3. Frontend
    - cd ../booking-frontend
    - cp .env.example .env (set NEXT_PUBLIC_API_URL to backend)
    - npm install
    - npm run dev
    - Frontend should be available at http://localhost:3000

Production build
- Backend: npm run build && npm run start
- Frontend: npm run build && npm run preview (or deploy to static host)

Example environment variables
- DATABASE_URL=postgres://user:pass@localhost:5432/bookabus
- JWT_ACCESS_SECRET=your_access_secret
- JWT_REFRESH_SECRET=your_refresh_secret
- COOKIE_SECRET=your_cookie_secret
- NEXT_PUBLIC_API_URL=http://localhost:4000

Database
- Use migrations to create schema. If using Prisma/TypeORM, run the respective CLI migrations prior to starting the backend.

Testing
- Run unit and integration tests in each package: npm test
- Use a test database or in-memory DB for CI.

## Authentication and authorization design

Authentication
- Uses short-lived access tokens (JWT) and longer-lived refresh tokens.
- Access token stored in memory on client; refresh token stored in HttpOnly, Secure cookie.
- Login flow:
  1. Client POSTs credentials to /auth/login.
  2. Backend validates credentials (bcrypt hashed password).
  3. Backend returns access token in JSON and sets refresh token cookie.
  4. Client includes access token in Authorization: Bearer for API calls.
  5. On 401 due to expired access token, client calls /auth/refresh which reads refresh cookie and issues new access token.
- CSRF mitigation: refresh endpoint should validate SameSite cookie or include anti-CSRF token if using cross-site flows.
- Password reset: tokenized link with short expiry stored server-side or in a secure signed token.

Authorization
- Role-based access control (RBAC) with minimal roles: user, driver, admin.
- Middleware on backend enforces:
  - Authentication middleware validates access token and attaches user context.
  - Authorization middleware checks required role or resource ownership (e.g., only booking owner or admin can modify a booking).
- Protect server-side routes (Next.js API routes) and separate client UI elements based on roles/claims.

Security best practices
- Use HTTPS in production and set cookie Secure flag.
- Use HttpOnly cookies for refresh tokens to prevent XSS theft.
- Use short expiry for access tokens and rotate refresh tokens on use.
- Rate-limit auth endpoints and lockout after repeated failed attempts.
- Store password hashes (bcrypt/argon2) never plaintext.

## Decisions and tradeoffs

- JWT access + refresh cookies (chosen)
  - Pros: stateless access checks (fast), simple horizontal scaling.
  - Cons: need to handle refresh token rotation/blacklisting for logout/invalidation.
  - Alternative: server-side sessions stored in DB/Redis — simpler logout/invalidation, but requires session store and adds state.

- Access token storage in memory vs cookies
  - In-memory + refresh cookie (chosen) minimizes XSS risk for refresh token, but access token in memory is lost on page reload (acceptable given refresh flow).
  - Storing access tokens in localStorage is easier but increases XSS risk.

- RBAC vs policy-based authorization
  - RBAC is simpler and fits typical roles (user, driver, admin).
  - Policy-based (attribute-based) gives finer-grained control at cost of complexity.

- Separate backend + frontend vs full Next.js app
  - Separate frontend allows independent deployment and scaling and a pure React app.
  - Monolithic Next.js app can simplify authentication/session handling and SSR.

- Database choice
  - PostgreSQL recommended for relational bookings, transactions, and reliability.
  - For simple prototypes, SQLite is faster to set up locally but less suitable for production scaling.

## Notes and future improvements
- Add OpenID Connect / OAuth provider support (Google, Apple) via NextAuth or similar for easier sign-up.
- Implement refresh token rotation and revoke list for improved security.
- Add CI pipelines to run migrations, tests, and linting automatically.
- More demo on the authorization
- Admin dashboard

Contributions, issues, and questions: open a GitHub issue or PR in the repository.
