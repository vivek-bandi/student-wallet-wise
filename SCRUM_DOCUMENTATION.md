# Student Wallet Wise — Scrum Documentation

## Team Details
- Product Owner: Faculty (CS&AI)
- Scrum Master: B. Vivek (2403A51L45)
- Development Team:
  - M. Manikanta (Frontend, UI/UX, Docs)
  - M. Srinath (Backend APIs, Auth)
  - N. Dhanush (Backend, Testing, UML)
  - R. Kowshik (DB Schema, Testing, Code Review)
  - K. Dhanush (Backend, API Integration)

### Team Roster
| # | Name | Role | Roll Number | Email |
|---|------|------|-------------|-------|
| 1 | B. Vivek | Scrum Master, Full Stack | 2403A51L45 | 2403A51L45@sru.edu.in |
| 2 | M. Manikanta | Frontend, UI/UX, Docs | 2403A51L12 | 2403A51L12@sru.edu.in |
| 3 | M. Srinath | Backend APIs, Auth | 2403A51L29 | 2403A51L29@sru.edu.in |
| 4 | N. Dhanush | Backend, Testing, UML | 2403A51L53 | 2403A51L53@sru.edu.in |
| 5 | R. Kowshik | DB Schema, Testing, Review | 2403A51L23 | 2403A51L23@sru.edu.in |
| 6 | K. Dhanush | Backend, API Integration | 2403A51L32 | 2403A51L32@sru.edu.in |

## Product Vision
Empower students to track expenses, set monthly budgets, visualize spending by category, and automate recurring expenses through a simple, secure web app.

## Product Goal
Release a full-stack, cloud-deployed MVP with authentication, expense CRUD, category insights, monthly budget tracking, and recurring expenses.

## Definition of Done (DoD)
- Feature has API + UI + validations
- Unit/basic integration tested
- Deployed to Render (backend) + Vercel (frontend)
- Documented in `docs/` and referenced in README
- No critical console errors; build passing

## Product Backlog
1. User Authentication (Register/Login, JWT)
2. Expenses CRUD (create/list/delete, filter by month/category)
3. Categories (create/list/delete)
4. Monthly Budget (set, summary: budget/spent/remaining)
5. Category Statistics (chart & dashboard stats)
6. Recurring Expenses (create/list/toggle, manual run)
7. Dashboard (Recent transactions, chart, stats)
8. Deployment (Render API, Vercel frontend, CORS)
9. Security & Validation (zod, bcrypt, JWT middleware)
10. Documentation (Architecture, API, Deployment, Project Report)

## JIRA-like Backlog

### Epics
| Epic ID | Epic Name | Goal | Owner |
|---------|-----------|------|-------|
| EP-1 | Authentication & Security | Secure access with JWT and validation | M. Srinath |
| EP-2 | Expenses & Categories | CRUD, filtering, and categorization | B. Vivek |
| EP-3 | Budget & Insights | Monthly budget, stats & charts | R. Kowshik |
| EP-4 | Recurring Expenses | Automate periodic expenses | N. Dhanush |
| EP-5 | Deployment & Ops | Render/Vercel deploy, CORS, envs | B. Vivek |
| EP-6 | Documentation & UX | Project docs and UI polish | M. Manikanta |

### User Stories
| Story ID | Epic | Summary | Acceptance Criteria | Story Points | Sprint |
|----------|------|---------|---------------------|--------------|--------|
| US-101 | EP-1 | As a student, I can register | Valid email, strong password, token returned | 5 | 1 |
| US-102 | EP-1 | As a student, I can login | Valid creds → token, invalid → error | 3 | 1 |
| US-201 | EP-2 | I can add expenses | Validated fields; visible in recent list | 5 | 2 |
| US-202 | EP-2 | I can view/filter expenses | Filter by month/category | 5 | 2 |
| US-301 | EP-3 | I can set monthly budget | Upsert budget and show summary | 5 | 2 |
| US-302 | EP-3 | I can view category stats | Chart aggregates per category | 3 | 2 |
| US-401 | EP-4 | I can create recurring expense | Interval + start date stored | 5 | 3 |
| US-402 | EP-4 | I can run recurring generator | Due items materialize as expenses | 3 | 3 |
| US-501 | EP-5 | Deployed backend & frontend | Live URLs work end-to-end | 5 | 3 |
| US-601 | EP-6 | Docs are complete | API, architecture, deployment ready | 3 | 3 |

