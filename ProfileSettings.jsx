import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Key, Sun, Moon, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSettings({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Eco Citizen',
    email: 'citizen@example.com',
    theme: 'dark'
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Load from localStorage or backend
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        name: parsed.name || 'Eco Citizen',
        email: parsed.email,
        theme: localStorage.getItem('theme') || 'dark'
      });
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = user.theme === 'dark' ? 'light' : 'dark';
    setUser({ ...user, theme: newTheme });
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update backend
      // await api.put('/user', { name: user.name });
      localStorage.setItem('user', JSON.stringify({ ...user, email: user.email }));
      setEditing(false);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => navigate('/citizen')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mx-auto mb-6 shadow-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
          </div>

          {/* Profile Info */}
          <div className="space-y-6 mb-12">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-400 font-semibold">
                <User className="w-5 h-5" />
                Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                />
              ) : (
                <div className="text-2xl font-bold text-white">{user.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-400 font-semibold">
                <Mail className="w-5 h-5" />
                Email
              </label>
              <div className="text-lg text-slate-300">{user.email}</div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mb-8">
            <label className="flex items-center justify-between text-slate-400 font-semibold mb-4">
              Theme Preference
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  user.theme === 'dark'
                    ? 'bg-slate-700 text-slate-200 border border-slate-600 shadow-inner'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-slate-900 shadow-md'
                }`}
              >
                <Moon className={`w-5 h-5 ${user.theme === 'dark' ? 'text-yellow-400' : 'text-slate-500'}`} />
                Dark
              </button>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  user.theme === 'light'
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-slate-900 shadow-md'
                    : 'bg-slate-700 text-slate-200 border border-slate-600 shadow-inner'
                }`}
              >
                <Sun className={`w-5 h-5 ${user.theme === 'light' ? 'text-yellow-400' : 'text-slate-500'}`} />
                Light
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-8 border-t border-slate-700">
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-4 px-6 rounded-2xl transition-all border border-slate-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/25 flex items-center gap-3 justify-center text-lg"
                >
                  <User className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl hover:shadow-red-500/25 flex items-center gap-3 justify-center text-lg group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
