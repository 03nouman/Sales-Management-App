import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  status: "In Stock" | "Low Stock";
};

export type OrderStatus =
  | "Paid"
  | "Partial"
  | "Pending"
  | "Returned"
  | "Exchanged";

export type Order = {
  id: string;
  customer: string;
  date: string;
  item: string;
  total: number;
  paid: number;
  outstanding: number;
  status: OrderStatus;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  totalSpent: number;
  tier: "Gold" | "Silver" | "Bronze";
};

export type PaymentEvent = {
  id: number;
  orderId: string;
  amount: number;
  type: "Invoice" | "Collection" | "Refund" | "Settlement";
  date: string;
};

export type SaleTransaction = {
  id: string;
  customer: string;
  items: Array<{ productId: number; name: string; qty: number; price: number }>;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  outstanding: number;
  returnedValue: number;
  exchangeValue: number;
  settlement: number;
  status: "Completed" | "Partial" | "Return Pending";
  createdAt: string;
};

type SalesState = {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  payments: PaymentEvent[];
  transactions: SaleTransaction[];
  dashboard: {
    grossSales: number;
    netSales: number;
    returns: number;
    grossProfit: number;
    returnExchangeImpact: number;
  };
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Aluminium Rod 12mm",
    category: "Metal",
    price: 220,
    cost: 145,
    stock: 48,
    sku: "AL-12-001",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Steel Plate 3mm",
    category: "Steel",
    price: 540,
    cost: 388,
    stock: 18,
    sku: "ST-3-014",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Nail Pack 50pcs",
    category: "Fasteners",
    price: 85,
    cost: 54,
    stock: 96,
    sku: "NA-50-019",
    status: "In Stock",
  },
  {
    id: 4,
    name: "PVC Pipe 1 inch",
    category: "Pipe",
    price: 165,
    cost: 112,
    stock: 24,
    sku: "PVC-1-088",
    status: "In Stock",
  },
];

const initialState: SalesState = {
  products: initialProducts,
  orders: [
    {
      id: "INV-1001",
      customer: "Rahim Ahmed",
      date: "2026-08-12",
      item: "Aluminium Rod 12mm",
      total: 5000,
      paid: 3500,
      outstanding: 1500,
      status: "Partial",
    },
    {
      id: "INV-1002",
      customer: "Nadia Hasan",
      date: "2026-08-13",
      item: "Steel Plate 3mm",
      total: 3200,
      paid: 3200,
      outstanding: 0,
      status: "Paid",
    },
    {
      id: "INV-1003",
      customer: "Shahab Ali",
      date: "2026-08-14",
      item: "Nail Pack 50pcs",
      total: 1800,
      paid: 1200,
      outstanding: 600,
      status: "Partial",
    },
  ],
  customers: [
    {
      id: 1,
      name: "Rahim Ahmed",
      email: "rahim@example.com",
      totalSpent: 5400,
      tier: "Gold",
    },
    {
      id: 2,
      name: "Nadia Hasan",
      email: "nadia@example.com",
      totalSpent: 8800,
      tier: "Gold",
    },
    {
      id: 3,
      name: "Shahab Ali",
      email: "shahab@example.com",
      totalSpent: 3200,
      tier: "Silver",
    },
  ],
  payments: [
    {
      id: 1,
      orderId: "INV-1001",
      amount: 3500,
      type: "Collection",
      date: "2026-08-12",
    },
    {
      id: 2,
      orderId: "INV-1001",
      amount: 500,
      type: "Refund",
      date: "2026-08-15",
    },
    {
      id: 3,
      orderId: "INV-1002",
      amount: 3200,
      type: "Invoice",
      date: "2026-08-13",
    },
  ],
  transactions: [
    {
      id: "TXN-1001",
      customer: "Rahim Ahmed",
      items: [
        { productId: 1, name: "Aluminium Rod 12mm", qty: 1, price: 5000 },
      ],
      subtotal: 5000,
      discount: 0,
      total: 5000,
      paid: 3500,
      outstanding: 1500,
      returnedValue: 1500,
      exchangeValue: 999,
      settlement: 501,
      status: "Return Pending",
      createdAt: "2026-08-12",
    },
    {
      id: "TXN-1002",
      customer: "Nadia Hasan",
      items: [{ productId: 2, name: "Steel Plate 3mm", qty: 2, price: 1600 }],
      subtotal: 1600,
      discount: 0,
      total: 1600,
      paid: 1600,
      outstanding: 0,
      returnedValue: 0,
      exchangeValue: 0,
      settlement: 0,
      status: "Completed",
      createdAt: "2026-08-13",
    },
  ],
  dashboard: {
    grossSales: 25480,
    netSales: 23650,
    returns: 820,
    grossProfit: 9650,
    returnExchangeImpact: 1420,
  },
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.dashboard.grossSales += action.payload.total;
    },
    addTransaction: (state, action: PayloadAction<SaleTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
    ) => {
      const target = state.orders.find(
        (order) => order.id === action.payload.id,
      );
      if (target) {
        target.status = action.payload.status;
      }
    },
  },
});

export const { addProduct, addOrder, addTransaction, updateOrderStatus } =
  salesSlice.actions;
export default salesSlice.reducer;
