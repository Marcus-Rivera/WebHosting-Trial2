import { useState } from "react";
import bg from './assets/BG.png';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage("Please enter a valid email address");
      return;
    }

    try {
      // Example API call for password reset
      const response = await fetch("http://localhost:5000/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlertMessage("Password reset instructions have been sent to your email.");
        setTimeout(() => navigate("/login"), 3000); // redirect after 3s
      } else {
        setAlertMessage("Email not found.");
      }
    } catch (error) {
      console.error("Forget password error:", error);
      setAlertMessage("Server error. Try again later.");
    }
  };

  return (
    <div
      className="flex flex-col-reverse lg:flex-row bg-cover min-h-screen lg:items-center pt-12 pb-35 lg:pt-10 lg:pb-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Alert */}
      {alertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
          <Alert severity="info">{alertMessage}</Alert>
        </div>
      )}

      <div className="flex w-full lg:w-2/3 items-center justify-center p-7">
        <div className="w-full max-w-md rounded-4xl bg-[#FFE660] p-8 shadow-lg">
          <h2 className="mb-6 text-center text-4xl font-bold text-[#272343]">Forget Password</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter your email address to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-md font-bold font-inter text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 w-full rounded-lg border-[#272343] border p-2 focus:outline-none focus:ring-2 bg-[#BAE8E8] ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : " focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="block px-6 mx-auto rounded-md bg-[#2C275C] py-2 font-semibold text-white transition hover:bg-[#1b163e] cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm">
            <a href="/login" className="text-[#272343] font-bold underline hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 justify-center lg:justify-end p-8 lg:items-center">
        <div className="text-center lg:text-right text-[#272343] p-2">
          <h3 className="text-3xl">Forgot Your Password?</h3>
          <h1 className="text-5xl lg:text-7xl font-inter font-bold mt-5 mb-4 italic text-[#272343] animate-bounce">
            Tara
            <span className="text-yellow-400 drop-shadow-[2px_2px_0px_black] italic">
              Trabaho!
            </span>
          </h1>
          <p className="text-lg mb-4">We’ll send instructions to reset your password.</p>
        </div>
      </div>
    </div>
  );
}
