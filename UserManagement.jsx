import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, User, Shield, Ban, Truck } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'Eco-Citizen' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addUser = async () => {
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      setShowAddModal(false);
      setNewUser({ email: '', password: '', role: 'Eco-Citizen' });
      fetchUsers();
    } catch (err) {
      console.error('Error adding user', err);
    }
  };

  const updateUser = async () => {
    try {
      await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingUser)
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user', err);
    }
  };

  const deleteUser = async (id) => {
    if (confirm('Delete this user?')) {
      try {
        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user', err);
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const roleIcon = (role) => {
    if (role === 'Truck Driver') return <Truck className="w-4 h-4" />;
    if (role === 'City Admin') return <Shield className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-emerald-400" />
          User Management
        </h1>
        <p className="text-slate-400">Manage citizens, drivers, and admins</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Add */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="search" 
              placeholder="Search users by email or role..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <span className="w-8 text-center">#</span>
              <span className="flex-1">Email</span>
              <span className="w-32">Role</span>
              <span className="w-24">Green Points</span>
              <span className="w-20 text-center">Banned</span>
              <span className="w-32">Vehicle</span>
              <span className="w-24 text-center">Actions</span>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading users...</div>
            ) : filteredUsers.map((user, index) => (
              <div key={user._id} className="p-6 border-t border-slate-700 hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-mono font-bold">{index + 1}</span>
                  <span className="flex-1 font-mono">{user.email}</span>
                  <span className="w-32 flex items-center gap-2 font-bold">
                    {roleIcon(user.role)}
                    {user.role}
                  </span>
                  <span className="w-24">{user.greenPoints || 0}</span>
                  <span className="w-20 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.banned ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {user.banned ? 'BANNED' : 'Active'}
                    </span>
                  </span>
                  <span className="w-32">{user.assignedVehicle || '-'}</span>
                  <div className="w-24 flex gap-2 justify-end">
                    <button onClick={() => openEditModal(user)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Add New User</h2>
              <div className="space-y-4">
                <input 
                  placeholder="Email" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
                <input 
                  placeholder="Password" 
                  type="password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="Eco-Citizen">Eco-Citizen</option>
                  <option value="Truck Driver">Truck Driver</option>
                  <option value="City Admin">City Admin</option>
                </select>
                <div className="flex gap-3 pt-4">
                  <button onClick={addUser} className="flex-1 bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-bold">
                    Add User
                  </button>
                  <button onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Edit User</h2>
              <div className="space-y-4">
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="Eco-Citizen">Eco-Citizen</option>
                  <option value="Truck Driver">Truck Driver</option>
                  <option value="City Admin">City Admin</option>
                </select>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={editingUser.banned}
                    onChange={(e) => setEditingUser({...editingUser, banned: e.target.checked})}
                    className="rounded"
                  />
                  Ban User
                </label>
                <input 
                  placeholder="Assigned Vehicle (for drivers)" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                  value={editingUser.assignedVehicle || ''}
                  onChange={(e) => setEditingUser({...editingUser, assignedVehicle: e.target.value})}
                />
                <div className="flex gap-3 pt-4">
                  <button onClick={updateUser} className="flex-1 bg-amber-500 hover:bg-amber-600 py-3 rounded-xl font-bold">
                    Update
                  </button>
                  <button onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

