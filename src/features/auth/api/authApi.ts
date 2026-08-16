type LoginRequest = {
  email?: string;
  password?: string;
  role?: "admin" | "manager" | "cashier";
};

export const authApi = {
  login: async (_credentials?: LoginRequest) => ({
    user: {
      id: 1,
      name: "Owner",
      role: "admin",
      branch: "Main Branch",
    },
    token: "demo-token",
  }),
};
