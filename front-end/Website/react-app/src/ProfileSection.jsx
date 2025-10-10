import React, { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SkillsSection from "./SkillsSections";
import { useSessionCheck } from "../useSessionCheck";
import SessionExpiredModal from "../SessionExpiredModal";
import { Alert } from "@mui/material";

const ProfileSection = () => {
  const { userData, loading, sessionError } = useSessionCheck();
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    birthday: "",
    address: "",
    phone: "",
    bio: "",
    certification: "",
    seniorHigh: "",
    undergraduate: "",
    postgraduate: "",
  });

  const [originalData, setOriginalData] = useState({});

  // Initialize original data when component mounts
  useEffect(() => {
    setOriginalData(formData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save logic - for now just update state
    setAlertType("success");
    setAlertMsg("Profile updated successfully!");
    setShowAlert(true);
    setOriginalData(formData);
    setIsEditing(false);
    setTimeout(() => setShowAlert(false), 3000);
    
    // TODO: Add backend API call here when ready
    console.log("Profile data to save:", formData);
  };

  const handleCancel = () => {
    // Restore original data
    setFormData(originalData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-[#272343]">
        <h2>Loading profile...</h2>
      </main>
    );
  }

  if (sessionError) return <SessionExpiredModal />;

  if (!userData) return null;

  const inputClassName = isEditing
    ? "w-full border border-gray-300 px-3 py-2 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBDA23] transition-all"
    : "w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed";

  const textareaClassName = isEditing
    ? "w-full border border-gray-300 px-3 py-2 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBDA23] transition-all resize-none"
    : "w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed resize-none";

  return (
    <main className="flex-1 lg:p-8 bg-white overflow-y-auto">
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert severity={alertType}>{alertMsg}</Alert>
        </div>
      )}

      <h1 className="text-2xl font-bold text-center text-[#272343] mb-6">
        PROFILE
      </h1>

      <div className="bg-[rgba(251,218,35,0.39)] rounded-[40px] p-8 flex flex-col md:flex-row gap-8">
        {/* Left Profile Info */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center relative group">
            <PersonIcon className="text-gray-500" style={{ fontSize: 80 }} />
            {isEditing && (
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <EditIcon className="text-white" style={{ fontSize: 30 }} />
              </div>
            )}
          </div>
          <h2 className="mt-4 text-xl text-[#272343] font-bold">
            {formData.firstname && formData.lastname 
              ? `${formData.firstname} ${formData.lastname}` 
              : "Your Name"}
          </h2>
          <p className="text-sm text-[#272343] font-semibold">
            {userData?.email || "your.email@example.com"}
          </p>
          <p className="text-sm text-[#6E090B] font-bold">UI Designer</p>

          {/* Skills Section */}
          <SkillsSection />
        </div>

        {/* Right Form */}
        <div className="flex-1">
          {/* Edit Mode Indicator */}
          {isEditing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <EditIcon className="text-blue-600" />
              <span className="text-sm text-blue-700 font-semibold">
                Editing Mode - Make your changes and click Save
              </span>
            </div>
          )}

          {/* Basic Info */}
          <h3 className="font-bold italic text-lg text-[#272343]">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-[#272343]">
            <div>
              <label className="block text-sm font-semibold mb-1">Firstname:</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your firstname"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Lastname:</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your lastname"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClassName}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Birthday:</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your address"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone #:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., +63 912 345 6789"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Bio & Certification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-[#272343]">
            <div>
              <h3 className="font-bold italic mb-1">BIO</h3>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className={`${textareaClassName} h-24`}
              />
            </div>
            <div>
              <h3 className="font-bold italic mb-1">Certification</h3>
              <textarea
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="List your certifications..."
                className={`${textareaClassName} h-24`}
              />
            </div>
          </div>

          {/* Degree */}
          <h3 className="font-bold italic mt-6 mb-1">Degree</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Senior HighSchool:
              </label>
              <input
                type="text"
                name="seniorHigh"
                value={formData.seniorHigh}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="School name"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">UnderGraduate:</label>
              <input
                type="text"
                name="undergraduate"
                value={formData.undergraduate}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Degree & University"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">PostGraduate:</label>
              <input
                type="text"
                name="postgraduate"
                value={formData.postgraduate}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Degree & University"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:scale-105 font-semibold"
                >
                  <SaveIcon />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all hover:scale-105 font-semibold"
                >
                  <CancelIcon />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-2 bg-[#272343] text-white rounded-xl hover:bg-[#1b163e] transition-all hover:scale-105 font-semibold"
              >
                <EditIcon />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSection;