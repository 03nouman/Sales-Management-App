export const authApi = {
  login: async () => ({
    user: {
      id: 1,
      name: "Owner",
      role: "admin",
      branch: "Main Branch",
    },
    token: "demo-token",
  }),
};
