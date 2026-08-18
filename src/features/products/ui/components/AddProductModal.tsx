import { X } from "lucide-react";

import type { UseFormReturn } from "react-hook-form";

import {
  PRODUCT_CATEGORIES,
  type ProductFormValues,
} from "../../constants/productConstants";

type AddProductModalProps = {
  isOpen: boolean;
  form: UseFormReturn<ProductFormValues>;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
};

export default function AddProductModal({
  isOpen,
  form,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  if (!isOpen) {
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-slate-950/40
        p-4
        backdrop-blur-[2px]
      "
    >
      <div
        className="
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-2xl
          border border-[#dedce8]
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b border-[#e7e5ed]
            px-5 py-4
          "
        >
          <div>
            <h2 className="text-lg font-bold text-[#101936]">Add Product</h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Add a new product to your inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              grid h-8 w-8
              place-items-center
              rounded-lg
              text-slate-500
              hover:bg-slate-100
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Product Name
            </label>

            <input
              {...register("name", {
                required: "Product name is required.",
              })}
              placeholder="e.g. Makita 18V Drill"
              className="
                w-full
                rounded-lg
                border border-slate-200
                px-3 py-2.5
                text-sm
                outline-none
                transition
                focus:border-[#263c93]
                focus:ring-2
                focus:ring-[#263c93]/10
              "
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Category
              </label>

              <select
                {...register("category", {
                  required: true,
                })}
                className="
                  w-full
                  rounded-lg
                  border border-slate-200
                  bg-white
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                "
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                SKU
              </label>

              <input
                {...register("sku", {
                  required: "SKU is required.",
                })}
                placeholder="e.g. XDT131"
                className="
                  w-full
                  rounded-lg
                  border border-slate-200
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                "
              />

              {errors.sku && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.sku.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Cost Price
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                {...register("cost", {
                  required: "Cost price is required.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price cannot be negative.",
                  },
                })}
                className="
                  w-full
                  rounded-lg
                  border border-slate-200
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                "
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Selling Price
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                {...register("price", {
                  required: "Selling price is required.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price cannot be negative.",
                  },
                })}
                className="
                  w-full
                  rounded-lg
                  border border-slate-200
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                "
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Initial Stock
              </label>

              <input
                type="number"
                min="0"
                {...register("stock", {
                  required: "Stock quantity is required.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Stock cannot be negative.",
                  },
                })}
                className="
                  w-full
                  rounded-lg
                  border border-slate-200
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                "
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              flex
              justify-end
              gap-2
              border-t border-[#e7e5ed]
              pt-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                border border-slate-200
                px-4 py-2.5
                text-sm
                font-medium
                text-slate-600
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                rounded-lg
                bg-[#263c93]
                px-5 py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#1f327e]
              "
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
