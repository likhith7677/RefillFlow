import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  Clock, 
  TrendingDown, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { BOTTLENECK_HEATMAP, HOURLY_THROUGHPUT, BottleneckItem } from '../data/metricsData';

interface MetricsDashboardProps {
  resolvedCount: number;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ resolvedCount }) => {
  const [selectedBottleneck, setSelectedBottleneck] = useState<BottleneckItem | null>(null);

  // Dynamic adjustments based on session resolved items
  const baseMinutes = Math.max(12, 18 - resolvedCount);
  const totalSavedHours = 142 + (resolvedCount * 0.4);

  return (
    <div className="space-y-6">
      
      {/* 4 Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Resolution Time */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Resolution Time</span>
            <span className="flex items-center text-emerald-400 font-semibold text-[11px] gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> -99.7%
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {baseMinutes} <span className="text-sm font-medium text-slate-400">min</span>
            </span>
            <span className="text-xs text-slate-500 line-through">4.2 days</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            NCPDP to Surescripts round-trip automated in minutes instead of days of clinic phone-tag.
          </p>
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* KPI 2: Refill Abandonment */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Refill Abandonment</span>
            <span className="flex items-center text-emerald-400 font-semibold text-[11px] gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> -38%
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              6.2%
            </span>
            <span className="text-xs text-slate-500 line-through">44.2%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Prevented prescription drop-offs at retail counters through immediate 30-day safety bridges.
          </p>
          <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* KPI 3: Clinician Time Saved */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Staff Hours Saved / Mo</span>
            <span className="flex items-center text-cyan-400 font-semibold text-[11px] gap-0.5">
              <Zap className="h-3.5 w-3.5" /> +{resolvedCount} this session
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalSavedHours.toFixed(1)} <span className="text-sm font-medium text-slate-400">hrs</span>
            </span>
            <span className="text-xs text-emerald-400 font-medium">~$6,400 saved</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Eliminates fax triage, manual EHR chart digging, and hold times with pharmacy call centers.
          </p>
          <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* KPI 4: HITL Automation Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Zero-Touch / 1-Click HITL</span>
            <span className="flex items-center text-emerald-400 font-semibold text-[11px] gap-0.5">
              <CheckCircle className="h-3.5 w-3.5" /> 99.4% Safety
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              78.5%
            </span>
            <span className="text-xs text-slate-400">of total refills</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Clinician maintains full audit control while saving 92% of repetitive cognitive effort.
          </p>
          <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
        </div>

      </div>

      {/* Main Charts & Bottleneck Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recharts Live Throughput Curve (7 cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 lg:col-span-7 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  LIVE HOURLY QUEUE THROUGHPUT & AUTOMATION
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Peak Load: <strong className="text-white">142 Rxs/hr</strong>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              RefillFlow AI real-time resolution trajectory compared to legacy manual clinician review.
            </p>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_THROUGHPUT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="legGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="incoming" name="Total Ingested (NCPDP)" stroke="#818cf8" fillOpacity={1} fill="url(#incGrad)" />
                <Area type="monotone" dataKey="aiResolved" name="RefillFlow AI Resolved" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#aiGrad)" />
                <Area type="monotone" dataKey="legacyBaseline" name="Legacy Clinic Manual" stroke="#f43f5e" strokeDasharray="3 3" fillOpacity={1} fill="url(#legGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Peak Clinic Shift: 11:00 AM - 2:00 PM</span>
            <span className="text-emerald-400 font-medium">99.8% Surescripts FHIR API Delivery</span>
          </div>
        </div>

        {/* Right: Bottleneck Heatmap Matrix across 4 Dimensions (5 cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 lg:col-span-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  QUEUE BOTTLENECK HEATMAP MATRIX
                </h3>
              </div>
              <span className="text-[11px] text-amber-400 font-semibold">4 Stalled Dimensions</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Congestion distribution across administrative & clinical blockers. Click category to inspect.
            </p>
          </div>

          {/* 4 Dimension Matrix */}
          <div className="mt-4 space-y-2.5">
            {BOTTLENECK_HEATMAP.map((item) => {
              const isSelected = selectedBottleneck?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBottleneck(isSelected ? null : item)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-800 shadow-md ring-1 ring-cyan-400/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-white">{item.category}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {item.percentage}% ({item.count} Rxs)
                    </span>
                  </div>

                  {/* Delay Comparison Bar */}
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Legacy: <strong className="text-rose-400 line-through">{item.legacyDelay}</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      RefillFlow AI: <strong>{item.aiDelay}</strong>
                    </span>
                  </div>

                  {/* Visual Bar Meter */}
                  <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                      <div><strong className="text-white">Cause:</strong> {item.description}</div>
                      <div><strong className="text-cyan-400">Resolution:</strong> {item.primaryAction}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-slate-400 text-center">
            Integrated with automated Prior Auth, Quest FHIR Labs, and Surescripts eRx.
          </div>
        </div>

      </div>

    </div>
  );
};
