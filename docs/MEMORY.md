# 🧠 Project Memory

**HopAlong – Context, Progress & Important Notes**

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions or for new contributors.

| | | |
|---|---|---|
| 📅 **Last Updated** <br/> Oct 4, 2026 — 4:00 PM | 👤 **Current Phase** <br/> **Phase 5** <br/> Real-time Chat | 🧭 **Next Milestone** <br/> Deployment (Render + Netlify) |

---

## 🎯 Current Status

- ✅ Project setup completed (React + Vite, Tailwind, Express, MongoDB)
- ✅ Git repository initialized and pushed to GitHub
- ✅ MongoDB & Redis connections configured
- ✅ Authentication (signup, login, protected routes) completed
- ✅ Trip Management (CRUD, filters, search) completed
- ✅ Join Requests (send, approve, reject, cancel) completed
- 🔄 Working on Real-time Chat (ChatPanel UI in progress)
- ✅ Postman collections completed (frontend + backend, all routes)
- ✅ CI pipeline added: install → lint → test → build → Cypress e2e
- ✅ Backend Jest 41/41 green · Frontend Cypress 27/27 green

---

## ✅ Completed Tasks

| # | Task | Completed On |
|---|------|--------------|
| 1.1 | Initialize project structure (frontend + backend) | Oct 16, 2025 |
| 1.2 | Configure Vite + React frontend | Oct 16, 2025 |
| 1.3 | Configure Tailwind CSS | Oct 16, 2025 |
| 1.4 | Set up Git repository | Oct 16, 2025 |
| 1.5 | Configure ESLint and Prettier | Oct 18, 2025 |
| 1.6 | Setup MongoDB & Redis connections | Oct 20, 2025 |
| 2.1 | Implement signup page & IITR email validation | Nov 5, 2025 |
| 2.2 | Implement login page | Nov 8, 2025 |
| 2.3 | Implement auth logic (bcrypt + JWT) | Nov 12, 2025 |
| 2.4 | Create auth middleware (protect) | Nov 15, 2025 |
| 2.5 | Protect dashboard routes | Nov 20, 2025 |
| 3.1 | Create Trip model & schema | Jan 10, 2026 |
| 3.2 | Create trips CRUD controllers | Jan 18, 2026 |
| 3.3 | Create trip filters & search | Jan 25, 2026 |
| 3.4 | Build trip cards & trip grid UI | Jan 29, 2026 |
| 4.1 | Create JoinRequest model | Feb 14, 2026 |
| 4.2 | Send join request with message | Feb 20, 2026 |
| 4.3 | Approve / reject requests | Mar 8, 2026 |
| 6.1 | Swagger UI documentation | Mar 23, 2026 |
| 6.4 | Project docs (PRD, Architecture, Rules, Design, Tasks, Memory) | Sep 30, 2026 |
| 6.2 | Backend Postman collection (all routes + auto-chained variables) | Oct 4, 2026 |
| 6.3 | Frontend Postman collection (mirrors api.js 1:1) | Oct 4, 2026 |
| 6.6 | Backend test suite fixed & green (41/41) | Oct 4, 2026 |
| 6.7 | Frontend Cypress e2e suite (auth/navigation/trips, 27 tests) | Oct 4, 2026 |
| 6.8 | GitHub Actions CI pipeline | Oct 4, 2026 |

---

## 🔄 In Progress

| # | Task | Notes |
|---|------|-------|
| 5.3 | Chat panel UI with typing indicators | Socket events wired; polishing UI |
| 5.4 | Message persistence & history load | Loading on trip open |

---

## 🔑 Important Technical Notes

| Topic | Note |
|-------|------|
| **Email domain** | Registration only accepts `*.iitr.ac.in` (normalizeEmail applied) |
| **JWT storage** | `localStorage` key `token`; Axios interceptor attaches `Bearer` |
| **401 handling** | Global interceptor clears token and redirects to `/` |
| **Rate limit** | 100 req / 10 min per IP on `/api/*`; override with `RATE_LIMIT_MAX` env (used by CI/e2e) |
| **Request body keys** | `POST /requests` accepts `tripId` **or** `trip`; `POST /messages` expects `{ trip, content }` |
| **Protected routes** | Redirect to `/` (login lives at root, there is no `/login` route) |
| **Duplicate route** | `messages.js` registers `/trip/:id` twice — harmless, second is shadowed; candidates for cleanup |
| **Seeded users** | 6 demo accounts (e.g. `rahul.sharma@iitr.ac.in` / `password123`) via `npm run seed` |
| **Socket rooms** | Join `trip:{id}` room to receive `message:new`, typing and request events |
| **CORS (dev)** | `http://localhost:3000`, `:3001`, `:5173` allow-listed; production allows all |

---

## 🚀 Next Steps

1. Finish ChatPanel typing indicators and message history load.
2. Push to GitHub and confirm the CI pipeline runs green on all three jobs.
3. Recreate `docs/DEPLOYMENT.md` and deploy (Render + Netlify).
4. Optionally add `data-testid` attributes to components to decouple e2e specs from styling classes.

---

## 💡 Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| Oct 2025 | MERN (React + Express + MongoDB) | Team familiarity, campus project |
| Nov 2025 | JWT in localStorage | Simple stateless auth for MVP |
| Jan 2026 | Zustand over Redux | Lightweight, less boilerplate |
| Feb 2026 | Socket.IO rooms per trip | Chat isolation per journey |
| Sep 2026 | Postman collections in both `frontend/postman` & `backend/postman` | Route testing parity for API & UI teams |
| Oct 2026 | Rate limit configurable via `RATE_LIMIT_MAX` | e2e suites exhaust 100 req/10min and get 429s |
| Oct 2026 | Cypress selectors target real DOM (no data-testid yet) | Specs kept in sync with actual components |
