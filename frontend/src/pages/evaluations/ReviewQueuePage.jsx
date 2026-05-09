import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { getEvaluations } from "../../api/evaluationApi";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import { truncateText } from "../../utils/formatters";

function ReviewQueuePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["evaluations", "review-queue"],
    queryFn: () => getEvaluations({ status: "SUBMITTED" }),
  });

  if (isLoading) {
    return <LoadingState message="Loading review queue..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load review queue"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const evaluations = data?.evaluations || [];

  return (
    <div>
      <PageHeader
        title="Review Queue"
        description="Review submitted annotator evaluations and approve or reject them with feedback."
      />

      {evaluations.length === 0 ? (
        <EmptyState
          title="No evaluations pending review"
          description="Submitted evaluations will appear here when annotators complete their tasks."
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Task</th>
                  <th className="px-3 py-3 font-semibold">Project</th>
                  <th className="px-3 py-3 font-semibold">Annotator</th>
                  <th className="px-3 py-3 font-semibold">Issue</th>
                  <th className="px-3 py-3 font-semibold">Score</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-b border-slate-100">
                    <td className="max-w-sm px-3 py-4 text-slate-700">
                      {truncateText(evaluation.task?.prompt, 80)}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {evaluation.task?.project?.title || "—"}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {evaluation.annotator?.name || "—"}
                    </td>

                    <td className="px-3 py-4">
                      <Badge value={evaluation.issueType} />
                    </td>

                    <td className="px-3 py-4 font-medium text-slate-900">
                      {evaluation.overallScore}
                    </td>

                    <td className="px-3 py-4">
                      <Badge value={evaluation.status} />
                    </td>

                    <td className="px-3 py-4">
                      <Link
                        to={`/evaluations/${evaluation.id}/review`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ReviewQueuePage;
