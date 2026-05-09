import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-950">404</h1>
        <p className="mt-3 text-slate-500">Page not found.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
