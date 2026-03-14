import React, { useState, useEffect } from 'react';
import { Outlet, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { 
  LayoutDashboard, Map, List, User, Navigation, Truck, LogOut, ChevronRight,
  Settings, Bell, BarChart3 
} from 'lucide-react';

import DriverDashboard from './DriverDashboard';
import RouteMap from './RouteMap';
import CollectionList from './CollectionList';
import DriverProfile from './DriverProfile';
import DriverNavigation from './DriverNavigation';
import BinCollection from './BinCollection';
import ErrorBoundary from './ErrorBoundary';
import { getDriverBins } from '../lib/api';


const sidebarNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/driver' },
  { icon: Map, label: 'Route Map', path: '/driver/map' },
  { icon: List, label: 'Collections', path: '/driver/list' },
  { icon: Navigation, label: 'Navigate', path: '/driver/navigate' },
  { icon: User, label: 'Profile', path: '/driver/profile' },
];

export default function DriverView({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [bins, setBins] = useState([]);


  useEffect(() => {
    const loadBins = async () => {
      try {
        const res = await getDriverBins();
        setBins(res.data || []);
      } catch {
        setBins([]);
      }
    };
    loadBins();
  }, []);

  const context = { user, bins, setBins };


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };


const NavItem = ({ icon: Icon, label, path, active }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all group w-full text-left ${
        active
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
          : 'hover:bg-slate-800/50 hover:border-slate-600/50 text-slate-400 hover:text-slate-200 border border-transparent'
      } border`}
    >
      <Icon className={`w-6 h-6 ${active ? 'text-cyan-300' : 'group-hover:text-cyan-400'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );


  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900/90 backdrop-blur-md border-r border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Driver Portal
              </h2>
              <p className="text-sm text-slate-500 font-mono">{user?.driverId || 'DRV-001'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarNav.map(({ icon: Icon, label, path }) => (
            <NavItem
              key={path}
              icon={Icon}
              label={label}
              path={path}
              active={location.pathname === path || (path === '/driver' && location.pathname === '/driver')}
            />
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700/50 space-y-3 pt-4">
          <button className="flex items-center gap-3 p-4 hover:bg-slate-800/50 rounded-2xl text-slate-400 hover:text-slate-200 transition-all w-full">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-2xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ErrorBoundary>
          <Routes>
            <Route index element={<DriverDashboard />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="map" element={<RouteMap />} />
            <Route path="list" element={<CollectionList />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route path="navigate" element={<DriverNavigation />} />
            <Route path="collect/:id" element={<BinCollection />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ErrorBoundary>

      </div>
    </div>
  );
}


// Nested Routes Config (internal to DriverView)


// Update App.jsx usage - wrap with driver routes
// But since App.jsx already has <DriverView />, children handled internally