### Tasks (Assignments)
| Task ID | Linked Story | Summary | Assignee | Roll No. | Status | Sprint |
|---------|--------------|---------|----------|----------|--------|--------|
| T-001 | US-101 | Implement `/api/auth/register` | M. Srinath | 2403A51L29 | Done | 1 |
| T-002 | US-102 | Implement `/api/auth/login` | M. Srinath | 2403A51L29 | Done | 1 |
| T-003 | US-201 | Expense model & route (POST/GET) | B. Vivek | 2403A51L45 | Done | 2 |
| T-004 | US-202 | Filter params (month/category) | B. Vivek | 2403A51L45 | Done | 2 |
| T-005 | US-301 | Budget routes (PUT/GET) | M. Srinath | 2403A51L29 | Done | 2 |
| T-006 | US-302 | Category stats aggregation | R. Kowshik | 2403A51L23 | Done | 2 |
| T-007 | US-401 | Recurring routes + toggle | N. Dhanush | 2403A51L53 | Done | 3 |
| T-008 | US-402 | Manual runner `/api/recurring/run` | N. Dhanush | 2403A51L53 | Done | 3 |
| T-009 | US-501 | Render/Vercel deploy & CORS | B. Vivek | 2403A51L45 | Done | 3 |
| T-010 | US-601 | Write docs & project report | M. Manikanta | 2403A51L12 | Done | 3 |

### Sprint Mapping
| Sprint | Stories Included | Target Dates |
|--------|------------------|--------------|
| 1 | US-101, US-102 | Week 1–2 |
| 2 | US-201, US-202, US-301, US-302 | Week 3–4 |
| 3 | US-401, US-402, US-501, US-601 | Week 5–6 |

## Release Plan (High-Level)
- MVP Release: v1.0 — features 1–8, 9 partially, 10

## Sprint Cadence
- Sprint Length: 2 weeks
- Sprints: 3 sprints total (6 weeks)

---

## Sprint 1 — Foundations (Weeks 1–2)
### Sprint Goal
Backend skeleton + core models + auth; base frontend scaffolding.

### Sprint Backlog
- Set up Express + TypeScript + Mongoose [Vivek]
- Config env + DB connection [Srinath]
- Models: User, Expense, Category, Budget, RecurringExpense [K. Dhanush]
- Auth routes + JWT middleware [Srinath]
- Frontend scaffold (Vite, Tailwind, shadcn) [Manikanta]
- API client (`src/lib/api.ts`) [Vivek]

### Tasks
- `server/src/app.ts` routes wiring [Vivek]
- `server/src/middleware/auth.ts` [Srinath]
- `server/src/config/env.ts`, `server/src/config/db.ts` [Srinath]
- Mongoose schemas in `server/src/models/*` [K. Dhanush]
- Frontend pages `Login`, `Register`, `Dashboard` scaffold [Manikanta]

### Increment
- Health endpoint `/api/health`
- Register/Login endpoints
- Dev servers up locally

### Demo Evidence
- Postman tests for `/api/auth/*`
- Login flow demonstrates token issuance

### Notes
- Decided ESM modules; fixed import `.js` extension in compiled JS.

---

## Sprint 2 — Features (Weeks 3–4)
### Sprint Goal
Expenses, categories, budget, stats integrated with UI; dashboard baseline.

