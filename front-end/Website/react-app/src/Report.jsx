import React from 'react';
import HomeAdmin from './HomeAdmin'; // Adjust import path as needed

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-9">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        </div>

        {/* Stats Grid - 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          {/* Daily Users */}
          <div className="bg-white rounded-lg shadow w-[450px] h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Daily Users</h3>
            <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Graph</span>
            </div>
          </div>

          {/* Resumes */}
          <div className="bg-white rounded-lg shadow w-[450px] h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Resumes</h3>
            <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Graph</span>
            </div>
          </div>

          {/* Job Applications */}
          <div className="bg-white rounded-lg shadow w-[450px] h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Job Applications</h3>
            <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Graph</span>
            </div>
          </div>

          {/* Job Matches */}
          <div className="bg-white rounded-lg shadow w-[450px] h-[350px] flex flex-col items-center justify-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Job Matches</h3>
            <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Graph</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
