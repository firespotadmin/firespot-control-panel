import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth";
import RequestAccess from "./pages/auth/request-access";
import ForgetPassword from "./pages/auth/password/forget";
import InitiateReset from "./pages/auth/password/initiate-reset";
import CheckMail from "./pages/auth/password/check-mail";
import VerifyEmail from "./pages/auth/MFA";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./pages/security/protected";
import Businesses from "./pages/businesses";
import Customers from "./pages/customers";
import BusinessView from "./pages/businesses/business";
import Transactions from "./pages/transactions";
import Products from "./pages/products";
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
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/products" element={<Products />} />
      </Route>
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
