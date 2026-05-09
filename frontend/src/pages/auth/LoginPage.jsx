import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import FormField from "../../components/common/FormField";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../utils/authSchemas";
import { getDashboardPath } from "../../utils/getDashboardPath";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  async function onSubmit(values) {
    setApiError("");

    try {
      const loggedInUser = await login(values);
      navigate(getDashboardPath(loggedInUser.role), { replace: true });
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to manage LLM evaluation workflows."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerTo="/register"
    >
      {apiError ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="admin@evalflow.ai"
          autoComplete="email"
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Demo accounts</p>
        <p className="mt-2">Admin: admin@evalflow.ai / Admin@123</p>
        <p>Annotator: annotator@evalflow.ai / Annotator@123</p>
        <p>Reviewer: reviewer@evalflow.ai / Reviewer@123</p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
