import React, { useState } from "react";

const ManageUser = () => {
  // Sample user data with status and actions
  const [users, setUsers] = useState([
    { id: 1, username: "Rebbeca", email: "Rebeca@gmail.com", status: "Approved", action: "Approved" },
    
  ]);

  // Handle action change and update status accordingly
  const handleActionChange = (userId, newAction) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, action: newAction, status: newAction } // Status depends on action
        : user
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[30px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
      

      {/* User Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {users.map((user) => (
            <div key={user.id} className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.status === "Approved" 
                    ? "bg-green-100 text-green-800" 
                    : user.status === "Suspended" 
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {user.status}
                </span>
              </div>
              <select 
                value={user.action}
                onChange={(e) => handleActionChange(user.id, e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="Approved">Approved</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Update</option>
              </select>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === "Approved" 
                      ? "bg-green-100 text-green-800" 
                      : user.status === "Suspended" 
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                  <select 
                    value={user.action}
                    onChange={(e) => handleActionChange(user.id, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Update</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
};

export default ManageUser;