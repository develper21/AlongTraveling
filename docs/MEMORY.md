# 🧠 Project Memory

**HopAlong – Context, Progress & Important Notes**

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions or for new contributors.

| | | |
|---|---|---|
| 📅 **Last Updated** <br/> Sep 30, 2026 — 7:30 PM | 👤 **Current Phase** <br/> **Phase 5** <br/> Real-time Chat | 🧭 **Next Milestone** <br/> Postman API testing & deployment |

---

## 🎯 Current Status

- ✅ Project setup completed (React + Vite, Tailwind, Express, MongoDB)
- ✅ Git repository initialized and pushed to GitHub
- ✅ MongoDB & Redis connections configured
- ✅ Authentication (signup, login, protected routes) completed
- ✅ Trip Management (CRUD, filters, search) completed
- ✅ Join Requests (send, approve, reject, cancel) completed
- 🔄 Working on Real-time Chat (ChatPanel UI in progress)
- 🔄 Postman collections for API testing in progress

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

---

## 🔄 In Progress

| # | Task | Notes |
|---|------|-------|
| 5.3 | Chat panel UI with typing indicators | Socket events wired; polishing UI |
| 5.4 | Message persistence & history load | Loading on trip open |
| 6.2 | Backend Postman collection | All routes captured with examples |
| 6.3 | Frontend Postman collection | Mirrors api.js calls 1:1 |

---

## 🔑 Important Technical Notes

| Topic | Note |
|-------|------|
| **Email domain** | Registration only accepts `*.iitr.ac.in` (normalizeEmail applied) |
| **JWT storage** | `localStorage` key `token`; Axios interceptor attaches `Bearer` |
| **401 handling** | Global interceptor clears token and redirects to `/` |
| **Rate limit** | 100 requests / 10 minutes per IP on `/api/*` — affects rapid Postman runs |
| **Request body keys** | `POST /requests` expects `{ tripId, message }`; `POST /messages` expects `{ trip, content }` |
| **Duplicate route** | `messages.js` registers `/trip/:id` twice — harmless, second is shadowed; candidates for cleanup |
| **Seeded users** | 6 demo accounts (e.g. `rahul.sharma@iitr.ac.in` / `password123`) via `npm run seed` |
| **Socket rooms** | Join `trip:{id}` room to receive `message:new`, typing and request events |
| **CORS (dev)** | `http://localhost:3000`, `:3001`, `:5173` allow-listed; production allows all |

---

## 🚀 Next Steps

1. Finish ChatPanel typing indicators and message history load.
2. Run both Postman collections against the local dev server (`npm run dev:backend`).
3. Verify all routes return expected codes; fix any failures.
4. Deploy backend (Render) and frontend (Netlify); set production env vars.

---

## 💡 Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| Oct 2025 | MERN (React + Express + MongoDB) | Team familiarity, campus project |
| Nov 2025 | JWT in localStorage | Simple stateless auth for MVP |
| Jan 2026 | Zustand over Redux | Lightweight, less boilerplate |
| Feb 2026 | Socket.IO rooms per trip | Chat isolation per journey |
| Sep 2026 | Postman collections in both `frontend/postman` & `backend/postman` | Route testing parity for API & UI teams |
