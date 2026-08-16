import { authApi } from "./api/authApi";
import { normalizeRole, rolePermissions } from "./permissions";

type LoginCredentials = {
  email: string;
  password: string;
};

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await authApi.login(credentials);
    const role = normalizeRole(response.user.role);

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
