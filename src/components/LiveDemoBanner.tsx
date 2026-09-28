import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Play, 
  FlaskConical, 
  ShieldCheck, 
  AlertTriangle, 
  Video,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

interface LiveDemoBannerProps {
  onOpenDemo: (initialMedication?: string) => void;
}

export const LiveDemoBanner: React.FC<LiveDemoBannerProps> = ({ onOpenDemo }) => {
  const [quickMedInput, setQuickMedInput] = useState('');

  const presets = [
    { name: 'Metformin HCl 1000mg', label: 'Lab Due (HbA1c)', icon: FlaskConical, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { name: 'Ozempic 1mg Pen', label: 'Prior Auth (ePA)', icon: ShieldCheck, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { name: 'Lisinopril 20mg', label: '0 Refills Left', icon: AlertTriangle, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { name: 'Adderall XR 20mg', label: 'Telehealth Visit Due', icon: Video, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenDemo(quickMedInput.trim() || undefined);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/40 bg-gradient-to-r from-[#09121f] via-[#0e1a2c] to-[#0f2438] p-4 sm:p-5 shadow-xl shadow-teal-950/30">
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Section: Title & Explanation */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30">
              <Zap className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              LIVE END-TO-END DEMONSTRATION MODE
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
                INTERACTIVE SIMULATOR
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter any prescription medicine to test the complete lifecycle: from <strong>Patient Intake &rarr; Automated Blocker Intercept &rarr; AI Clinical Reasoning &rarr; Clinician Sign-off &rarr; Surescripts FHIR &amp; SMS Dispatch &rarr; Retail Pickup</strong>.
          </p>

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">1-Click Scenarios:</span>
            {presets.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.name}
                  onClick={() => onOpenDemo(p.name)}
                  className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all hover:scale-105 ${p.color}`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{p.name.split(' ')[0]} ({p.label})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Direct Input Form */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={quickMedInput}
                onChange={(e) => setQuickMedInput(e.target.value)}
                placeholder="Enter medicine (e.g. Metformin)..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/90 py-2 pl-3 pr-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] shrink-0"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run Live Demo</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
