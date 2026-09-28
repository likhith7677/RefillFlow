import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FlaskConical, 
  Video, 
  XCircle, 
  FileCode, 
  Activity, 
  Heart, 
  AlertCircle, 
  BookOpen, 
  Check, 
  Calendar, 
  Building, 
  User, 
  CreditCard,
  Copy
} from 'lucide-react';
import { RefillRequest } from '../types/refill';

interface AIExplainabilityModalProps {
  refill: RefillRequest | null;
  onClose: () => void;
  onApprove: (refill: RefillRequest, note?: string) => void;
  onBridgeLab: (refill: RefillRequest, note?: string) => void;
  onTelehealth: (refill: RefillRequest, note?: string) => void;
  onDeny: (refill: RefillRequest, reason: string) => void;
}

export const AIExplainabilityModal: React.FC<AIExplainabilityModalProps> = ({
  refill,
  onClose,
  onApprove,
  onBridgeLab,
  onTelehealth,
  onDeny
}) => {
  const [activeTab, setActiveTab] = useState<'clinical' | 'fhir' | 'guidelines'>('clinical');
  const [denyReason, setDenyReason] = useState<string>('Patient requires comprehensive in-person medical evaluation before therapy can be renewed.');
  const [isDenying, setIsDenying] = useState<boolean>(false);
  const [copiedFhir, setCopiedFhir] = useState<boolean>(false);

  if (!refill) return null;

  // Synthesize FHIR R4 JSON Bundle
  const fhirBundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'MedicationRequest',
          id: refill.id,
          status: 'draft',
          intent: 'order',
          medicationCodeableConcept: {
            text: refill.medication.name,
            coding: [
              {
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                display: refill.medication.genericName
              }
            ]
          },
          subject: {
            reference: `Patient/${refill.patient.id}`,
            display: refill.patient.name
          },
          dispenseRequest: {
            numberOfRepeatsAllowed: 3,
            quantity: {
              value: refill.medication.quantity,
              unit: 'tablets'
            },
            expectedSupplyDuration: {
              value: refill.medication.daysSupply,
              unit: 'days'
            }
          },
          dosageInstruction: [
            {
              text: refill.medication.sig
            }
          ]
        }
      },
      {
        resource: {
          resourceType: 'Observation',
          id: 'obs-adherence-recent',
          status: 'final',
          code: {
            text: 'Medication Possession Ratio (MPR)'
          },
          valueQuantity: {
            value: refill.clinicalEvidence.adherenceRate,
            unit: '%'
          }
        }
      }
    ]
  };

  const handleCopyFhir = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirBundle, null, 2));
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  AI Decisioning & Clinical Explainability
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {refill.aiRecommendation.confidenceScore}% Model Confidence
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {refill.patient.name} &bull; {refill.medication.name} ({refill.rxNumber})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* AI Banner Hero */}
          <div className="border-b border-indigo-900/40 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/40 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Clinical Intelligence Recommendation
                </span>
                <div className="text-base font-bold text-white mt-0.5">
                  {refill.aiRecommendation.actionTitle}
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {refill.aiRecommendation.reasoning}
                </p>
              </div>

              {/* Confidence Breakdown Pill Box */}
              <div className="shrink-0 space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
                <div className="text-[11px] font-medium text-slate-400">Decision Factors</div>
                {refill.aiRecommendation.confidenceBreakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-slate-300">{b.metric}</span>
                    <span className="font-semibold text-emerald-400">{b.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('clinical')}
              className={`flex items-center space-x-2 border-b-2 py-3 px-3 transition-colors ${
                activeTab === 'clinical'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Clinical Evidence & Labs</span>
            </button>

            <button
              onClick={() => setActiveTab('guidelines')}
              className={`flex items-center space-x-2 border-b-2 py-3 px-3 transition-colors ${
                activeTab === 'guidelines'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Medical Guidelines & Citations</span>
            </button>

            <button
              onClick={() => setActiveTab('fhir')}
              className={`flex items-center space-x-2 border-b-2 py-3 px-3 transition-colors ${
                activeTab === 'fhir'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="h-4 w-4" />
              <span>FHIR R4 JSON Interop</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'clinical' && (
              <div className="space-y-6">
                
                {/* 4 Demographics & Safety Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-[11px] text-slate-400">Last Office Visit</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {refill.clinicalEvidence.lastVisitDaysAgo} days ago
                    </div>
                    <div className="text-[10px] text-slate-400">{refill.clinicalEvidence.lastVisitDate}</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-[11px] text-slate-400">Adherence (MPR/PDC)</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {refill.clinicalEvidence.adherenceRate}% Adherent
                    </div>
                    <div className="text-[10px] text-slate-400">Optimal possession ratio</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-[11px] text-slate-400">Drug-Drug Interactions</div>
                    <div className="text-sm font-bold text-cyan-400 mt-1 capitalize">
                      {refill.clinicalEvidence.drugInteractions.severity}
                    </div>
                    <div className="text-[10px] text-slate-400">No contraindications</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-[11px] text-slate-400">Recent Blood Pressure</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {refill.clinicalEvidence.vitals?.bp || '120/80 mmHg'}
                    </div>
                    <div className="text-[10px] text-slate-400">Pulse: {refill.clinicalEvidence.vitals?.pulse || 72} bpm</div>
                  </div>
                </div>

                {/* Structured Clinical Labs Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-800 bg-slate-950 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Relevant Laboratory Panels & Biomarkers</span>
                    <span className="text-[11px] text-slate-400">Synced via Health Gorilla / Quest FHIR</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Lab Test / Panel</th>
                        <th className="px-4 py-2.5">Observed Value</th>
                        <th className="px-4 py-2.5">Reference Range</th>
                        <th className="px-4 py-2.5">Date Screened</th>
                        <th className="px-4 py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {refill.clinicalEvidence.labs.map((lab, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="px-4 py-2.5 font-medium text-white">{lab.name}</td>
                          <td className="px-4 py-2.5 font-mono text-cyan-300">{lab.value}</td>
                          <td className="px-4 py-2.5 text-slate-400">{lab.referenceRange}</td>
                          <td className="px-4 py-2.5 text-slate-400">{lab.date}</td>
                          <td className="px-4 py-2.5 text-right">
                            {lab.status === 'normal' && (
                              <span className="rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold">
                                Normal
                              </span>
                            )}
                            {lab.status === 'due' && (
                              <span className="rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold">
                                Due / Overdue
                              </span>
                            )}
                            {lab.status === 'abnormal' && (
                              <span className="rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2 py-0.5 text-[10px] font-semibold">
                                Suboptimal
                              </span>
                            )}
                            {lab.status === 'critical' && (
                              <span className="rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 text-[10px] font-semibold">
                                Alert Flag
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Safety & Rationale Card */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Clinical Risk & Safety Assessment</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {refill.clinicalEvidence.clinicalRationale}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    <strong className="text-slate-300">Drug-Drug Safety Notes:</strong> {refill.clinicalEvidence.drugInteractions.notes}
                  </p>
                </div>

              </div>
            )}

            {activeTab === 'guidelines' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/20 p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Evidence-Based Clinical Practice Guidelines</h4>
                  </div>
                  <blockquote className="border-l-2 border-indigo-500 pl-3 text-xs italic text-indigo-200">
                    &ldquo;{refill.clinicalEvidence.guidelineCitation}&rdquo;
                  </blockquote>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    RefillFlow AI parses national standard protocols (ADA, ACC/AHA, GINA, APA, SAMHSA) to automate routine prescription maintenance. For stable chronic regimens with documented therapeutic response, maintaining pharmacotherapy without administrative barriers directly reduces avoidable ER admissions and cardiovascular mortality.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
                    <div className="font-semibold text-white">State Prescription Monitoring (PDMP)</div>
                    <p className="text-slate-400 text-[11px]">
                      Automated query conducted against Appriss Health / Bamboo Health PDMP network. Verified 0 duplicate controlled fills, 0 prescribers flagged.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
                    <div className="font-semibold text-white">Real-Time Benefit Check (RTPB)</div>
                    <p className="text-slate-400 text-[11px]">
                      Direct 270/271 eligibility verification. Patient active on {refill.insurance.payer} with Tier 1/2 formulary coverage and zero outstanding deductible.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fhir' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    HL7 FHIR R4 Transaction Bundle Payload
                  </span>
                  <button
                    onClick={handleCopyFhir}
                    className="flex items-center space-x-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
                  >
                    {copiedFhir ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedFhir ? 'Copied JSON' : 'Copy Payload'}</span>
                  </button>
                </div>
                <pre className="max-h-72 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-cyan-300">
                  {JSON.stringify(fhirBundle, null, 2)}
                </pre>
              </div>
            )}

            {/* Deny drawer if toggled */}
            {isDenying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" />
                    Specify Clinical Reason for Denial
                  </span>
                  <button 
                    onClick={() => setIsDenying(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-rose-500/30 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
                  placeholder="Enter medical reason for denial..."
                />
                <button
                  onClick={() => onDeny(refill, denyReason)}
                  className="rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow"
                >
                  Confirm Denial & Transmit to Pharmacy
                </button>
              </motion.div>
            )}

          </div>

          {/* Footer Action Suite */}
          <div className="border-t border-slate-800 bg-slate-950/90 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Physician Sign-off:</span>
              <span>Dr. Sarah Chen, MD (NPI: 1922039182)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsDenying(!isDenying)}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-600/40 transition-colors"
              >
                Deny with Reason
              </button>

              <button
                onClick={() => onTelehealth(refill)}
                className="flex items-center space-x-1.5 rounded-lg border border-purple-500/40 bg-purple-600/20 px-3 py-2 text-xs font-medium text-purple-300 hover:bg-purple-600/30 transition-colors"
              >
                <Video className="h-3.5 w-3.5 text-purple-400" />
                <span>Request Telehealth</span>
              </button>

              <button
                onClick={() => onBridgeLab(refill)}
                className="flex items-center space-x-1.5 rounded-lg border border-amber-500/40 bg-amber-600/20 px-3 py-2 text-xs font-medium text-amber-300 hover:bg-amber-600/30 transition-colors"
              >
                <FlaskConical className="h-3.5 w-3.5 text-amber-400" />
                <span>Order Lab & 30-Day Bridge</span>
              </button>

              <button
                onClick={() => onApprove(refill)}
                className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>One-Click Approve & Issue eRx</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
