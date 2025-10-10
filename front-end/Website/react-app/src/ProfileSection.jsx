import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import SkillsSection from "./SkillsSections";
import { useSessionCheck } from "../useSessionCheck";
import SessionExpiredModal from "../SessionExpiredModal";

const ProfileSection = () => {
  const { userData, loading, sessionError } = useSessionCheck();

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-[#272343]">
        <h2>Loading profile...</h2>
      </main>
    );
  }

  if (sessionError) return <SessionExpiredModal />;

  if (!userData) return null;


  return (
    <main className="flex-1 lg:p-8 bg-white overflow-y-auto">
      <h1 className="text-2xl font-bold text-center text-[#272343] mb-6">
        PROFILE
      </h1>

      <div className="bg-[rgba(251,218,35,0.39)] rounded-[40px] p-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Profile Info */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
            <PersonIcon className="text-gray-600" style={{ fontSize: 80 }} />
          </div>
          <h2 className="mt-4 text-xl text-[#272343] font-bold">Rebecca Oscar</h2>
          <p className="text-sm text-[#272343] font-semibold">
            Rebecca@gmail.com
          </p>
          <p className="text-sm text-[#6E090B] font-bold">UI Designer</p>
          
          {/* Skills Section */}
          <SkillsSection />
        </div>

        {/* Right Form */}
        <div className="flex-1">
          {/* Basic Info */}
          <h3 className="font-bold italic text-lg text-[#272343]">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-[#272343]">
            <div>
              <label className="block text-sm font-semibold">Firstname:</label>
              <input
                type="text"
                defaultValue="Rebecca"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Lastname:</label>
              <input
                type="text"
                defaultValue="Oscar"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Gender:</label>
              <input
                type="text"
                defaultValue="Female"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Birthday:</label>
              <input
                type="text"
                defaultValue="May 15, 1999"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Address:</label>
              <input
                type="text"
                defaultValue="Ever Gotesco Commonwealth"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Phone #:</label>
              <input
                type="text"
                defaultValue="0999-888-888"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
          </div>

          {/* Bio & Certification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-[#272343]">
            <div>
              <h3 className="font-bold italic">BIO</h3>
              <textarea
                defaultValue="I am good at User Interface"
                className="w-full border px-2 py-1 h-24 bg-white"
              />
            </div>
            <div>
              <h3 className="font-bold italic">Certification</h3>
              <textarea
                defaultValue="Manual Typing"
                className="w-full border px-2 py-1 h-24 bg-white"
              />
            </div>
          </div>

          {/* Degree */}
          <h3 className="font-bold italic mt-6">Degree</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-semibold">Senior HighSchool:</label>
              <input
                type="text"
                defaultValue="STEM"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">UnderGraduate:</label>
              <input
                type="text"
                defaultValue="BSIT"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">PostGraduate:</label>
              <input
                type="text"
                defaultValue="BSMIT"
                className="w-full border px-2 py-1 bg-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-2 bg-[#272343] text-white rounded-xl cursor-pointer">
              Save
            </button>
            <button className="px-6 py-2 bg-[#272343] text-white rounded-xl cursor-pointer">
              Edit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSection;