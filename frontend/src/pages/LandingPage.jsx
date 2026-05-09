import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
          AI Data Operations Platform
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          EvalFlow AI helps teams manage LLM evaluation workflows.
        </h1>

        <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
          Create evaluation projects, assign prompt-response tasks, collect
          annotator ratings, and review quality through role-specific
          dashboards.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
