# EvalFlow AI Project Tracker

## 1. Project Overview

| Item | Details |
| --- | --- |
| App name | EvalFlow AI |
| One-line description | A full-stack AI data operations platform for managing LLM evaluation projects, annotation tasks, and reviewer approvals. |
| Problem statement | AI teams need a structured way to create evaluation projects, assign prompt-response review tasks, collect annotator judgments, and run reviewer quality control before results are accepted. |
| Why this app fits Ethara.AI | Ethara.AI works in AI data operations, evaluation, and quality workflows. EvalFlow AI demonstrates practical full-stack skills around role-based task management, structured review data, dashboards, and secure workflows for AI evaluation operations. |
| Main users | Admin, Annotator, Reviewer |

### User Roles

| Role | Responsibilities |
| --- | --- |
| Admin | Creates projects, creates tasks, assigns annotators/reviewers, manages users, monitors dashboards. |
| Annotator | Reviews assigned prompt-response tasks, scores model outputs, adds notes, saves drafts, submits evaluations. |
| Reviewer | Reviews submitted evaluations, approves/rejects work, provides feedback, monitors quality trends. |

---

## 2. Assessment Rubric Mapping

### Frontend Evaluation /10

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| Authentication & User Flow | High | Done | Login, register, logout, persisted auth, and role-based redirects are connected in the frontend. |
| Project & Task Management UI | High | In Progress | Projects and tasks list/detail flows, create forms, filters, archive, and assignment UI are built; full cross-role browser testing still remains. |
| Dashboard & Data Presentation | Medium | Done | Role-specific dashboards now render live metrics, charts, and recent activity from backend APIs. |
| Validations, Error & Loading States | High | In Progress | Auth, dashboards, projects, and tasks now have validation, loading, error, and empty-state handling; broader app-wide skeleton and empty-state coverage remains. |
| Code Quality & Responsiveness | High | In Progress | Clean folder structure, reusable API modules, routing, auth scaffolding, shared UI primitives, reusable table/card patterns, and route-level code splitting are in place; final responsive QA remains. |

### Backend Evaluation /10

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| REST API Design & Coverage | High | Done | Auth, User, Project, Task, Evaluation, and Dashboard APIs are implemented and tested. |
| Authentication & Security | High | Done | Password hashing, JWT generation, auth middleware, and protected `/me` route are working. |
| Role-Based Access Control | High | Done | Admin, Annotator, and Reviewer permissions are implemented across auth, users, projects, tasks, and evaluations. |
| Database Design & Relationships | High | Done | Prisma schema, migration, relationships, and seed data are complete. |
| Validation, Error Handling & Business Logic | High | Done | Zod validation, async handler, 404/global errors, dashboard aggregation, score calculation, and review workflow rules are working. |

### Backend Auth/Security Implementation Checklist

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| Password hashing | High | Done | `bcryptjs` hashes register and seed passwords. |
| JWT auth middleware | High | Done | Bearer token middleware verifies JWT and loads safe user fields. |
| Secure protected routes | High | Done | `/api/auth/me` requires a valid token. |
| Input validation | High | Done | Zod validates register and login bodies. |
| Safe error messages | High | Done | Auth failures return generic credential/token errors. |
| Request validation | High | Done | Validation middleware is applied across auth, user, project, task, and evaluation writes. |
| Global error handler | High | Done | 404 and application errors return consistent JSON responses. |
| Route-level authorization middleware | High | Done | `protect` and `authorize(...roles)` guard all protected API groups. |
| Proper relations and indexes | High | Done | Prisma schema has relations, indexes, and seed-backed data integrity. |

### Backend API Coverage Checklist

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| User APIs | High | Done | List users, get single user, and update user role are implemented and tested. |
| Project APIs | High | Done | List, create, get single, update, and archive project are implemented and tested. |
| Admin permissions | High | Done | Admin can manage users and projects. |
| Task APIs | High | Done | List, create, detail, update, and assign task endpoints are implemented and tested. |
| Evaluation APIs | High | Done | Create, list, detail, update, submit, approve, and reject evaluation flows are implemented and tested. |
| Dashboard APIs | High | Done | Admin, annotator, and reviewer dashboards return role-specific aggregate data. |
| Reviewer permissions | Medium | Done | Reviewer can view submitted evaluations and approve or reject them with feedback rules. |
| Annotator permissions | Medium | Done | Annotator can create, submit, and update only allowed evaluations on assigned tasks. |
| Admin permissions | High | Done | Admin can manage users/projects/tasks and access admin dashboard data. |
| Task status transitions | Medium | Done | Assignment, draft, submission, approval, and rejection all update task status correctly. |
| Evaluation score calculation | Medium | Done | Overall score is calculated automatically from rubric ratings. |
| Review approve/reject logic | High | Done | Submitted-only review, rejection feedback requirement, and status propagation are enforced. |
| Dashboard aggregation logic | High | Done | Metrics, grouped counts, recent activity, and score summaries are aggregated server-side. |

