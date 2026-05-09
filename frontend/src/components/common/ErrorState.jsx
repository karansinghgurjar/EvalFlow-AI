import { AlertCircle } from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
      <AlertCircle className="mt-0.5" size={20} />

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
}

export default ErrorState;
