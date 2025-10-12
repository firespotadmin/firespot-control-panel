import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/auth"
import RequestAccess from "./pages/auth/request-access"
import ForgetPassword from "./pages/auth/password/forget"
import InitiateReset from "./pages/auth/password/initiate-reset"
import CheckMail from "./pages/auth/password/check-mail"
import VerifyEmail from "./pages/auth/MFA"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/MFA" element={<VerifyEmail />} />
      <Route path="/initiate-reset" element={<InitiateReset />} />
      <Route path="/check-mail" element={<CheckMail />} />
    </Routes>
  )
}

export default App