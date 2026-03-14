
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CitizenDashboard from './components/CitizenDashboard';
import DriverView from './components/DriverView';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import BinDetails from './components/BinDetails';
import OneTapReport from './components/OneTapReport';
import ReportsHistory from './components/ReportsHistory';
import ImpactDashboard from './components/ImpactDashboard';
import NotificationsPage from './components/NotificationsPage';
import ProfileSettings from './components/ProfileSettings';
import DriverDashboard from './components/DriverDashboard';
import RouteMap from './components/RouteMap';
import CollectionList from './components/CollectionList';
import BinCollection from './components/BinCollection';
import DriverNavigation from './components/DriverNavigation';
import DriverProfile from './components/DriverProfile';
import AdminLayout from './components/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary'; 


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onLogin={handleLogin} />} />
              
              {/* Protected Routes */}
              <Route path="/citizen" element={user && user.role === 'Eco-Citizen' ? <CitizenDashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/driver/*" element={user && user.role === 'Truck Driver' ? <DriverView user={user} /> : <Navigate to="/login" />} />

              <Route path="/admin/*" element={user && user.role === 'City Admin' ? <AdminLayout /> : <Navigate to="/login" />} />
              <Route path="/admin" element={user && user.role === 'City Admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
              
              {/* Citizen Pages Routes */}
              <Route path="/bin/:id" element={user && user.role === 'Eco-Citizen' ? <BinDetails /> : <Navigate to="/login" />} />
              <Route path="/report" element={user && user.role === 'Eco-Citizen' ? <OneTapReport /> : <Navigate to="/login" />} />
              <Route path="/reports" element={user && user.role === 'Eco-Citizen' ? <ReportsHistory /> : <Navigate to="/login" />} />
              <Route path="/impact" element={user && user.role === 'Eco-Citizen' ? <ImpactDashboard /> : <Navigate to="/login" />} />
              <Route path="/notifications" element={user && user.role === 'Eco-Citizen' ? <NotificationsPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user && user.role === 'Eco-Citizen' ? <ProfileSettings onLogout={handleLogout} /> : <Navigate to="/login" />} />
            </Routes>
          </ErrorBoundary>
        </main>

      </div>
    </Router>
  );
}

export default App;
