import { Link } from "react-router-dom";

function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerTo,
}) {
  return (
    <div className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950">
              AI
            </div>
            <div>
              <p className="font-bold">EvalFlow AI</p>
              <p className="text-xs text-slate-400">LLM Evaluation Ops</p>
            </div>
          </Link>
        </div>

        <div>
          <p className="mb-4 w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
            AI data operations workflow
          </p>

          <h1 className="max-w-xl text-4xl font-bold leading-tight">
            Manage prompt-response evaluation with role-based workflows.
          </h1>

          <p className="mt-5 max-w-lg text-slate-300">
            Admins create projects, annotators submit rubric-based evaluations,
            and reviewers approve or reject work with quality feedback.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          Built for Ethara.AI Full-Stack Assessment
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8">
            <Link
              to="/"
              className="mb-6 inline-block text-sm font-medium text-slate-500 hover:text-slate-950"
            >
              ← Back to home
            </Link>

            <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-slate-500">
            {footerText}{" "}
            <Link
              to={footerTo}
              className="font-medium text-slate-950 hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
