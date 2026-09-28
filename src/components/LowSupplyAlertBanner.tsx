import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  BellRing,
  Pill
} from 'lucide-react';
import { RefillRequest } from '../types/refill';

interface LowSupplyAlertBannerProps {
  refills: RefillRequest[];
  onFilterLowSupply: () => void;
  onOpenMobile: () => void;
}

export const LowSupplyAlertBanner: React.FC<LowSupplyAlertBannerProps> = ({
  refills,
  onFilterLowSupply,
  onOpenMobile
}) => {
  // Find all active medications with <= 10 days remaining
  const urgentRefills = refills.filter(
    (r) => r.status === 'Blocked' && r.medication.daysRemaining !== undefined && r.medication.daysRemaining <= 10
  );

  if (urgentRefills.length === 0) return null;

  // Most critical medication (least days remaining)
  const sorted = [...urgentRefills].sort((a, b) => (a.medication.daysRemaining ?? 99) - (b.medication.daysRemaining ?? 99));
  const mostCritical = sorted[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border-2 border-rose-500/60 bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 p-4 sm:p-5 shadow-xl shadow-rose-950/40"
    >
      {/* Hospital Emergency Flashing Ambient Glow */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-36 w-36 rounded-full bg-rose-500/20 blur-3xl animate-pulse"></div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Alert Title & Count */}
        <div className="flex items-start space-x-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/40">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
                HOSPITAL CLINICAL ALERT: ≤ 10 DAYS MEDICATION SUPPLY REMAINING
              </h3>
              <span className="rounded-full bg-rose-500/25 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-300 border border-rose-500/40">
                {urgentRefills.length} High-Risk Patients
              </span>
            </div>

            <p className="text-xs text-rose-200/90 leading-relaxed">
              Immediate clinical action required to prevent pharmacotherapy interruption: 
              <strong className="text-white ml-1">
                {mostCritical.patient.name}&apos;s {mostCritical.medication.name} has only{' '}
                <span className="underline decoration-rose-400 font-extrabold text-rose-300">
                  {mostCritical.medication.daysRemaining} days of pills remaining
                </span>
                !
              </strong>
            </p>

            {/* Quick Urgent Pills List */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {urgentRefills.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center space-x-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 px-2.5 py-1 text-[11px] text-rose-200"
                >
                  <Pill className="h-3 w-3 text-rose-400" />
                  <span className="font-semibold text-white">{r.medication.name.split(' ')[0]}</span>
                  <span className="rounded bg-rose-500/30 px-1 font-mono font-bold text-rose-300">
                    {r.medication.daysRemaining}d left
                  </span>
                  <span className="text-rose-400 text-[10px]">({r.patient.name.split(' ')[0]})</span>
                </div>
              ))}
              {urgentRefills.length > 4 && (
                <span className="text-[11px] text-slate-400 font-medium">
                  +{urgentRefills.length - 4} more patients
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onFilterLowSupply}
            className="flex items-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Filter Urgent (≤ 10d)</span>
          </button>

          <button
            onClick={onOpenMobile}
            className="flex items-center space-x-2 rounded-xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-600/40 via-orange-600/40 to-rose-600/40 hover:from-amber-600/60 hover:to-orange-600/60 px-4 py-2 text-xs font-black text-white transition-all shadow-lg shadow-amber-950/50 hover:scale-105 ring-2 ring-amber-400/50"
          >
            <Pill className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>📱 1-Tap Refill on Mobile</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
