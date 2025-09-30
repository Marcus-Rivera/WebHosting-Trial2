import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import GridViewIcon from "@mui/icons-material/GridView";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import SkillsSection from "./SkillsSections";
import DashboardSection from "./DashboardSection";
import ProfileSection from "./ProfileSection";
import { href } from "react-router-dom";

const SidebarContent = ({ active, setActive }) => (
  <div className="flex flex-col w-64 h-full px-4 py-8 overflow-y-auto bg-white dark:bg-[#BAE8E8] dark:border-gray-700">
    {/* Logo */}
    {/* <a href="#" className="mx-auto">
      <img
        className="w-auto h-6 sm:h-7"
        src="https://merakiui.com/images/full-logo.svg"
        alt="logo"
      />
    </a> */}

    {/* Profile */}
    <div className="flex flex-col items-center mt-6 -mx-2">
      <img
        className="object-cover w-32 h-32 mx-2 rounded-full"
        src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80"
        alt="avatar"
      />
      <h4 className="mx-2 mt-4 text-xl font-bold font-inter text-[#272343] dark:text-[#272343]">
        Rebecca Oscar
      </h4>
    </div>

    {/* Navigation */}
    <div className="flex flex-col justify-between flex-1 mt-6">
      <nav>
        <a
          onClick={() => setActive("profile")}
          className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
            active === "profile"
              ? "bg-[#FBDA23] text-[#272343] font-bold"
              : "text-[#272343] hover:bg-[#FBDA23]/38 hover:text-gray-700"
          }`}
        >
          <PersonIcon className="w-5 h-5" />
          <span className="mx-4 font-bold">Profile Setup</span>
        </a>

        <a
          onClick={() => setActive("dashboard")}
   
          className={`flex items-center px-4 py-2 mt-5 rounded-lg cursor-pointer ${
            active === "dashboard" && <DashboardSection/>
              ? "bg-[#FBDA23] text-[#272343] font-bold"
              : "text-[#272343] hover:bg-[#FBDA23]/38 hover:text-gray-700"
            
          }`}
        >
          <GridViewIcon className="w-5 h-5" />
          <span className="mx-4 font-bold">Dashboard</span>
        </a>

        <a
          onClick={() => setActive("careerbot")}
          className={`flex items-center px-4 py-2 mt-5 rounded-lg cursor-pointer ${
            active === "careerbot"
              ? "bg-[#FBDA23] text-[#272343] font-bold"
              : "text-[#272343] hover:bg-[#FBDA23]/38 hover:text-gray-700"
          }`}
        >
          <WorkOutlineOutlinedIcon className="w-5 h-5" />
          <span className="mx-4 font-bold">Career Bot</span>
        </a>

        <a
          onClick={() => setActive("resumes")}
          className={`flex items-center px-4 py-2 mt-5 rounded-lg cursor-pointer ${
            active === "resumes"
              ? "bg-[#FBDA23] text-[#272343] font-bold"
              : "text-[#272343] hover:bg-[#FBDA23]/38 hover:text-gray-700"
          }`}
        >
          <AssignmentIndIcon className="w-5 h-5" />
          <span className="mx-4 font-bold">Resumes</span>
        </a>
      </nav>

      {/* Logout */}
      <div className="mt-8">
        <a
          onClick={() => alert("Logging out...")}
          className="flex items-center px-4 py-2 text-[#272343] rounded-lg cursor-pointer hover:bg-red-100"
          href="/login"
        >
          <LogoutIcon className="w-5 h-5" />
          <span className="mx-4 font-bold">Logout</span>
        </a>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("profile"); // default active item

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile toggle button */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SidebarContent active={active} setActive={setActive} />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: { width: "260px", backgroundColor: "#fff" },
        }}
      >
        <SidebarContent active={active} setActive={setActive} />
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white overflow-y-auto">
         {active === "profile" && <ProfileSection />}
         {active === "dashboard" && <DashboardSection />}
        
      </main>
    </div>
  );
};

export default Home;
