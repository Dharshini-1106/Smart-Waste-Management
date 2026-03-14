import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLogin(res.data.user);
      localStorage.setItem('token', res.data.token);
      
      const role = res.data.user.role;
      if (role === 'Eco-Citizen') navigate('/citizen');
      else if (role === 'Truck Driver') navigate('/driver');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login Failed');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-emerald-400 text-center drop-shadow">Welcome Back</h2>
        {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1">Email</label>
            <input type="email" required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <input type="password" required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          New here? <Link to="/register" className="text-emerald-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
