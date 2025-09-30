import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from '@mui/icons-material/Star';

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
        <div className="flex-1 bg-[#FFE660] rounded-4xl p-4 flex items-center gap-3">
          <div className="bg-[#BAE8E8] p-3 rounded-lg flex items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className="text-black flex-shrink-0"
              >
                <path
                  fill="currentColor"
                  d="M11 20v2H3c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v8.1l-.2-.2c-.5-.5-1.1-.8-1.8-.8V6H3v14zm10.4-6.7l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2s.3.1.4.2m-.3 3.6l-6 6.1H13v-2.1l6.1-6.1z"
                />
              </svg>
            </div>
            {/* Text block */}
            <div className="flex flex-col">
              <div className="text-2xl font-bold mt-1 text-[#272343]">5 Application</div>
              <div className="text-sm font-semibold text-[#272343]/77">Application Submitted</div>
          </div>
        </div>
        <div className="flex-1 bg-[#FFE660] rounded-4xl p-4 flex items-center gap-3">
          <div className="bg-[#BAE8E8] p-3 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 16 16"
              className="text-black flex-shrink-0"
            >
              <path
                fill="currentColor"
                d="M8 4.5A1.25 1.25 0 1 0 8 2a1.25 1.25 0 0 0 0 2.5"
              />
              <path
                fill="currentColor"
                d="M8 4.5c.597 0 1.13.382 1.32.949l.087.26a.22.22 0 0 1-.21.291h-2.39a.222.222 0 0 1-.21-.291l.087-.26a1.39 1.39 0 0 1 1.32-.949zm-3 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m.5 1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M2.33 1.64c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16a3.02 3.02 0 0 0 1.31 1.31c.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327a3 3 0 0 0 1.31-1.31c.327-.642.327-1.48.327-3.16V4.8c0-1.68 0-2.52-.327-3.16A3 3 0 0 0 12.36.33C11.718.003 10.88.003 9.2.003H6.8c-1.68 0-2.52 0-3.16.327a3.02 3.02 0 0 0-1.31 1.31m6.87-.638H6.8c-.857 0-1.44 0-1.89.038c-.438.035-.663.1-.819.18a2 2 0 0 0-.874.874c-.08.156-.145.38-.18.819c-.037.45-.038 1.03-.038 1.89v6.4c0 .857.001 1.44.038 1.89c.036.438.101.663.18.819c.192.376.498.682.874.874c.156.08.381.145.819.18c.45.036 1.03.037 1.89.037h2.4c.857 0 1.44 0 1.89-.037c.438-.036.663-.101.819-.18c.376-.192.682-.498.874-.874c.08-.156.145-.381.18-.82c.037-.45.038-1.03.038-1.89v-6.4c0-.856-.001-1.44-.038-1.89c-.036-.437-.101-.662-.18-.818a2 2 0 0 0-.874-.874c-.156-.08-.381-.145-.819-.18c-.45-.037-1.03-.038-1.89-.038"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col">
          <div className="text-2xl font-bold mt-1 text-[#272343]">4 Resume</div>
              <div className="text-sm font-semibold text-[#272343]/77">Resume Generated</div>
          </div>
        </div>
        <div className="flex-1 bg-[#FFE660] rounded-4xl p-4 flex items-center gap-3">
          <div className="bg-[#BAE8E8] p-3 rounded-lg flex items-center justify-center">
            <StarIcon className="text-[#272343]" style={{ fontSize: 33 }} />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold mt-1 text-[#272343]">3 Matches</div>
            <div className="text-sm font-semibold text-[#272343]/77">Job Matches</div>
          </div>
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
