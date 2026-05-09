import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  description = "There is nothing to show yet.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Inbox size={22} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
