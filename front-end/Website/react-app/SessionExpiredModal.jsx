import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Displays a modal popup for session expiration or admin access denial.
 * 
 * @param {Object} props
 * @param {"session" | "admin"} props.errorType - Determines which message to show.
 */
const SessionExpiredModal = ({ errorType = "session" }) => {
  const navigate = useNavigate();

  // Define title and message dynamically based on error type
  const modalContent =
    errorType === "admin"
      ? {
          title: "Access Denied",
          message:
            "You do not have permission to access the admin panel. Redirecting to login...",
        }
      : {
          title: "Session Expired",
          message: "Your session has expired. Redirecting to login...",
        };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center w-80">
        <h2 className="text-lg font-bold text-[#6E090B] mb-3">
          {modalContent.title}
        </h2>
        <p className="text-sm text-[#272343] mb-4">{modalContent.message}</p>
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
