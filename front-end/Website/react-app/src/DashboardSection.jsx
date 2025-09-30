import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const DashboardSection = () => {
  // Sample data for Job Recommendations
  const jobRecommendations = [
    {
      title: "UI / UX Designer",
      company: "Innovition Solution",
      salary: "₱300-₱400",
    },
    {
      title: "UI / UX Designer",
      company: "Innovition Solution",
      salary: "₱300-₱400",
    },
    {
      title: "UI / UX Designer",
      company: "Innovition Solution",
      salary: "₱300-₱400",
    },
    {
      title: "UI / UX Designer",
      company: "Innovition Solution",
      salary: "₱300-₱400",
    },
    {
      title: "UI / UX Designer",
      company: "Innovition Solution",
      salary: "₱300-₱400",
    },
    {
      title: "UI / UX Designer",
      company: "Innovition Solution",
      salary: "₱300-₱400",
    },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#272343] mb-2">DASHBOARD</h1>
      <p className="text-[#272343] font-bold mb-6">
        Hi there! <span className="wave">👋</span>
        <br />
        Here's your overview for today
      </p>

      {/* Overview cards */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-[#FBDA23] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-sm font-semibold">Application Submitted</div>
          <div className="text-lg font-bold mt-2">5 Application</div>
        </div>
        <div className="flex-1 bg-[#FBDA23] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-sm font-semibold">Resume Generated</div>
          <div className="text-lg font-bold mt-2">4 Resume</div>
        </div>
        <div className="flex-1 bg-[#FBDA23] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-sm font-semibold">Job Matches</div>
          <div className="text-lg font-bold mt-2">3 Matches</div>
        </div>
      </div>

      {/* Job Recommendations */}
      <h2 className="text-xl font-bold text-[#272343] mb-4">Job Recommendation</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobRecommendations.map((job, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-[#272343]">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-green-600">{job.salary}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">
                Apply
              </button>
              <OpenInNewIcon className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSection;
