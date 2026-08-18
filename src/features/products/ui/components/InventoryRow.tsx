import { Box, MoreHorizontal } from "lucide-react";
import { formatPrice } from "../../../../lib/currency";
import ProductStatusBadge from "./ProductStatusBadge";
import type { Product } from "../../../sales/salesSlice";

type InventoryRowProps = {
  product: Product;
};

export default function InventoryRow({ product }: InventoryRowProps) {
  const zone = `Zone ${String.fromCharCode(
    65 + (product.id % 5),
  )}-${String(product.id).slice(-2)}`;

  const stockStatus =
    product.stock === 0
      ? "OUT OF STOCK"
      : product.stock <= 10
        ? "LOW STOCK"
        : "IN STOCK";

  return (
    <tr
      className="
        border-t border-[#ebe9f0]
        transition
        hover:bg-[#fafaff]
      "
    >
      {/* Product */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="
              grid h-7 w-7
              shrink-0
              place-items-center
              rounded-md
              bg-[#eef0ff]
              text-[#263c93]
            "
          >
            <Box size={15} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-[#17244d]">
              {product.name}
            </p>

            <p className="mt-0.5 text-[9px] text-slate-500">
              {product.category} &gt; Products
            </p>
          </div>
        </div>
      </td>

      {/* SKU */}
      <td className="px-4 py-3">
        <p className="font-mono text-[10px] font-semibold text-[#17244d]">
          {product.sku}
        </p>

        <p className="mt-0.5 text-[9px] text-slate-500">{zone}</p>
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <p
          className={[
            "font-mono text-[11px] font-semibold",
            product.stock === 0
              ? "text-red-600"
              : product.stock <= 10
                ? "text-[#e06b2f]"
                : "text-[#17244d]",
          ].join(" ")}
        >
          {product.stock}
        </p>

        <p className="text-[8px] text-slate-400">Min: 10</p>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <p className="font-mono text-[11px] font-semibold text-[#17244d]">
          {formatPrice(product.price)}
        </p>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <ProductStatusBadge status={stockStatus} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <button
          type="button"
          aria-label={`Actions for ${product.name}`}
          className="
            grid h-7 w-7
            place-items-center
            rounded-md
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-900
          "
        >
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}
