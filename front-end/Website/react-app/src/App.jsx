import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import DashboardSection from "./DashboardSection";
import ProfileSection from "./ProfileSection";
import ResumeSection from "./ResumeSection";
import CareerBotSection from "./CareerBotSection";
import ForgetPage from "./ForgetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/taratrabaho" element={<Home />} />
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/ManageUser" element={<ManageUser />} />
        <Route path="/JobListing" element={<JobListing />} />
        <Route path="/dashboard" element={<DashboardSection />} />
        <Route path="/profile" element={<ProfileSection />} />
        <Route path="/resumes" element={<ResumeSection />} />
        <Route path="/careerbot" element={<CareerBotSection />} />
        <Route path="/forget" element={<ForgetPage />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
