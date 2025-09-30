import { useState } from "react";
import bg from './assets/BG.png';
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
      
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Email:", email, "Password:", password);
      setShowAlert(false);
      navigate("/home");
      // API call here
    }
    else
    {
       setShowAlert(true); // show alert if errors
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row bg-cover min-h-screen lg:items-center pt-12 pb-35 lg:pt-10 lg:pb-10" style={{ backgroundImage: `url(${bg})` }}>
      {/* Login Panel */}

      {/* Alert if no inputs */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert severity="error">Please enter your email and password</Alert>
        </div>
      )}

      <div className="flex w-full lg:w-2/3 items-center justify-center p-7">
      {/* Login Box */}
        <div className="w-full max-w-md rounded-4xl bg-[#FFE660] p-8 shadow-lg">
          
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800">
            Login 
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-md font-bold font-inter text-gray-600 ">Email</label>
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
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-md font-bold text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 w-full rounded-lg border-[#272343] border p-2 focus:outline-none focus:ring-2 bg-[#BAE8E8] ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : " focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="block px-6 mx-auto rounded-md bg-[#2C275C] py-2 font-semibold text-white transition hover:bg-[#1b163e]"
            >
              Trabaho Na!
            </button>
          </form>

          {/* Extra Links */}
          <p className="mt-6 text-center text-sm text-gray-600">
    
            <a href="/Signup" className="text-black font-bold underline hover:underline">
              Don’t have an account? Sign up
            </a>
          </p>
        </div>
      </div>
      {/* Welcome Back Panel */}
      <div
        className="flex w-full lg:w-1/2 justify-center lg:justify-end p-8 lg:items-center">
        <div className="text-center lg:text-right  text-[#272343] p-2">
          <h3 className="text-3xl">Welcome Back to</h3>
          <h1 className="text-5xl xl:text-7xl font-inter font-bold mb-4">TaraTRABAHO</h1>
          <p className="text-lg mb-4">
            Sign in to access your dashboard and start your journey with us.
          </p>
          <h4 className="font-bold ">Login With</h4>

          {/* Social Buttons */}
          <div className="flex  justify-center lg:justify-end gap-4 mt-4">
            {/* Facebook Login */}
            <a
              href="https://www.facebook.com/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition transform duration-200 cursor-pointer"
            >
              <FaFacebookF /> Facebook
            </a>

            {/* Google Login */}
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
