export const PRODUCT_CATEGORIES = [
  "Metal",
  "Steel",
  "Fasteners",
  "Pipe",
  "Electrical",
  "Tools",
] as const;

export const ITEMS_PER_PAGE = 4;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type ProductFormValues = {
  name: string;
  category: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
};
