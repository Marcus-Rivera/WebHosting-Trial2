import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/BG.png";
import LockIcon from "@mui/icons-material/Lock";

const OtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);

  // handle OTP input
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto move to next input
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = () => {
    console.log("OTP Entered:", otp.join(""));
    navigate("/dashboard"); // change to your route
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* OTP Box */}
      <div className="w-full max-w-md bg-[#FFE660] p-10 rounded-3xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <LockIcon fontSize="large" className="text-[#272343]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#272343] mb-2">Enter OTP Code</h2>
        <p className="text-gray-700 text-sm mb-6">
          We have sent the verification code <br /> to your email address
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-14 text-center text-xl font-bold rounded-md border border-gray-400 bg-[#BAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2C275C]"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full bg-[#2C275C] text-white py-2 rounded-md font-semibold hover:bg-[#1b163e] transition"
        >
          Verify Code
        </button>

        {/* Resend */}
        <p className="mt-4 text-sm">
          Didn’t receive the code?{" "}
          <button className="text-blue-600 underline">Resend Code</button>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
