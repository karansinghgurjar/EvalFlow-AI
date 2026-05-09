import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  FileCheck,
  RotateCcw,
  Star,
} from "lucide-react";

import { getAnnotatorDashboard } from "../../api/dashboardApi";
import { truncateText } from "../../utils/formatters";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import RecentTasksTable from "../../components/common/RecentTasksTable";
import StatusChart from "../../components/common/StatusChart";

function AnnotatorDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "annotator"],
    queryFn: getAnnotatorDashboard,
  });

  if (isLoading) {
    return <LoadingState message="Loading annotator dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load annotator dashboard"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const metrics = data.metrics;

  return (
    <div>
      <PageHeader
        title="Annotator Dashboard"
        description="Track your assigned tasks, submissions, rejected work, and quality score."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Assigned Tasks"
          value={metrics.assignedTasks}
          description="Total tasks assigned"
          icon={ClipboardList}
        />

        <MetricCard
          title="Pending"
          value={metrics.pendingTasks}
          description="Not yet started"
          icon={Clock}
        />

        <MetricCard
          title="Submitted"
          value={metrics.submittedTasks}
          description="Awaiting review"
          icon={FileCheck}
        />

        <MetricCard
          title="Average Score"
          value={metrics.averageScore}
          description={`${metrics.completionRate}% completion rate`}
          icon={Star}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <StatusChart
          title="My Task Status"
          data={data.charts.taskStatusDistribution}
          type="bar"
        />

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Work Summary
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={18} />
                <p className="text-sm font-medium">Approved</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {metrics.approvedTasks}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-red-700">
                <RotateCcw size={18} />
                <p className="text-sm font-medium">Rejected</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {metrics.rejectedTasks}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Use rejected feedback to improve your rubric alignment and resubmit
            revised evaluations.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecentTasksTable title="Recent Assigned Tasks" tasks={data.recentTasks} />

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Rejected Evaluations
          </h3>

          {data.rejectedEvaluations.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No rejected evaluations. Great work.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {data.rejectedEvaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge value={evaluation.status} />
                    <span className="text-xs text-slate-500">
                      Reviewer: {evaluation.reviewer?.name || "—"}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {truncateText(evaluation.task?.prompt, 100)}
                  </p>

                  <p className="mt-2 text-sm text-red-700">
                    {evaluation.reviewerFeedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AnnotatorDashboard;
