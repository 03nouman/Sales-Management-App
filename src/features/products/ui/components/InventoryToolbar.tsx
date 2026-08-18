import { Filter, Plus, Search, X } from "lucide-react";
import { PRODUCT_CATEGORIES } from "../../constants/productConstants";

type InventoryToolbarProps = {
  search: string;
  category: string;
  isFilterOpen: boolean;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onToggleFilter: () => void;
  onResetFilters: () => void;
  onAddProduct: () => void;
};

export default function InventoryToolbar({
  search,
  category,
  isFilterOpen,
  onSearchChange,
  onCategoryChange,
  onToggleFilter,
  onResetFilters,
  onAddProduct,
}: InventoryToolbarProps) {
  return (
    <div
      className="
        flex flex-col gap-3
        border-b border-[#e5e3ed]
        px-4 py-3
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* Search */}
      <div
        className="
          flex
          h-9
          w-full
          max-w-[420px]
          items-center
          rounded-md
          border border-[#d9d7e5]
          bg-[#faf9fd]
          px-3
        "
      >
        <Search size={14} className="shrink-0 text-slate-400" />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products, SKUs, or categories..."
          className="
            h-full
            w-full
            bg-transparent
            px-2
            text-xs
            text-slate-700
            outline-none
            placeholder:text-slate-400
          "
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleFilter}
          className={[
            "inline-flex",
            "items-center",
            "gap-2",
            "rounded-md",
            "border",
            "px-3 py-2",
            "text-xs",
            "font-medium",
            "transition",
            isFilterOpen || category !== "all"
              ? "border-[#263c93] bg-[#eef0ff] text-[#263c93]"
              : "border-[#d9d7e5] bg-white text-slate-600 hover:bg-slate-50",
          ].join(" ")}
        >
          <Filter size={13} />
          Filter
        </button>

        <button
          type="button"
          onClick={onAddProduct}
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            bg-[#263c93]
            px-3 py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-[#1f327e]
          "
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div
          className="
            absolute
            right-4
            top-[145px]
            z-20
            w-[250px]
            rounded-xl
            border border-[#dedce8]
            bg-white
            p-4
            shadow-xl
          "
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Filter Inventory
            </p>

            <button
              type="button"
              onClick={onToggleFilter}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </div>

          <label className="mb-1 block text-xs font-medium text-slate-600">
            Category
          </label>

          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="
              w-full
              rounded-md
              border border-slate-200
              px-3 py-2
              text-xs
              outline-none
              focus:border-[#263c93]
            "
          >
            <option value="all">All categories</option>

            {PRODUCT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onResetFilters}
            className="
              mt-3
              w-full
              rounded-md
              border border-slate-200
              px-3 py-2
              text-xs
              font-medium
              text-slate-600
              hover:bg-slate-50
            "
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
