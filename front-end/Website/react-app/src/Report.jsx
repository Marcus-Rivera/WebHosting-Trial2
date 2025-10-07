import React from 'react';
import HomeAdmin from './HomeAdmin'; // Adjust import path as needed

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Daily Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Users</h3>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Graph Placeholder</span>
            </div>
          </div>

          {/* Resumes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumes</h3>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Graph Placeholder</span>
            </div>
          </div>

          {/* Job Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Job Applications</h3>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Graph Placeholder</span>
            </div>
          </div>
        </div>

        {/* Job Matches */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Job Matches per Category</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Graph Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;