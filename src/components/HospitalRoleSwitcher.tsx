import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Building2, 
  User, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowRightLeft,
  Hospital
} from 'lucide-react';
import { PortalRole, HospitalUser } from '../types/refill';
import { HOSPITAL_USERS } from '../data/refillsData';

interface HospitalRoleSwitcherProps {
  currentRole: PortalRole;
  onRoleChange: (role: PortalRole) => void;
  currentUser: HospitalUser;
}

export const HospitalRoleSwitcher: React.FC<HospitalRoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = (role: PortalRole) => {
    switch (role) {
      case 'physician':
        return Stethoscope;
      case 'pharmacy':
        return Building2;
      case 'patient':
        return User;
    }
  };

  const CurrentIcon = getRoleIcon(currentRole);

  const getRoleTheme = (role: PortalRole) => {
    switch (role) {
      case 'physician':
        return {
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          gradient: 'from-emerald-600 to-teal-600',
          ring: 'ring-emerald-400/40',
          label: 'Physician Practice Portal'
        };
      case 'pharmacy':
        return {
          pill: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          gradient: 'from-blue-600 to-cyan-600',
          ring: 'ring-cyan-400/40',
          label: 'Retail Pharmacy Staff Desk'
        };
      case 'patient':
        return {
          pill: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          gradient: 'from-purple-600 to-indigo-600',
          ring: 'ring-purple-400/40',
          label: 'Patient Portal & Mobile App'
        };
    }
  };

  const currentTheme = getRoleTheme(currentRole);

  return (
    <div className="relative">
      {/* Account Login Bar Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800/90 px-3 py-1.5 text-xs text-white shadow-md transition-all hover:border-slate-600"
      >
        {/* User Avatar */}
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden border border-slate-600">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-slate-950"></div>
        </div>

        <div className="text-left">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-white tracking-wide">{currentUser.name}</span>
            <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${currentTheme.pill}`}>
              {currentUser.badge}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate max-w-[160px] sm:max-w-[200px]">
            {currentUser.facility.split('(')[0]}
          </p>
        </div>

        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Account Switcher Modal / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl shadow-slate-950/80 backdrop-blur-xl"
            >
              <div className="mb-2.5 px-2 pt-1 border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                    <Hospital className="h-3.5 w-3.5 text-cyan-400" />
                    SWITCH HOSPITAL USER ACCOUNT
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Select an account to review and approve changes from their role:
                  </p>
                </div>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400 font-mono">
                  3 ACCOUNTS
                </span>
              </div>

              {/* List of 3 Users */}
              <div className="space-y-1.5">
                {HOSPITAL_USERS.map((user) => {
                  const isSelected = user.role === currentRole;
                  const Icon = getRoleIcon(user.role);
                  const theme = getRoleTheme(user.role);

                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        onRoleChange(user.role);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-start space-x-3 rounded-xl p-2.5 text-left transition-all ${
                        isSelected
                          ? 'border border-cyan-400/80 bg-slate-800/90 shadow-md ring-1 ring-cyan-400/30'
                          : 'border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden border border-slate-700">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{user.name}</span>
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${theme.pill}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-300 mt-0.5 truncate">
                          {user.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {user.facility}
                        </div>

                        {/* Role ability summary */}
                        <div className="mt-1.5 text-[10px] text-cyan-300/80 flex items-center gap-1">
                          <Icon className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {user.role === 'physician'
                              ? 'Can edit dosage & approve prescriptions via Surescripts'
                              : user.role === 'pharmacy'
                              ? 'Can counter-check NCPDP claims & dispense pills'
                              : 'Can request refills & view live status + SMS'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
