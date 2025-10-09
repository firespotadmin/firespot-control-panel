import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/auth"
import RequestAccess from "./pages/auth/request-access"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/request-access" element={<RequestAccess />} />
    </Routes>
  )
}

export default App