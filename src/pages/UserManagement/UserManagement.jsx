import React, { useEffect, useState, useCallback } from "react";
import { FaTrash, FaKey } from "react-icons/fa";
import Popup from "../../components/Popup";
import "./UserManagement.css";
import {
  fetchUsersFromApi,
  fetchUserById,
  saveUser,
  deleteUser,
  updateUserPassword,
} from "./userManagementService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [changePasswordUserId, setChangePasswordUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const USERS_PER_PAGE = 5;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    const data = await fetchUsersFromApi({ page, size: USERS_PER_PAGE, sortField, sortDir, search: debouncedSearch });
    setUsers(data.content || []);
    setTotalPages(data.totalPages || 1);
  }, [page, sortField, sortDir, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openUserModal = async (id) => {
    const data = await fetchUserById(id);
    setSelectedUser(data);
  };

  useEffect(() => {
    if (selectedUser) {
      setModalOpen(true);
    }
  }, [selectedUser]);

  const handleDelete = async () => {
    await deleteUser(confirmDelete);
    setConfirmDelete(null);
    fetchUsers();
  };

  const handleSave = async () => {
    await saveUser(selectedUser);
    setModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleChangePassword = async () => {
    await updateUserPassword(changePasswordUserId, newPassword);
    setChangePasswordUserId(null);
    setNewPassword("");
    fetchUsers();
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
      <div className="um-container">
        <div className="um-header">
          <h2 className="um-title">User Management</h2>
          <button className="um-add-btn" onClick={() => {
            setSelectedUser({ name: "", userName: "", accessGroups: [], active: true });
            setModalOpen(true);
          }}>+ Add User</button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="um-search"
        />

        <table className="um-table">
          <thead>
            <tr className="um-header-row">
              <th className="um-th" onClick={() => toggleSort("name")}>Name</th>
              <th className="um-th" onClick={() => toggleSort("userName")}>Username</th>
              <th className="um-th" onClick={() => toggleSort("accessGroups")}>Access Groups</th>
              <th className="um-th" onClick={() => toggleSort("active")}>Active</th>
              <th className="um-th text-center">Change Password</th>
              <th className="um-th text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="um-row" onClick={() => openUserModal(user.id)}>
                <td className="um-td">{user.name}</td>
                <td className="um-td">{user.userName}</td>
                <td className="um-td">{Array.isArray(user.accessGroups) ? user.accessGroups.join(", ") : user.accessGroups}</td>
                <td className="um-td">{user.active ? "Yes" : "No"}</td>
                <td className="um-td text-center" onClick={(e) => { e.stopPropagation(); setChangePasswordUserId(user.id); }}>
                  <div className="um-icon blue"><FaKey /></div>
                </td>
                <td className="um-td text-center" onClick={(e) => { e.stopPropagation(); setConfirmDelete(user.id); }}>
                  <div className="um-icon red"><FaTrash /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="um-pagination">
          <span>Page {page + 1} of {totalPages || 1}</span>
          <div className="um-page-controls">
            <button disabled={page === 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>Previous</button>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>

       {modalOpen && selectedUser && (
          <Popup onClose={() => { setModalOpen(false); setSelectedUser(null); }}>
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="text"
                className={`w-full p-2 border rounded ${selectedUser.id ? 'bg-gray-100 text-gray-600' : ''}`}
                value={selectedUser.userName || ""}
                onChange={(e) => {
                  if (!selectedUser.id) {
                    setSelectedUser({ ...selectedUser, userName: e.target.value });
                  }
                }}
                disabled={!!selectedUser.id}
                placeholder="Username"
              />
              <select
                className="w-full p-2 border rounded"
                value={selectedUser.accessGroups?.[0] || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, accessGroups: [e.target.value] })
                }
              >
                <option value="">Select Access Group</option>
                <option value="admin">admin</option>
                <option value="viewer">viewer</option>
              </select>
              <div className="flex items-center gap-2">
                <label htmlFor="active-toggle" className="text-sm font-medium">
                  Active
                </label>
                <input
                  id="active-toggle"
                  type="checkbox"
                  checked={selectedUser.active}
                  onChange={(e) => setSelectedUser({ ...selectedUser, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={
                  !selectedUser.name ||
                  !selectedUser.userName ||
                  !selectedUser.accessGroups?.[0]
                }
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </Popup>
        )}



      {confirmDelete && (
        <Popup onClose={() => setConfirmDelete(null)}>
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="mb-4">Do you really want to remove the user?</p>
          <div className="flex justify-end gap-4">
            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
              Delete
            </button>
          </div>
        </Popup>
      )}

      {changePasswordUserId && (
        <Popup onClose={() => setChangePasswordUserId(null)}>
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <button onClick={() => setChangePasswordUserId(null)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button onClick={handleChangePassword} className="px-4 py-2 bg-green-600 text-white rounded">
              Save
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}

export default UserManagement;
