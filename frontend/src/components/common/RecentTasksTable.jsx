import { truncateText } from "../../utils/formatters";
import Badge from "./Badge";
import Card from "./Card";
import EmptyState from "./EmptyState";

function RecentTasksTable({ title = "Recent Tasks", tasks = [] }) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>

      {tasks.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No tasks found"
            description="There are no recent tasks to display."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="px-3 py-3 font-semibold">Prompt</th>
                <th className="px-3 py-3 font-semibold">Project</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Score</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-100">
                  <td className="max-w-md px-3 py-4 text-slate-700">
                    {truncateText(task.prompt, 80)}
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {task.project?.title || "—"}
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
  );
}

export default RecentTasksTable;
