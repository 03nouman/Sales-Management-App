import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "../authService";
import { loginSuccess } from "../state/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { register, handleSubmit } = useForm<LoginForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.login(data);

      dispatch(
        loginSuccess({
          id: response.user.id,
          name: response.user.name,
          role: response.user.role,
          branch: response.user.branch,
          permissions: response.user.permissions,
          token: response.token,
        }),
      );

      navigate("/");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
          SalesFlow
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Secure access to the hardware shop dashboard
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="enter email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
            {/* <p className="mt-1 text-xs text-slate-500">
              Try: admin@example.com, manager@example.com, or
              cashier@example.com
            </p> */}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
            {/* <p className="mt-1 text-xs text-slate-500">
              Passwords: admin123, manager123, cashier123
            </p> */}
          </div>

          {submitError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          {/* <div className="rounded-2xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <p className="font-semibold">Demo Credentials</p>
            <p className="mt-1">admin@example.com / admin123 → Full access</p>
            <p>manager@example.com / manager123 → Manager access</p>
            <p>cashier@example.com / cashier123 → Cashier access</p>
          </div> */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
