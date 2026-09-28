import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  FileCheck, 
  X, 
  Sparkles,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { ToastMessage } from '../types/refill';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm sm:max-w-md w-full px-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const getIcon = () => {
            switch (toast.type) {
              case 'erx_fhir':
                return <FileCheck className="h-5 w-5 text-emerald-400" />;
              case 'sms':
                return <MessageSquare className="h-5 w-5 text-cyan-400" />;
              case 'pa_portal':
                return <ShieldCheck className="h-5 w-5 text-amber-400" />;
              default:
                return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
            }
          };

          const getBorder = () => {
            switch (toast.type) {
              case 'erx_fhir':
                return 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10';
              case 'sms':
                return 'border-cyan-500/40 bg-slate-900/95 shadow-cyan-500/10';
              case 'pa_portal':
                return 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10';
              default:
                return 'border-slate-700 bg-slate-900/95';
            }
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start space-x-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md ${getBorder()}`}
            >
              <div className="mt-0.5 shrink-0">
                {getIcon()}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{toast.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 font-normal">
                    {toast.meta || 'FHIR Webhook'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {toast.description}
                </p>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-1 text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
