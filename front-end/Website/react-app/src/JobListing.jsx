import React, { useState, useEffect } from "react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    description: "",
    min_salary: "",
    max_salary: "",
    availability: 1
  });
  const [editingJob, setEditingJob] = useState({
    id: "",
    title: "",
    location: "",
    description: "",
    min_salary: "",
    max_salary: "",
    availability: 1
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch jobs from backend on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();

        // Format data for frontend consistency
        const formattedJobs = data.map((job) => ({
          id: job.job_id,
          title: job.title,
          location: job.location,
          description: job.description,
          min_salary: job.min_salary,
          max_salary: job.max_salary,
          availability: job.availability,
          action: "Edit" 
        }));

        setJobs(formattedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper formatters
  const formatSalary = (min, max) =>
    `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;

  const formatAvailability = (a) => parseInt(a, 10);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading jobs...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">{error}</div>
    );
  }

  const openAddModal = () => {
    setShowAddModal(true);
    setErrors({});
    setSuccessMessage("");
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewJob({ title: "", location: "", description: "", min_salary: "", max_salary: "", availability: 1 });
    setErrors({});
    setSuccessMessage("");
  };

  // Open edit modal and populate with job data (convert to lowercase)
  const openEditModal = (job) => {
    setEditingJob({
      id: job.id,
      title: job.title.toLowerCase(),        // Convert to lowercase
      location: job.location.toLowerCase(),  // Convert to lowercase
      description: job.description.toLowerCase(), // Convert to lowercase
      min_salary: job.min_salary.toString(),
      max_salary: job.max_salary.toString(),
      availability: job.availability
    });
    setShowEditModal(true);
    setErrors({});
    setSuccessMessage("");
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingJob({
      id: "",
      title: "",
      location: "",
      description: "",
      min_salary: "",
      max_salary: "",
      availability: 1
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers for salary fields
    if ((name === 'min_salary' || name === 'max_salary') && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setNewJob((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle edit form input changes
const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  
  // Only allow numbers for salary fields
  if ((name === 'min_salary' || name === 'max_salary') && value !== '' && !/^\d+$/.test(value)) {
    return;
  }
  
  setEditingJob(prev => ({ ...prev, [name]: value }));
  
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

    if (!newJob.min_salary) {
      newErrors.min_salary = "Minimum salary is required";
    } else if (parseInt(newJob.min_salary) < 0) {
      newErrors.min_salary = "Minimum salary cannot be negative";
    }

    if (!newJob.max_salary) {
      newErrors.max_salary = "Maximum salary is required";
    } else if (parseInt(newJob.max_salary) < 0) {
      newErrors.max_salary = "Maximum salary cannot be negative";
    } else if (parseInt(newJob.max_salary) < parseInt(newJob.min_salary)) {
      newErrors.max_salary = "Maximum salary must be greater than minimum salary";
    }

    if (newJob.availability < 1) {
      newErrors.availability = "Availability must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};

    if (!editingJob.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (editingJob.title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    }

    if (!editingJob.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!editingJob.description.trim()) {
      newErrors.description = "Description is required";
    } else if (editingJob.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!editingJob.min_salary) {
      newErrors.min_salary = "Minimum salary is required";
    } else if (parseInt(editingJob.min_salary) < 0) {
      newErrors.min_salary = "Minimum salary cannot be negative";
    }

    if (!editingJob.max_salary) {
      newErrors.max_salary = "Maximum salary is required";
    } else if (parseInt(editingJob.max_salary) < 0) {
      newErrors.max_salary = "Maximum salary cannot be negative";
    } else if (parseInt(editingJob.max_salary) < parseInt(editingJob.min_salary)) {
      newErrors.max_salary = "Maximum salary must be greater than minimum salary";
    }

    if (editingJob.availability < 1) {
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
        min_salary: parseInt(newJob.min_salary),
        max_salary: parseInt(newJob.max_salary),
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

  // Save edited job (all values already in lowercase)
  const saveEditedJob = () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      const updatedJob = {
        ...editingJob,
        min_salary: parseInt(editingJob.min_salary),
        max_salary: parseInt(editingJob.max_salary),
        action: "Edit"
      };
      
      setJobs(jobs.map(job => job.id === editingJob.id ? updatedJob : job));
      setSuccessMessage("Job updated successfully!");
      
      // Auto-close modal after success
      setTimeout(() => {
        closeEditModal();
      }, 1500);
      
    } catch (error) {
      setErrors({ general: "Failed to update job. Please try again." });
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
      closeEditModal();
    }
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
                  {formatSalary(job.min_salary, job.max_salary)}
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
                  {/* Changed from dropdown to buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => openEditModal(job)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleActionChange(job.id, "View")}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleActionChange(job.id, "Archive")}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-xs"
                    >
                      Archive
                    </button>
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
                    >
                      Delete
                    </button>
                  </div>
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
                  <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {formatSalary(job.min_salary, job.max_salary)}
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
                    {/* Changed from dropdown to buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => openEditModal(job)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleActionChange(job.id, "View")}
                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleActionChange(job.id, "Archive")}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-xs"
                      >
                        Archive
                      </button>
                      <button 
                        onClick={() => deleteJob(job.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
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
                    name="min_salary"
                    value={newJob.min_salary}
                    onChange={handleInputChange}
                    placeholder="Min Salary"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.min_salary 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-yellow-400 focus:ring-yellow-500"
                    }`}
                  />
                  {errors.min_salary && (
                    <p className="text-red-500 text-sm mt-1">{errors.min_salary}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="max_salary"
                    value={newJob.max_salary}
                    onChange={handleInputChange}
                    placeholder="Max Salary"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.max_salary 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-yellow-400 focus:ring-yellow-500"
                    }`}
                  />
                  {errors.max_salary && (
                    <p className="text-red-500 text-sm mt-1">{errors.max_salary}</p>
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

      {/* Edit Job Modal - Responsive */}
      {showEditModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-yellow-50 rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl border-2 border-yellow-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Job</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={editingJob.title}
                  onChange={handleEditInputChange}
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
                  value={editingJob.location}
                  onChange={handleEditInputChange}
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
                    name="min_salary"
                    value={editingJob.min_salary}
                    onChange={handleEditInputChange}
                    placeholder="Min Salary"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.min_salary 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-yellow-400 focus:ring-yellow-500"
                    }`}
                  />
                  {errors.min_salary && (
                    <p className="text-red-500 text-sm mt-1">{errors.min_salary}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="max_salary"
                    value={editingJob.max_salary}
                    onChange={handleEditInputChange}
                    placeholder="Max Salary"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.max_salary 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-yellow-400 focus:ring-yellow-500"
                    }`}
                  />
                  {errors.max_salary && (
                    <p className="text-red-500 text-sm mt-1">{errors.max_salary}</p>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  name="description"
                  value={editingJob.description}
                  onChange={handleEditInputChange}
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
                  value={editingJob.availability}
                  onChange={handleEditInputChange}
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
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedJob}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors order-1 sm:order-2"
              >
                Update Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;