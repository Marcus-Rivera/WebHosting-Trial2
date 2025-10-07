import React, { useState } from "react";

const JobListing = () => {
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    description: "",
    availability: 0
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
    setNewJob({ title: "", location: "", description: "", availability: 0 });
    setErrors({});
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

    if (newJob.availability < 0) {
      newErrors.availability = "Availability cannot be negative";
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
        id: Date.now(), // Use timestamp for better unique IDs
        ...newJob,
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

  return (
    <div className="max-w-6xl mx-auto">
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

      {/* Job Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                  <div className="line-clamp-3">{job.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {job.availability}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select 
                      value={job.action}
                      onChange={(e) => handleActionChange(job.id, e.target.value)}
                      className="block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

      {/* Add Job Modal - No Dark Background */}
      {showAddModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-yellow-50 rounded-lg p-6 w-full max-w-md shadow-xl border-2 border-yellow-200"
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
                  placeholder="Availability"
                  min="0"
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

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveNewJob}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
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