export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  status: ProductStatus;
};

export type CreateProductPayload = {
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
};

export type UpdateProductPayload = {
  productId: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
};
