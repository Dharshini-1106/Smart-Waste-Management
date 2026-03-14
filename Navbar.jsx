import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-slate-800 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link to="/" className="flex items-center gap-2 text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
        <Leaf className="w-6 h-6" />
        EcoSync
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-sm text-slate-400">
              Welcome, <span className="text-emerald-400 font-semibold">{user.email.split('@')[0]}</span> ({user.role})
            </span>
            <Link to={
                user.role === 'Eco-Citizen' ? '/citizen' :
                user.role === 'Truck Driver' ? '/driver' : '/admin'
            } className="text-slate-300 hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-emerald-400 transition-colors">Login</Link>
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
