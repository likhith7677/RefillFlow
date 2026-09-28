import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  CheckCircle2, 
  Building2, 
  Award, 
  Calculator, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { GTM_FUNNEL_STAGES } from '../data/metricsData';

interface GtmRoiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GtmRoiModal: React.FC<GtmRoiModalProps> = ({ isOpen, onClose }) => {
  // ROI Interactive Sliders State
  const [monthlyRefills, setMonthlyRefills] = useState<number>(7500);
  const [maHourlyRate, setMaHourlyRate] = useState<number>(32);
  const [adherenceValue, setAdherenceValue] = useState<number>(240);
  const [activeTab, setActiveTab] = useState<'roi' | 'funnel' | 'personas'>('roi');

  if (!isOpen) return null;

  // Real-time calculations:
  // Legacy manual time: ~8.5 mins per refill. RefillFlow AI: ~0.8 min. Saved: ~7.7 mins (0.128 hrs)
  const hoursSavedPerMonth = Math.round(monthlyRefills * 0.128);
  const monthlyLaborSavings = Math.round(hoursSavedPerMonth * maHourlyRate);
  const annualLaborSavings = monthlyLaborSavings * 12;

  // Prescription adherence recovery: 15% of refills normally abandon. RefillFlow recaptures 65% of those.
  const monthlyRecapturedRx = Math.round(monthlyRefills * 0.15 * 0.65);
  const annualAdherenceRevenue = Math.round(monthlyRecapturedRx * adherenceValue);

  // Total Annual Economic Value
  const totalAnnualValue = annualLaborSavings + annualAdherenceRevenue;

