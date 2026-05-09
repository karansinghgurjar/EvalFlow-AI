import { useQuery } from "@tanstack/react-query";
import {
  ClipboardCheck,
  ClipboardList,
  FolderKanban,
  Star,
  Users,
} from "lucide-react";

import { getAdminDashboard } from "../../api/dashboardApi";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import RecentEvaluationsTable from "../../components/common/RecentEvaluationsTable";
import StatusChart from "../../components/common/StatusChart";

function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return <LoadingState message="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load admin dashboard"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const metrics = data.metrics;

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Platform-wide overview of projects, tasks, users, and evaluation quality."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          description="All platform users"
          icon={Users}
        />

        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          description={`${metrics.totalProjects} total projects`}
          icon={FolderKanban}
        />

        <MetricCard
          title="Total Tasks"
          value={metrics.totalTasks}
          description={`${metrics.pendingTasks} pending`}
          icon={ClipboardList}
        />

        <MetricCard
          title="Avg Quality Score"
          value={metrics.averageQualityScore}
          description="Across evaluations"
          icon={Star}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <StatusChart
          title="Task Status Distribution"
          data={data.charts.taskStatusDistribution}
          type="bar"
        />

        <StatusChart
          title="Project Status Distribution"
          data={data.charts.projectStatusDistribution}
          type="pie"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Top Annotators
          </h3>

          {data.topAnnotators.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No annotator data available.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="px-3 py-3 font-semibold">Name</th>
                    <th className="px-3 py-3 font-semibold">Tasks</th>
                    <th className="px-3 py-3 font-semibold">Evaluations</th>
                    <th className="px-3 py-3 font-semibold">Avg Score</th>
                  </tr>
                </thead>

                <tbody>
                  {data.topAnnotators.map((annotator) => (
                    <tr key={annotator.id} className="border-b border-slate-100">
                      <td className="px-3 py-4">
                        <p className="font-medium text-slate-900">
                          {annotator.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {annotator.email}
                        </p>
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {annotator.assignedTasks}
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {annotator.evaluations}
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {annotator.averageScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <RecentEvaluationsTable
          title="Recent Evaluations"
          evaluations={data.recentEvaluations}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Submitted Tasks"
          value={metrics.submittedTasks}
          description="Awaiting review"
          icon={ClipboardCheck}
        />

        <MetricCard
          title="Approved Tasks"
          value={metrics.approvedTasks}
          description="Passed review"
          icon={ClipboardCheck}
        />

        <MetricCard
          title="Rejected Tasks"
          value={metrics.rejectedTasks}
          description="Need revision"
          icon={ClipboardCheck}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
