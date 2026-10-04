# ✅ Project Tasks

**HopAlong – Task Breakdown & Development Plan**

This document contains the complete list of tasks for building the HopAlong application. Tasks are divided into phases with clear deliverables, priorities and status tracking.

| | | |
|---|---|---|
| 📊 **Total Tasks** <br/> **41** | ✅ **Completed** <br/> **33** (80%) | 🔄 **In Progress** <br/> **2** (5%) |

---

## ✅ Phase 1: Project Setup

Set up the development environment, repository and core configuration.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 1.1 | Initialize project structure (frontend + backend) | High | ✅ Completed | MERN layout |
| 1.2 | Configure Vite + React frontend | High | ✅ Completed | React 18 |
| 1.3 | Configure Tailwind CSS | High | ✅ Completed | v3.4 |
| 1.4 | Set up Git repository & GitHub | High | ✅ Completed | Main branch protected |
| 1.5 | Configure ESLint and Prettier | Medium | ✅ Completed | Zero-warning policy |
| 1.6 | Setup MongoDB & Redis connections | High | ✅ Completed | config/db.js, config/redis.js |

---

## ✅ Phase 2: Authentication

Implement user authentication and protected routes.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 2.1 | Implement signup page & IITR email validation | High | ✅ Completed | `*.iitr.ac.in` enforced |
| 2.2 | Implement login page | High | ✅ Completed | JWT issued |
| 2.3 | Implement auth logic (bcrypt + JWT) | High | ✅ Completed | 10 salt rounds |
| 2.4 | Create auth middleware (protect) | High | ✅ Completed | Bearer token |
| 2.5 | Protect dashboard routes | High | ✅ Completed | Frontend + backend |
| 2.6 | Implement update password & logout | Medium | ✅ Completed | `/auth/updatepassword` |

---

## ✅ Phase 3: Trip Management

Allow users to create, browse, update and delete trips.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 3.1 | Create Trip model & schema | High | ✅ Completed | Seats, dates, cost |
| 3.2 | Create trips CRUD controllers | High | ✅ Completed | Ownership checks |
| 3.3 | Create trip filters & search | High | ✅ Completed | 9 query params |
| 3.4 | Build trip cards & trip grid UI | High | ✅ Completed | Glassmorphism |
| 3.5 | Create trip form (create/edit) | High | ✅ Completed | Shared TripForm |
| 3.6 | Trip detail page | High | ✅ Completed | Participants + chat |
| 3.7 | Trip stats endpoint & dashboard | Medium | ✅ Completed | `/trips/stats` |

---

## ✅ Phase 4: Join Requests

Implement the request-to-join workflow with organizer approvals.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 4.1 | Create JoinRequest model (unique per trip+user) | High | ✅ Completed | Compound index |
| 4.2 | Send join request with message | High | ✅ Completed | Duplicate prevention |
| 4.3 | Trip requests view for organizers | High | ✅ Completed | RequestsList |
| 4.4 | Approve / reject requests | High | ✅ Completed | Auto seat update |
| 4.5 | Cancel own request | Medium | ✅ Completed | Sender only |
| 4.6 | Request notifications via Socket.IO | Medium | ✅ Completed | Organizer alerts |

---

## 🔄 Phase 5: Real-time Chat

Group chat for approved trip participants.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 5.1 | Create Message model & REST endpoints | High | ✅ Completed | CRUD ready |
| 5.2 | Socket.IO rooms per trip | High | ✅ Completed | `trip:{id}` rooms |
| 5.3 | Chat panel UI with typing indicators | High | 🔄 In Progress | ChatPanel |
| 5.4 | Message persistence & history load | Medium | 🔄 In Progress | On trip open |

---

## 🔄 Phase 6: API Testing & Documentation

Full route documentation and API testing.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 6.1 | Swagger UI documentation | Medium | ✅ Completed | `/api-docs` |
| 6.2 | Backend Postman collection | High | ✅ Completed | `backend/postman/postman.json` — all 29 routes |
| 6.3 | Frontend Postman collection | High | ✅ Completed | `frontend/postman/postman.json` — mirrors `api.js` |
| 6.4 | Project docs (PRD, Architecture, Rules, Design) | Medium | ✅ Completed | docs/ folder |
| 6.5 | Recreate deployment guide | Medium | ⬜ Not Started | docs/DEPLOYMENT.md — before launch |
| 6.6 | Backend Jest suite green (41/41) | High | ✅ Completed | Fixed IITR email check, `/auth/me` crash, validation |
| 6.7 | Frontend Cypress e2e suite (27 tests) | High | ✅ Completed | auth / navigation / trips specs |
| 6.8 | GitHub Actions CI pipeline | High | ✅ Completed | install → lint → test → build → e2e |

---

## ⬜ Phase 7: Deployment (Planned)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 7.1 | Deploy backend to Render | High | ⬜ Not Started | Health check `/health` |
| 7.2 | Deploy frontend to Netlify | High | ⬜ Not Started | Live at alontraveling.netlify.app |
| 7.3 | Production env vars & CORS | High | ⬜ Not Started | Both platforms |
| 7.4 | Seed production database | Low | ⬜ Not Started | Demo users + trips |