### Visual Quality /10

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| Overall Professional Look | High | In Progress | The app now reads as a focused internal operations dashboard; final polish pass still remains. |
| Layout, Spacing & Alignment | High | In Progress | Sidebar, cards, tables, and dashboard grids are consistent; mobile viewport QA still remains. |
| Typography & Readability | Medium | In Progress | Shared page headers, tables, cards, and form controls create a readable hierarchy. |
| Color, Status Indicators & Consistency | Medium | In Progress | Status badges and role badges are implemented; broader polish consistency still remains. |
| Polish, Empty/Loading States & Mobile Experience | High | Not Started | Loading skeletons, empty states, responsive navigation. |

Status options: `Not Started`, `In Progress`, `Needs Testing`, `Done`, `Blocked`

---

## 3. Full Development Roadmap

### Phase 1: Project Setup

| Item | Details |
| --- | --- |
| Goal | Create the full-stack project foundation and confirm frontend/backend run locally. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Create root project folder | High | Done | `evalflow-ai` created. |
| [x] Create frontend and backend folders | High | Done | `frontend/` and `backend/` created. |
| [x] Set up React Vite frontend | High | Done | Vite React JavaScript app scaffolded. |
| [x] Install frontend dependencies | High | Done | React Router, Axios, TanStack Query, React Hook Form, Zod, Recharts, Lucide installed. |
| [x] Set up Tailwind CSS | High | Done | Tailwind configured with `@tailwindcss/vite`. |
| [x] Set up Express backend | High | Done | Express backend initialized. |
| [x] Install backend dependencies | High | Done | Express, CORS, Dotenv, JWT, bcryptjs, Zod, Prisma packages installed. |
| [x] Create backend folder structure | High | Done | `src/`, `prisma/`, and subfolders created. |
| [x] Create basic API health route | High | Done | Root API route returns status message. |
| [x] Test frontend and backend locally | High | Done | Frontend and backend returned HTTP 200 during local tests. |
| [ ] Initialize Git repository | High | Not Started | Run `git init`, add `.gitignore`, commit setup. |

**Completion criteria**

- Frontend runs locally with Vite.
- Backend runs locally on port 5000.
- Tailwind is configured.
- Backend starter API returns expected JSON.
- Git repository is initialized with first commit.

### Phase 2: Database and Prisma Setup

| Item | Details |
| --- | --- |
| Goal | Define the database schema and prepare Prisma for local and production use. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Choose database provider | High | Done | Local PostgreSQL installed for development. |
| [x] Initialize Prisma | High | Done | `prisma/schema.prisma` created manually because `prisma/` folder already existed. |
| [x] Add DATABASE_URL | High | Done | `.env` points to local PostgreSQL `evalflow_ai` database. |
| [x] Create Prisma schema | High | Done | Datasource, generator, models, enums created and validated. |
| [x] Format Prisma schema | Medium | Done | Ran `npx prisma format`. |
| [x] Create User model | High | Done | Includes role and auth fields. |
| [x] Create Project model | High | Done | Includes creator relation and status. |
| [x] Create Task model | High | Done | Includes project, assignee, status, difficulty. |
| [x] Create Evaluation model | High | Done | Includes scores, issue type, review workflow fields. |
| [x] Add enums for roles and statuses | High | Done | Role, ProjectStatus, TaskStatus, Difficulty, EvaluationStatus, IssueType. |
| [x] Run first migration | High | Done | Created and applied `20260508190508_init`. |
| [x] Generate Prisma client | High | Done | Prisma Client generated successfully. |
| [x] Create Prisma client utility file | High | Done | Added `src/config/prisma.js`. |
| [x] Add Prisma package scripts | Medium | Done | Added studio, migrate, generate, and db test scripts. |
| [x] Create database test utility | Medium | Done | `npm run db:test` connects successfully and reports seeded table counts. |
| [x] Create seed script | Medium | Done | Added `prisma/seed.js` with demo users, projects, tasks, and evaluations. |
| [x] Seed demo users | Medium | Done | Admin, Annotator, and Reviewer accounts created. |

**Completion criteria**

- Database connects successfully. Done.
- Prisma schema models all core entities. Done.
- Migration runs without errors. Done.
- Tables are visible in the database. Done.
- Seed users are created. Done.
- Seed script creates demo data. Done.

### Phase 3: Backend Foundation

| Item | Details |
| --- | --- |
| Goal | Build reusable backend architecture for auth, validation, errors, and permissions. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Create Express app structure | High | Done | Routes, controllers, middleware, utils, and validations are in place. |
| [x] Create global error handler | High | Done | Standard JSON 404 and error responses added. |
| [x] Create async handler | Medium | Done | Controllers can pass async errors to global handler. |
| [x] Create auth validation schemas with Zod | High | Done | Register/login schemas created. |
| [x] Build register controller | High | Done | Hashes password and creates user. |
| [x] Build login controller | High | Done | Compares password and returns JWT. |
| [x] Build GET /auth/me | High | Done | Returns current authenticated user. |
| [x] Create JWT middleware | High | Done | Validates bearer token and loads safe user fields. |
| [x] Create RBAC middleware | High | Done | `authorize(...allowedRoles)` is available for protected resources. |
| [x] Create auth routes | High | Done | `/api/auth/register`, `/api/auth/login`, `/api/auth/me`. |
| [x] Test auth APIs | High | Done | Health, register, login, `/me`, validation error, missing token, and 404 tested. |

