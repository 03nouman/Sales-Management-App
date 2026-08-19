export type CustomerTier = "Regular" | "Silver" | "Gold";

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tier?: CustomerTier;
};

const CUSTOMERS_API_URL = "/api/customers";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Unable to load customers.";

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

export const customersService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(CUSTOMERS_API_URL);

    return parseResponse<Customer[]>(response);
  },

  async getCustomerById(customerId: number): Promise<Customer> {
    const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`);

    return parseResponse<Customer>(response);
  },
};
