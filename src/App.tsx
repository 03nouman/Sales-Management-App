import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { LoginPage } from "./features/auth/components/LoginPage";
import { SalesLayout } from "./features/sales/components/SalesLayout";
import { DashboardPage } from "./features/sales/pages/DashboardPage";
import { ProductsPage } from "./features/sales/pages/ProductsPage";
import { SalesPage } from "./features/sales/pages/SalesPage";
import { ReturnsPage } from "./features/sales/pages/ReturnsPage";
import { CustomersPage } from "./features/sales/pages/CustomersPage";
import { SettingsPage } from "./features/sales/pages/SettingsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <SalesLayout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "manager", "cashier"]}
                    >
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "manager", "cashier"]}
                    >
                      <SalesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <ProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "manager", "cashier"]}
                    >
                      <SalesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/returns"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "manager", "cashier"]}
                    >
                      <ReturnsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "manager", "cashier"]}
                    >
                      <CustomersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SalesLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
