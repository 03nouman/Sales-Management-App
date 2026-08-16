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
                <Route path="/" element={<DashboardPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/orders" element={<SalesPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
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
