type LoginRequest = {
  email?: string;
  password?: string;
};

// Mock user database - in production, validate against real backend
const users = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    name: "Owner",
    branch: "Main Branch",
  },
  {
    id: 2,
    email: "manager@example.com",
    password: "manager123",
    role: "manager" as const,
    name: "Manager Ali",
    branch: "Warehouse Branch",
  },
  {
    id: 3,
    email: "cashier@example.com",
    password: "cashier123",
    role: "cashier" as const,
    name: "Cashier Ayesha",
    branch: "Front Desk",
  },
];

export const authApi = {
  login: async (credentials?: LoginRequest) => {
    const email = credentials?.email?.trim().toLowerCase();
    const password = credentials?.password?.trim();

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Find user by email
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Validate password
    if (user.password !== password) {
      throw new Error("Invalid email or password.");
    }

    // Return user with their actual role (not user-selectable)
    return {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        branch: user.branch,
      },
      token: "demo-token-" + user.id,
    };
  },
};
