export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Product = {
  id: number;
  name: string;
  category: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
  status: ProductStatus;
};

const PRODUCTS_API_URL = "/api/products";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Unable to load products.";

    try {
      const data = await response.json();

      if (data?.message) {
        message = data.message;
      }
    } catch {
      // Ignore invalid response.
    }

    throw new Error(message);
  }

  return response.json();
}

export const productsApi = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(PRODUCTS_API_URL);

    return parseResponse<Product[]>(response);
  },

  async getProductById(productId: number): Promise<Product> {
    const response = await fetch(`${PRODUCTS_API_URL}/${productId}`);

    return parseResponse<Product>(response);
  },
};
