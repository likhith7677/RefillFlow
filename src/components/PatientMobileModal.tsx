import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Smartphone, 
  Pill, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Info, 
  Send, 
  Activity, 
  ShieldCheck, 
  PlusCircle, 
  Building2, 
  Stethoscope, 
  Sparkles,
  ChevronRight,
  RefreshCw,
  BellRing,
  UserCheck,
  ArrowRight,
  Sliders,
  Check,
  Flame,
  HeartPulse,
  Zap,
  Gauge,
  QrCode
} from 'lucide-react';
import { RefillRequest, PortalRole } from '../types/refill';
import { playSmsReceivedSound, playLowSupplyAlertSound } from '../utils/audio';

interface PatientMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  refills: RefillRequest[];
  onRequestRefill: (medicationName: string, daysRemaining?: number) => void;
  patientName?: string;
  onSwitchRole?: (role: PortalRole) => void;
}

interface SmsMessage {
  id: string;
  sender: 'clinic' | 'pharmacy' | 'patient' | 'system';
  senderLabel: string;
  text: string;
  time: string;
  isNew?: boolean;
}

export const PatientMobileModal: React.FC<PatientMobileModalProps> = ({
  isOpen,
  onClose,
  refills,
  onRequestRefill,
  patientName = 'Eleanor Vance',
  onSwitchRole
}) => {
  const [activeTab, setActiveTab] = useState<'rxs' | 'sms' | 'explainer'>('rxs');
  const [newMedInput, setNewMedInput] = useState('');
  const [newMedDays, setNewMedDays] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRequestedMed, setLastRequestedMed] = useState<string | null>(null);

  // Live Interactive SMS State
  const [smsInput, setSmsInput] = useState('');
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>([
    {
      id: 'sms-1',
      sender: 'clinic',
      senderLabel: 'MetroHealth Primary Care (Dr. Sarah Chen)',
      text: 'Hi Eleanor, your annual refill review for Metformin HCl 1000mg is currently with Dr. Sarah Chen. We are monitoring your safety labs.',
      time: '8:15 AM'
    },
    {
      id: 'sms-2',
      sender: 'pharmacy',
      senderLabel: 'CVS Pharmacy #4421',
      text: 'Prescription update: Waiting for doctor electronic sign-off from MetroHealth Clinic. We will notify you once dispensed.',
      time: '8:20 AM'
    }
  ]);
  const [isTypingSms, setIsTypingSms] = useState(false);
  const smsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll SMS feed
  useEffect(() => {
    if (activeTab === 'sms' && smsScrollRef.current) {
      smsScrollRef.current.scrollTop = smsScrollRef.current.scrollHeight;
    }
  }, [smsMessages, activeTab]);

  if (!isOpen) return null;

  // Filter refills for this patient or display active queue
  const patientRefills = refills.filter(
    (r) => r.patient.name.toLowerCase().includes(patientName.toLowerCase().split(' ')[0])
  );
  const displayedRefills = patientRefills.length > 0 ? patientRefills : refills.slice(0, 4);

  // Count medications with <= 10 days remaining
  const lowSupplyMeds = displayedRefills.filter(
    (r) => r.medication.daysRemaining !== undefined && r.medication.daysRemaining <= 10
  );
  const lowSupplyCount = lowSupplyMeds.length;

  const handleQuickRequest = (medName: string, daysRemaining = 4) => {
    if (!medName.trim()) return;
    setIsSubmitting(true);
    setLastRequestedMed(medName);

    setTimeout(() => {
      onRequestRefill(medName, daysRemaining);
      setIsSubmitting(false);
      setNewMedInput('');

      // Add automated SMS confirmation
      const newSms: SmsMessage = {
        id: `sms-${Date.now()}`,
        sender: 'system',
        senderLabel: 'RefillFlow Mobile Bot',
        text: `Refill request for ${medName} submitted! Only ${daysRemaining} days remaining. Sent with high priority to Dr. Sarah Chen's In Basket.`,
        time: 'Just now',
        isNew: true
      };
      setSmsMessages((prev) => [...prev, newSms]);
      playSmsReceivedSound();
    }, 400);
  };

  const handleSendSms = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!smsInput.trim()) return;

    const userText = smsInput.trim();
    const userMsg: SmsMessage = {
      id: `sms-user-${Date.now()}`,
      sender: 'patient',
      senderLabel: 'You (Eleanor Vance)',
      text: userText,
      time: 'Just now'
    };

    setSmsMessages((prev) => [...prev, userMsg]);
    setSmsInput('');
    setIsTypingSms(true);

    // Dynamic smart reply
    setTimeout(() => {
      setIsTypingSms(false);
      let replyText = "We received your message. Dr. Sarah Chen's care team is reviewing your active prescriptions.";
      let replySender: 'clinic' | 'pharmacy' = 'clinic';
      let replyLabel = 'MetroHealth Care Concierge';

      const lower = userText.toLowerCase();
      if (lower.includes('ready') || lower.includes('pickup') || lower.includes('cvs')) {
        replySender = 'pharmacy';
        replyLabel = 'CVS Pharmacy #4421 Automated Triage';
        const readyMed = displayedRefills.find((r) => r.status === 'Resolved');
        if (readyMed) {
          replyText = `Yes! Your ${readyMed.medication.name} (${readyMed.medication.dosage}) has been signed off and is ready for pickup or curbside at CVS Pharmacy #4421 (742 Evergreen Terrace).`;
        } else {
          replyText = `Your prescription is currently being evaluated by Dr. Sarah Chen. As soon as she approves, CVS Pharmacy will dispense it within 20 minutes!`;
        }
      } else if (lower.includes('doctor') || lower.includes('chen') || lower.includes('bridge') || lower.includes('lab')) {
        replySender = 'clinic';
        replyLabel = 'MetroHealth Primary Care (Dr. Chen)';
        replyText = `Dr. Chen has standing orders to issue a 30-day bridge supply so you won't run out while routine blood work is arranged.`;
      } else if (lower.includes('days') || lower.includes('run out') || lower.includes('supply') || lower.includes('emergency')) {
        replySender = 'clinic';
        replyLabel = 'MetroHealth Urgent Medication Line';
        replyText = `Alert noted! We see your medication has less than 10 days supply remaining. High-priority clinical flag attached to your chart.`;
      }

      const botReply: SmsMessage = {
        id: `sms-bot-${Date.now()}`,
        sender: replySender,
        senderLabel: replyLabel,
        text: replyText,
        time: 'Just now',
        isNew: true
      };
      setSmsMessages((prev) => [...prev, botReply]);
      playSmsReceivedSound();
    }, 900);
  };

  const handlePromptClick = (prompt: string) => {
    setSmsInput(prompt);
  };

  // Preset fast-refill medicines
  const fastPresets = [
    { name: 'Metformin 1000mg', days: 4, tag: '4d left' },
    { name: 'Eliquis 5mg', days: 1, tag: '1d left' },
    { name: 'Adderall XR 20mg', days: 2, tag: '2d left' },
    { name: 'Lisinopril 20mg', days: 8, tag: '8d left' },
    { name: 'Atorvastatin 40mg', days: 15, tag: '15d left' },
    { name: 'Ozempic 1mg/dose', days: 3, tag: '3d left' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 sm:p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative flex flex-col w-full max-w-lg overflow-hidden rounded-[2.5rem] border-[6px] border-slate-700 bg-slate-950 shadow-2xl shadow-cyan-950/60 text-slate-100"
        style={{ minHeight: '720px', maxHeight: '94vh' }}
      >
        {/* Smartphone Hardware Notch / Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-4 w-32 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/60 shadow-inner">
          <div className="h-2 w-2 rounded-full bg-slate-900 mr-2 flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-blue-900/60"></div>
          </div>
          <div className="h-1.5 w-7 rounded-full bg-slate-900"></div>
        </div>

        {/* Smartphone Status Bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none z-20">
          <span className="font-mono">9:41 AM</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono">5G</span>
            <span>&bull;</span>
            <div className="h-2.5 w-5 rounded-sm border border-slate-400 p-0.5 flex items-center">
              <div className="h-full w-full bg-emerald-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-teal-950/70 to-slate-900 px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300/40">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-extrabold text-white tracking-wide">
                  MetroHealth <span className="text-cyan-400">RxPortal</span>
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400">
                Patient: <strong className="text-slate-200">{patientName}</strong> &bull; MRN: #892014
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title="Close Mobile View"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Low-Supply Alert Pill if <= 10 Days */}
        {lowSupplyCount > 0 && (
          <div className="bg-gradient-to-r from-rose-950/95 via-red-950/90 to-amber-950/95 border-b-2 border-rose-500/60 px-4 py-2.5 flex items-center justify-between text-xs text-rose-200 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0"></div>
              <span>
                <strong className="text-white">{lowSupplyCount} Medicine{lowSupplyCount > 1 ? 's' : ''}</strong> will deplete in &le; 10 days!
              </span>
            </div>
            <span className="rounded-full bg-rose-500/40 px-2 py-0.5 text-[10px] font-black text-rose-200 border border-rose-400/50 uppercase tracking-wider animate-pulse">
              🚨 Refill Needed
            </span>
          </div>
        )}

        {/* Mobile App Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 text-xs select-none">
          <button
            onClick={() => setActiveTab('rxs')}
            className={`flex-1 py-2.5 text-center font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'rxs'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="h-3.5 w-3.5" />
            <span>Prescriptions ({displayedRefills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-2.5 text-center font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'sms'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Live SMS ({smsMessages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('explainer')}
            className={`flex-1 py-2.5 text-center font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'explainer'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>Telemetry</span>
          </button>
        </div>

        {/* Mobile Body Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-[#070d16]">
          <AnimatePresence mode="wait">

            {/* TAB 1: Prescriptions & Live Status Tracker */}
            {activeTab === 'rxs' && (
              <motion.div
                key="rxs-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="space-y-4"
              >
                {/* Real-World Patient Confirmation Card */}
                {lastRequestedMed && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border-2 border-cyan-500/60 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/80 p-4 space-y-2.5 text-xs shadow-xl shadow-cyan-950/40"
                  >
                    <div className="flex items-center space-x-2 text-cyan-300 font-extrabold text-sm">
                      <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                      <span>Refill Order Dispatched to Dr. Sarah Chen</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1.5 pl-7">
                      <div>Prescription: <strong className="text-white text-xs">{lastRequestedMed}</strong></div>
                      <div>Reviewing Physician: <strong className="text-slate-200">Dr. Sarah Chen, MD (Primary Care)</strong></div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                        <span className="text-amber-300 font-bold">In Clinical Triage &bull; Estimated review: ~2 hrs</span>
                      </div>
                      <p className="text-[10px] text-slate-400 pt-1 leading-relaxed border-t border-slate-800/80 mt-1">
                        Surescripts FHIR token generated. Once approved, CVS Pharmacy #4421 receives instant dispensing instructions.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* HERO MEDICAL EQUIPMENT: CLINICAL 1-TAP REFILL CONSOLE / DISPENSER UNIT   */}
                {/* ========================================================================= */}
                <div className="relative rounded-2xl border-2 border-teal-500/60 bg-gradient-to-b from-slate-900 via-[#0a1626] to-[#06101d] p-4 shadow-xl shadow-teal-950/50 overflow-hidden">
                  {/* Medical Equipment Hardware Header Strip */}
                  <div className="flex items-center justify-between pb-3 border-b border-teal-500/30 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        <Zap className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                          <span>1-Tap Refill Dispenser Unit</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        </div>
                        <span className="text-[9px] text-teal-400/80 font-mono">MODEL: RX-TELEMETRY-9000</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-full px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      <span>ONLINE</span>
                    </div>
                  </div>

                  {/* Form & Input Section */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newMedInput.trim()) {
                        handleQuickRequest(newMedInput.trim(), newMedDays);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Enter or Select Medicine to Refill:</span>
                        <span className="text-[10px] text-cyan-400 font-mono">Direct Surescripts Interop</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newMedInput}
                          onChange={(e) => setNewMedInput(e.target.value)}
                          placeholder="e.g. Metformin 1000mg, Eliquis 5mg, Ozempic..."
                          className="w-full rounded-xl border-2 border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium"
                        />
                        {newMedInput && (
                          <button
                            type="button"
                            onClick={() => setNewMedInput('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick 1-Tap Preset Medication Chips */}
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                        ⚡ Quick Select Your Medication:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {fastPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNewMedInput(preset.name);
                              setNewMedDays(preset.days);
                            }}
                            className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all border ${
                              newMedInput === preset.name
                                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                                : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="truncate">{preset.name.split(' ')[0]}</span>
                            <span className={`text-[9px] font-mono px-1 rounded ${
                              preset.days <= 2 ? 'bg-rose-500/30 text-rose-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {preset.tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Days Supply Dial Selector */}
                    <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>Supply Left in Bottle:</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[
                          { days: 1, label: '1d (🚨 Crit)' },
                          { days: 4, label: '4d (⚠️ Urgent)' },
                          { days: 8, label: '8d (≤10d)' },
                          { days: 30, label: '30d' }
                        ].map((d) => (
                          <button
                            key={d.days}
                            type="button"
                            onClick={() => setNewMedDays(d.days)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                              newMedDays === d.days
                                ? d.days <= 2
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/50'
                                  : 'bg-teal-600 text-white shadow-md shadow-teal-600/50'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ================================================================= */}
                    {/* SEPARATE BIG HIGH-CONTRAST 1-TAP REFILL BUTTON                   */}
                    {/* ================================================================= */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !newMedInput.trim()}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/40 ring-2 ring-cyan-300/60 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2.5"
                    >
                      <Pill className="h-5 w-5 animate-pulse" />
                      <span>{isSubmitting ? 'DISPATCHING REFILL...' : '🚀 REFILL MY PRESCRIPTION NOW'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                {/* ========================================================================= */}
                {/* MEDICAL EQUIPMENT ACTIVE MEDICATIONS (AMBER VIALS & TELEMETRY MONITORS)   */}
                {/* ========================================================================= */}
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-cyan-400" />
                      Active Prescriptions &bull; EHR Hardware Vials
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">AUTONOMOUS SYNC</span>
                  </div>

                  {displayedRefills.map((refill) => {
                    const isLowSupply = refill.medication.daysRemaining !== undefined && refill.medication.daysRemaining <= 10;
                    const isCritical = refill.medication.daysRemaining !== undefined && refill.medication.daysRemaining <= 2;
                    const isResolved = refill.status === 'Resolved' || refill.status === 'Fulfilled';

                    return (
                      <div
                        key={refill.id}
                        className={`rounded-2xl overflow-hidden border-2 transition-all shadow-xl ${
                          isResolved
                            ? 'border-emerald-500/70 bg-gradient-to-b from-[#0a1e17] via-[#061510] to-[#030c09] shadow-emerald-950/40'
                            : isCritical
                            ? 'border-rose-500/80 bg-gradient-to-b from-[#2a0e14] via-[#1a080c] to-[#0f0407] shadow-rose-950/50 ring-2 ring-rose-500/40'
                            : isLowSupply
                            ? 'border-amber-500/70 bg-gradient-to-b from-[#241306] via-[#1a0c03] to-[#0d0601] shadow-amber-950/40'
                            : 'border-slate-700 bg-gradient-to-b from-slate-900 via-[#0e1726] to-[#090f19]'
                        }`}
                      >
                        {/* ------------------------------------------------------------- */}
                        {/* 1. CHILDPROOF RIBBED CAP ON TOP OF AMBER VIAL                */}
                        {/* ------------------------------------------------------------- */}
                        <div className="bg-gradient-to-r from-slate-300 via-white to-slate-200 border-b-2 border-slate-400 py-1.5 px-3 flex items-center justify-between text-slate-900 select-none shadow-inner">
                          <div className="flex items-center space-x-1.5">
                            <div className="flex space-x-0.5 opacity-60">
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                            </div>
                            <span className="text-[9px] font-black tracking-widest uppercase">
                              PUSH DOWN &amp; TURN TO OPEN
                            </span>
                            <div className="flex space-x-0.5 opacity-60">
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                              <span className="w-0.5 h-3 bg-slate-800 inline-block"></span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <span className="text-[8px] font-mono font-bold bg-amber-500/30 text-amber-950 border border-amber-600/50 rounded px-1.5 py-0.2">
                              SAFETY LOCK
                            </span>
                          </div>
                        </div>

                        {/* Tamper-evident Holographic Ribbon */}
                        <div className="bg-gradient-to-r from-rose-900/60 via-amber-800/60 to-cyan-900/60 px-3 py-0.5 flex items-center justify-between text-[8px] font-mono text-slate-300 border-b border-amber-600/30">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-2.5 w-2.5 text-cyan-400" />
                            METROHEALTH CLINICAL PHARMACY &bull; DISPENSER VIAL
                          </span>
                          <span>Rx #{refill.rxNumber.replace('RX-', '')}</span>
                        </div>

                        {/* ------------------------------------------------------------- */}
                        {/* 2. AUTHENTIC PHARMACY PRESCRIPTION LABEL (BOTTLE FRONT)       */}
                        {/* ------------------------------------------------------------- */}
                        <div className="p-3.5 space-y-3">
                          <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                                  {refill.pharmacy.name}
                                </div>
                                <h4 className="text-sm font-black text-white mt-0.5">
                                  {refill.medication.name}
                                </h4>
                                <p className="text-[11px] font-medium text-slate-300 mt-0.5">
                                  Dosage: <strong className="text-cyan-300 font-bold">{refill.medication.dosage}</strong> &bull; Supply: <strong className="text-slate-200">{refill.medication.daysSupply} Days</strong>
                                </p>
                              </div>

                              {/* Barcode SVG */}
                              <div className="hidden sm:flex flex-col items-end">
                                <svg className="h-6 w-24" viewBox="0 0 100 24">
                                  <rect x="0" y="0" width="2" height="24" fill="#94a3b8" />
                                  <rect x="4" y="0" width="3" height="24" fill="#94a3b8" />
                                  <rect x="10" y="0" width="1" height="24" fill="#94a3b8" />
                                  <rect x="14" y="0" width="4" height="24" fill="#94a3b8" />
                                  <rect x="22" y="0" width="2" height="24" fill="#94a3b8" />
                                  <rect x="28" y="0" width="1" height="24" fill="#94a3b8" />
                                  <rect x="32" y="0" width="3" height="24" fill="#94a3b8" />
                                  <rect x="40" y="0" width="2" height="24" fill="#94a3b8" />
                                  <rect x="46" y="0" width="4" height="24" fill="#94a3b8" />
                                  <rect x="54" y="0" width="1" height="24" fill="#94a3b8" />
                                  <rect x="58" y="0" width="3" height="24" fill="#94a3b8" />
                                  <rect x="66" y="0" width="2" height="24" fill="#94a3b8" />
                                  <rect x="72" y="0" width="4" height="24" fill="#94a3b8" />
                                  <rect x="80" y="0" width="2" height="24" fill="#94a3b8" />
                                  <rect x="88" y="0" width="3" height="24" fill="#94a3b8" />
                                  <rect x="94" y="0" width="2" height="24" fill="#94a3b8" />
                                </svg>
                                <span className="text-[8px] font-mono text-slate-500">BARCODE SCANNED</span>
                              </div>
                            </div>

                            {/* Doctor Directions Sig */}
                            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 text-[11px] text-slate-300">
                              <span className="font-bold text-slate-400 text-[10px] block uppercase">Directions (SIG):</span>
                              <span>&ldquo;{refill.medication.sig}&rdquo;</span>
                            </div>

                            {/* Warning sticker */}
                            <div className="flex items-center space-x-1.5 text-[10px] text-amber-300 font-semibold bg-amber-950/40 rounded px-2 py-1 border border-amber-600/30">
                              <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                              <span>WARNING: DO NOT DISCONTINUE WITHOUT PHYSICIAN SUPERVISION</span>
                            </div>
                          </div>

                          {/* ------------------------------------------------------------- */}
                          {/* 3. MEDICAL ECG TELEMETRY & 7-SEGMENT DIGITAL VITALS DISPLAY   */}
                          {/* ------------------------------------------------------------- */}
                          <div className="rounded-xl border border-slate-800 bg-[#060c14] p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Activity className={`h-4 w-4 ${isCritical ? 'text-rose-500 animate-bounce' : 'text-emerald-400 animate-pulse'}`} />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                  PILL SUPPLY TELEMETRY
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-slate-400">STATUS:</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                  isResolved
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : isCritical
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                                    : isLowSupply
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                                }`}>
                                  {isResolved ? '✅ Ready at Pharmacy' : isCritical ? '🚨 CRITICAL DEPLETION' : isLowSupply ? '⚠️ LOW SUPPLY' : 'STABLE SUPPLY'}
                                </span>
                              </div>
                            </div>

                            {/* Cardiac ECG Sinus Trace SVG */}
                            <div className="h-6 w-full overflow-hidden bg-slate-950/80 rounded border border-slate-800/80 flex items-center px-1">
                              <svg className="w-full h-5" viewBox="0 0 300 24" preserveAspectRatio="none">
                                <path
                                  d="M0,12 L30,12 L35,12 L38,3 L42,21 L45,8 L48,16 L52,12 L100,12 L105,12 L108,3 L112,21 L115,8 L118,16 L122,12 L170,12 L175,12 L178,3 L182,21 L185,8 L188,16 L192,12 L240,12 L245,12 L248,3 L252,21 L255,8 L258,16 L262,12 L300,12"
                                  fill="none"
                                  stroke={isCritical ? '#f43f5e' : isLowSupply ? '#f59e0b' : '#10b981'}
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>

                            {/* Digital 7-Segment Readout & Gauge */}
                            <div className="flex items-center justify-between pt-1">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-mono">SUPPLY REMAINING:</span>
                                <div className="flex items-baseline space-x-1.5">
                                  <span className={`text-2xl font-black font-mono tracking-tight ${
                                    isCritical ? 'text-rose-400 animate-pulse' : isLowSupply ? 'text-amber-400' : 'text-emerald-400'
                                  }`}>
                                    {String(refill.medication.daysRemaining ?? 15).padStart(2, '0')}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400 uppercase">Days of Pills</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block font-mono">VITAL SIGNS:</span>
                                <span className="text-xs font-mono font-semibold text-slate-300">
                                  BPM: 74 &bull; SpO2: 98%
                                </span>
                              </div>
                            </div>

                            {/* Pill Fluid Meter Gauge */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                <span>CRITICAL 0d</span>
                                <span>10d ALERT</span>
                                <span>20d</span>
                                <span>30d FULL</span>
                              </div>
                              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isCritical
                                      ? 'bg-gradient-to-r from-red-600 to-rose-500'
                                      : isLowSupply
                                      ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                                      : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(8, ((refill.medication.daysRemaining ?? 15) / 30) * 100))}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Doctor Resolution Note if approved */}
                          {isResolved && refill.resolutionDetails?.note && (
                            <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-200 space-y-1">
                              <div className="font-extrabold text-white flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>Physician Clinical Sign-Off:</span>
                              </div>
                              <p className="text-[11px] text-emerald-300 pl-5">{refill.resolutionDetails.note}</p>
                            </div>
                          )}

                          {/* ------------------------------------------------------------- */}
                          {/* 4. DEDICATED SEPARATE BIG REFILL ACTION BUTTON                */}
                          {/* ------------------------------------------------------------- */}
                          {!isResolved ? (
                            <button
                              onClick={() => handleQuickRequest(refill.medication.name, refill.medication.daysRemaining ?? 4)}
                              className={`w-full py-4 px-4 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center space-x-2.5 shadow-xl transition-all active:scale-[0.98] ${
                                isCritical
                                  ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-rose-600/50 hover:brightness-110 ring-2 ring-rose-400 animate-pulse'
                                  : isLowSupply
                                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-amber-600/40 hover:brightness-110 ring-2 ring-amber-400/80'
                                  : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white shadow-cyan-600/40 hover:brightness-110 ring-1 ring-cyan-300/80'
                              }`}
                            >
                              <Pill className="h-5 w-5 shrink-0" />
                              <span>⚡ 1-TAP REFILL THIS BOTTLE ({refill.medication.daysRemaining ?? 15}d LEFT)</span>
                              <ArrowRight className="h-4 w-4 shrink-0" />
                            </button>
                          ) : (
                            <div className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-2 border-emerald-500/70 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg shadow-emerald-950/40">
                              <div className="flex items-center space-x-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                                <div>
                                  <div className="font-extrabold text-white text-xs">READY FOR PHARMACY PICKUP</div>
                                  <div className="text-[10px] text-emerald-300">CVS Pharmacy #4421 &bull; Curbside or Counter</div>
                                </div>
                              </div>
                              <span className="rounded-lg bg-emerald-500 text-slate-950 px-2 py-1 text-[10px] font-black uppercase">
                                Pick Up
                              </span>
                            </div>
                          )}

                          {/* 4-Stage Surescripts Interop Telemetry Rail */}
                          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                              <span>Surescripts Interop Rail:</span>
                              <span className={isResolved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                                {isResolved ? 'Dispatched to CVS' : 'Physician In Basket'}
                              </span>
                            </div>

                            <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-bold font-mono">
                              <div className="rounded py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                1. INTAKE
                              </div>
                              <div className="rounded py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                2. AI TRIAGE
                              </div>
                              <div className={`rounded py-1 border ${
                                isResolved 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                              }`}>
                                3. DR. CHEN
                              </div>
                              <div className={`rounded py-1 border ${
                                isResolved 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                  : 'bg-slate-800 text-slate-500 border-slate-800'
                              }`}>
                                4. CVS eRx
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 2: Interactive 2-Way SMS Alerts Feed (Twilio) */}
            {activeTab === 'sms' && (
              <motion.div
                key="sms-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex flex-col h-full space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                    Twilio Patient SMS Gateway (Live 2-Way)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Connected
                  </span>
                </div>

                {/* Quick test prompt chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Quick Test Prompts:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Is my Metformin ready for pickup?',
                      'I have only 4 days of pills left!',
                      'Did Dr. Chen approve my safety bridge?'
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handlePromptClick(prompt)}
                        className="rounded-full bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SMS Message Thread */}
                <div 
                  ref={smsScrollRef}
                  className="space-y-2.5 text-xs max-h-72 overflow-y-auto pr-1"
                >
                  {smsMessages.map((msg) => {
                    const isPatient = msg.sender === 'patient';
                    return (
                      <div
                        key={msg.id}
                        className={`rounded-2xl p-3 space-y-1 transition-all ${
                          isPatient
                            ? 'ml-8 rounded-tr-sm bg-cyan-700 text-white shadow-md shadow-cyan-900/40'
                            : msg.sender === 'pharmacy'
                            ? 'mr-6 rounded-tl-sm bg-emerald-950/80 border border-emerald-500/40 text-emerald-100'
                            : 'mr-6 rounded-tl-sm bg-slate-800/90 text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] opacity-75">
                          <span>{msg.senderLabel}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    );
                  })}

                  {isTypingSms && (
                    <div className="rounded-2xl rounded-tl-sm bg-slate-800 p-2.5 text-slate-400 text-xs w-28 flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[10px]">Typing...</span>
                    </div>
                  )}
                </div>

                {/* Send SMS Input */}
                <form onSubmit={handleSendSms} className="pt-2 border-t border-slate-800 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    placeholder="Type an SMS to clinic or pharmacy..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!smsInput.trim()}
                    className="rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 p-2 text-white shadow-md transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 3: How It Works Explainer ("What and all happening") */}
            {activeTab === 'explainer' && (
              <motion.div
                key="explainer-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="space-y-3.5 text-xs text-slate-300 leading-relaxed"
              >
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 space-y-1">
                  <h4 className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                    <Info className="h-4 w-4 text-cyan-400" />
                    How RefillFlow Clinical AI Works Behind the Scenes:
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Here is what happens the instant you tap Refill or your bottle reaches &le; 10 days of pills:
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold">1</span>
                      &le; 10 Days Pill Depletion Detection
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6">
                      RefillFlow tracks remaining pill counts. If 10 days or fewer remain, it flashes a clinical urgency alert to Dr. Sarah Chen to prevent therapy discontinuation.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">2</span>
                      EHR Safety &amp; Lab Intelligence Engine
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6">
                      The AI checks past bloodwork (A1c, eGFR, creatinine, blood pressure) and medication adherence to synthesize clinical recommendations.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold">3</span>
                      Doctor Review &amp; Order Adjustments
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6">
                      Dr. Sarah Chen logs into her In Basket. She can adjust dosage (e.g., 30 vs 90 days) or issue a 30-day safety bridge while ordering needed lab tests.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">4</span>
                      Cryptographic Surescripts eRx to CVS Pharmacy
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6">
                      Upon sign-off, the prescription is securely dispatched via FHIR API to CVS Pharmacy #4421, and you receive an immediate SMS ready alert!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Smartphone Home Bar */}
        <div className="py-2 flex justify-center bg-slate-950">
          <div className="h-1 w-32 rounded-full bg-slate-700"></div>
        </div>
      </motion.div>
    </div>
  );
};