### Sprint Backlog
- Expenses CRUD + list/filter [Vivek]
- Categories management [K. Dhanush]
- Monthly budget set + summary [Srinath]
- Category stats aggregation + chart [R. Kowshik]
- Dashboard components (Recent, Chart, Stats) [Manikanta]

### Tasks
- `server/src/routes/expenses.ts` (list, recent, stats/categories) [Vivek]
- `server/src/routes/categories.ts` [K. Dhanush]
- `server/src/routes/budgets.ts` [Srinath]
- `src/components/*` (DashboardStats, ExpenseChart, RecentTransactions) [Manikanta]
- `SetBudgetDialog` + category filter in `Dashboard.tsx` [Vivek/Manikanta]

### Increment
- Working dashboard with real data
- Budget summary shown; category chart rendered

### Demo Evidence
- Create expense, see it in Recent Transactions
- Set budget for current month; see Remaining update

### Notes
- Replaced Supabase with MongoDB completely; updated docs.

---

## Sprint 3 — Recurring & Deployment (Weeks 5–6)
### Sprint Goal
Recurring expenses + deployment + documentation completion.

### Sprint Backlog
- Recurring expenses: create/list/toggle/run [N. Dhanush]
- Render (backend) & Vercel (frontend) deployment [Vivek]
- CORS config, env variables, build fixes [Srinath]
- Documentation (API, Architecture, Deployment, Project Report) [Manikanta]
- Basic tests/readiness checks [R. Kowshik]

### Tasks
- `server/src/routes/recurring.ts` + aggregation run [N. Dhanush]
- `render.yaml` `rootDir: server`, `build/start` commands [Vivek]
- Fix ES module imports to `.js` in TS source for production [Srinath/Vivek]
- Vercel `vercel.json` cleanup (remove secret references) [Vivek]
- Write `docs/*` & `PROJECT_DOCUMENTATION.md` [Manikanta]

### Increment
- Manual recurring run materializes expenses
- Production URLs live:
  - Backend: `https://student-wallet-wise-api.onrender.com`
  - Frontend: `https://student-wallet-wise.vercel.app`

### Demo Evidence
- Create a monthly recurring expense; run `/api/recurring/run`; new expense appears
- Frontend connected to backend via `VITE_API_BASE_URL`

### Notes
- Free tier idle delay acknowledged; tested warm-up.

---

## Scrum Events
- Sprint Planning: Day 1 of each sprint
- Daily Scrum: 15 mins, Mon–Fri (standup updates)
- Sprint Review: Demo to stakeholders, last day of sprint
- Sprint Retrospective: Process reflection, last day of sprint

## Risks & Mitigations
- DB connection issues → Verified Atlas network access; proper URI format
- Build failures (ESM) → Standardized `.js` extensions in compiled imports
- CORS issues → Explicit allowlist for Vercel domain
- Token storage → MVP uses localStorage; plan for httpOnly cookies later

## Burndown Snapshot (Illustrative)
- Sprint 1: 18 → 2 remaining
- Sprint 2: 22 → 3 remaining
- Sprint 3: 16 → 1 remaining

## Velocity (Illustrative)
- Sprint 1: 16
- Sprint 2: 20
- Sprint 3: 18

## Team Allocation & Ownership Matrix
- Features → Primary owners (see sprint backlog)
- Code reviews → Kowshik (backend), Manikanta (frontend)
- Deployments → Vivek

## Final Reflection
- What went well: Clear separation backend/frontend, quick deployments, zod validation
- What to improve: Automated CI/CD, cron job for recurring, token refresh flows
- Lessons learned: ESM production import paths, Render rootDir setup, CORS in multi-origin

## Attachments & References
- Architecture: `docs/architecture.md`
- API: `docs/api-reference.md`
- Deployment: `docs/deployment.md`
- Repo: `https://github.com/vivek-bandi/student-wallet-wise`
- Frontend: `https://wallet-lyart-three.vercel.app/`
- Backend: `https://student-wallet-wise-api.onrender.com`