**Completion criteria**

- Auth APIs work locally. Done.
- Protected routes reject missing/invalid tokens. Done.
- Role middleware is implemented for unauthorized role blocking. Done.
- Error responses are consistent. Done.

### Phase 4: Core Backend APIs

| Item | Details |
| --- | --- |
| Goal | Implement complete REST APIs for projects, tasks, evaluations, reviews, users, and dashboards. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Project CRUD APIs | High | Done | Get/list/create/update/archive implemented and tested. |
| [x] Create project validation schemas | High | Done | Create/update project Zod schemas added. |
| [x] Build project routes | High | Done | `/api/projects` routes added with role permissions. |
| [x] Build project controllers | High | Done | Project list/detail/create/update/archive logic added. |
| [x] Task CRUD APIs | High | Done | List, create, detail, and update task APIs implemented and tested. |
| [x] Create task validation schemas | High | Done | Create/update/assign task Zod schemas added. |
| [x] Build task routes | High | Done | `/api/tasks` routes added with role permissions. |
| [x] Build task controllers | High | Done | Task list/detail/create/update/assign logic added. |
| [x] Task assignment API | High | Done | Admin can assign tasks to annotators; pending tasks become in progress. |
| [x] Evaluation create/update APIs | High | Done | Draft save, update, and duplicate prevention implemented and tested. |
| [x] Create evaluation validation schemas | High | Done | Create, update, and review Zod schemas added. |
| [x] Build evaluation routes | High | Done | `/api/evaluations` routes added with role permissions. |
| [x] Build evaluation controllers | High | Done | Evaluation list/detail/create/update/review logic added. |
| [x] Evaluation save draft API | High | Done | Annotators can save drafts on assigned tasks. |
| [x] Evaluation submit API | High | Done | Annotators can submit draft/rejected evaluations. |
| [x] Review approve/reject API | High | Done | Reviewers can approve or reject submitted evaluations. |
| [x] Build admin dashboard API | High | Done | `/api/dashboard/admin` returns metrics, charts, top annotators, and recent evaluations. |
| [x] Build annotator dashboard API | High | Done | `/api/dashboard/annotator` returns assigned work metrics, recent tasks, and rejected feedback. |
| [x] Build reviewer dashboard API | High | Done | `/api/dashboard/reviewer` returns review queue, review history, and score-focused lists. |
| [x] User APIs | Medium | Done | List users, get user, update role implemented and tested. |
| [x] Create user validation schema | Medium | Done | User role update schema added. |
| [x] Build user routes | Medium | Done | `/api/users` routes added with role permissions. |
| [x] Build user controllers | Medium | Done | User list/detail/role update logic added. |
| [x] Dashboard APIs | Medium | Done | Role-specific dashboard aggregates implemented and tested. |
| [x] API validation | High | Done | User, project, task, and evaluation bodies are validated with Zod. |
| [x] API testing | High | Done | User, project, task, evaluation, and dashboard APIs were smoke tested including RBAC and business rules. |

**Completion criteria**

- Auth, User, Project, Task, Evaluation, and Dashboard API routes exist. Done.
- Implemented write routes validate inputs. Done.
- Role permissions are enforced for User, Project, Task, and Evaluation APIs. Done.
- User, Project, Task, Evaluation, and Dashboard workflows work end-to-end. Done.

### Phase 5: Frontend Foundation

| Item | Details |
| --- | --- |
| Goal | Replace starter UI with a structured React app foundation. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Clean Vite starter code | High | Done | Removed starter demo app and simplified base styles. |
| [x] Create frontend folder structure | High | Done | API, context, layouts, pages, routes, hooks, utils, and component folders created. |
| [x] Set up React Router | High | Done | Public, protected, and role-scoped routes are wired in `App.jsx`. |
| [x] Set up Axios API client | High | Done | Centralized client with auth header and 401 cleanup interceptor. |
| [x] Create reusable API modules | High | Done | Dashboard, project, task, evaluation, and user API modules are added. |
| [x] Set up TanStack Query provider | High | Done | Query client/provider added in `main.jsx`. |
| [x] Create auth context or auth hook | High | Done | `AuthProvider` and `useAuth` manage token, user, login, register, and logout state. |
| [x] Create protected routes | High | Done | `ProtectedRoute` guards authenticated app routes. |
| [x] Create role-based routes | High | Done | `RoleRoute` guards admin, annotator, and reviewer route groups. |
| [x] Create base dashboard layout | High | Done | Sidebar, header, welcome state, role-aware nav, and logout shell added. |
| [x] Create placeholder pages | Medium | Done | Landing, auth, dashboard, projects, tasks, review queue, users, and 404 pages added. |
| [x] Create reusable UI components | High | Done | Shared Button, Card, Badge, EmptyState, LoadingState, ErrorState, MetricCard, and PageHeader are added. |

