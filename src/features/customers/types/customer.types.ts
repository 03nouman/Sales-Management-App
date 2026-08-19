export type CustomerTier = "Regular" | "Silver" | "Gold";

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tier?: CustomerTier;
};

export type CreateCustomerPayload = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tier?: CustomerTier;
};

export type UpdateCustomerPayload = {
  customerId: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tier?: CustomerTier;
};
