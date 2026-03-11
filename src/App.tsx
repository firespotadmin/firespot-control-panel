import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth";
import RequestAccess from "./pages/auth/request-access";
import ForgetPassword from "./pages/auth/password/forget";
import InitiateReset from "./pages/auth/password/initiate-reset";
import CheckMail from "./pages/auth/password/check-mail";
import VerifyEmail from "./pages/auth/MFA";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./pages/security/protected";
import RoleGuard from "./pages/security/role-guard";
import Businesses from "./pages/businesses";
import Customers from "./pages/customers";
import BusinessView from "./pages/businesses/business";
import Transactions from "./pages/transactions";
import QrKits from "./pages/qr-kits";
import Products from "./pages/products";
import Settings from "./pages/settings";
import AuditLogs from "./pages/settings/audit-logs";
import UserRoles from "./pages/settings/user-roles";
import Insights from "./pages/insights";
import Support from "./pages/support";
import NotFound from "./pages/404/not-found";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/" element={<Loading />} /> */}
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/MFA" element={<VerifyEmail />} />
      <Route path="/initiate-reset" element={<InitiateReset />} />
      <Route path="/check-mail" element={<CheckMail />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/business/:id" element={<BusinessView />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route
          path="/qr-kits"
          element={
            <RoleGuard path="/qr-kits" fallback="/dashboard">
              <QrKits />
            </RoleGuard>
          }
        />
        <Route
          path="/products"
          element={
            <RoleGuard path="/products" fallback="/dashboard">
              <Products />
            </RoleGuard>
          }
        />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/settings/audit-logs"
          element={
            <RoleGuard path="/settings/audit-logs" fallback="/settings">
              <AuditLogs />
            </RoleGuard>
          }
        />
        <Route
          path="/settings/user-roles"
          element={
            <RoleGuard path="/settings/user-roles" fallback="/settings">
              <UserRoles />
            </RoleGuard>
          }
        />
      </Route>
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
