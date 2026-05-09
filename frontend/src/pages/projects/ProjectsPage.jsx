import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, Eye, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  archiveProject,
  createProject,
  getProjects,
} from "../../api/projectApi";
import { useAuth } from "../../context/AuthContext";
import { formatDate, truncateText } from "../../utils/formatters";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import ProjectForm from "../../components/projects/ProjectForm";

function ProjectsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  const queryParams = useMemo(
    () => ({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(domainFilter ? { domain: domainFilter } : {}),
    }),
    [statusFilter, domainFilter]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => getProjects(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowCreateForm(false);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const projects = data?.projects || [];

  const uniqueDomains = Array.from(
    new Set(projects.map((project) => project.domain).filter(Boolean))
  );

  function handleArchive(projectId) {
    const confirmed = window.confirm(
      "Are you sure you want to archive this project?"
    );

    if (confirmed) {
      archiveMutation.mutate(projectId);
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage AI evaluation batches and track their task coverage."
        action={
          user?.role === "ADMIN" ? (
            <Button onClick={() => setShowCreateForm((value) => !value)}>
              <Plus size={16} />
              {showCreateForm ? "Close Form" : "Create Project"}
            </Button>
          ) : null
        }
      />

      {showCreateForm ? (
        <Card className="mb-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-950">
            Create Project
          </h3>

          {createMutation.error ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {createMutation.error.response?.data?.message ||
                "Failed to create project."}
            </div>
          ) : null}

          <ProjectForm
            onSubmit={(payload) => createMutation.mutate(payload)}
            isSubmitting={createMutation.isPending}
            submitLabel="Create Project"
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
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Domain
            </label>

            <select
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
            >
              <option value="">All domains</option>
              {uniqueDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
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
                setDomainFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? <LoadingState message="Loading projects..." /> : null}

      {error ? (
        <ErrorState
          title="Unable to load projects"
          message={error.response?.data?.message || "Please try again later."}
        />
      ) : null}

      {!isLoading && !error && projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Create your first AI evaluation project to begin."
          action={
            user?.role === "ADMIN" ? (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus size={16} />
                Create Project
              </Button>
            ) : null
          }
        />
      ) : null}

      {!isLoading && !error && projects.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge value={project.status} />
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {project.domain}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-950">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {truncateText(project.description, 140)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-950">
                    {project._count?.tasks || 0}
                  </p>
                  <p className="text-xs text-slate-500">Tasks</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 text-sm text-slate-600 sm:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-900">Deadline:</span>{" "}
                  {formatDate(project.deadline)}
                </p>

                <p>
                  <span className="font-medium text-slate-900">Created by:</span>{" "}
                  {project.createdBy?.name || "—"}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Eye size={16} />
                  View Details
                </Link>

                {user?.role === "ADMIN" && project.status !== "ARCHIVED" ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleArchive(project.id)}
                    disabled={archiveMutation.isPending}
                  >
                    <Archive size={16} />
                    Archive
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectsPage;