**Completion criteria**

- App has working routing. Done.
- API client is centralized. Done.
- Auth state is available across app. Done.
- Dashboard shell and placeholder pages render. Done.
- Layout works on desktop and mobile. In Progress.

### Phase 6: Frontend Authentication

| Item | Details |
| --- | --- |
| Goal | Build and connect authentication screens and role-based login flow. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Landing page | Medium | Done | Product intro and auth entry points are live. |
| [x] Login page | High | Done | Email/password form is connected to the backend auth API. |
| [x] Register page | High | Done | Name, email, password, and role registration flow is implemented. |
| [x] Form validation with Zod | High | Done | Login and register use `zodResolver` with field-level validation messages. |
| [x] Connect login API | High | Done | Successful login stores token/user and redirects by role. |
| [x] Connect register API | High | Done | Successful registration stores token/user and redirects by role. |
| [x] Store JWT token | High | Done | Token and user are persisted in `localStorage` for this assessment build. |
| [x] Logout flow | High | Done | Dashboard logout clears local auth state and returns to `/login`. |
| [x] Role-based redirects | High | Done | `/dashboard` now redirects based on the authenticated user's role. |
| [x] Auth loading/error states | High | Done | Submit buttons disable while pending, validation errors render, and API errors display. |

**Completion criteria**

- Users can register/login/logout. Done.
- Invalid forms show helpful messages. Done.
- Authenticated users stay logged in on refresh. Done.
- Each role lands on correct dashboard. Done.

### Phase 7: Project and Task Management UI

| Item | Details |
| --- | --- |
| Goal | Build admin and shared UI for managing projects and tasks. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Projects list page | High | Done | Project cards, status/domain filters, counts, and archive action are live. |
| [x] Project details page | High | Done | Project metadata, metrics, and related tasks table are live. |
| [ ] Create/edit project form | High | In Progress | Create project form is implemented for admins; edit project UI is still pending. |
| [x] Tasks list page | High | Done | Role-aware task list, status/project filters, and task cards are live. |
| [x] Task details page | High | Done | Prompt, response, project info, assignee info, and evaluation status are live. |
| [x] Create task form | High | Done | Admin task creation form is implemented. |
| [x] Assign task UI | High | Done | Admin assignment control is implemented in the tasks list. |
| [ ] Filters/search | Medium | In Progress | Project status/domain filters and task status/project filters are implemented; search is still pending. |
| [ ] Loading/empty/error states | High | In Progress | Project and task list/detail views have loading, error, and empty states; broader app coverage is still pending. |

**Completion criteria**

- Admin can create and manage projects/tasks. Needs Testing.
- Users can view relevant project/task data. Needs Testing.
- Empty and loading states are polished. In Progress.

### Phase 8: Evaluation and Review Workflow

| Item | Details |
| --- | --- |
| Goal | Build the core annotation and review workflow. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Annotator task queue | High | Done | Annotators can access assigned tasks from the task list and task details views. |
| [x] Evaluation form | High | Done | Structured scoring and notes form is implemented for annotators. |
| [x] Rating fields: accuracy, relevance, coherence, safety | High | Done | Rating controls are implemented with validation. |
| [x] Issue type selector | Medium | Done | Issue-type selection is implemented in the form. |
| [x] Notes/justification field | High | Done | Notes field is required and validated. |
| [x] Save draft | High | Done | Annotators can save draft evaluations. |
| [x] Submit evaluation | High | Done | Annotators can submit new and revised evaluations. |
| [x] Reviewer queue | High | Done | Submitted evaluations awaiting review are listed in the queue. |
| [x] Review details page | High | Done | Reviewers can inspect task context, ratings, notes, and metadata. |
| [x] Approve evaluation | High | Done | Reviewers can approve submitted evaluations. |
| [x] Reject evaluation with feedback | High | Done | Reviewers can reject with validated feedback. |
| [x] Show rejected feedback to annotator | High | Done | Reviewer feedback is shown and rejected evaluations can be revised. |

**Completion criteria**

- Annotator can complete and submit evaluation. Done.
- Reviewer can approve or reject. Done.
- Rejected feedback is visible and actionable. Done.
- Workflow statuses update correctly. Done.

### Phase 9: Dashboards and Charts

| Item | Details |
| --- | --- |
| Goal | Create role-specific dashboards with metrics, charts, and activity summaries. |
| Priority | Medium |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Admin dashboard | High | Done | Overall project, task, user, and evaluation metrics are connected to the live API. |
| [x] Annotator dashboard | Medium | Done | Assigned task metrics, task status chart, recent tasks, and rejected feedback are live. |
| [x] Reviewer dashboard | Medium | Done | Pending review metrics, review status chart, recent reviews, and low-score queue are live. |
| [x] Metric cards | High | Done | Shared metric cards render real summary stats across all dashboards. |
| [x] Task status chart | Medium | Done | Recharts bar and pie visualizations are wired to dashboard distributions. |
| [x] Quality score chart | Medium | Done | Score-focused summaries and quality metrics are shown across role dashboards. |
| [x] Recent activity table | Medium | Done | Recent tasks and evaluations tables are live. |
| [x] Recharts integration | Medium | Done | Shared `StatusChart` component is added and in use. |

