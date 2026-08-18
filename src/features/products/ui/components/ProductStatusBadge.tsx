type ProductStatusBadgeProps = {
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
};

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  const classes = {
    "IN STOCK": "bg-[#e9f5eb] text-[#31753d]",
    "LOW STOCK": "bg-[#fff0e5] text-[#a84c20]",
    "OUT OF STOCK": "bg-[#f9e3e0] text-[#a7352c]",
  };

  return (
    <span
      className={[
        "inline-flex",
        "rounded-full",
        "px-2 py-1",
        "text-[8px]",
        "font-bold",
        "whitespace-nowrap",
        classes[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
