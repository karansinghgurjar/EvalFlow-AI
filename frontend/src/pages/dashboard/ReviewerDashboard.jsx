import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  RotateCcw,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getReviewerDashboard } from "../../api/dashboardApi";
import { truncateText } from "../../utils/formatters";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import RecentEvaluationsTable from "../../components/common/RecentEvaluationsTable";
import StatusChart from "../../components/common/StatusChart";

function ReviewerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "reviewer"],
    queryFn: getReviewerDashboard,
  });

  if (isLoading) {
    return <LoadingState message="Loading reviewer dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load reviewer dashboard"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const metrics = data.metrics;

  return (
    <div>
      <PageHeader
        title="Reviewer Dashboard"
        description="Review submitted evaluations, approve high-quality work, and reject submissions with feedback."
        action={
          <Link
            to="/evaluations/review"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Open Review Queue
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pending Review"
          value={metrics.pendingReview}
          description="Submitted evaluations"
          icon={ClipboardCheck}
        />

        <MetricCard
          title="Approved By Me"
          value={metrics.approvedByMe}
          description="Accepted evaluations"
          icon={CheckCircle}
        />

        <MetricCard
          title="Rejected By Me"
          value={metrics.rejectedByMe}
          description={`${metrics.rejectionRate}% rejection rate`}
          icon={RotateCcw}
        />

        <MetricCard
          title="Avg Reviewed Score"
          value={metrics.averageReviewedScore}
          description="Reviewed evaluations"
          icon={Star}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <StatusChart
          title="My Review Status Distribution"
          data={data.charts.reviewStatusDistribution}
          type="pie"
        />

        <Card>
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-950">
            <AlertTriangle size={18} />
            Low Score Submitted Evaluations
          </h3>

          {data.lowScoreSubmittedEvaluations.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No low-score submitted evaluations right now.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {data.lowScoreSubmittedEvaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge value={evaluation.status} />
                    <span className="text-sm font-semibold text-red-700">
                      Score: {evaluation.overallScore}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {truncateText(evaluation.task?.prompt, 100)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Annotator: {evaluation.annotator?.name || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecentEvaluationsTable
          title="Pending Evaluations"
          evaluations={data.pendingEvaluations}
        />

        <RecentEvaluationsTable
          title="Recently Reviewed"
          evaluations={data.recentReviewedEvaluations}
        />
      </div>
    </div>
  );
}

export default ReviewerDashboard;
