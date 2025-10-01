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

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewJob({ title: "", location: "", description: "", availability: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewJob = () => {
    if (newJob.title && newJob.location && newJob.description) {
      setJobs([
        ...jobs,
        { id: jobs.length + 1, ...newJob, action: "Edit" }
      ]);
      closeAddModal();
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleActionChange = (jobId, newAction) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, action: newAction } : job
    ));
  };

  const deleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Listing Management</h1>
      <p className="text-gray-600 mb-8">Admin can add, edit, or remove job listings in the system.</p>

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

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeAddModal}>
          <div 
            className="bg-yellow-50 rounded-lg p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Job</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={newJob.title}
                onChange={handleInputChange}
                placeholder="Job Title"
                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                name="location"
                value={newJob.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                name="description"
                value={newJob.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows="4"
                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="number"
                name="availability"
                value={newJob.availability}
                onChange={handleInputChange}
                placeholder="Availability"
                min="0"
                className="w-full px-3 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveNewJob}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
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
