import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import DashboardRedirect from "./pages/dashboard/DashboardRedirect";
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const AnnotatorDashboard = lazy(() =>
  import("./pages/dashboard/AnnotatorDashboard")
);
const ReviewerDashboard = lazy(() =>
  import("./pages/dashboard/ReviewerDashboard")
);
const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const ProjectDetailsPage = lazy(() =>
  import("./pages/projects/ProjectDetailsPage")
);
const TasksPage = lazy(() => import("./pages/tasks/TasksPage"));
const TaskDetailsPage = lazy(() =>
  import("./pages/tasks/TaskDetailsPage")
);
const EvaluationFormPage = lazy(() =>
  import("./pages/evaluations/EvaluationFormPage")
);
const ReviewQueuePage = lazy(() =>
  import("./pages/evaluations/ReviewQueuePage")
);
const ReviewDetailsPage = lazy(() =>
  import("./pages/evaluations/ReviewDetailsPage")
);
const UsersPage = lazy(() => import("./pages/UsersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <p className="text-sm text-slate-500">Loading page...</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardRedirect />}
            />

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["ANNOTATOR"]} />}>
              <Route
                path="/dashboard/annotator"
                element={<AnnotatorDashboard />}
              />
              <Route
                path="/tasks/:taskId/evaluate"
                element={<EvaluationFormPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={["REVIEWER"]} />}>
              <Route path="/dashboard/reviewer" element={<ReviewerDashboard />} />
              <Route path="/evaluations/review" element={<ReviewQueuePage />} />
              <Route
                path="/evaluations/:evaluationId/review"
                element={<ReviewDetailsPage />}
              />
            </Route>

            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
