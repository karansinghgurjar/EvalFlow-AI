import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getProjectById } from "../../api/projectApi";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import { formatDate, truncateText } from "../../utils/formatters";

function ProjectDetailsPage() {
  const { projectId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProjectById(projectId),
  });

  if (isLoading) {
    return <LoadingState message="Loading project details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load project"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const project = data.project;
  const tasks = project.tasks || [];

  return (
    <div>
      <div className="mb-5">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>
      </div>

      <PageHeader title={project.title} description={project.description} />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge value={project.status} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {project.domain}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Tasks"
          value={tasks.length}
          description="Tasks in this project"
          icon={ClipboardList}
        />

        <MetricCard
          title="Submitted"
          value={tasks.filter((task) => task.status === "SUBMITTED").length}
          description="Awaiting review"
          icon={ClipboardList}
        />

        <MetricCard
          title="Approved"
          value={tasks.filter((task) => task.status === "APPROVED").length}
          description="Passed review"
          icon={ClipboardList}
        />

        <MetricCard
          title="Rejected"
          value={tasks.filter((task) => task.status === "REJECTED").length}
          description="Needs revision"
          icon={ClipboardList}
        />
      </div>

      <Card className="mt-6">
        <h3 className="text-base font-semibold text-slate-950">
          Project Information
        </h3>

        <div className="mt-5 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <p>
            <span className="font-medium text-slate-950">Created by:</span>{" "}
            {project.createdBy?.name || "—"}
          </p>

          <p>
            <span className="font-medium text-slate-950">Deadline:</span>{" "}
            {formatDate(project.deadline)}
          </p>

          <p>
            <span className="font-medium text-slate-950">Domain:</span>{" "}
            {project.domain}
          </p>

          <p>
            <span className="font-medium text-slate-950">Status:</span>{" "}
            {project.status}
          </p>
        </div>
      </Card>

      <Card className="mt-6">
        <h3 className="text-base font-semibold text-slate-950">
          Related Tasks
        </h3>

        {tasks.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No tasks in this project"
              description="Tasks created for this project will appear here."
            />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Prompt</th>
                  <th className="px-3 py-3 font-semibold">Assignee</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Score</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-slate-100">
                    <td className="max-w-md px-3 py-4">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="font-medium text-slate-700 hover:text-slate-950 hover:underline"
                      >
                        {truncateText(task.prompt, 90)}
                      </Link>
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="px-3 py-4">
                      <Badge value={task.status} />
                    </td>

                    <td className="px-3 py-4 text-slate-700">
                      {task.evaluation?.overallScore ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ProjectDetailsPage;
