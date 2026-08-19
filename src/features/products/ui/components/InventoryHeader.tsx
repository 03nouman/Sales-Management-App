import { Filter, Plus } from "lucide-react";

type InventoryHeaderProps = {
  totalProducts: number;
  onAddProduct: () => void;
};

export default function InventoryHeader({
  totalProducts,
  onAddProduct,
}: InventoryHeaderProps) {
  console.log(totalProducts);
  
  return (
    <header
      className="
        flex flex-col gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div>
        <h1
          className="
            text-[24px]
            font-bold
            tracking-tight
            text-[#101936]
            sm:text-[26px]
          "
        >
          Inventory Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage stock levels across all warehouse zones.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            border border-[#d8d9e8]
            bg-[#eef0ff]
            px-4 py-2
            text-xs
            font-semibold
            text-[#263c93]
            transition
            hover:bg-[#e4e7ff]
          "
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
            px-4 py-2
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
    </header>
  );
}
