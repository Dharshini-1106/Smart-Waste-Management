import React, { useState, useEffect } from 'react';
import { ChevronLeft, Navigation2, Truck, MapPin, AlertCircle, Wifi, Battery, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DriverNavigation() {
  const navigate = useNavigate();
  const [currentInstruction, setCurrentInstruction] = useState('Turn right in 150m onto 5th Ave');
  const [distanceToNext, setDistanceToNext] = useState('150m');
  const [etaNextStop, setEtaNextStop] = useState('2 min');
  const [trafficStatus, setTrafficStatus] = useState('Moderate');
  const [connectionStatus, setConnectionStatus] = useState('Connected');

  const instructions = [
    'Head north on Main St',
    'Turn right onto 5th Ave in 150m',
    'Continue straight for 800m',
    'Turn left onto Park Ave in 300m',
    'Arrive at bin B102'
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setCurrentInstruction(instructions[step % instructions.length]);
      step++;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goBack = () => navigate('/driver/map');

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 p-6 border-b border-slate-700/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goBack} className="p-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl hover:bg-slate-700/50 transition-all border border-slate-700/50">
            <ChevronLeft className="w-6 h-6 text-slate-300" />
          </button>
          <div className="text-center">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping mx-auto mb-1"></div>
            <p className="text-xs text-emerald-400 font-mono">GPS Active</p>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-white to-emerald-400 bg-clip-text text-transparent mb-1">
            Navigation
          </h1>
          <p className="text-slate-400 text-sm font-mono uppercase tracking-wide">Next Stop: Bin B102</p>
        </div>
      </div>

      {/* Main Navigation Screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center">
        {/* Large Next Stop Indicator */}
        <div className="w-48 h-48 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-4 border-cyan-500/50 rounded-3xl flex flex-col items-center justify-center mb-12 backdrop-blur-xl shadow-2xl animate-bounce-slow">
          <MapPin className="w-24 h-24 text-cyan-300 drop-shadow-2xl mb-4" />
          <div>
            <p className="text-2xl font-bold text-white mb-1">{distanceToNext}</p>
            <p className="text-4xl font-mono font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent drop-shadow-lg">{etaNextStop}</p>
          </div>
        </div>

        {/* Current Instruction */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 max-w-2xl backdrop-blur-md shadow-2xl mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Navigation2 className="w-12 h-12 text-orange-400 animate-spin" />
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Next Instruction</p>
              <p className="font-mono text-2xl">{trafficStatus} traffic ahead</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white leading-relaxed animate-pulse">{currentInstruction}</p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm group hover:border-emerald-400/50">
            <Battery className="w-8 h-8 text-emerald-400 mb-1 group-hover:animate-bounce" />
            <span className="text-sm font-mono text-emerald-400 font-bold">87%</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <Volume2 className="w-8 h-8 text-slate-300 mb-1" />
            <span className="text-sm font-mono text-slate-300">Voice On</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm group hover:border-orange-400/50">
            <AlertCircle className="w-8 h-8 text-orange-400 mb-1 group-hover:animate-pulse" />
            <span className="text-sm font-mono text-orange-400 font-bold">1 Issue</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50">
        <div className="flex gap-4">
          <button className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300 py-4 px-6 rounded-2xl border border-slate-600/50 backdrop-blur-sm font-mono uppercase tracking-wide font-bold transition-all">
            Pause Route
          </button>
          <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-4 px-6 rounded-2xl font-mono uppercase tracking-wide font-bold shadow-lg hover:shadow-emerald-500/25 transition-all">
            Skip Stop
          </button>
        </div>
      </div>
    </div>
  );
}
