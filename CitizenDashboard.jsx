import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, TreePine, Leaf, Download, Map, FileText, Award, Bell, User } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Map3D from './Map3D';

export default function CitizenDashboard({ user }) {
  const webcamRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);
  const [stats, setStats] = useState({ 
    plasticWeight: 0, 
    co2Saved: 0, // plastic weight * 1.5
    trees: 0 // +1 every 21kg co2
  });
  const [isScanning, setIsScanning] = useState(false);

  const capture = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate AI Scan Delay
    setTimeout(() => {
        const fakeWeight = parseFloat((Math.random() * 2 + 0.5).toFixed(2)); // 0.5 to 2.5 kg
        const types = ['Plastic Bottle', 'Cardboard Box', 'Glass Jar', 'Aluminum Can'];
        const fakeType = types[Math.floor(Math.random() * types.length)];
        
        setScanResult({ type: fakeType, weight: fakeWeight });
        
        const newCo2 = stats.co2Saved + (fakeWeight * 1.5);
        setStats({
            plasticWeight: +(stats.plasticWeight + fakeWeight).toFixed(2),
            co2Saved: +newCo2.toFixed(2),
            trees: Math.floor(newCo2 / 21)
        });
        
        setIsScanning(false);
    }, 2000);
  }, [webcamRef, stats]);

  // Billing Calculation
  const baseTax = 50;
  // Let's say every kg of plastic saves $0.50
  const discount = Math.min(stats.plasticWeight * 0.5, 25); 
  const totalBill = baseTax - discount;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map', icon: Map, label: 'Map View', content: <Map3D /> },
    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
    { id: 'impact', icon: Award, label: 'Impact', path: '/impact' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="p-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
          Citizen Dashboard
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">3D Digital Twin • Live Bin Status • One-Tap Reporting</p>
      </header>

      <div className="max-w-7xl mx-auto px-8 pb-12">
        {/* Tab Navigation */}
        <nav className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-1 mb-12 shadow-2xl">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path || '/citizen'}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all group relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 shadow-emerald-500/50 shadow-xl scale-[1.02] translate-y-1' 
                      : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50'
                  }`
                }
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-slate-900' : 'group-hover:text-emerald-400'}`} />
                <span>{tab.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <main className="min-h-[600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

