import React from 'react';
import { 
  Search, 
  Filter, 
  FlaskConical, 
  AlertTriangle, 
  ShieldCheck, 
  Video, 
  CheckCircle2, 
  ListFilter,
  Flame,
  Zap,
  Plus,
  Clock
} from 'lucide-react';
import { BlockerReason, PortalRole } from '../types/refill';

interface FilterBarProps {
  portalRole: PortalRole;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBlocker: string;
  onBlockerChange: (b: string) => void;
  selectedUrgency: string;
  onUrgencyChange: (u: string) => void;
  viewTab: 'blocked' | 'resolved';
  onTabChange: (tab: 'blocked' | 'resolved') => void;
  blockedCount: number;
  resolvedCount: number;
  onOpenLiveDemo?: () => void;
  lowSupplyCount?: number;
  isLowSupplyOnly?: boolean;
  onToggleLowSupplyOnly?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  portalRole,
  searchQuery,
  onSearchChange,
  selectedBlocker,
  onBlockerChange,
  selectedUrgency,
  onUrgencyChange,
  viewTab,
  onTabChange,
  blockedCount,
  resolvedCount,
  onOpenLiveDemo,
  lowSupplyCount = 0,
  isLowSupplyOnly = false,
  onToggleLowSupplyOnly
}) => {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-[#0c1421]/90 p-4 backdrop-blur-md">
      
      {/* Top Row: Search and Queue Tab Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              portalRole === 'pharmacy'
                ? 'Search retail queue by Rx#, patient, drug, or prescriber clinic...'
                : portalRole === 'patient'
                ? 'Search my medications, doctor notes, or dosage...'
                : 'Search practice In Basket by patient name, MRN, medication, or blocker...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Queue Switcher Tab: Blocked vs Resolved */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
          <button
            onClick={() => onTabChange('blocked')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              viewTab === 'blocked'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Active Blocked Queue</span>
            <span className="ml-1 rounded-full bg-rose-500/30 px-1.5 py-0.2 text-[10px] text-rose-200">
              {blockedCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('resolved')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              viewTab === 'resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Resolved &amp; Dispatched</span>
            <span className="ml-1 rounded-full bg-emerald-500/30 px-1.5 py-0.2 text-[10px] text-emerald-200">
              {resolvedCount}
            </span>
          </button>
        </div>

        {/* Enter Medicine & Live Demo Shortcut Button */}
        {onOpenLiveDemo && (
          <button
            onClick={onOpenLiveDemo}
            className="flex items-center space-x-1.5 rounded-xl border border-cyan-500/50 bg-cyan-600/20 hover:bg-cyan-600/35 px-3 py-2 text-xs font-bold text-cyan-200 shadow-md shadow-cyan-500/10 transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            <span>Enter Medicine / Demo</span>
          </button>
        )}

      </div>

      {/* Bottom Row: Blocker Category Chips, Low Supply Filter, & Urgency */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-3">
        
        {/* Blocker Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>

          {/* Dedicated Low Supply Filter Button */}
          {lowSupplyCount > 0 && onToggleLowSupplyOnly && (
            <button
              onClick={onToggleLowSupplyOnly}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                isLowSupplyOnly
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
                  : 'bg-rose-950/70 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60'
              }`}
            >
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>≤ 10d Supply ({lowSupplyCount})</span>
            </button>
          )}

          <button
            onClick={() => onBlockerChange('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBlocker === 'all' && !isLowSupplyOnly
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Blockers
          </button>

          <button
            onClick={() => onBlockerChange('Routine Monitoring Lab Due (e.g., A1c, Lipid panel)')}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBlocker === 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FlaskConical className="h-3 w-3 text-amber-400" />
            <span>Labs Due</span>
          </button>

          <button
            onClick={() => onBlockerChange('Prior Authorization Required by PBM')}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBlocker === 'Prior Authorization Required by PBM'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShieldCheck className="h-3 w-3 text-rose-400" />
            <span>Prior Auth (PBM)</span>
          </button>

          <button
            onClick={() => onBlockerChange('No Refills Remaining (Requires New Rx)')}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBlocker === 'No Refills Remaining (Requires New Rx)'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <AlertTriangle className="h-3 w-3 text-cyan-400" />
            <span>0 Refills (New Rx)</span>
          </button>

          <button
            onClick={() => onBlockerChange('Patient Needs Follow-up Visit')}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBlocker === 'Patient Needs Follow-up Visit'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Video className="h-3 w-3 text-purple-400" />
            <span>Follow-up / Visit</span>
          </button>
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-[11px] text-slate-400 mr-1">Urgency:</span>
          {['all', 'critical', 'high', 'moderate'].map((u) => (
            <button
              key={u}
              onClick={() => onUrgencyChange(u)}
              className={`rounded px-2 py-0.5 capitalize text-[11px] font-medium transition-colors ${
                selectedUrgency === u
                  ? 'bg-slate-800 text-white font-bold border border-slate-600'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
