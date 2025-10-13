import React, { useState, useEffect } from "react";

const ManageUser = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from backend database
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // In handleActionChange, only update the action field temporarily
const handleActionChange = (userId, newAction) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.user_id === userId ? { ...user, action: newAction } : user
    )
  );

  // Update user status in backend (using newAction as the status)
  fetch(`http://localhost:5000/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newAction }),
  })
  .then(() => {
    // After successful update, sync the status with action
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user_id === userId ? { ...user, status: newAction } : user
      )
    );
  })
  .catch((err) => console.error("Error updating user:", err));
};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[30px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-4 py-4 text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : user.status === "Suspended"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <select
                    value={user.action || user.status}
                    onChange={(e) => handleActionChange(user.user_id, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
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