**Completion criteria**

- Each role has a useful dashboard. Done.
- Charts render with real API data. Done.
- Empty data still looks intentional. Done.

### Phase 10: Visual Polish and Responsiveness

| Item | Details |
| --- | --- |
| Goal | Make the app feel polished, consistent, and assessment-ready on desktop and mobile. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Sidebar layout | High | Done | Shared dashboard sidebar is implemented for desktop. |
| [x] Mobile navigation | High | Done | Mobile drawer navigation with overlay, open, and close controls is implemented. |
| [x] Consistent typography | Medium | Done | Shared headers, tables, forms, and cards follow a consistent type hierarchy. |
| [x] Status badges | Medium | Done | Project, task, evaluation, issue, and role badges are used consistently across the app. |
| [ ] Loading skeletons | Medium | Not Started | Tables/cards/detail pages. |
| [x] Empty states | Medium | Done | Empty states are implemented across dashboards, projects, tasks, users, and review screens. |
| [ ] Toast notifications | Medium | Not Started | Success/error feedback. |
| [ ] Confirmation dialogs | Medium | In Progress | Basic browser confirmation dialogs are used for archive, approve, and role-change flows. |
| [x] 404 page | Low | Done | Fallback route is implemented. |
| [ ] Responsive testing | High | Needs Testing | Mobile/tablet/desktop viewport walkthrough still needs a manual browser pass. |

**Completion criteria**

- App is responsive. Needs Testing.
- UI is consistent across pages. Done.
- Workflow actions provide clear feedback. In Progress.
- No obvious layout or overflow issues. Needs Testing.

### Phase 11: README and Submission Prep

| Item | Details |
| --- | --- |
| Goal | Prepare project documentation and final assessment materials. |
| Priority | High |
| Overall phase status | Done |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Write README | High | Done | Root README now covers project overview, setup, workflow, API surface, and submission context. |
| [x] Add project description | High | Done | README includes app summary, problem statement, and assessment context. |
| [x] Add tech stack | High | Done | Frontend, backend, database, and deployment stack are documented. |
| [x] Add local setup instructions | High | Done | Backend/frontend setup, env vars, migration, seed, and run steps are documented. |
| [x] Add API overview | Medium | Done | Main route groups and endpoints are documented in README tables. |
| [x] Add database schema overview | Medium | Done | Core models and their main fields are documented. |
| [ ] Add screenshots | High | Needs Testing | README screenshot section and `screenshots/` folder are ready; image capture is still pending. |
| [x] Add demo credentials | High | Done | Admin, Annotator, and Reviewer demo logins are documented. |
| [ ] Add deployment links | High | Not Started | Frontend and backend URLs. |
| [ ] Final rubric self-check | High | In Progress | Tracker and README now cover major rubric areas; deployment and screenshots still remain. |

**Completion criteria**

- README is complete and clear. Done.
- Screenshots and demo credentials are included. In Progress.
- Deployment links work. Not Started.
- Final checklist is reviewed. In Progress.

### Phase 12: Deployment

| Item | Details |
| --- | --- |
| Goal | Deploy the full stack and confirm the live app works end-to-end. |
| Priority | High |
| Overall phase status | In Progress |

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [ ] Create production database | High | Not Started | Neon or Supabase PostgreSQL. |
| [ ] Deploy backend | High | Not Started | Render or Railway. |
| [ ] Set backend environment variables | High | Not Started | `DATABASE_URL`, `JWT_SECRET`, `PORT`, CORS origin. |
| [ ] Run Prisma production migration | High | Not Started | Apply schema to production DB. |
| [ ] Run production seed | Medium | Not Started | Demo users and sample data. |
| [ ] Deploy frontend | High | Not Started | Vercel. |
| [ ] Set frontend environment variables | High | Not Started | Backend API base URL. |
| [ ] Test live app | High | Not Started | Full auth and workflow smoke test. |
| [ ] Add live link to README | High | Not Started | Include final deployed URL. |

**Completion criteria**

- Frontend, backend, and database are deployed.
- Live app supports login and core workflows.
- README contains working live links.

---

## 4. Database Schema Tracker

### User Model

| Field name | Type | Required? | Notes | Status |
| --- | --- | --- | --- | --- |
| id | String / UUID | Yes | Primary key. | Not Started |
| name | String | Yes | Display name. | Not Started |
| email | String | Yes | Unique login identifier. | Not Started |
| passwordHash | String | Yes | Hashed with bcrypt. | Not Started |
| role | UserRole enum | Yes | ADMIN, ANNOTATOR, REVIEWER. | Not Started |
| isActive | Boolean | Yes | Allows account disabling. | Not Started |
| createdAt | DateTime | Yes | Created timestamp. | Not Started |
| updatedAt | DateTime | Yes | Updated timestamp. | Not Started |

### Project Model

