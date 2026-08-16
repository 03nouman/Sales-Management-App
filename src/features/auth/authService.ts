import { authApi } from "./api/authApi";
import { normalizeRole, rolePermissions, type Role } from "./permissions";

type LoginCredentials = {
  email: string;
  password: string;
  role: Role;
};

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await authApi.login(credentials);

    const role = normalizeRole(credentials.role);

    return {
      ...response,
      user: {
        ...response.user,
        role,
        permissions: rolePermissions[role],
      },
    };
  },

  async logout() {
    localStorage.removeItem("salesflow-auth");
  },
};
