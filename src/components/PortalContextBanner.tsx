import React from 'react';
import { 
  Building2, 
  Stethoscope, 
  Send, 
  Sparkles, 
  BellRing, 
  ShieldCheck, 
  Clock, 
  CheckCheck, 
  AlertCircle, 
  FileCheck,
  User,
  Smartphone,
  Pill,
  CheckCircle2
} from 'lucide-react';
import { PortalRole } from '../types/refill';

interface PortalContextBannerProps {
  portalRole: PortalRole;
  onBatchAction: (actionType: string) => void;
  pendingCount: number;
  highConfidenceCount: number;
  onOpenMobile?: () => void;
  onOpenLiveDemo?: () => void;
  onDoctorFastApprove?: () => void;
}

export const PortalContextBanner: React.FC<PortalContextBannerProps> = ({
  portalRole,
  onBatchAction,
  pendingCount,
  highConfidenceCount,
  onOpenMobile,
  onOpenLiveDemo,
  onDoctorFastApprove
}) => {
  // Patient Portal Role View
  if (portalRole === 'patient') {
    return (
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <User className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold text-white tracking-wide">
                PATIENT PORTAL ACCOUNT &bull; ELEANOR VANCE (MRN-449102-B)
              </h2>
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                MyMetroHealth Active
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Primary Care Provider: <strong className="text-white">Dr. Sarah Chen, MD</strong> &bull; Dispensing Pharmacy: <strong className="text-white">CVS Pharmacy #4421</strong>. Track medication renewals and receive instant SMS updates.
            </p>
          </div>

          {/* Patient Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenMobile && (
              <button
                onClick={onOpenMobile}
                className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>📱 Open Mobile Phone App</span>
              </button>
            )}

            {onOpenLiveDemo && (
              <button
                onClick={onOpenLiveDemo}
                className="flex items-center space-x-1.5 rounded-lg border border-purple-500/40 bg-purple-600/20 hover:bg-purple-600/35 px-3 py-1.5 text-xs font-medium text-purple-200 transition-all"
              >
                <Pill className="h-3.5 w-3.5 text-purple-400" />
                <span>Request Refill for Medicine</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (portalRole === 'pharmacy') {
    return (
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold text-white tracking-wide">
                PHARMACY STAFF WORKSPACE &bull; OUTGOING NCPDP SCRIPT QUEUE
              </h2>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                Walgreens / CVS Integrated
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Monitoring unfulfilled refill requests stalled at provider clinics or blocked by PBM prior authorization criteria.
            </p>
          </div>

          {/* Pharmacy Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onBatchAction('batch_ping')}
              className="flex items-center space-x-1.5 rounded-lg border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/35 px-3 py-1.5 text-xs font-medium text-blue-200 transition-all"
            >
              <BellRing className="h-3.5 w-3.5 text-blue-400" />
              <span>Batch Ping Provider Clinics</span>
            </button>

            <button
              onClick={() => onBatchAction('batch_pa')}
              className="flex items-center space-x-1.5 rounded-lg border border-amber-500/40 bg-amber-600/20 hover:bg-amber-600/35 px-3 py-1.5 text-xs font-medium text-amber-200 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Auto-Submit PBM ePA Packets</span>
            </button>

            <button
              onClick={() => onBatchAction('batch_sms')}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all"
            >
              <Send className="h-3.5 w-3.5 text-slate-400" />
              <span>Dispatch Status SMS to Patients</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Physician Practice Portal
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Stethoscope className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-wide">
              PHYSICIAN PRACTICE PORTAL &bull; CLINIC IN BASKET REFILL TRIAGE
            </h2>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              MetroHealth Internal Medicine
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Medical Assistant &amp; Physician review desk with real-time AI explainability, guideline citations, and one-click eRx sign-off.
          </p>
        </div>

        {/* Physician Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {highConfidenceCount > 0 && (
            <div className="flex flex-col items-start sm:items-end">
              <button
                onClick={() => onBatchAction('batch_approve_high')}
                className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                title="Bulk sign-off all safe, guidelines-compliant refills with confidence >= 92%"
              >
                <CheckCheck className="h-3.5 w-3.5 text-white" />
                <span>Batch Sign High-Confidence ({highConfidenceCount} Safe Rxs)</span>
              </button>
              <span className="text-[10px] text-emerald-300/80 mt-0.5 font-mono">
                ⚡ Marked with [⚡ Batch-Eligible] below
              </span>
            </div>
          )}

          {/* Quick Doctor Fast 1-Click Sign-Off */}
          {onDoctorFastApprove && (
            <button
              onClick={onDoctorFastApprove}
              className="flex items-center space-x-2 rounded-lg border-2 border-emerald-400 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-600/40 transition-all hover:scale-[1.03] ring-2 ring-emerald-400/60 active:scale-[0.98]"
              title="Doctor 1-Click Fast Sign-Off: Instantly sign and dispatch the next pending prescription"
            >
              <CheckCircle2 className="h-4 w-4 text-white animate-pulse" />
              <span>⚡ Fast 1-Click Doctor Approve (Next Rx)</span>
            </button>
          )}

          {onOpenMobile && (
            <button
              onClick={onOpenMobile}
              className="flex items-center space-x-1.5 rounded-lg border-2 border-purple-400/70 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-600/30 hover:from-purple-600/50 px-3.5 py-1.5 text-xs font-black text-purple-200 transition-all shadow-md shadow-purple-950/40 hover:scale-[1.02] ring-1 ring-purple-400/40"
            >
              <Smartphone className="h-3.5 w-3.5 text-purple-300" />
              <span>📱 1-Tap Refill (Mobile)</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 rounded-lg bg-slate-950/70 border border-slate-800 px-3 py-1.5 text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>RefillFlow AI Safety Rules Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
