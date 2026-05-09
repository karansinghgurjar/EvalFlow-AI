import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import FormField from "../../components/common/FormField";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { registerSchema } from "../../utils/authSchemas";
import { getDashboardPath } from "../../utils/getDashboardPath";

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, user } = useAuth();

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "ANNOTATOR",
    },
  });

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  async function onSubmit(values) {
    setApiError("");

    try {
      const registeredUser = await registerUser(values);
      navigate(getDashboardPath(registeredUser.role), { replace: true });
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register as an admin, annotator, or reviewer."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerTo="/login"
    >
      {apiError ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Full name"
          name="name"
          register={register}
          error={errors.name}
          placeholder="Enter your name"
          autoComplete="name"
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
        />

        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Role
          </label>

          <select
            id="role"
            {...register("role")}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
              errors.role
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : "border-slate-200 bg-white focus:border-slate-950"
            }`}
          >
            <option value="ANNOTATOR">Annotator</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ADMIN">Admin</option>
          </select>

          {errors.role ? (
            <p className="mt-1.5 text-sm text-red-600">{errors.role.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
