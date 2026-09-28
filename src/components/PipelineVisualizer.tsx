import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Building2, 
  ShieldAlert, 
  Stethoscope, 
  CheckCircle2, 
  Cpu, 
  ArrowRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { RefillRequest } from '../types/refill';

interface PipelineVisualizerProps {
  refills: RefillRequest[];
  isPulsing: boolean;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ refills, isPulsing }) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Group counts by stage
  const patientCount = refills.filter(r => r.pipelineStage === 'patient').length;
  const pharmacyCount = refills.filter(r => r.pipelineStage === 'pharmacy').length;
  const pbmCount = refills.filter(r => r.pipelineStage === 'pbm').length;
  const ehrCount = refills.filter(r => r.pipelineStage === 'provider_ehr' && r.status !== 'Resolved' && r.status !== 'Fulfilled').length;
  const resolvedCount = refills.filter(r => r.status === 'Resolved' || r.status === 'Fulfilled').length;

  const stages = [
    {
      id: 'patient',
      name: '1. Patient Request',
      shortName: 'Patient',
      icon: User,
      count: patientCount || 1, // active incoming flow
      badge: 'Mobile / SMS',
      protocol: 'FHIR Patient.refillRequest',
      color: 'from-blue-500 to-indigo-600',
      glow: 'shadow-blue-500/20',
      status: 'Active Ingestion'
    },
    {
      id: 'pharmacy',
      name: '2. Pharmacy Routing',
      shortName: 'Pharmacy',
      icon: Building2,
      count: pharmacyCount || 2,
      badge: 'NCPDP SCRIPT',
      protocol: 'NCPDP SCRIPT v2017071',
      color: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/20',
      status: 'Counter Validation'
    },
    {
      id: 'pbm',
      name: '3. PBM / Formulary',
      shortName: 'PBM / PA',
      icon: ShieldAlert,
      count: pbmCount || 2,
      badge: 'Formulary & PA',
      protocol: 'Electronic Prior Auth (ePA)',
      color: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/20',
      status: 'Coverage Intercept'
    },
    {
      id: 'provider_ehr',
      name: '4. Provider EHR & AI',
      shortName: 'Provider EHR',
      icon: Stethoscope,
      count: ehrCount,
      badge: 'AI Triage & HITL',
      protocol: 'HL7 FHIR R4 Bundle + LLM',
      color: 'from-teal-600 to-blue-600',
      glow: 'shadow-teal-500/20',
      status: 'Clinical Decisioning'
    },
    {
      id: 'resolved',
      name: '5. Resolved & Dispensed',
      shortName: 'Resolved',
      icon: CheckCircle2,
      count: resolvedCount,
      badge: 'eRx Dispatched',
      protocol: 'Surescripts Network Broadcast',
      color: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/20',
      status: 'Fulfilled at Pharmacy'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0c1421]/90 p-4 shadow-xl backdrop-blur-md sm:p-5">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

      {/* Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              REAL-TIME INTEROPERABILITY PIPELINE STREAM
              <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE PACKET TRAIN
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Bi-directional FHIR / NCPDP data stream synchronizing Retail Pharmacies, PBMs, and Clinical In Baskets
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Network Latency: <strong className="text-cyan-400">14ms</strong></span>
          <span className="text-slate-600">&bull;</span>
          <span>Interoperability: <strong className="text-emerald-400">100% FHIR R4</strong></span>
        </div>
      </div>

      {/* 5-Stage Interactive Pipeline */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 md:gap-2 py-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <div 
                onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                className={`group relative flex flex-1 cursor-pointer flex-col items-center rounded-xl border p-3 transition-all duration-300 ${
                  selectedStage === stage.id
                    ? 'border-cyan-400/80 bg-slate-800/90 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                {/* Active Stage Indicator */}
                <div className="flex w-full items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">{stage.protocol.split(' ')[0]}</span>
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    stage.count > 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {stage.count} {stage.count === 1 ? 'Rx' : 'Rxs'}
                  </span>
                </div>

                {/* Node Icon Circle */}
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${stage.color} text-white shadow-md ${stage.glow} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                  {stage.count > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-xl bg-white/30"
                    />
                  )}
                </div>

                <div className="mt-2.5 text-center">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {stage.badge}
                  </div>
                </div>

                {/* Micro status tag */}
                <div className="mt-2 w-full pt-2 border-t border-slate-800/60 text-center">
                  <span className="text-[10px] text-slate-400 truncate block">
                    {stage.status}
                  </span>
                </div>
              </div>

              {/* Connecting Pipe with Animated Data Packets (Framer Motion) */}
              {!isLast && (
                <div className="relative flex h-6 w-full md:h-auto md:w-12 items-center justify-center">
                  {/* Base Track Line */}
                  <div className="h-full w-0.5 md:h-0.5 md:w-full bg-slate-800 relative overflow-hidden">
                    {/* Pulsing traveling packets */}
                    <motion.div
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: 'linear',
                        delay: idx * 0.35
                      }}
                      className="hidden md:block absolute top-0 bottom-0 w-6 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]"
                    />
                    <motion.div
                      animate={{
                        y: ['-100%', '100%']
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: 'linear',
                        delay: idx * 0.35
                      }}
                      className="block md:hidden absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[1px]"
                    />
                  </div>

                  {/* Packet Orb if action is pulsing */}
                  {isPulsing && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80"
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Stage Inspection Details Drawer */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/80 p-3.5 text-xs"
          >
            {(() => {
              const activeInfo = stages.find(s => s.id === selectedStage);
              if (!activeInfo) return null;
              return (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-cyan-400">{activeInfo.name}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                        {activeInfo.protocol}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      Standardized data packet stream processing real-time prescription refill state events.
                      Integrated with HL7 FHIR US-Core and Surescripts electronic prescribing protocols.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStage(null)}
                    className="self-end sm:self-auto rounded-lg bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700 text-[11px]"
                  >
                    Close Inspection
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
