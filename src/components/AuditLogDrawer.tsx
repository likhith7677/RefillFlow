import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Clock,
  Sparkles,
  Cpu
} from 'lucide-react';
import { AuditEvent } from '../types/refill';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditEvent[];
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => 
    log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.fhirTransactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative h-full w-full max-w-xl flex flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  EHR & Surescripts Audit Log
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tamper-evident FHIR activity stream for clinical compliance
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="border-b border-slate-800 bg-slate-950/40 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail by patient, drug, or FHIR Tx ID..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Activity Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No matching audit records found.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isAi = log.actorRole === 'AI_Engine';
                return (
                  <div
                    key={log.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs transition-colors hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        {isAi ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/20 text-indigo-400">
                            <Sparkles className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                        )}
                        <span className="font-semibold text-white">{log.action}</span>
                      </div>

                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-1.5 text-slate-300 text-[11px] leading-relaxed">
                      {log.details}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t border-slate-800/60 pt-2 text-[10px] text-slate-400">
                      <div>
                        Patient: <strong className="text-slate-300">{log.patientName}</strong> &bull; {log.medicationName}
                      </div>
                      <div className="font-mono text-cyan-400/90">
                        {log.fhirTransactionId}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="border-t border-slate-800 bg-slate-950/90 px-4 py-3 text-center text-[11px] text-slate-500">
            Encrypted with SHA-256 &bull; Compliant with HIPAA Security Rule 45 CFR &sect; 164.312
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
