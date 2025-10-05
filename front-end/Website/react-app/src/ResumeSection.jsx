import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";

const allResumes = [
  { name: "Resumes 1", date: "2024-01-12" },
  { name: "Resumes 2", date: "2024-02-18" },
  { name: "Resumes 3", date: "2024-03-25" },
  { name: "Resumes 4", date: "2024-05-10" },
];

const ResumeSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // Filter resumes based on search term
  const filteredResumes = allResumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <div className="flex-1 p-5 pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-[#272343]">Resumes</h2>
          <p className="text-[#272343]/77 text-sm">You Have Resumes Available!</p>
        </div>

        {/* Search */}
        <div className="flex items-center border border-black px-1 lg:px-3 py-2 rounded ">
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm flex-1 pr-2 font-bold text-[#272343]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="text-gray-700 flex-shrink-0" />
        </div>
      </div>

      {/* Resume List */}
      <div className="flex flex-col gap-4">
        {filteredResumes.length > 0 ? (
          filteredResumes.map((resume, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#E6F6F6] border rounded px-4 py-3 relative"
            >
              <div className="flex items-center gap-3">
                <DescriptionIcon className="text-black" />
                <span className="font-semibold text-sm md:text-lg text-[#272343]">
                  {resume.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{resume.date}</span>

                {/* Triple dot menu */}
                <button onClick={() => toggleMenu(index)}>
                  <MoreVertIcon className="text-gray-700 cursor-pointer" />
                </button>

                {/* Dropdown Menu */}
                {openMenu === index && (
                  <div className="absolute right-4 top-12 bg-white shadow-lg border rounded w-28 z-10">
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer">
                      Edit
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No resumes found.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeSection;