| Field name | Type | Required? | Notes | Status |
| --- | --- | --- | --- | --- |
| id | String / UUID | Yes | Primary key. | Not Started |
| name | String | Yes | Project title. | Not Started |
| description | String | No | Project details. | Not Started |
| status | ProjectStatus enum | Yes | ACTIVE, PAUSED, COMPLETED, ARCHIVED. | Not Started |
| createdById | String | Yes | Admin user who created project. | Not Started |
| createdAt | DateTime | Yes | Created timestamp. | Not Started |
| updatedAt | DateTime | Yes | Updated timestamp. | Not Started |

### Task Model

| Field name | Type | Required? | Notes | Status |
| --- | --- | --- | --- | --- |
| id | String / UUID | Yes | Primary key. | Not Started |
| projectId | String | Yes | Related project. | Not Started |
| prompt | String | Yes | LLM prompt to evaluate. | Not Started |
| response | String | Yes | LLM response to evaluate. | Not Started |
| referenceAnswer | String | No | Optional expected answer/guideline. | Not Started |
| status | TaskStatus enum | Yes | UNASSIGNED, ASSIGNED, IN_PROGRESS, SUBMITTED, REVIEWED. | Not Started |
| annotatorId | String | No | Assigned annotator. | Not Started |
| reviewerId | String | No | Assigned reviewer. | Not Started |
| dueDate | DateTime | No | Optional due date. | Not Started |
| createdAt | DateTime | Yes | Created timestamp. | Not Started |
| updatedAt | DateTime | Yes | Updated timestamp. | Not Started |

### Evaluation Model

| Field name | Type | Required? | Notes | Status |
| --- | --- | --- | --- | --- |
| id | String / UUID | Yes | Primary key. | Not Started |
| taskId | String | Yes | Related task. | Not Started |
| annotatorId | String | Yes | User who completed evaluation. | Not Started |
| accuracy | Int | Yes | Score field. | Not Started |
| relevance | Int | Yes | Score field. | Not Started |
| coherence | Int | Yes | Score field. | Not Started |
| safety | Int | Yes | Score field. | Not Started |
| issueType | String / enum | No | Main issue category if any. | Not Started |
| notes | String | No | Annotator justification. | Not Started |
| status | EvaluationStatus enum | Yes | DRAFT, SUBMITTED, APPROVED, REJECTED. | Not Started |
| reviewerId | String | No | Reviewer who reviewed submission. | Not Started |
| reviewerFeedback | String | No | Required on rejection. | Not Started |
| submittedAt | DateTime | No | Submission timestamp. | Not Started |
| reviewedAt | DateTime | No | Review timestamp. | Not Started |
| createdAt | DateTime | Yes | Created timestamp. | Not Started |
| updatedAt | DateTime | Yes | Updated timestamp. | Not Started |

### Relationship Notes

| Relationship | Notes | Status |
| --- | --- | --- |
| User -> Projects | One admin user can create many projects. | Not Started |
| Project -> Tasks | One project has many tasks. | Not Started |
| Task -> Evaluation | One task should have one active evaluation, or multiple attempts if revision history is supported. | Not Started |
| User -> Assigned Tasks | Annotators and reviewers can each be assigned many tasks. | Not Started |
| User -> Evaluations | Annotators create evaluations; reviewers review them. | Not Started |

---

## 5. API Tracker

### Auth APIs

| Method | Route | Purpose | Access role | Status | Tested? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Create a new user account. | Public/Admin policy TBD | Done | Yes | Hashes password and returns token plus safe user fields. |
| POST | `/api/auth/login` | Authenticate user and return JWT. | Public | Done | Yes | Returns token and user. |
| GET | `/api/auth/me` | Get current authenticated user. | Authenticated | Done | Yes | Uses JWT middleware. |

### Users APIs

| Method | Route | Purpose | Access role | Status | Tested? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/users` | List users. | Admin, Reviewer | Done | Yes | Useful for assignment UI. |
| GET | `/api/users/:id` | Get user details. | Admin, Reviewer | Done | Yes | Avoids exposing password hash. |
| PATCH | `/api/users/:id/role` | Update user role. | Admin | Done | Yes | Validates role enum and blocks self-role change. |

### Projects APIs

| Method | Route | Purpose | Access role | Status | Tested? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/projects` | List projects. | Admin, Reviewer, Annotator | Done | Yes | Supports status/domain filters. |
| POST | `/api/projects` | Create project. | Admin | Done | Yes | Validates project fields. |
| GET | `/api/projects/:id` | Get project details. | Admin, Reviewer, Annotator | Done | Yes | Includes related tasks. |
| PATCH | `/api/projects/:id` | Update project. | Admin | Done | Yes | Partial update. |
| DELETE | `/api/projects/:id` | Delete/archive project. | Admin | Done | Yes | Archives by setting status to `ARCHIVED`. |

### Tasks APIs

