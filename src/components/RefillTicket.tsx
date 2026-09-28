import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FlaskConical, 
  Video, 
  XCircle, 
  FileSearch, 
  Clock, 
  Building, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Sliders,
  FileCheck,
  Pill,
  Save
} from 'lucide-react';
import { RefillRequest, PortalRole } from '../types/refill';

interface RefillTicketProps {
  refill: RefillRequest;
  portalRole: PortalRole;
  onOpenExplainability: (refill: RefillRequest) => void;
  onQuickApprove: (refill: RefillRequest, note?: string) => void;
  onQuickBridgeLab: (refill: RefillRequest, note?: string) => void;
  onQuickTelehealth: (refill: RefillRequest, note?: string) => void;
  onQuickDeny: (refill: RefillRequest) => void;
}

export const RefillTicket: React.FC<RefillTicketProps> = ({
  refill,
  portalRole,
  onOpenExplainability,
  onQuickApprove,
  onQuickBridgeLab,
  onQuickTelehealth,
  onQuickDeny
}) => {
  // Doctor custom adjustment state
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedDosage, setAdjustedDosage] = useState(refill.medication.dosage);
  const [adjustedDaysSupply, setAdjustedDaysSupply] = useState(refill.medication.daysSupply);
  const [adjustedNote, setAdjustedNote] = useState('');

  // Blocker styling
  const getBlockerBadge = () => {
    switch (refill.blocker) {
      case 'Prior Authorization Required by PBM':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400',
          icon: ShieldCheck,
          label: 'Prior Auth Required (PBM)'
        };
      case 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          icon: FlaskConical,
          label: 'Monitoring Lab Due'
        };
      case 'No Refills Remaining (Requires New Rx)':
        return {
          bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
          dot: 'bg-cyan-400',
          icon: AlertTriangle,
          label: '0 Refills Left (New Rx Needed)'
        };
      case 'Patient Needs Follow-up Visit':
        return {
          bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          dot: 'bg-purple-400',
          icon: Video,
          label: 'Follow-up Visit Due'
        };
      default:
        return {
          bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
          dot: 'bg-slate-400',
          icon: AlertTriangle,
          label: refill.blocker
        };
    }
  };

  const blockerStyle = getBlockerBadge();
  const BlockerIcon = blockerStyle.icon;

  // Urgency, Critical Depletion, and Batch-Eligibility flags
  const isCritical = refill.urgency === 'critical';
  const isLowSupply = refill.medication.daysRemaining !== undefined && refill.medication.daysRemaining <= 10;
  const isImmediateCritical = refill.medication.daysRemaining !== undefined && refill.medication.daysRemaining <= 2;
  const isBatchEligible = refill.status === 'Blocked' && refill.aiRecommendation.confidenceScore >= 92;

  // AI-recommended action types
  const isApproveRecommended = refill.aiRecommendation.actionType === 'approve_erx' || (refill.aiRecommendation.actionType as string) === 'auto_approve';
  const isBridgeRecommended = refill.aiRecommendation.actionType === 'bridge_and_lab';
  const isTelehealthRecommended = refill.aiRecommendation.actionType === 'telehealth_visit';
  const isDenyRecommended = refill.aiRecommendation.actionType === 'deny';

  // Handle approving with custom doctor adjustments
  const handleApproveWithChanges = () => {
    const updatedRefill: RefillRequest = {
      ...refill,
      medication: {
        ...refill.medication,
        dosage: adjustedDosage,
        daysSupply: adjustedDaysSupply,
        quantity: adjustedDaysSupply === 90 ? 180 : 30
      }
    };
    const note = adjustedNote || `Doctor approved with modified parameters: ${adjustedDosage}, ${adjustedDaysSupply}-day supply. Electronically transmitted via Surescripts.`;
    onQuickApprove(updatedRefill, note);
  };

  // Handle issuing 30-day bridge with custom doctor adjustments
  const handleBridgeWithChanges = () => {
    const updatedRefill: RefillRequest = {
      ...refill,
      medication: {
        ...refill.medication,
        dosage: adjustedDosage,
        daysSupply: 30,
        quantity: 30
      }
    };
    const note = adjustedNote || `Doctor authorized 30-day bridge with modified dosage (${adjustedDosage}) while standing safety labs are drawn.`;
    onQuickBridgeLab(updatedRefill, note);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95, transition: { duration: 0.28 } }}
      transition={{ duration: 0.25 }}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-200 ${
        isImmediateCritical
          ? 'border-2 border-red-500 bg-gradient-to-b from-[#1c0b13] via-[#0d1624] to-[#09111c] shadow-2xl shadow-red-950/70 ring-2 ring-red-500/50'
          : isLowSupply
          ? 'border border-rose-500/50 bg-[#0d1624] hover:border-rose-400/80 shadow-lg shadow-rose-950/20'
          : isCritical 
          ? 'border border-rose-500/40 bg-[#0d1624] hover:border-rose-400/70 shadow-lg shadow-rose-950/20' 
          : 'border border-slate-800/90 bg-[#0c1421]/90 hover:border-slate-700/90 shadow-md'
      }`}
    >
      {/* 🔴 Immediate Critical Depletion Warning Strip (≤ 2 Days Left) */}
      {isImmediateCritical && (
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-600 px-4 py-1.5 flex items-center justify-between text-xs font-bold text-white shadow-inner animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="tracking-wide uppercase">
              🚨 CRITICAL / HIGH-RISK DEPLETION: Patient has only {refill.medication.daysRemaining} DAY{refill.medication.daysRemaining === 1 ? '' : 'S'} of medication remaining!
            </span>
          </div>
          <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-extrabold uppercase border border-white/30">
            Immediate Action Required
          </span>
        </div>
      )}

      {/* Top Blocker Banner & Urgency */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#09111c]/70 px-4 py-2.5 text-xs">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${blockerStyle.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${blockerStyle.dot} animate-pulse`}></span>
            <BlockerIcon className="h-3 w-3" />
            <span>{blockerStyle.label}</span>
          </span>

          {refill.medication.deaSchedule && (
            <span className="rounded bg-red-950/70 border border-red-800/60 px-2 py-0.5 text-[10px] font-bold text-red-300 uppercase tracking-wider">
              {refill.medication.deaSchedule}
            </span>
          )}

          <span className="font-mono text-slate-400 text-[11px]">
            {refill.rxNumber}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          {/* Top Bar Batch-Eligible Tag */}
          {isBatchEligible && (
            <span 
              className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300"
              title="Eligible for bulk 1-click batch signing"
            >
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>⚡ Batch-Eligible ({refill.aiRecommendation.confidenceScore}%)</span>
            </span>
          )}

          {isImmediateCritical ? (
            <span className="flex items-center gap-1 rounded bg-red-600/30 border border-red-500 px-2.5 py-0.5 text-red-200 font-extrabold animate-pulse">
              <Flame className="h-3 w-3 text-red-400" />
              <span>CRITICAL: {refill.medication.daysRemaining}d Left</span>
            </span>
          ) : isLowSupply ? (
            <span className="flex items-center gap-1 rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-rose-300 font-extrabold">
              <Flame className="h-3 w-3 text-rose-400" />
              <span>≤ 10d Supply: {refill.medication.daysRemaining}d Left</span>
            </span>
          ) : null}

          {/* Quick Doctor Fast-Approve Button (Top of Card) */}
          {portalRole === 'physician' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickApprove(refill);
              }}
              className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 px-3 py-1 text-xs font-black text-white shadow-md shadow-emerald-600/40 ring-2 ring-emerald-400/60 active:scale-95 transition-all hover:scale-105"
              title="Doctor 1-Click Fast Sign-Off: Sign and transmit eRx via Surescripts FHIR API"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              <span>⚡ Fast Approve</span>
            </button>
          )}

          <span>Queue Wait: <strong className="text-slate-200">22m</strong></span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-3.5">
        
        {/* Critical Low Supply Alert Bar inside the card (when > 2d and <= 10d) */}
        {!isImmediateCritical && isLowSupply && (
          <div className="rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 p-2.5 flex items-center justify-between text-xs text-rose-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>
                <strong>Urgent Depletion Warning:</strong> Patient has only{' '}
                <strong className="text-white underline">{refill.medication.daysRemaining} days of medication remaining</strong>. Renewal fast-tracked to prevent therapy gap.
              </span>
            </div>
            <span className="rounded bg-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-200 shrink-0">
              Discontinuation Risk
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          
          {/* Col 1: Patient & Medication Specs (7 cols) */}
          <div className="space-y-3 lg:col-span-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {refill.patient.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    ({refill.patient.age}yo {refill.patient.gender} &bull; DOB: {refill.patient.dob})
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-slate-300">
                    {refill.patient.mrn}
                  </span>

                  {/* Immediate Critical Badge */}
                  {isImmediateCritical && (
                    <span className="inline-flex items-center gap-1 rounded bg-red-600/30 border border-red-500 px-2 py-0.5 text-[10px] font-extrabold text-red-200 animate-pulse">
                      <Flame className="h-3 w-3 text-red-400" />
                      CRITICAL / HIGH-RISK (&le; 2d)
                    </span>
                  )}

                  {/* Batch-Eligible Tag */}
                  {isBatchEligible && (
                    <span 
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300 shadow-sm shadow-emerald-500/20"
                      title="Eligible for 1-click bulk sign-off (AI confidence score >= 92%)"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span>Batch-Eligible</span>
                    </span>
                  )}
                </div>
                
                {/* Medication Details */}
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-sm font-semibold text-emerald-400">
                    {refill.medication.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({refill.medication.dosage}) &bull; Qty: {refill.medication.quantity} &bull; {refill.medication.daysSupply}-day supply
                  </span>
                </div>

                {/* SIG */}
                <p className="mt-1 text-xs text-slate-300 italic bg-slate-950/60 rounded p-2 border border-slate-800/80">
                  &ldquo;{refill.medication.sig}&rdquo;
                </p>
              </div>
            </div>

            {/* Context meta: Pharmacy & Clinician */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
              <div className="flex items-center space-x-1.5">
                <Building className="h-3.5 w-3.5 text-slate-500" />
                <span>{refill.pharmacy.name}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Last Prescribed: {refill.clinicalEvidence.lastVisitDate}</span>
              </div>
            </div>

            {/* Blocker specific detail alert */}
            <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-xs text-slate-300">
              <strong className="text-amber-300">Blocker Diagnostic:</strong> {refill.blockerDetails}
            </div>
          </div>

          {/* Col 2: AI Explainability Card & Recommendation (5 cols) */}
          <div className="flex flex-col justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-slate-900/40 to-slate-950/60 p-3.5 lg:col-span-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/20 text-indigo-300">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    RefillFlow Clinical AI
                  </span>
                </div>
                
                {/* AI Confidence Gauge Badge */}
                <div className="flex items-center space-x-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>{refill.aiRecommendation.confidenceScore}% Confidence</span>
                </div>
              </div>

              {/* Recommendation Title */}
              <div className="text-xs font-semibold text-white">
                Recommendation: <span className="text-cyan-300">{refill.aiRecommendation.actionTitle}</span>
              </div>

              {/* Clinical Evidence Summary */}
              <p className="text-[11px] leading-relaxed text-slate-300">
                <strong className="text-slate-200">Clinical Evidence: </strong>
                {refill.aiRecommendation.reasoning.slice(0, 155)}...
              </p>

              {/* Quick metrics preview */}
              <div className="flex items-center space-x-2 pt-1 text-[10px] text-slate-400">
                <span className="rounded bg-slate-800/80 px-1.5 py-0.5 border border-slate-700/50">
                  Adherence: <strong className="text-emerald-400">{refill.clinicalEvidence.adherenceRate}%</strong>
                </span>
                <span className="rounded bg-slate-800/80 px-1.5 py-0.5 border border-slate-700/50">
                  Last Visit: <strong className="text-slate-300">{refill.clinicalEvidence.lastVisitDaysAgo}d ago</strong>
                </span>
                <span className="rounded bg-slate-800/80 px-1.5 py-0.5 border border-slate-700/50">
                  Safety: <strong className="text-emerald-400">{refill.aiRecommendation.riskScore}</strong>
                </span>
              </div>
            </div>

            {/* Inspect Evidence Button */}
            <div className="mt-3 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => onOpenExplainability(refill)}
                className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/40 py-1.5 text-xs font-medium text-indigo-200 transition-colors"
              >
                <FileSearch className="h-3.5 w-3.5 text-indigo-400" />
                <span>Inspect Full AI Rationale &amp; FHIR Data</span>
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              </button>
            </div>

          </div>
        </div>

        {/* Doctor Custom Prescription Modification Panel */}
        <AnimatePresence>
          {isAdjusting && portalRole === 'physician' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-cyan-500/40 bg-slate-950/90 p-3.5 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Prescriber Clinical Modification Desk (Dr. Sarah Chen, MD)
                </span>
                <span className="text-[10px] text-slate-400">
                  Make changes to prescription prior to electronic sign-off
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Adjust Dosage / Strength:</label>
                  <input
                    type="text"
                    value={adjustedDosage}
                    onChange={(e) => setAdjustedDosage(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Days Supply:</label>
                  <select
                    value={adjustedDaysSupply}
                    onChange={(e) => setAdjustedDaysSupply(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={30}>30 Days (Bridge / Standard)</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days (Maintenance Supply)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Prescriber Sign-off Note:</label>
                  <input
                    type="text"
                    value={adjustedNote}
                    onChange={(e) => setAdjustedNote(e.target.value)}
                    placeholder="e.g. Dose confirmed safe under ADA criteria..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                  {/* Quick Note Presets */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[
                      'Confirmed safe under ADA guidelines',
                      'Dose adjusted for renal protection',
                      '30-day bridge pending routine HbA1c draw'
                    ].map((notePreset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAdjustedNote(notePreset)}
                        className="rounded bg-slate-800/80 hover:bg-slate-700 px-1.5 py-0.5 text-[9px] text-slate-300 border border-slate-700 transition-colors"
                      >
                        + {notePreset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsAdjusting(false)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBridgeWithChanges}
                  className="flex items-center space-x-1.5 rounded-lg bg-amber-600/25 hover:bg-amber-600/40 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors"
                  title="Issue 30-day bridge supply with adjusted dosage and standing lab requisition"
                >
                  <FlaskConical className="h-3.5 w-3.5 text-amber-400" />
                  <span>Issue 30d Bridge With Changes</span>
                </button>
                <button
                  onClick={handleApproveWithChanges}
                  className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3.5 py-1.5 font-bold text-white shadow-md shadow-emerald-600/30 text-xs transition-all"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Approve &amp; Sign With Changes</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Human-in-the-Loop Action Suite */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
          
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>
              {portalRole === 'physician' 
                ? 'Physician Sign-off Desk (Dr. Sarah Chen, MD)' 
                : portalRole === 'pharmacy'
                ? 'Pharmacy Outgoing Dispatch Desk (Dr. James Holloway, PharmD)'
                : 'Patient View: Pending Care Team Review'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Toggle Doctor Modification Drawer */}
            {portalRole === 'physician' && (
              <button
                onClick={() => setIsAdjusting(!isAdjusting)}
                className={`flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border ${
                  isAdjusting
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
                title="Modify dosage, days supply, or clinical notes before approving"
              >
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>{isAdjusting ? 'Close Adjustments' : 'Adjust Order'}</span>
              </button>
            )}

            {/* Action 1: One-Click Fast Approve */}
            <button
              onClick={() => onQuickApprove(refill)}
              className={`flex items-center space-x-2 transition-all ${
                isApproveRecommended
                  ? 'rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 px-5 py-2.5 text-xs font-black text-white shadow-xl shadow-emerald-600/40 ring-2 ring-emerald-400/80 hover:scale-[1.03] active:scale-[0.98]'
                  : 'rounded-lg border border-slate-700 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-emerald-950/30 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-emerald-300'
              }`}
              title="Issue approved electronic prescription directly via Surescripts FHIR API"
            >
              <CheckCircle2 className={`h-4 w-4 ${isApproveRecommended ? 'text-white' : 'text-emerald-400'}`} />
              <span>⚡ Fast 1-Click Approve &amp; Issue eRx</span>
              {isApproveRecommended && (
                <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 border border-emerald-300/40">
                  ⭐ Recommended
                </span>
              )}
            </button>

            {/* Action 2: Bridge & Lab Order */}
            <button
              onClick={() => onQuickBridgeLab(refill)}
              className={`flex items-center space-x-1.5 transition-all ${
                isBridgeRecommended
                  ? 'rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-600/35 ring-2 ring-amber-400/60 hover:scale-[1.03] active:scale-[0.98]'
                  : 'rounded-lg border border-slate-700 bg-slate-900/60 hover:border-amber-500/50 hover:bg-amber-950/30 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-amber-300'
              }`}
              title="Dispense 30-day safety bridge supply and transmit standing electronic lab order"
            >
              <FlaskConical className={`h-3.5 w-3.5 ${isBridgeRecommended ? 'text-white' : 'text-amber-400'}`} />
              <span>Order Lab &amp; 30-Day Bridge</span>
              {isBridgeRecommended && (
                <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-200 border border-amber-300/40">
                  ⭐ Recommended
                </span>
              )}
            </button>

            {/* Action 3: Request Telehealth */}
            <button
              onClick={() => onQuickTelehealth(refill)}
              className={`flex items-center space-x-1.5 transition-all ${
                isTelehealthRecommended
                  ? 'rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/35 ring-2 ring-purple-400/60 hover:scale-[1.03] active:scale-[0.98]'
                  : 'rounded-lg border border-slate-700 bg-slate-900/60 hover:border-purple-500/50 hover:bg-purple-950/30 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-purple-300'
              }`}
              title="SMS patient instant video link for mandated clinical evaluation"
            >
              <Video className={`h-3.5 w-3.5 ${isTelehealthRecommended ? 'text-white' : 'text-purple-400'}`} />
              <span>Request Telehealth</span>
              {isTelehealthRecommended && (
                <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-purple-200 border border-purple-300/40">
                  ⭐ Recommended
                </span>
              )}
            </button>

            {/* Action 4: Deny */}
            <button
              onClick={() => onQuickDeny(refill)}
              className={`flex items-center space-x-1.5 transition-all ${
                isDenyRecommended
                  ? 'rounded-xl bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-700/35 ring-2 ring-rose-400/60 hover:scale-[1.03] active:scale-[0.98]'
                  : 'rounded-lg border border-slate-700 bg-slate-900/60 hover:border-rose-600/50 hover:bg-rose-950/30 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-300'
              }`}
              title="Deny refill request with structured clinical reason"
            >
              <XCircle className={`h-3.5 w-3.5 ${isDenyRecommended ? 'text-white' : 'text-rose-400'}`} />
              <span>Deny</span>
              {isDenyRecommended && (
                <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-rose-200 border border-rose-300/40">
                  ⭐ Recommended
                </span>
              )}
            </button>

          </div>

        </div>

      </div>
    </motion.div>
  );
};
