import { truncateText } from "../../utils/formatters";
import Badge from "./Badge";
import Card from "./Card";
import EmptyState from "./EmptyState";

function RecentEvaluationsTable({
  title = "Recent Evaluations",
  evaluations = [],
}) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>

      {evaluations.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No evaluations found"
            description="There are no evaluations to display."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="px-3 py-3 font-semibold">Task</th>
                <th className="px-3 py-3 font-semibold">Annotator</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Score</th>
              </tr>
            </thead>

            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="border-b border-slate-100">
                  <td className="max-w-md px-3 py-4 text-slate-700">
                    {truncateText(evaluation.task?.prompt, 80)}
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {evaluation.annotator?.name || "—"}
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={evaluation.status} />
                  </td>

                  <td className="px-3 py-4 text-slate-700">
                    {evaluation.overallScore ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default RecentEvaluationsTable;
