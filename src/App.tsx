import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import LoanApplicationStepper from "./components/application/LoanApplicationStepper";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import CalculatorPage from "./pages/CalculatorPage";
import HomePage from "./pages/HomePage";
import LoanApplicationPage from "./pages/LoanApplicationPage";
import Loginpage from "./pages/Login";
import ManageAdmin from "./pages/admin/MangeAdmin";
import AdminLogin from "./pages/admin/AdminLogin";
import ManageFee from "./pages/admin/ManageFees";
import ManageApplications from "./pages/admin/ManageApplications";
import LoanApplicationDetail from "./components/admin/LoanApplicationDetail";
import TestConnection from "./components/TestConnection";

// ✅ Wrapper component to conditionally hide Header/Footer
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<LoanApplicationPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/loan-applications" element={<LoanApplicationStepper />} />
          <Route path="/test" element={<TestConnection />} />

          {/* Admin routes (no Header/Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/manage-admin" element={<ManageAdmin />} />
          <Route path="/admin/manage-fees" element={<ManageFee />} />
          <Route path="/admin/manage-applications" element={<ManageApplications />} />
          <Route path="/admin/loan-applications/:id" element={<LoanApplicationDetail />} />

          {/* Redirect admin root to dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
