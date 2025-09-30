import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ManageUser = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;


  //cd C:\Users\user\Downloads\APP\GIT\its120 project\ITS120L_BM2_Grp7\front-end\Website\react-app\src
  // Sample user data with status and actions
  const [users, setUsers] = useState([
    { id: 1, username: "Rebbeca", email: "Rebeca@gmail.com", status: "Approved", action: "Approved" },
    { id: 2, username: "John Doe", email: "Joe@gmail.com", status: "Suspend", action: "Suspend" },
    { id: 3, username: "Bobby Joohn", email: "bob@gmail.com", status: "Pending", action: "Update" },
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
    <div className="flex">
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
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">Admin John Doe</h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">john@example.com</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {/* Manage User */}
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
              <span className="mx-4 font-medium">Manage User</span>
            </a>

            {/* Job listing */}
            <a
              className={`flex items-center px-4 py-2 mt-5 rounded-lg transition-colors duration-300 ${
                isActive("/JobListing") ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              href="/JobListing"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5V..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mx-4 font-medium">Job listing</span>
            </a>

            {/* Report */}
            <a
              className={`flex items-center px-4 py-2 mt-5 rounded-lg transition-colors duration-300 ${
                isActive("/report") ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              href="/report"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.3246 4.3..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12C..." stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mx-4 font-medium">Report</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content - User Management Table */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Manage Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Allows Admin to approve, suspend or update user accounts</p>

          {/* User Table */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-green-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Approved" 
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                          : user.status === "Suspend" 
                          ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <select 
                        value={user.action}
                        onChange={(e) => handleActionChange(user.id, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Suspend">Suspend</option>
                        <option value="Pending">Update</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {/*End of Main content*/}
          
        </div>
      </main>





    </div>
  );
};

export default ManageUser;