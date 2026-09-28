import React from 'react';
import { 
  Building2, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  FileText,
  Sliders,
  Sparkles,
  Zap,
  Smartphone,
  Hospital,
  Volume2,
  VolumeX,
  CheckCircle2
} from 'lucide-react';
import { PortalRole, HospitalUser } from '../types/refill';
import { HospitalRoleSwitcher } from './HospitalRoleSwitcher';
import { setSoundEnabled, isSoundEnabled } from '../utils/audio';

interface HeaderProps {
  portalRole: PortalRole;
  onRoleChange: (role: PortalRole) => void;
  currentUser: HospitalUser;
  onOpenGtm: () => void;
  onOpenAuditLog: () => void;
  onOpenLiveDemo: () => void;
  onOpenMobile: () => void;
  onResetData: () => void;
  onDoctorFastApprove?: () => void;
  pendingDoctorApprovals?: number;
  activeCount: number;
  resolvedCount: number;
  auditCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  portalRole,
  onRoleChange,
  currentUser,
  onOpenGtm,
  onOpenAuditLog,
  onOpenLiveDemo,
  onOpenMobile,
  onResetData,
  onDoctorFastApprove,
  pendingDoctorApprovals,
  activeCount,
  resolvedCount,
  auditCount
}) => {
  const [isAudioActive, setIsAudioActive] = React.useState(true);

  const toggleSound = () => {
    const next = !isAudioActive;
    setIsAudioActive(next);
    setSoundEnabled(next);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-[#09121f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        
        {/* Brand Logo & Connection Badge */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-500 shadow-lg shadow-teal-500/20">
            <Activity className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Refill<span className="text-cyan-400">Flow</span> <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-xs font-bold text-teal-300 border border-teal-500/40">EHR</span>
              </span>
              <span className="hidden items-center space-x-1 rounded-full bg-slate-900 border border-slate-700/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Hospital Network Live</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              MetroHealth Clinical Prescription Interop &bull; Epic FHIR Connected
            </p>
          </div>
        </div>

        {/* Multi-Account Hospital Role Switcher (Doctor, Pharmacist, Patient) */}
        <div className="hidden lg:flex items-center">
          <HospitalRoleSwitcher
            currentRole={portalRole}
            onRoleChange={onRoleChange}
            currentUser={currentUser}
          />
        </div>

        {/* Actions & Overlays */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* Doctor Fast 1-Click Approve Button */}
          {onDoctorFastApprove && (
            <button
              onClick={onDoctorFastApprove}
              className="flex items-center space-x-1.5 rounded-lg border-2 border-emerald-400/80 bg-gradient-to-r from-emerald-600/40 via-teal-600/40 to-emerald-500/40 hover:from-emerald-500 hover:to-teal-400 px-3 py-1.5 text-xs font-black text-white transition-all shadow-lg shadow-emerald-500/30 hover:scale-[1.03] ring-2 ring-emerald-400/50"
              title="Doctor 1-Click Fast Sign-Off: Instantly sign and dispatch the next pending prescription"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span className="hidden sm:inline">⚡ Doctor Fast Approve</span>
              <span className="inline sm:hidden">⚡ Fast Sign</span>
              {pendingDoctorApprovals !== undefined && pendingDoctorApprovals > 0 && (
                <span className="rounded-full bg-emerald-400 text-slate-950 px-1.5 py-0.2 text-[10px] font-black">
                  {pendingDoctorApprovals}
                </span>
              )}
            </button>
          )}

          {/* Patient Mobile Companion App Button */}
          <button
            onClick={onOpenMobile}
            className="flex items-center space-x-1.5 rounded-lg border-2 border-purple-400/80 bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-cyan-600/40 hover:from-purple-600/60 hover:to-indigo-600/60 px-3 py-1.5 text-xs font-black text-white transition-all shadow-lg shadow-purple-500/30 hover:scale-[1.03] ring-2 ring-purple-400/50"
            title="Open Mobile 1-Tap Medicine Refill: Patient Smartphone App Simulator"
          >
            <Smartphone className="h-4 w-4 text-purple-200 animate-pulse" />
            <span className="hidden sm:inline">💊 1-Tap Refill (Mobile)</span>
            <span className="inline sm:hidden">💊 Refill App</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* Live Demonstration Button */}
          <button
            onClick={onOpenLiveDemo}
            className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/50 bg-gradient-to-r from-cyan-600/25 via-teal-600/25 to-emerald-600/25 hover:from-cyan-600/45 hover:to-teal-600/45 px-3 py-1.5 text-xs font-bold text-cyan-200 transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02] ring-1 ring-cyan-400/40"
            title="Run Live Demonstration: Enter any medicine and watch the entire resolution flow"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Enter Medicine Demo</span>
            <span className="inline sm:hidden">Demo</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* Commercial GTM & ROI Button */}
          <button
            onClick={onOpenGtm}
            className="group relative flex items-center space-x-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/20"
          >
            <TrendingUp className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">GTM & ROI</span>
          </button>

          {/* Activity / Audit Log Button */}
          <button
            onClick={onOpenAuditLog}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            title="View Tamper-Evident EHR & Surescripts FHIR Audit Trail"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Audit Log</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
              {auditCount}
            </span>
          </button>

          {/* Audio Chime Mute/Unmute Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center space-x-1 rounded-lg border p-1.5 transition-colors ${
              isAudioActive
                ? 'border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
                : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:text-slate-400'
            }`}
            title={isAudioActive ? 'Clinical sound effects enabled (Click to mute)' : 'Sound effects muted (Click to enable)'}
          >
            {isAudioActive ? (
              <Volume2 className="h-3.5 w-3.5 text-teal-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-500" />
            )}
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetData}
            className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            title="Reset All Refills to Seed State"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

        </div>
      </div>

      {/* Mobile-Only Account Switcher bar */}
      <div className="lg:hidden px-4 py-2 border-t border-slate-800/80 bg-slate-950 flex justify-center">
        <HospitalRoleSwitcher
          currentRole={portalRole}
          onRoleChange={onRoleChange}
          currentUser={currentUser}
        />
      </div>
    </header>
  );
};