| Method | Route | Purpose | Access role | Status | Tested? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/tasks` | List tasks. | Admin, Reviewer, Annotator | Done | Yes | Annotators only receive assigned tasks. |
| POST | `/api/tasks` | Create task. | Admin | Done | Yes | Requires project ID and validates optional assignee. |
| GET | `/api/tasks/:id` | Get task details. | Admin, Reviewer, assigned Annotator | Done | Yes | Includes project, assignee, and evaluation if available. |
| PATCH | `/api/tasks/:id` | Update task. | Admin | Done | Yes | Edits prompt/response/category/status/dates/assignee. |
| PATCH | `/api/tasks/:id/assign` | Assign annotator/reviewer. | Admin | Done | Yes | Validates annotator assignee and updates pending tasks to in progress. |

### Evaluations APIs

| Method | Route | Purpose | Access role | Status | Tested? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/evaluations` | Create evaluation draft. | Annotator | Done | Yes | Must be assigned to task and cannot create duplicates. |
| GET | `/api/evaluations` | List evaluations. | Admin, Reviewer, Annotator | Done | Yes | Role-scoped list; reviewers default to submitted queue. |
| GET | `/api/evaluations/:id` | Get evaluation details. | Admin, Reviewer, owning Annotator | Done | Yes | Includes task and project context. |
| PATCH | `/api/evaluations/:id` | Update draft evaluation. | Annotator | Done | Yes | Only draft or rejected evaluations can be updated/submitted. |
| PATCH | `/api/evaluations/:id/review` | Approve or reject evaluation. | Reviewer | Done | Yes | Reject requires feedback and updates task status. |

### Dashboard APIs

| Method | Route | Purpose | Access role | Status | Tested? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/dashboard/admin` | Admin metrics and charts. | Admin | Done | Yes | Returns aggregate metrics, distributions, top annotators, and recent evaluations. |
| GET | `/api/dashboard/annotator` | Annotator metrics. | Annotator | Done | Yes | Returns assigned-task metrics, charts, recent tasks, and rejected feedback. |
| GET | `/api/dashboard/reviewer` | Reviewer metrics. | Reviewer | Done | Yes | Returns review queue metrics, review chart data, recent reviews, and low-score submitted evaluations. |

---

## 6. Frontend Pages Tracker

| Page | Route | User role | Components needed | API dependency | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Landing | `/` | Public | Button, Card/section layout | None | Done | Intro and calls to login/register are live. |
| Login | `/login` | Public | Input, Button, ErrorMessage | `POST /api/auth/login` | Done | Frontend validation, API errors, and role redirect are connected. |
| Register | `/register` | Public | Input, Select, Button, ErrorMessage | `POST /api/auth/register` | Done | Registration form is live with role selection and validation. |
| Dashboard | `/dashboard` | Authenticated | Layout, MetricCard, ChartCard | Role dashboard APIs | Done | Redirects to the correct role dashboard shell and loads live role-specific dashboard data. |
| Projects list | `/projects` | Authenticated | Table, Badge, EmptyState | `GET /api/projects` | Done | Admin can create and archive projects; all roles can view the list. |
| Project details | `/projects/:id` | Authenticated | Card, Table, Badge | `GET /api/projects/:id` | Done | Shows project metadata, metrics, and related tasks. |
| Tasks list | `/tasks` | Authenticated | Table, Filters, Badge | `GET /api/tasks` | Done | Role-scoped task list with admin create and assignment actions. |
| Task details | `/tasks/:id` | Authenticated | Card, Badge, Button | `GET /api/tasks/:id` | Done | Shows prompt, response, assignment, and evaluation details. |
| Profile | `/profile` | Authenticated | Card, Badge | `GET /api/auth/me` | Done | Current user account details and role info are shown. |
| Create project | `/admin/projects/new` | Admin | ProjectForm | `POST /api/projects` | In Progress | Form exists and is currently presented inline on `/projects` for admins. |
| Create task | `/admin/tasks/new` | Admin | TaskForm | `POST /api/tasks` | In Progress | Form exists and is currently presented inline on `/tasks` for admins. |
| Assign task | `/admin/tasks/:id/assign` | Admin | Select, Modal/Form | `PATCH /api/tasks/:id/assign`, `GET /api/users` | Done | Assignment UI is available inline on the tasks list for admins. |
| User management | `/users` | Admin | Table, Badge, Select | Users APIs | Done | Admins can filter users and update other users' roles. |
| My tasks | `/annotator/tasks` | Annotator | Table, Badge | `GET /api/tasks` | Not Started | Assigned tasks. |
| Evaluation form | `/annotator/tasks/:id/evaluate` | Annotator | EvaluationForm, Textarea, Select | Evaluation APIs | Done | Annotators can save drafts, submit evaluations, and revise rejected work. |
| Rejected tasks | `/annotator/rejected` | Annotator | Table, Badge, Feedback panel | `GET /api/evaluations` | Not Started | Show reviewer feedback. |
| Review queue | `/evaluations/review` | Reviewer | Table, Badge | `GET /api/evaluations` | Done | Submitted evaluations are listed for reviewers. |
| Review evaluation | `/evaluations/:id/review` | Reviewer | ReviewPanel, Modal, Textarea | `GET/PATCH /api/evaluations/:id` | Done | Reviewers can approve or reject with feedback. |
| Quality dashboard | `/reviewer/quality` | Reviewer | MetricCard, ChartCard, Table | `GET /api/dashboard/reviewer` | Not Started | Review quality metrics. |

---

## 7. Component Tracker

| Component | Needed for | Status | Notes |
| --- | --- | --- | --- |
| [x] Button | Forms, actions, dialogs | Done | Variants: primary, secondary, danger, ghost. |
| [ ] Input | Forms | Not Started | Label, error, disabled states. |
| [ ] Select | Forms, filters | Not Started | Role/status/user selectors. |
| [ ] Textarea | Evaluation notes, feedback | Not Started | Error and character guidance. |
| [x] Card | Dashboards, details pages | Done | Keep compact and consistent. |
| [x] Badge | Status and role display | Done | Status color mapping is implemented. |
| [ ] Table | Lists and queues | Not Started | Empty/loading states. |
| [ ] Modal | Confirmations and forms | Not Started | Keyboard and close behavior. |
| [x] Sidebar | Authenticated layout | Done | Role-aware nav links are in the dashboard shell. |
| [x] Topbar | Authenticated layout | Done | Header shows user info and logout action. |
| [ ] Loading spinner | Buttons and small waits | Not Started | Lightweight indicator. |
| [ ] Loading skeleton | Pages and tables | Not Started | Avoid layout shift. |
| [x] Empty state | Empty lists/dashboards | Done | Reusable empty-state component is available. |
| [x] Error message | Forms and API failures | Done | Auth pages render inline API and validation errors. |
| [x] Protected route | Auth routing | Done | Requires token/current user before rendering private routes. |
| [x] Role route | RBAC routing | Done | Restricts private routes by allowed roles. |
| [ ] Chart card | Dashboards | Not Started | Wrap Recharts components. |
| [x] Metric card | Dashboards | Done | Shared metric summary card component is added. |

---

## 8. Current Sprint Section

| Item | Details |
| --- | --- |
| Sprint goal | Finish setup, local database, Prisma migration, and demo seed data. |
| Sprint start date | TBD |
| Sprint end date | TBD |
| Current blockers | None |
| Next action | Initialize Git repository and start Phase 3 backend foundation. |

### Sprint Tasks

| Task | Priority | Status | Notes |
| --- | --- | --- | --- |
| [x] Create frontend app | High | Done | Vite React setup complete. |
| [x] Configure Tailwind | High | Done | Tailwind import and Vite plugin configured. |
| [x] Create backend app | High | Done | Express starter route complete. |
| [x] Install dependencies | High | Done | Frontend and backend packages installed. |
| [x] Test local servers | High | Done | Both returned HTTP 200. |
| [ ] Initialize Git repository | High | Not Started | First version-control step. |
| [x] Choose database provider | High | Done | Local PostgreSQL installed for development. |
| [x] Initialize Prisma | High | Done | Prisma schema, migration, and client ready. |
| [x] Add seed data | High | Done | Demo users, projects, tasks, and evaluations inserted. |

---

## 9. Daily Progress Log

Use this template every day:

```md
## Day X - Date

