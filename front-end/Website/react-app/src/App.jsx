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
<<<<<<< HEAD
import Profile from "./ProfileSection";
import Faqs from "./Faqs";
=======
import Faqs from "./Faqs";
import Forget from "./ForgetPage";
import Reset from "./ResetPassword";
>>>>>>> bb8312d121d13dd58954f58b07a8c4c09e8bd999

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
        <Route path="/Faqs" element={<Faqs />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/Reset" element={<Reset />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
