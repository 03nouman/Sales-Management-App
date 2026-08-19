import type {
  CreateOrderPayload,
  Order,
  UpdateOrderPaymentPayload,
  UpdateOrderStatusPayload,
} from "../types/order.types";

const ORDERS_API_URL = "/api/orders";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const data = await response.json();

      if (data?.message) {
        message = data.message;
      }
    } catch {
      // Ignore invalid JSON response.
    }

    throw new Error(message);
  }

  return response.json();
}

export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    const response = await fetch(ORDERS_API_URL);

    return parseResponse<Order[]>(response);
  },

  async getOrderById(orderId: number): Promise<Order> {
    const response = await fetch(`${ORDERS_API_URL}/${orderId}`);

    return parseResponse<Order>(response);
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await fetch(ORDERS_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    return parseResponse<Order>(response);
  },

  async updateOrderStatus(payload: UpdateOrderStatusPayload): Promise<Order> {
    const response = await fetch(
      `${ORDERS_API_URL}/${payload.orderId}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: payload.status,
        }),
      },
    );

    return parseResponse<Order>(response);
  },

  async updateOrderPayment(payload: UpdateOrderPaymentPayload): Promise<Order> {
    const response = await fetch(
      `${ORDERS_API_URL}/${payload.orderId}/payment`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          paidAmount: payload.paidAmount,
          paymentType: payload.paymentType,
        }),
      },
    );

    return parseResponse<Order>(response);
  },

  async cancelOrder(orderId: number): Promise<Order> {
    const response = await fetch(`${ORDERS_API_URL}/${orderId}/cancel`, {
      method: "PATCH",
    });

    return parseResponse<Order>(response);
  },
};
