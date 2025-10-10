import React, { useState } from "react";

const JobListing = () => {
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: "Software Engineer", 
      location: "Mandaluyong", 
      description: "We are looking for a Software Engineer to develop, combine, and maintain software applications. For new services setting class and efficient code, collaborating with cross-functional teams, and ensuring software quality and performance.", 
      minSalary: 45000,
      maxSalary: 65000,
      availability: 3,
      action: "Edit" 
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    description: "",
    minSalary: "",
    maxSalary: "",
    availability: 1
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const openAddModal = () => {
    setShowAddModal(true);
    setErrors({});
    setSuccessMessage("");
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewJob({ title: "", location: "", description: "", minSalary: "", maxSalary: "", availability: 1 });
    setErrors({});
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers for salary fields
    if ((name === 'minSalary' || name === 'maxSalary') && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setNewJob((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newJob.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (newJob.title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    }

    if (!newJob.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!newJob.description.trim()) {
      newErrors.description = "Description is required";
    } else if (newJob.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!newJob.minSalary) {
      newErrors.minSalary = "Minimum salary is required";
    } else if (parseInt(newJob.minSalary) < 0) {
      newErrors.minSalary = "Minimum salary cannot be negative";
    }

    if (!newJob.maxSalary) {
      newErrors.maxSalary = "Maximum salary is required";
    } else if (parseInt(newJob.maxSalary) < 0) {
      newErrors.maxSalary = "Maximum salary cannot be negative";
    } else if (parseInt(newJob.maxSalary) < parseInt(newJob.minSalary)) {
      newErrors.maxSalary = "Maximum salary must be greater than minimum salary";
    }

    if (newJob.availability < 1) {
      newErrors.availability = "Availability must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveNewJob = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const jobToAdd = {
        id: Date.now(),
        ...newJob,
        minSalary: parseInt(newJob.minSalary),
        maxSalary: parseInt(newJob.maxSalary),
        action: "Edit"
      };
      
      setJobs(prevJobs => [...prevJobs, jobToAdd]);
      setSuccessMessage("Job added successfully!");
      
      // Auto-close modal after success
      setTimeout(() => {
        closeAddModal();
      }, 1500);
      
    } catch (error) {
      setErrors({ general: "Failed to add job. Please try again." });
    }
  };

  const handleActionChange = (jobId, newAction) => {
    try {
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, action: newAction } : job
      ));
    } catch (error) {
      console.error("Error updating job action:", error);
    }
  };

  const deleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        setJobs(jobs.filter(job => job.id !== jobId));
        setSuccessMessage("Job deleted successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrors({ general: "Failed to delete job. Please try again." });
      }
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAddModal();
    }
  };

  // Format availability to remove leading zeros
  const formatAvailability = (availability) => {
    return parseInt(availability, 10);
  };

  // Format salary for display
  const formatSalary = (minSalary, maxSalary) => {
    return `₱${minSalary.toLocaleString()} - ₱${maxSalary.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[30px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Listing Management</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {errors.general}
        </div>
      )}

      {/* Add Job Button */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Job Table - Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm text-green-600 font-medium mt-1">
                  {formatSalary(job.minSalary, job.maxSalary)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  Positions: {formatAvailability(job.availability)}
                </span>
                
                <div className="flex space-x-2">
                  <select 
                    value={job.action}
                    onChange={(e) => handleActionChange(job.id, e.target.value)}
                    className="block px-3 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="Edit">Edit</option>
                    <option value="View">View</option>
                    <option value="Archive">Archive</option>
                  </select>
                  <button 
                    onClick={() => deleteJob(job.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Table - Desktop View */}
      <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatSalary(job.minSalary, job.maxSalary)}
                </td>
                <td className="px-4 py-4 lg:px-6 text-sm text-gray-500 max-w-md">
                  <div className="line-clamp-3">{job.description}</div>
                </td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {formatAvailability(job.availability)}
                  </span>
                </td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select 
                      value={job.action}
                      onChange={(e) => handleActionChange(job.id, e.target.value)}
                      className="block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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

      {/* Add Job Modal - Responsive */}
      {showAddModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-yellow-50 rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl border-2 border-yellow-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Job</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  placeholder="Job Title"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.title 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.location 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              {/* Salary Range Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="minSalary"
                    value={newJob.minSalary}
                    onChange={handleInputChange}
                    placeholder="Min Salary"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.minSalary 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-yellow-400 focus:ring-yellow-500"
                    }`}
                  />
                  {errors.minSalary && (
                    <p className="text-red-500 text-sm mt-1">{errors.minSalary}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="maxSalary"
                    value={newJob.maxSalary}
                    onChange={handleInputChange}
                    placeholder="Max Salary"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.maxSalary 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-yellow-400 focus:ring-yellow-500"
                    }`}
                  />
                  {errors.maxSalary && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxSalary}</p>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.description 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  name="availability"
                  value={newJob.availability}
                  onChange={handleInputChange}
                  placeholder="Available Positions"
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.availability 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.availability && (
                  <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0 mt-6">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={saveNewJob}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors order-1 sm:order-2"
              >
                Save Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;