
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChevronLeft, Layout, BarChart3, MapPin, Users, AlertCircle, Activity, Settings, LogOut, CloudRain } from 'lucide-react';

const navItems = [
  { path: '/admin', icon: Layout, name: 'Dashboard', label: 'Overview' },
  { path: '/admin/bins', icon: MapPin, name: 'Bin Management', label: 'Bins & Sensors' },
  { path: '/admin/users', icon: Users, name: 'User Management', label: 'Users & Roles' },
  { path: '/admin/reports', icon: AlertCircle, name: 'Reports', label: 'Citizen Reports' },
  { path: '/admin/routes', icon: Activity, name: 'Routes', label: 'Driver Routes' },
  { path: '/admin/analytics', icon: BarChart3, name: 'Analytics', label: 'Data Insights' },
{ path: '/admin/weather', icon: CloudRain, name: 'Weather', label: 'Priority System' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            City Admin
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all group ${
                location.pathname === item.path
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 border'
                  : 'hover:bg-slate-800 text-slate-400 border border-transparent'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 group-hover:text-emerald-400" />
              <span className="font-medium">{item.name}</span>
              <span className="ml-auto text-xs bg-slate-700 px-2 py-1 rounded-full">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-slate-900 border border-slate-700 rounded-xl lg:hidden"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
}

