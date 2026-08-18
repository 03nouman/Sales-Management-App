import { AlertTriangle, Boxes, DollarSign, PackageOpen } from "lucide-react";

import { formatPrice } from "../../../../lib/currency";

type InventoryStatsData = {
  totalItems: number;
  lowStockAlerts: number;
  pendingRestock: number;
  inventoryValue: number;
};

type InventoryStatsProps = {
  stats: InventoryStatsData;
  isLoading: boolean;
};

export default function InventoryStats({
  stats,
  isLoading,
}: InventoryStatsProps) {
  const cards = [
    {
      label: "TOTAL ITEMS",
      value: stats.totalItems.toLocaleString(),
      icon: Boxes,
      accent: "text-[#263c93]",
    },
    {
      label: "LOW STOCK ALERTS",
      value: stats.lowStockAlerts.toString(),
      icon: AlertTriangle,
      accent: "text-[#b83a2f]",
      warning: true,
    },
    {
      label: "PENDING RESTOCK",
      value: stats.pendingRestock.toString(),
      icon: PackageOpen,
      accent: "text-[#e77a32]",
    },
    {
      label: "INVENTORY VALUE",
      value: formatPrice(stats.inventoryValue),
      icon: DollarSign,
      accent: "text-slate-900",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
                h-[82px]
                animate-pulse
                rounded-lg
                border
                border-slate-200
                bg-white
              "
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={[
              "rounded-lg",
              "border",
              "bg-white",
              "px-4 py-3",
              "shadow-[0_1px_3px_rgba(30,30,70,0.03)]",
              card.warning
                ? "border-t-2 border-t-[#b83a2f]"
                : "border-[#dedce8]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-[0.08em] text-slate-500">
                {card.label}
              </p>

              <div
                className="
                  grid h-7 w-7
                  place-items-center
                  rounded-md
                  bg-[#f0f1fa]
                "
              >
                <Icon size={15} className={card.accent} />
              </div>
            </div>

            <p
              className={[
                "mt-2",
                "font-mono",
                "text-[21px]",
                "font-bold",
                "leading-none",
                card.accent,
              ].join(" ")}
            >
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
