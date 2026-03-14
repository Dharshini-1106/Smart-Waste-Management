import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Activity, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">Smart Waste</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI-powered tracking, predictive logistics, and dynamic billing for a greener tomorrow. Join the ecosystem.
        </p>
        
        <div className="flex justify-center gap-6 pt-4">
          <Link to="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            Start the Revolution
          </Link>
          <Link to="/login" className="px-8 py-4 bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700 rounded-xl font-bold text-lg transition-all">
            Dashboard Login
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-16">
          {[
            { title: "Citizens", icon: Globe2, desc: "Scan waste with AI, track impact, and earn green discounts on your utility bills." },
            { title: "Drivers", icon: Truck, desc: "AI-optimized predictive routes skipping empty bins and highlighting full ones." },
            { title: "Admins", icon: Activity, desc: "3D digital twin map. Monitor live fill levels and district statistics." }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors text-left group">
              <feature.icon className="w-10 h-10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
