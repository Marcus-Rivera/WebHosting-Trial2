import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/BG.png";
import { Alert } from "@mui/material";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    gender: "Female",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("error");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.firstname) newErrors.firstname = "Firstname is required";
    if (!form.lastname) newErrors.lastname = "Lastname is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.agree) newErrors.agree = "You must accept Terms of Use";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Combine firstname and lastname into 'name'
        const payload = {
          ...form,
          name: `${form.firstname.trim()} ${form.lastname.trim()}`,
        };

        const response = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.status === "success") {
          setAlertType("success");
          setAlertMsg("User registered successfully!");
          setShowAlert(true);
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setAlertType("error");
          setAlertMsg(result.message || "Registration failed");
          setShowAlert(true);
        }
      } catch (error) {
        setAlertType("error");
        setAlertMsg("Error connecting to server");
        setShowAlert(true);
      }
    } else {
      setAlertType("error");
      setAlertMsg("Please fill out all fields properly");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };


  return (
    <div
      className="flex flex-col lg:flex-row bg-cover min-h-screen lg:items-center pt-5 pb-5 lg:pt-10 lg:pb-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert severity={alertType}>{alertMsg}</Alert>
        </div>
      )}

      {/* Welcome Section */}
      <div className="flex w-full lg:w-2/3 items-center justify-center p-3 mx-auto">
        <div className="flex w-full lg:w-1/2 justify-center items-center">
          <div className="text-[#272343] p-2">
            <h3 className="text-3xl font-inter font-bold">Welcome To</h3>
            <h1 className="text-5xl lg:text-7xl text-center font-inter font-bold mt-10 mb-2 italic text-[#272343] animate-bounce">
              Tara
              <span className="text-yellow-400 drop-shadow-[2px_2px_0px_black] italic">
                Trabaho!
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="flex w-full lg:w-2/3 items-center justify-center p-7">
        <div className="w-full max-w-2xl rounded-3xl bg-[#FFE660] p-10 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Firstname & Lastname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                placeholder="Firstname"
                className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
              />
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                placeholder="Lastname"
                className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
              />
            </div>

            {/* Birthday & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700">Birthday:</label>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  className="flex-1 rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700">Gender:</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="flex-1 rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
              />
            </div>

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full rounded-md border border-gray-400 p-2 bg-[#BAE8E8]"
            />

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <p>
                By clicking <span className="font-bold">"Sign Up"</span> I agree
                that I have read and accept the{" "}
                <a href="#" className="text-blue-600 underline">
                  Terms of Use
                </a>
                .
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-[#2C275C] py-2 font-semibold text-white hover:bg-[#1b163e] transition"
            >
              Sign Up
            </button>

            {/* Login link */}
            <p className="mt-4 text-center text-sm text-gray-700">
              Already have an Account?{" "}
              <a href="/login" className="text-blue-600 underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
