import { UserPlus } from "lucide-react";
import type { CustomerMode } from "../../../../../customers/types/customerMode.types";

type Props = {
  customerMode: CustomerMode;

  onChange: (mode: CustomerMode) => void;
};

export function CustomerModeTabs({ customerMode, onChange }: Props) {
  return (
    <div
      className="
        flex
        w-fit
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        p-1
      "
      role="tablist"
      aria-label="Customer type"
    >
      {/* ===================================================
          EXISTING CUSTOMER
      ==================================================== */}

      <button
        type="button"
        role="tab"
        aria-selected={customerMode === "existing"}
        onClick={() => onChange("existing")}
        className={`
          rounded-lg
          px-4
          py-2
          text-xs
          font-semibold
          transition
          ${
            customerMode === "existing"
              ? "bg-white text-[#263c93] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }
        `}
      >
        Existing Customer
      </button>

      {/* ===================================================
          NEW CUSTOMER
      ==================================================== */}

      <button
        type="button"
        role="tab"
        aria-selected={customerMode === "new"}
        onClick={() => onChange("new")}
        className={`
          flex
          items-center
          gap-1.5
          rounded-lg
          px-4
          py-2
          text-xs
          font-semibold
          transition
          ${
            customerMode === "new"
              ? "bg-white text-[#263c93] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }
        `}
      >
        <UserPlus size={14} />
        New Customer
      </button>
    </div>
  );
}
