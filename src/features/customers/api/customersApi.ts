import type { Customer } from "../types/customer.types";

const CUSTOMERS_API_URL = "/api/customers";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Unable to load customers.";

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

export const customersApi = {
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(CUSTOMERS_API_URL); 
    return parseResponse<Customer[]>(response);
  },

  async getCustomerById(customerId: number): Promise<Customer> {
    const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`);
    return parseResponse<Customer>(response);
  },
};