  // Platform Tier Estimate (e.g. ~$0.45 per processed refill)
  const annualPlatformFee = Math.round(monthlyRefills * 0.45 * 12);
  const roiMultiplier = (totalAnnualValue / annualPlatformFee).toFixed(1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Commercial Engine & B2B Go-To-Market Strategy
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-semibold text-amber-300">
                    B2B SaaS Economic Engine
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Value creation model for Multi-Specialty Clinics, Health Systems, and Pharmacy Retailers
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

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('roi')}
              className={`flex items-center space-x-2 border-b-2 py-3 px-3 transition-colors ${
                activeTab === 'roi'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Interactive ROI & Economic Value Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('funnel')}
              className={`flex items-center space-x-2 border-b-2 py-3 px-3 transition-colors ${
                activeTab === 'funnel'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>B2B Sales Funnel Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('personas')}
              className={`flex items-center space-x-2 border-b-2 py-3 px-3 transition-colors ${
                activeTab === 'personas'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Enterprise Buyer Personas & Value Props</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'roi' && (
              <div className="space-y-6">
                
                {/* Sliders vs Live Output Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Interactive Sliders (6 cols) */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-5 lg:col-span-6">
                    <div className="border-b border-slate-800 pb-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-amber-400" />
                        Clinical & Operational Parameters
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Adjust to match your MSO, Health System, or Pharmacy network scale.
                      </p>
                    </div>

                    {/* Slider 1: Monthly Refills */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-slate-200">
                          Monthly Refill In Basket Volume
                        </label>
                        <span className="font-mono text-sm font-bold text-amber-300">
                          {monthlyRefills.toLocaleString()} <span className="text-xs text-slate-400 font-normal">refills/mo</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1000}
                        max={35000}
                        step={500}
                        value={monthlyRefills}
                        onChange={(e) => setMonthlyRefills(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>1,000 (Solo Group)</span>
                        <span>15,000 (Mid-tier MSO)</span>
                        <span>35,000+ (Health System)</span>
                      </div>
                    </div>

                    {/* Slider 2: MA Hourly Cost */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-slate-200">
                          Medical Assistant / Nurse Hourly Burden
                        </label>
                        <span className="font-mono text-sm font-bold text-cyan-300">
                          ${maHourlyRate} <span className="text-xs text-slate-400 font-normal">/hour</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min={22}
                        max={55}
                        step={1}
                        value={maHourlyRate}
                        onChange={(e) => setMaHourlyRate(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>$22/hr (Base MA)</span>
                        <span>$32/hr (Loaded)</span>
                        <span>$55/hr (Triage RN)</span>
                      </div>
                    </div>

                    {/* Slider 3: Adherence Value */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-slate-200">
                          Annual Adherence Value per Retained Patient
                        </label>
                        <span className="font-mono text-sm font-bold text-emerald-300">
                          ${adherenceValue} <span className="text-xs text-slate-400 font-normal">/pt/yr</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min={120}
                        max={500}
                        step={20}
                        value={adherenceValue}
                        onChange={(e) => setAdherenceValue(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>$120 (Generic Rx)</span>
                        <span>$240 (Chronic Specialty)</span>
                        <span>$500+ (MSSP/VBC Bonus)</span>
                      </div>
                    </div>

                    {/* Benchmark Note */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400 space-y-1">
                      <div className="font-medium text-slate-300">Clinical Triage Benchmark:</div>
                      <p className="text-[11px] leading-relaxed">
                        Clinicians spend an average of 8.5 minutes per refill request reviewing EHR charts, verifying labs, and communicating with retail pharmacies. RefillFlow AI cuts this to 45 seconds.
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Live Value Return Cards (6 cols) */}
                  <div className="space-y-4 lg:col-span-6 flex flex-col justify-between">
                    
                    {/* Big ROI Hero Card */}
                    <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Total Annual Economic Value Generated
                        </span>
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                          {roiMultiplier}x Net ROI Multiplier
                        </span>
                      </div>

                      <div className="mt-3 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        ${totalAnnualValue.toLocaleString()}
                        <span className="text-sm font-medium text-slate-400 ml-1">/year</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-emerald-900/40">
                        <div>
                          <div className="text-[11px] text-slate-400">Monthly Operational Labor Saved</div>
                          <div className="text-lg font-bold text-white mt-0.5">
                            ${monthlyLaborSavings.toLocaleString()} <span className="text-xs text-slate-400">/mo</span>
                          </div>
                          <div className="text-[10px] text-cyan-400">{hoursSavedPerMonth} staff hours/month</div>
                        </div>

                        <div>
                          <div className="text-[11px] text-slate-400">Adherence Revenue Recaptured</div>
                          <div className="text-lg font-bold text-white mt-0.5">
                            ${annualAdherenceRevenue.toLocaleString()} <span className="text-xs text-slate-400">/yr</span>
                          </div>
                          <div className="text-[10px] text-emerald-400">{monthlyRecapturedRx * 12} prescriptions preserved</div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Operational Impacts */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                        <div className="text-slate-400 text-[11px]">Doctor Burnout Reduction</div>
                        <div className="text-sm font-bold text-white">-92% In Basket Pings</div>
                        <p className="text-[10px] text-slate-400">Allows doctors to sign off between patient consults in 1 click.</p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                        <div className="text-slate-400 text-[11px]">Payer Star Ratings / HEDIS</div>
                        <div className="text-sm font-bold text-emerald-400">+1.2 Stars Target</div>
                        <p className="text-[10px] text-slate-400">Directly impacts Medicare Advantage Part D PDC quality measures.</p>
                      </div>
                    </div>

                    {/* Payback period */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <span className="text-slate-300">Estimated Implementation & Payback:</span>
                      </div>
                      <span className="font-bold text-white">Under 28 Days (Zero EHR Downtime)</span>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {activeTab === 'funnel' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white">Enterprise B2B Go-To-Market Pipeline</h4>
                  <p className="text-xs text-slate-400">
                    Live pipeline velocity targeting Multi-Specialty Clinics, Integrated Delivery Networks (IDNs), and Retail Chains.
                  </p>
                </div>

                <div className="space-y-3">
                  {GTM_FUNNEL_STAGES.map((stage, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white shadow"
                            style={{ backgroundColor: stage.color }}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-white">{stage.stage}</div>
                            <div className="text-xs text-slate-400">{stage.label}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs">
                          <div className="text-right">
                            <div className="font-bold text-white text-sm">{stage.count.toLocaleString()} Accounts</div>
                            <div className="text-[11px] text-emerald-400">{stage.conversionRate} Stage Conversion</div>
                          </div>
                          <span className="rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300">
                            {stage.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex items-center justify-between">
                        <span>{stage.metric}</span>
                        <span className="text-cyan-400 font-medium">Interoperability: Epic App Orchard & Athenahealth Certified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'personas' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Persona 1 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      CMO
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Chief Medical Officer</div>
                      <div className="text-[11px] text-slate-400">Clinical Quality & Safety</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prioritizes physician retention, reducing after-hours &ldquo;pajama time&rdquo; In Basket burden, and strict adherence to evidence-based protocols (ADA, ACC/AHA).
                  </p>
                  <div className="border-t border-slate-800 pt-2 text-[11px] text-emerald-400 font-medium">
                    &bull; Zero adverse drug event liability via HITL sign-off
                  </div>
                </div>

                {/* Persona 2 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      COO
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Chief Operating Officer</div>
                      <div className="text-[11px] text-slate-400">Clinic Staffing & Efficiency</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Struggling with high MA turnover and endless phone-tag with retail pharmacies. RefillFlow AI automates triage, freeing up 140+ hours/month of clinical staff time.
                  </p>
                  <div className="border-t border-slate-800 pt-2 text-[11px] text-cyan-400 font-medium">
                    &bull; 91% reduction in routine refill handling cost
                  </div>
                </div>

                {/* Persona 3 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      VP
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">VP Pharmacy Ops</div>
                      <div className="text-[11px] text-slate-400">Retail & PBM Partnerships</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Focused on reducing the 40%+ refill drop-off rate when prescriptions stall in &ldquo;Awaiting Doctor Approval&rdquo; status. Instant bridge dispensing saves fills.
                  </p>
                  <div className="border-t border-slate-800 pt-2 text-[11px] text-purple-400 font-medium">
                    &bull; Recaptures up to $48,000/mo in dispensed script value
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 bg-slate-950/90 px-6 py-3.5 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              RefillFlow AI Enterprise Architecture &bull; SOC2 Type II & HIPAA Certified
            </span>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Close Strategy Engine
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
