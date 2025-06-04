import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import avatarIcon from '../assets/avatars.png';
import './UserManagement.css';

const UserManagement = () => {
  const username = localStorage.getItem('user_email');
  const role = localStorage.getItem('user_role') || 'User';
  const avatar = localStorage.getItem('user_avatar') || avatarIcon;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null); // user ID being toggled

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/admin`)
      .then(res => res.json())
      .then(data => setUsers(data.users || data))
      .catch(err => console.error('Failed to fetch users:', err))
      .finally(() => setLoading(false));
  }, []);

    const toggleUserStatus = async (userId, newStatus) => {
    setToggling(userId);

    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/status/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email_verified: newStatus })
        });

        if (res.ok) {
        setUsers(prev =>
            prev.map(u => (u._id === userId ? { ...u, email_verified: newStatus } : u))
        );
        } else {
        console.error('Failed to update status');
        }
    } catch (error) {
        console.error('Error toggling status:', error);
    } finally {
        setToggling(null);
    }
    };


  const getStatusLabel = (user) => {
    if (user.email_verified === true) return 'Active';
    if (user.email_verified === false) return 'Suspended';
    return 'Pending';
  };

  const getStatusDot = (user) => {
    const status = getStatusLabel(user);
    if (status === 'Active') return <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2" />;
    if (status === 'Pending') return <span className="h-3 w-3 bg-yellow-500 rounded-full inline-block mr-2" />;
    return <span className="h-3 w-3 bg-red-500 rounded-full inline-block mr-2" />;
  };

  const filteredUsers = users.filter(user => {
    const name = user.username || user.name || '';
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || getStatusLabel(user) === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="dashboard-container px-6 py-4 bg-gray-50 min-h-screen">
      <PageHeader username={username} role={role} avatar={avatar} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Search by Name or Email"
            className="border px-3 py-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All</option>
            <option>Student</option>
            <option>Instructor</option>
          </select>
          <select
            className="border px-3 py-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading users...</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead className="bg-gray-100 text-gray-700 text-sm leading-6">
                <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3 min-w-[160px]">Last Login</th>
                    <th className="text-left p-3 min-w-[120px]">Actions</th>
                </tr>
                </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index} className="border-t text-sm leading-6">
                    <td className="p-3">{user.username || user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">
                      {getStatusDot(user)}
                      {getStatusLabel(user)}
                    </td>
                    <td className="p-3 whitespace-nowrap min-w-[160px]">
                    {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : '—'}
                    </td>
                    <td className="p-3 whitespace-nowrap min-w-[120px]">
                    {toggling === user._id ? (
                        <span className="text-sm text-gray-500">Updating...</span>
                    ) : user.email_verified ? (
                        <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => toggleUserStatus(user._id, false)}
                        >
                        Deactivate
                        </button>
                    ) : (
                        <button
                        className="text-sm text-green-600 hover:underline"
                        onClick={() => toggleUserStatus(user._id, true)}
                        >
                        Activate
                        </button>
                    )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
