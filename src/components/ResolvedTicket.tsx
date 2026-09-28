import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Send, 
  Building, 
  Calendar, 
  FileCheck, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { RefillRequest } from '../types/refill';

interface ResolvedTicketProps {
  refill: RefillRequest;
  onReopen: (refill: RefillRequest) => void;
}

export const ResolvedTicket: React.FC<ResolvedTicketProps> = ({ refill, onReopen }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-emerald-500/40 bg-[#0c1421]/90 p-4 shadow-md backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-white text-sm">
              {refill.patient.name}
            </span>
            <span className="text-xs text-slate-400">
              ({refill.medication.name})
            </span>
            <span className="rounded bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              {refill.resolutionDetails?.actionTaken || 'Prescription Fulfilled'}
            </span>
          </div>

          <div className="text-xs text-slate-300">
            Resolved by: <strong className="text-white">{refill.resolutionDetails?.resolvedBy || 'Dr. Sarah Chen, MD'}</strong> &bull;{' '}
            <span className="text-slate-400">
              {new Date(refill.resolutionDetails?.timestamp || refill.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            &ldquo;{refill.resolutionDetails?.note || 'Prescription renewed via Surescripts FHIR API; patient notified via SMS.'}&rdquo;
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono text-cyan-400">
              {refill.resolutionDetails?.txId || 'FHIR-TX-LIVE'}
            </div>
            <div className="text-[10px] text-slate-500">
              Dispatched to {refill.pharmacy.name}
            </div>
          </div>

          <button
            onClick={() => onReopen(refill)}
            className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Move back to Active Blocked Queue for re-testing"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Re-triage</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
