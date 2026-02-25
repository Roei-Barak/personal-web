import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Users, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'approved_friend' | 'pending';
  created_at: string;
}

export default function AdminPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) {
        throw new Error('Failed to fetch users');
      }

      const { users: data } = await resp.json();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'approved_friend' | 'pending') => {
    try {
      setUpdating(userId);
      const resp = await fetch(`${apiUrl}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!resp.ok) {
        throw new Error('Failed to update user role');
      }

      // Refresh users list
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-900/20 text-red-300 border-red-700';
      case 'approved_friend':
        return 'bg-green-900/20 text-green-300 border-green-700';
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-300 border-yellow-700';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400 mt-1">Manage users and permissions</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-white mt-2">{users.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-medium">Pending Approvals</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {users.filter((u) => u.role === 'pending').length}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-medium">Approved Users</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {users.filter((u) => u.role === 'approved_friend' || u.role === 'admin').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Users</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Role</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Joined</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                      <td className="py-3 px-4 text-slate-300 text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        {user.role === 'pending' && (
                          <>
                            <button
                              onClick={() => updateUserRole(user.id, 'approved_friend')}
                              disabled={updating === user.id}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white text-sm rounded transition"
                            >
                              {updating === user.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => updateUserRole(user.id, 'pending')}
                              disabled={updating === user.id}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white text-sm rounded transition"
                            >
                              {updating === user.id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </>
                        )}
                        {user.role === 'approved_friend' && (
                          <button
                            onClick={() => updateUserRole(user.id, 'pending')}
                            disabled={updating === user.id}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-white text-sm rounded transition"
                          >
                            {updating === user.id ? 'Updating...' : 'Revoke'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-8 text-slate-400">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
