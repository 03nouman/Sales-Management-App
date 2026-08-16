import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-red-500">
          Access denied
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          You do not have permission
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          This section is restricted for your role. Please contact the owner or
          switch to an authorized account.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
