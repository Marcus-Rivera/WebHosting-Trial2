import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Displays a modal popup for expired sessions.
 * Redirects user to login when dismissed.
 */
const SessionExpiredModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center w-80">
        <h2 className="text-lg font-bold text-[#6E090B] mb-3">
          Session Expired
        </h2>
        <p className="text-sm text-[#272343] mb-4">
          Your session has expired. Redirecting to login...
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-[#272343] text-white rounded-md"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
