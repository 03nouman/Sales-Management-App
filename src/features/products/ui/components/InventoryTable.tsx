import { ChevronLeft, ChevronRight } from "lucide-react";


import InventoryRow from "./InventoryRow";
import type { Product } from "../../../sales/salesSlice";

type InventoryTableProps = {
  products: Product[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
};

export default function InventoryTable({
  products,
  isLoading,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
                h-[60px]
                animate-pulse
                rounded-md
                bg-slate-100
              "
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left">
          <thead className="bg-[#f2f2fa]">
            <tr>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Product Details
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                SKU / Zone
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Stock Level
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Unit Price
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <InventoryRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="px-4 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No products found
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Try changing your search or filter.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div
        className="
          flex
          flex-col
          gap-3
          border-t border-[#e5e3ed]
          px-4 py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="text-xs text-slate-600">
          Showing <span className="font-medium">{products.length}</span> of{" "}
          <span className="font-medium">{totalResults.toLocaleString()}</span>{" "}
          results
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="
              grid h-7 w-7
              place-items-center
              rounded-md
              text-slate-500
              hover:bg-slate-100
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(0, 5)
            .map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={[
                  "grid h-7 w-7",
                  "place-items-center",
                  "rounded-md",
                  "text-xs font-medium",
                  page === currentPage
                    ? "bg-[#263c93] text-white"
                    : "text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                {page}
              </button>
            ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="
              grid h-7 w-7
              place-items-center
              rounded-md
              text-slate-500
              hover:bg-slate-100
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
