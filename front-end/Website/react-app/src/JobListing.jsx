import React, { useState, useEffect } from "react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All Types");
  const [savedJobs, setSavedJobs] = useState([]);
  
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    skills: "",
    description: "",
    min_salary: "",
    max_salary: "",
    availability: 1
  });

  const [editingJob, setEditingJob] = useState({
    id: "",
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    skills: "",
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
          company: job.company || "Tech Solutions Inc.",
          location: job.location,
          job_type: job.job_type || "Full-time",
          skills: job.skills ? job.skills.split(',') : ["React", "TypeScript", "Tailwind CSS"],
          description: job.description,
          min_salary: job.min_salary,
          max_salary: job.max_salary,
          availability: job.availability,
          posted_date: job.posted_date || "2 days ago",
          isSaved: false
        }));

        setJobs(formattedJobs);
        setFilteredJobs(formattedJobs);
        
        // Load saved jobs from localStorage
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSavedJobs(saved);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (jobTypeFilter !== "All Types") {
      filtered = filtered.filter(job => job.job_type === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  // Helper formatters
  const formatSalary = (min, max) =>
    `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;

  const formatAvailability = (a) => parseInt(a, 10);

  // Toggle save job
  const toggleSaveJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    let updatedSavedJobs;
    const isCurrentlySaved = savedJobs.some(savedJob => savedJob.id === jobId);

    if (isCurrentlySaved) {
      updatedSavedJobs = savedJobs.filter(savedJob => savedJob.id !== jobId);
    } else {
      updatedSavedJobs = [...savedJobs, job];
    }

    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));

    // Update jobs with saved status
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId
          ? { ...job, isSaved: !isCurrentlySaved }
          : job
      )
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setJobTypeFilter("All Types");
  };

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
    setNewJob({ 
      title: "", 
      company: "",
      location: "", 
      job_type: "Full-time",
      skills: "",
      description: "", 
      min_salary: "", 
      max_salary: "", 
      availability: 1 
    });
    setErrors({});
    setSuccessMessage("");
  };

  // Open view modal
  const openViewModal = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedJob(null);
  };

  // Open edit modal and populate with job data
  const openEditModal = (job) => {
    setEditingJob({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      job_type: job.job_type,
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills,
      description: job.description,
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
      company: "",
      location: "",
      job_type: "Full-time",
      skills: "",
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

    if (!newJob.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!newJob.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!newJob.skills.trim()) {
      newErrors.skills = "Skills are required";
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

    if (!editingJob.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!editingJob.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!editingJob.skills.trim()) {
      newErrors.skills = "Skills are required";
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
        skills: newJob.skills.split(',').map(skill => skill.trim()),
        min_salary: parseInt(newJob.min_salary),
        max_salary: parseInt(newJob.max_salary),
        posted_date: "Just now",
        isSaved: false
      };
      
      setJobs(prevJobs => [...prevJobs, jobToAdd]);
      setFilteredJobs(prevJobs => [...prevJobs, jobToAdd]);
      setSuccessMessage("Job added successfully!");
      
      // Auto-close modal after success
      setTimeout(() => {
        closeAddModal();
      }, 1500);
      
    } catch (error) {
      setErrors({ general: "Failed to add job. Please try again." });
    }
  };

  // Save edited job
  const saveEditedJob = async () => {
    if (!validateEditForm()) return;

    try {
      const updatedJob = {
        ...editingJob,
        skills: editingJob.skills.split(',').map(skill => skill.trim()),
        min_salary: parseInt(editingJob.min_salary),
        max_salary: parseInt(editingJob.max_salary),
      };
      
      setJobs(jobs.map(job => job.id === editingJob.id ? { ...job, ...updatedJob } : job));
      setFilteredJobs(filteredJobs.map(job => job.id === editingJob.id ? { ...job, ...updatedJob } : job));
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
        setFilteredJobs(filteredJobs.filter(job => job.id !== jobId));
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
      closeViewModal();
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

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search jobs or companies...
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Search jobs or companies..."
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Filter by location"
            />
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="All Types">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Results and Clear Filters */}
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            CLEAR FILTERS
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className={`px-4 py-2 font-medium ${savedJobs.length === 0 ? 'text-gray-500' : 'text-blue-600 border-b-2 border-blue-600'}`}>
          ALL JOBS
        </button>
        <button className={`px-4 py-2 font-medium ${savedJobs.length > 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          SAVED JOBS ({savedJobs.length})
        </button>
      </div>

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

      {/* Job Cards - Mobile View */}
      <div className="block sm:hidden space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <button 
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-2 rounded-full ${job.isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <svg className="w-5 h-5" fill={job.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div>
                <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
              </div>

              {/* Job Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.job_type}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {formatSalary(job.min_salary, job.max_salary)}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {job.posted_date}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {formatAvailability(job.availability)} Vacancies Left
                </span>
                
                <div className="flex space-x-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => openEditModal(job)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openViewModal(job)}
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
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-4 py-3 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <button 
                        onClick={() => toggleSaveJob(job.id)}
                        className={`text-xs ${job.isSaved ? 'text-yellow-500' : 'text-red-400 hover:text-yellow-500'}`}
                      >
                        {job.isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-gray-500">
                  {job.company}
                </td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-gray-500">
                  {job.location}
                </td>
                
                
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-green-600 font-semibold">
                  {formatSalary(job.min_salary, job.max_salary)}
                </td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {formatAvailability(job.availability)}
                  </span>
                </td>
                <td className="px-4 py-4 lg:px-6 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => openEditModal(job)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openViewModal(job)}
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

      {/* Add Job Modal */}
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
                  name="company"
                  value={newJob.company}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.company 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company}</p>
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
                <select
                  name="job_type"
                  value={newJob.job_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="skills"
                  value={newJob.skills}
                  onChange={handleInputChange}
                  placeholder="Skills (comma separated, e.g., React, TypeScript, Tailwind CSS)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.skills 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
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

      {/* Edit Job Modal */}
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
                  name="company"
                  value={editingJob.company}
                  onChange={handleEditInputChange}
                  placeholder="Company Name"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.company 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company}</p>
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

              <div>
                <select
                  name="job_type"
                  value={editingJob.job_type}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="skills"
                  value={editingJob.skills}
                  onChange={handleEditInputChange}
                  placeholder="Skills (comma separated)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.skills 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-yellow-400 focus:ring-yellow-500"
                  }`}
                />
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
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

      {/* View Job Modal */}
      {showViewModal && selectedJob && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-gray-600">{selectedJob.company}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedJob.job_type === 'Full-time' ? 'bg-green-100 text-green-800' : 
                    selectedJob.job_type === 'Part-time' ? 'bg-blue-100 text-blue-800' : 
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedJob.job_type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-700">Location:</strong>
                  <p className="text-gray-600">{selectedJob.location}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Salary Range:</strong>
                  <p className="text-green-600 font-semibold">{formatSalary(selectedJob.min_salary, selectedJob.max_salary)}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Available Positions:</strong>
                  <p className="text-gray-600">{selectedJob.availability}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Posted:</strong>
                  <p className="text-gray-600">{selectedJob.posted_date}</p>
                </div>
              </div>

              <div>
                <strong className="text-gray-700">Skills Required:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="text-gray-700">Job Description:</strong>
                <p className="text-gray-600 mt-2 whitespace-pre-line">{selectedJob.description}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;