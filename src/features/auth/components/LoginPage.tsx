import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { loginSuccess } from "../state/authSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

type Role = "admin" | "manager" | "cashier";

type LoginForm = {
  email: string;
  password: string;
  role: Role;
};

const roleProfiles: Record<Role, { name: string; branch: string }> = {
  admin: { name: "Owner", branch: "Main Branch" },
  manager: { name: "Manager Ali", branch: "Warehouse Branch" },
  cashier: { name: "Cashier Ayesha", branch: "Front Desk" },
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { register, handleSubmit } = useForm<LoginForm>();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: LoginForm) => {
    const profile = roleProfiles[data.role];
    dispatch(
      loginSuccess({
        name: profile.name,
        role: data.role,
        branch: profile.branch,
      }),
    );
    navigate("/");
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              {...register("role", { required: true })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
