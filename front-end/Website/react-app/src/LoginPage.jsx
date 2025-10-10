import { useState, useEffect } from "react";
import bg from './assets/BG.png';
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error"); // For MUI Alert
  const navigate = useNavigate();

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fieldName === "email") {
      if (!value) {
        fieldErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        fieldErrors.email = "Enter a valid email address";
      } else {
        delete fieldErrors.email; // Clear error if valid
      }
    }

    if (fieldName === "password") {
      if (!value) {
        fieldErrors.password = "Password is required";
      } else if (value.length < 6) {
        fieldErrors.password = "Password must be at least 6 characters";
      } else {
        delete fieldErrors.password; // Clear error if valid
      }
    }

    setErrors(fieldErrors);
  };

  const validateForm = () => {
    validateField("email", email);
    validateField("password", password);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    // Validate on change for real-time feedback
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run full validation
    if (!validateForm()) {
      setAlertMessage("Please fix the errors below");
      setAlertSeverity("error");
      return;
    }

    // Clear any previous alerts
    setAlertMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success: Clear form and navigate
        sessionStorage.setItem("token", data.token);
        setEmail("");
        setPassword("");
        setErrors({});
        const role = data.user.role;
        if (role === "admin") {
          navigate("/HomeAdmin");
        } else {
          navigate("/taratrabaho");
        }
      } else {
        // Server error: Use specific message if available (e.g., for invalid password)
        const errorMsg = data.message || "Invalid email or password";
        setAlertMessage(errorMsg);
        setAlertSeverity("error");
        // Highlight fields on server error (optional: assume email/password invalid)
        setErrors({ email: "Invalid credentials", password: "Invalid credentials" });
      }

    } catch (error) {
      console.error("Login error:", error);
      setAlertMessage("Server error. Try again later.");
      setAlertSeverity("error");
    }
  };

  return (
    <div
      className="flex flex-col-reverse lg:flex-row bg-cover min-h-screen lg:items-center pt-12 pb-35 lg:pt-10 lg:pb-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Alert if login fails */}
      {alertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
          <Alert severity={alertSeverity} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </div>
      )}

      <div className="flex w-full lg:w-2/3 items-center justify-center p-7">
        <div className="w-full max-w-md rounded-4xl bg-[#FFE660] p-8 shadow-lg">
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block text-md font-bold font-inter text-gray-600"
              >
                Email{errors.email ? <span className="text-red-500 ml-1">*</span> : ''}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 bg-[#BAE8E8] ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#272343] focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Enter your email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block text-md font-bold text-gray-600"
              >
                Password{errors.password ? <span className="text-red-500 ml-1">*</span> : ''}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`mt-1 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 bg-[#BAE8E8] ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#272343] focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="block px-6 mx-auto rounded-md bg-[#2C275C] py-2 font-semibold text-white transition hover:bg-[#1b163e] cursor-pointer"
            >
              Trabaho Na!
            </button>
          </form>

          {/* Extra Links */}
          <p className="mt-6 mb-1 text-center text-sm">
            <a href="/Signup" className="text-[#272343] font-bold underline hover:underline">
              Don’t have an account? Sign up
            </a>
          </p>
          <p className="text-center text-sm">
            <a href="/Forget" className="text-[#272343] font-bold underline hover:underline">
              Forget Password?
            </a>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 justify-center lg:justify-end p-8 lg:items-center">
        <div className="text-center lg:text-right text-[#272343] p-2">
          <h3 className="text-3xl">Welcome Back to</h3>
          <h1 className="text-5xl lg:text-7xl font-inter font-bold mt-5 mb-4 italic text-[#272343] animate-bounce">
            Tara
            <span className="text-yellow-400 drop-shadow-[2px_2px_0px_black] italic">
              Trabaho!
            </span>
          </h1>
          <p className="text-lg mb-4">Sign in to access your dashboard and start your journey with us.</p>
          <h4 className="font-bold">Login With</h4>

          {/* Social Buttons */}
          <div className="flex justify-center lg:justify-end gap-4 mt-4">
            <a
              href="https://www.facebook.com/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition transform duration-200 cursor-pointer"
            >
              <FaFacebookF /> Facebook
            </a>
            <a
              href="https://accounts.google.com/signin"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-gray-800 border hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition transform duration-200 cursor-pointer"
            >
              <FcGoogle /> Gmail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
