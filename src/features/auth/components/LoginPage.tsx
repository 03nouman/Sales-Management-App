import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../state/authSlice";
import { useAppDispatch } from "../../../app/hooks";

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = () => {
    dispatch(loginSuccess());
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
              defaultValue="owner@salesflow.com"
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
              defaultValue="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
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
