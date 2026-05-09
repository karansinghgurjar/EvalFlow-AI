import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Plus, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../../api/projectApi";
import { assignTask, createTask, getTasks } from "../../api/taskApi";
import { getUsers } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { formatDate, truncateText } from "../../utils/formatters";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import TaskForm from "../../components/tasks/TaskForm";

function TasksPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [assignmentDrafts, setAssignmentDrafts] = useState({});

  const queryParams = useMemo(
    () => ({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(projectFilter ? { projectId: projectFilter } : {}),
    }),
    [statusFilter, projectFilter]
  );

  const {
    data: taskData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks", queryParams],
    queryFn: () => getTasks(queryParams),
  });

  const {
    data: projectData,
    isLoading: projectsLoading,
  } = useQuery({
    queryKey: ["projects", "task-page-options"],
    queryFn: () => getProjects(),
  });

  const {
    data: userData,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["users", "annotators"],
    queryFn: () => getUsers({ role: "ANNOTATOR" }),
    enabled: user?.role === "ADMIN",
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowCreateForm(false);
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ taskId, assignedToId }) =>
      assignTask(taskId, { assignedToId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const tasks = taskData?.tasks || [];
  const projects = projectData?.projects || [];
  const annotators = userData?.users || [];

  function handleAssign(taskId) {
    const assignedToId = assignmentDrafts[taskId];

    if (!assignedToId) {
      window.alert("Please select an annotator first.");
      return;
    }

    assignMutation.mutate({
      taskId,
      assignedToId,
    });
  }

  const isInitialLoading = tasksLoading || projectsLoading || usersLoading;

  return (
    <div>
      <PageHeader
        title={user?.role === "ANNOTATOR" ? "My Tasks" : "Tasks"}
        description={
          user?.role === "ANNOTATOR"
            ? "View assigned prompt-response evaluation tasks."
            : "Manage prompt-response tasks, assignments, and review status."
        }
        action={
          user?.role === "ADMIN" ? (
            <Button onClick={() => setShowCreateForm((value) => !value)}>
              <Plus size={16} />
              {showCreateForm ? "Close Form" : "Create Task"}
            </Button>
          ) : null
        }
      />

      {showCreateForm && user?.role === "ADMIN" ? (
        <Card className="mb-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-950">
            Create Task
          </h3>

          {createMutation.error ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {createMutation.error.response?.data?.message ||
                "Failed to create task."}
            </div>
          ) : null}

          <TaskForm
            projects={projects}
            annotators={annotators}
            onSubmit={(payload) => createMutation.mutate(payload)}
            isSubmitting={createMutation.isPending}
            submitLabel="Create Task"
          />
        </Card>
      ) : null}

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Project
            </label>

            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setStatusFilter("");
                setProjectFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {isInitialLoading ? <LoadingState message="Loading tasks..." /> : null}

      {tasksError ? (
        <ErrorState
          title="Unable to load tasks"
          message={tasksError.response?.data?.message || "Please try again later."}
        />
      ) : null}

      {!isInitialLoading && !tasksError && tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={
            user?.role === "ANNOTATOR"
              ? "No tasks have been assigned to you yet."
              : "Create or assign tasks to begin the evaluation workflow."
          }
          action={
            user?.role === "ADMIN" ? (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus size={16} />
                Create Task
              </Button>
            ) : null
          }
        />
      ) : null}

      {!isInitialLoading && !tasksError && tasks.length > 0 ? (
        <div className="space-y-5">
          {tasks.map((task) => (
            <Card key={task.id}>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge value={task.status} />
                    <Badge value={task.difficulty} />
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {task.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-950">
                    {truncateText(task.prompt, 120)}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {truncateText(task.response, 180)}
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                    <p>
                      <span className="font-medium text-slate-900">Project:</span>{" "}
                      {task.project?.title || "—"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-900">Assignee:</span>{" "}
                      {task.assignedTo?.name || "Unassigned"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-900">Due:</span>{" "}
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:w-72">
                  {user?.role === "ADMIN" ? (
                    <div className="flex gap-2">
                      <select
                        value={assignmentDrafts[task.id] || ""}
                        onChange={(event) =>
                          setAssignmentDrafts((current) => ({
                            ...current,
                            [task.id]: event.target.value,
                          }))
                        }
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-950"
                      >
                        <option value="">Assign annotator</option>
                        {annotators.map((annotator) => (
                          <option key={annotator.id} value={annotator.id}>
                            {annotator.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        variant="secondary"
                        onClick={() => handleAssign(task.id)}
                        disabled={assignMutation.isPending}
                      >
                        <UserPlus size={16} />
                      </Button>
                    </div>
                  ) : null}

                  <Link
                    to={`/tasks/${task.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>

                  {user?.role === "ANNOTATOR" &&
                  task.assignedTo?.id === user.id &&
                  (!task.evaluation ||
                    ["DRAFT", "REJECTED"].includes(task.evaluation.status)) ? (
                    <Link
                      to={`/tasks/${task.id}/evaluate`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      {task.evaluation?.status === "REJECTED"
                        ? "Revise Evaluation"
                        : task.evaluation?.status === "DRAFT"
                          ? "Continue Draft"
                          : "Evaluate"}
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default TasksPage;
