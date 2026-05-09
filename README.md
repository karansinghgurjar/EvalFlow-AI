# EvalFlow AI

EvalFlow AI is a full-stack AI data operations platform for managing LLM evaluation workflows. It allows admins to create evaluation projects, assign prompt-response review tasks to annotators, and let reviewers approve or reject submitted evaluations with feedback.

This project was built for the Ethara.AI Software Engineer Full Stack assessment.

---

## Live Links

Frontend: https://eval-flow-ai-taupe.vercel.app  
Backend API: https://evalflow-ai-backend.onrender.com/api  
GitHub Repository: https://github.com/karansinghgurjar/EvalFlow-AI  

---

## Demo Credentials

### Admin

Email: `admin@evalflow.ai`  
Password: `Admin@123`

### Annotator

Email: `annotator@evalflow.ai`  
Password: `Annotator@123`

### Reviewer

Email: `reviewer@evalflow.ai`  
Password: `Reviewer@123`

---

## Problem Statement

LLM post-training workflows require structured evaluation of model responses. Teams need a way to create evaluation batches, assign prompt-response tasks, collect rubric-based ratings, review submissions, and track quality metrics.

EvalFlow AI solves this by providing a role-based workflow for AI data operations.

---

## Core Features

### Authentication and Authorization

- User registration
- User login
- JWT-based authentication
- Protected routes
- Role-based access control
- Role-based dashboard redirects

### Admin Features

- Create projects
- View all projects
- Archive projects
- Create evaluation tasks
- Assign tasks to annotators
- Manage user roles
- View platform-wide dashboard

### Annotator Features

- View assigned tasks
- Evaluate prompt-response pairs
- Rate accuracy, relevance, coherence, and safety
- Save draft evaluations
- Submit evaluations
- View reviewer feedback
- Revise rejected evaluations

### Reviewer Features

- View submitted evaluations
- Review annotator ratings and notes
- Approve evaluations
- Reject evaluations with feedback
- Track review metrics

### Dashboard Features

- Role-specific dashboards
- Metric cards
- Task status charts
- Project status charts
- Recent activity tables
- Quality score tracking

---

## Tech Stack

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Axios

### Backend

- Node.js
- Express.js
- JavaScript
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- Zod

### Deployment

- Frontend: Vercel
- Backend: Render or Railway
- Database: Neon or Supabase PostgreSQL

---

## Folder Structure

```txt
evalflow-ai/
  frontend/
    src/
      api/
      components/
      context/
      layouts/
      pages/
      routes/
      utils/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      middleware/
      routes/
      utils/
      validations/
```

---

## Database Models

### User

Stores account and role information.

Main fields:

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `createdAt`
- `updatedAt`

Roles:

- `ADMIN`
- `ANNOTATOR`
- `REVIEWER`

### Project

Represents an AI evaluation batch.

Main fields:

- `id`
- `title`
- `description`
- `domain`
- `status`
- `deadline`
- `createdById`

### Task

Represents a prompt-response pair assigned for evaluation.

Main fields:

- `id`
- `projectId`
- `prompt`
- `response`
- `category`
- `difficulty`
- `status`
- `assignedToId`
- `dueDate`

### Evaluation

Represents annotator ratings and reviewer feedback.

Main fields:

- `id`
- `taskId`
- `annotatorId`
- `accuracy`
- `relevance`
- `coherence`
- `safety`
- `overallScore`
- `issueType`
- `notes`
- `status`
- `reviewerId`
- `reviewerFeedback`
- `reviewedAt`

---

## API Overview

### Auth Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current logged-in user |

### User Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/users` | Get users |
| GET | `/api/users/:id` | Get user details |
| PATCH | `/api/users/:id/role` | Update user role |

### Project Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/projects` | Get projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project details |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Archive project |

### Task Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task details |
| PATCH | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/assign` | Assign task |

### Evaluation Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/evaluations` | Create evaluation |
| GET | `/api/evaluations` | Get evaluations |
| GET | `/api/evaluations/:id` | Get evaluation details |
| PATCH | `/api/evaluations/:id` | Update evaluation |
| PATCH | `/api/evaluations/:id/review` | Approve or reject evaluation |

### Dashboard Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/dashboard/admin` | Admin dashboard |
| GET | `/api/dashboard/annotator` | Annotator dashboard |
| GET | `/api/dashboard/reviewer` | Reviewer dashboard |

---

## Local Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL database or Neon/Supabase database

### Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Seed demo data:

```bash
npm run db:seed
```

Start backend:

```bash
npm run dev
```

Backend will run on:

`http://localhost:5000`

### Frontend Setup

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend will run on:

`http://localhost:5173`

---

## Scripts

### Backend

- `npm run dev`
- `npm run start`
- `npm run db:seed`
- `npm run db:test`
- `npm run prisma:studio`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`

---

## Assessment Rubric Coverage

### Frontend

- Authentication and user flow
- Project and task management UI
- Dashboard and data presentation
- Validation, error, and loading states
- Responsive layout
- Reusable components

### Backend

- REST API design
- Authentication and security
- Role-based access control
- Relational database design
- Validation and business logic
- Evaluation workflow status transitions

### Visual Quality

- Clean SaaS-style dashboard
- Consistent spacing and typography
- Status badges
- Metric cards
- Charts
- Empty states
- Mobile navigation

---

## Main Workflow

1. Admin creates project
2. Admin creates task
3. Admin assigns task to annotator
4. Annotator saves draft
5. Annotator submits evaluation
6. Reviewer reviews submitted evaluation
7. Reviewer approves or rejects with feedback
8. Annotator revises rejected evaluation
9. Reviewer approves final evaluation
10. Dashboards update by role

---

## Screenshots

Add screenshots here before submission.

Suggested screenshots:

- Landing page
- Login page
- Admin dashboard
- Projects page
- Tasks page
- Evaluation form
- Reviewer queue
- Review details page
- Mobile navigation

Example usage after adding images:

### Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

### Evaluation Form

![Evaluation Form](./screenshots/evaluation-form.png)

---

## Future Improvements

- Toast notifications
- Better confirmation modals
- Advanced search
- Pagination
- CSV import for tasks
- Export evaluation reports
- Unit and integration tests
- Swagger/OpenAPI documentation
- HTTP-only cookie authentication

---

## Author

Karan Singh Gurjar
B.Tech / CSE / 2024  
M.Tech / CSE / 2026  
GitHub:   https://github.com/karansinghgurjar
LinkedIn: https://www.linkedin.com/in/karan-singh-gurjar-052b30197/