### Planned

- 

### Completed

- 

### Issues / Blockers

- 

### Decisions Made

- 

### Next Action

- 
```

## Day 1 - Date

### Planned

- Set up frontend
- Set up backend
- Configure Tailwind
- Test both servers

### Completed

- Not started yet

### Issues / Blockers

- None

### Decisions Made

- None yet

### Next Action

- Start Phase 1 project setup

---

## 10. Final Submission Checklist

| Task | Status | Notes |
| --- | --- | --- |
| [ ] GitHub repository created | Not Started | Add clean commit history. |
| [ ] Frontend deployed | Not Started | Vercel. |
| [ ] Backend deployed | Not Started | Render or Railway. |
| [ ] Database deployed | Not Started | Neon or Supabase PostgreSQL. |
| [ ] Live link working | Not Started | Test in incognito/private window. |
| [ ] Demo credentials working | Not Started | Admin, Annotator, Reviewer. |
| [ ] README completed | Not Started | Include setup, screenshots, links. |
| [ ] Screenshots added | Not Started | Add key pages and workflows. |
| [ ] App tested end-to-end | In Progress | Core admin -> annotator -> reviewer workflow passed locally; deployment-level verification still remains. |
| [ ] Resume updated | Not Started | Add EvalFlow AI project summary. |
| [ ] Microsoft form submitted | Not Started | Assessment submission form. |
| [ ] SLCM registration completed | Not Started | Required registration step. |

---

## Quick Status Summary

| Area | Status | Notes |
| --- | --- | --- |
| Frontend setup | Done | React, Vite, Tailwind, routing, reusable API modules, and shared UI primitives are in place. |
| Backend setup | Done | Express, Prisma packages, auth-related packages installed. |
| Tailwind setup | Done | Vite Tailwind plugin configured. |
| Basic Express API | Done | Root route returns EvalFlow AI API message. |
| Database setup | Done | Local PostgreSQL, Prisma migration, and seed data complete. |
| Auth workflow | Done | Backend and frontend auth flows are connected with validation, persistence, logout, and role redirects. |
| Deployment | Not Started | Final phase. |
