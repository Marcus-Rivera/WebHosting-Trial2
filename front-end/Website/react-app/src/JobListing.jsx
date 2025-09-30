import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const JobListing = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Sample job data
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: "Software Engineer", 
      location: "Mandaluyong", 
      description: "We are looking for a Software Engineer to develop, combine, and maintain software applications. For new services setting class and efficient code, collaborating with cross-functional teams, and ensuring software quality and performance.", 
      availability: 3,
      action: "Edit" 
    },
  ]);

  // State for popup modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    description: "",
    availability: 0
  });

  // Open add job modal
  const openAddModal = () => {
    setShowAddModal(true);
  };

  // Close add job modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewJob({
      title: "",
      location: "",
      description: "",
      availability: 0
    });
  };

  // Handle overlay click (click outside modal)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAddModal();
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save new job
  const saveNewJob = () => {
    if (newJob.title && newJob.location && newJob.description) {
      const jobToAdd = {
        id: jobs.length + 1,
        ...newJob,
        action: "Edit"
      };
      setJobs([...jobs, jobToAdd]);
      closeAddModal();
    } else {
      alert("Please fill in all fields");
    }
  };

  // Handle action change
  const handleActionChange = (jobId, newAction) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, action: newAction } : job
    ));
  };

  // Delete job function
  const deleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation - Same as ManageUser */}
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        {/* Logo */}
        <a href="#" className="mx-auto">
          <img
            className="w-auto h-6 sm:h-7"
            src="https://merakiui.com/images/full-logo.svg"
            alt=""
          />
        </a>

        {/* Profile */}
        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            alt="avatar"
          />
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">Admin</h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">admin@example.com</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {/* Manage Users */}
            <a
              className={`flex items-center px-4 py-2 mt-5 rounded-lg transition-colors duration-300 ${
                isActive("/ManageUser") ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              href="/ManageUser"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14C..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mx-4 font-medium">Manage Users</span>
            </a>

            {/* Job Listing - Active */}
            <a
              className={`flex items-center px-4 py-2 mt-5 rounded-lg transition-colors duration-300 ${
                isActive("/JobListing") ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              href="/JobListing"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5V..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mx-4 font-medium">Job Listing</span>
            </a>

            {/* Reports */}
            <a
              className={`flex items-center px-4 py-2 mt-5 rounded-lg transition-colors duration-300 ${
                isActive("/reports") ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              href="/reports"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.3246 4.3..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12C..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mx-4 font-medium">Reports</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content - Job Listing Management */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Job Listing Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Admin can add, edit, or remove job listing in the system</p>

          {/* Add Job Button */}
          <div className="mb-6 flex justify-end">
            <button 
              onClick={openAddModal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Job
            </button>
          </div>

          {/* Job Table */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-green-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Job title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-md">
                      <div className="line-clamp-3">{job.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                        {job.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <select 
                          value={job.action}
                          onChange={(e) => handleActionChange(job.id, e.target.value)}
                          className="block px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        >
                          <option value="Edit">Edit</option>
                          <option value="View">View</option>
                          <option value="Archive">Archive</option>
                        </select>
                        <button 
                          onClick={() => deleteJob(job.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Logout Button */}
          <div className="mt-8">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300">
              Logout
            </button>
          </div>
        </div>
      </main>

      {/* Add Job Modal/Popup */}
      {showAddModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Job</h2>
            
            <div className="space-y-4">
              {/* Job Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter job title"
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter location"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter job description"
                />
              </div>

              {/* Availability Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Availability
                </label>
                <input
                  type="number"
                  name="availability"
                  value={newJob.availability}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter number of positions"
                  min="0"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={saveNewJob}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;