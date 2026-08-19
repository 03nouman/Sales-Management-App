import type { Product } from "./product.type";

export type ProductsState = {
  products: Product[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  selectedProductId: number | null;
};
