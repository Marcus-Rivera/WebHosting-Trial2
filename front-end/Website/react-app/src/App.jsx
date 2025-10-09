import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import Home from "./Home";
import HomeAdmin from "./HomeAdmin";
import "./index.css";
import LandingPage from "./LandingPage";
import SignupPage from "./SignupPage";
import OtpPage from "./OtpPage";
import AboutUsPage from "./AboutUsPage";
import ManageUser from "./ManageUser";
import JobListing from "./JobListing";
import Faqs from "./Faqs";
import Forget from "./ForgetPage";
import Reset from "./ResetPassword";
import Report from "./Report";

// Import your sections
import ProfileSection from "./ProfileSection";
import DashboardSection from "./DashboardSection";
import CareerBotSection from "./CareerBotSection";
import ResumeSection from "./ResumeSection";
import JobListingsSection from "./JobListingsSection"; // NEW IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/Faqs" element={<Faqs />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/Reset" element={<Reset />} />
        <Route path="/Report" element={<Report />} />

        {/* Nested routes for Home */}
        <Route path="/taratrabaho" element={<Home />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="dashboard" element={<DashboardSection />} />
          <Route path="careerbot" element={<CareerBotSection />} />
          <Route path="resumes" element={<ResumeSection />} />
          <Route path="jobs" element={<JobListingsSection />} /> {/* NEW ROUTE */}
        </Route>

        {/* Admin routes */}
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
        <Route path="/ManageUser" element={<ManageUser />} />
        <Route path="/JobListing" element={<JobListing />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;