import type { Product } from "../types/product.type";

const PRODUCTS_API_URL = "/api/products";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Unable to load products.";

    try {
      const data: unknown = await response.json();

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        message = data.message;
      }
    } catch {
      // Ignore invalid response.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
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
