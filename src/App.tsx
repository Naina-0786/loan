import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet-async"; // ✅ Add this
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
import LoanApprovalLetter from "./components/document/pdf";
import SBILifeReceiptPDF from "./components/document/lic";
import CTSDocumentPDF from "./components/document/cts";
import PaymentPage from "./components/document/test/payment";
import QRCodeManager from "./pages/admin/Qr";
import TermsAndConditions from "./components/document/contidion";
import ManageAccountNumbers from "./pages/admin/MangeAccounts";
import ManageInquiries from "./pages/admin/ManageEnquery";

// ✅ Layout wrapper (unchanged)
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <main className="flex-1 pt-16">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* ✅ Add Helmet here so it applies globally */}
      <Helmet>
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1389090272813951');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=1389090272813951&ev=PageView&noscript=1"/>`}
        </noscript>
      </Helmet>

      <LayoutWrapper>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<LoanApplicationPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/loan-applications" element={<LoanApplicationStepper />} />
          <Route path="/test" element={<TestConnection />} />
          <Route path="/docs" element={<LoanApprovalLetter />} />
          <Route path="/lic" element={<SBILifeReceiptPDF />} />
          <Route path="/cts" element={<CTSDocumentPDF />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/condition" element={<TermsAndConditions />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/manage-admin" element={<ManageAdmin />} />
          <Route path="/admin/manage-fees" element={<ManageFee />} />
          <Route path="/admin/qr-code" element={<QRCodeManager />} />
          <Route path="/admin/account" element={<ManageAccountNumbers />} />
          <Route path="/admin/enquiry" element={<ManageInquiries />} />
          <Route path="/admin/manage-applications" element={<ManageApplications />} />
          <Route path="/admin/loan-applications/:id" element={<LoanApplicationDetail />} />

          {/* Redirect /admin */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
