# 📄 Development Rules

**HopAlong – Project Guidelines for AI & Human Collaborators**

This document defines the development rules, coding standards, and best practices for the HopAlong application. These rules ensure consistency, maintainability, security, and quality across the codebase.

**Both AI assistants and human contributors must follow these guidelines.**

---

## 1️⃣ General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before making changes.
- ✅ Keep the code clean, readable and well-structured.
- ✅ Prioritize simplicity and maintainability.
- ✅ Do not duplicate logic. Reuse existing components, utilities or services.
- ✅ Make small, focused changes instead of large, risky edits.
- ✅ Do not modify unrelated files.
- ✅ Write self-explanatory code with meaningful variable and function names.

---

## 2️⃣ Technology & Coding Standards

Rules related to the tech stack and coding style:

| Topic | Rule |
|-------|------|
| 🟦 **Language** | Use modern JavaScript (ES6+). Avoid `var`; prefer `const`/`let`. |
| ⚛️ **Framework** | Follow React best practices (functional components + hooks) and Express conventions. |
| 🎨 **Styling** | Use Tailwind CSS and follow the design system in DESIGN.md. |
| 🧹 **Linting** | Follow ESLint rules — zero warnings allowed (`--max-warnings 0`). |
| 📐 **Formatting** | Use Prettier for consistent formatting across frontend and backend. |
| 📦 **Dependencies** | Use stable, well-maintained packages. Justify every new dependency. |
| 📁 **File Naming** | Use clear and consistent names — `PascalCase.jsx` for components, `camelCase.js` for modules, kebab-case for assets. |
| 🔐 **Secrets** | Never commit `.env` files or secrets. Use `.env.example` as template. |

---

## 3️⃣ Project Structure

Follow the defined folder structure in ARCHITECTURE.md.

- ✅ Place reusable UI components in `/frontend/src/components`.
- ✅ Feature-specific page components should be inside `/frontend/src/routes`.
- ✅ Database and external service logic should stay in `/backend/config` and `/backend/controllers`.
- ✅ Common utilities should be in `/backend/utils` or `/frontend/src/lib`.
- ✅ Mongoose schemas belong in `/backend/models`; route definitions in `/backend/routes`.
- ✅ Do not create new folders without a clear reason and documentation update.

---

## 4️⃣ API & Backend Rules

- ✅ Every route must be mounted under `/api/<resource>` in `server.js`.
- ✅ Controllers contain the logic; routes only wire middleware + controllers.
- ✅ Protected routes **must** use the `protect` middleware (`backend/middleware/auth.js`).
- ✅ Validate all inputs with express-validator or controller-level checks.
- ✅ Return consistent JSON: `{ success: true/false, data?, error? }`.
- ✅ Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 429, 500).
- ✅ Every new/changed endpoint must be updated in Swagger JSDoc comments **and** both Postman collections.
- ✅ Apply ownership checks — only trip organizers can edit/delete trips or act on requests.

---

## 5️⃣ Security Rules

- ✅ Hash passwords with bcrypt (10 salt rounds). Never return passwords in responses.
- ✅ Enforce IITR email domain (`*.iitr.ac.in`) at registration.
- ✅ Keep rate limiting (100 requests / 10 min per IP) enabled on `/api/*`.
- ✅ Keep Helmet, CORS allow-list, and compression enabled in production.
- ✅ Handle 401 globally on the frontend — clear token and redirect to login.
- ✅ Prevent NoSQL injection through Mongoose schemas and input sanitization.
- ✅ Log security events (rate-limit hits, auth failures) via the configured logger.

---

## 6️⃣ Git & Collaboration

- ✅ Create a feature branch for every change (`git checkout -b feature/YourFeature`).
- ✅ Commit small, atomic changes with descriptive messages.
- ✅ Never commit directly to `main`.
- ✅ Open a Pull Request for review; link related issues.
- ✅ Run `npm run lint:all` and `npm run test:all` before every PR.

---

## 7️⃣ Testing & Quality

- ✅ Write/keep backend tests with Jest + Supertest (`npm run test:backend`).
- ✅ Keep E2E flows for Cypress (`npm run test:e2e`).
- ✅ Test every API endpoint in Postman before marking a task complete.
- ✅ Verify both happy path and error cases (401, 400, 404, 429).

---

## 8️⃣ Documentation Rules

- ✅ Update docs/PRD.md when scope changes.
- ✅ Update docs/ARCHITECTURE.md when structure or stack changes.
- ✅ Update docs/TASKS.md and docs/MEMORY.md after meaningful progress.
- ✅ Keep docs/DESIGN.md in sync with the actual UI.
- ✅ Regenerate/refresh Postman collections and Swagger docs for any API change.
