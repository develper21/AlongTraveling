# 📋 Product Requirements Document (PRD)

**HopAlong – Your Travel Companion Platform**

| | |
|---|---|
| **Version:** | 1.0 |
| **Date:** | Sep 30, 2026 |
| **Author:** | Team HopAlong |
| **Status:** | Draft |
| **Target Launch:** | MVP (v1.0) |

---

## 1. Product Overview

HopAlong is a web application designed to help IIT Roorkee students find travel companions, plan trips together, and coordinate group journeys — all in one secure, campus-only platform.

### Live Product

- **Frontend:** [alontraveling.netlify.app](https://alontraveling.netlify.app/)
- **API Docs:** `/api-docs` (Swagger UI, served by the backend)

---

## 2. Problem Statement

IITR students often want to travel (weekend trips, fests, home visits, adventures) but:

- Lack companions who share the same destination and dates.
- Struggle to coordinate group trips across scattered WhatsApp groups.
- Have no trusted, verified community to find fellow travelers.

There is no centralized, easy-to-use solution built for the campus.

---

## 3. Goals

- Provide a simple and intuitive platform for finding travel companions.
- Help students organize trips with clear details (dates, budget, seats, mode).
- Enable safe, approved-only communication through trip chat.
- Offer a clean, modern, distraction-free user experience.

---

## 4. Target Users

- **BCA, BSc, CS, BTech** and other IIT Roorkee students *(IITR email required)*
- **Age group:** 17–25
- **Tech-savvy:** uses laptops and smartphones
- **Needs:** a simple, reliable tool for trip discovery and coordination

---

## 5. Core Features (MVP)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **User Authentication** | Sign up / Login with IITR email validation (`*.iitr.ac.in`), JWT sessions, password update |
| 2 | **Trip Dashboard** | Browse trips with filters (destination, dates, mode, type, status) and quick search |
| 3 | **Trip Management** | Create, edit, and delete trips; seat/capacity tracking with participant counts |
| 4 | **Join Requests** | Send personalized requests; organizers approve / reject; senders cancel |
| 5 | **Real-time Chat** | Socket.IO group chat for approved participants, typing indicators, message history |
| 6 | **Profile & Stats** | Edit profile (branch, year, bio), view trips created / joined and statistics |

---

## 6. User Stories

- As a **student**, I can register with my IITR email so that the community stays campus-only.
- As a **traveler**, I can filter trips by destination, date, mode, and type so that I find relevant journeys quickly.
- As an **organizer**, I can create a trip with capacity and cost so that others know what to expect.
- As an **organizer**, I can approve or reject join requests so that I control who joins my trip.
- As an **approved participant**, I can chat with trip members in real time so that we coordinate easily.
- As a **user**, I can view my trips and participation stats so that I track my travel history.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Security** | JWT auth, bcrypt password hashing, Helmet headers, rate limiting (100 req / 10 min) |
| **Performance** | Redis caching, MongoDB text indexes, compression middleware |
| **Validation** | express-validator on all inputs, Mongoose schema constraints |
| **Responsiveness** | Optimized for desktop, tablet, and mobile |
| **Availability** | Health-check endpoints (`/health`, `/api/health`) for Render monitoring |
| **Documentation** | Swagger UI + Postman collections (frontend & backend) |

---

## 8. Out of Scope (v1.0)

- Payments / wallet integration
- In-app maps and live location tracking
- Push notifications (Socket.IO in-app notifications only)
- Native mobile apps

---

## 9. Success Metrics

- Number of verified IITR sign-ups per week
- Trips created and trips filled (seats utilized)
- Join-request approval rate
- Messages sent per active trip chat

---

## 10. Release Plan

| Milestone | Scope | Status |
|-----------|-------|--------|
| **v0.1 – Setup** | Repo, tooling, database | ✅ Completed |
| **v0.5 – Auth + Trips** | Auth, trips CRUD, filters | ✅ Completed |
| **v0.8 – Social** | Join requests, chat, notifications | ✅ Completed |
| **v1.0 – MVP Launch** | Deployment, API testing & docs | 🔄 In Progress |
