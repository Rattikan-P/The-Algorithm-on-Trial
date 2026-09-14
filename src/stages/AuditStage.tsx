import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  FileSearch,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
  TriangleAlert,
  Check,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import {
  AUDIT_APPLICANTS,
  AUDIT_FACTORS,
  OFFICIAL_REASONS,
} from '../data/gameData';
import { OfficialReason } from '../types';

interface AuditStageProps {
  onContinue: () => void;
}

export const AuditStage: React.FC<AuditStageProps> = ({ onContinue }) => {
  const [guideOpen, setGuideOpen] = useState(false);
  const [testedIds, setTestedIds] = useState<Set<string>>(new Set());
  const [activeReason, setActiveReason] = useState<OfficialReason | null>(null);

  const allTested = testedIds.size === OFFICIAL_REASONS.length;

  const handleTestReason = (reason: OfficialReason) => {
    setActiveReason(reason);
    setTestedIds((prev) => new Set(prev).add(reason.id));
  };

  const getFactor = (key: string) => {
    return AUDIT_FACTORS.find((f) => f.key === key);
  };

  const isRiskScore = activeReason?.factorKey === 'risk_score';
  const currentFactor = activeReason ? getFactor(activeReason.factorKey) : null;

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-4 text-slate-200 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto w-full max-w-4xl my-auto">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2 rounded-full bg-amber-500/10 px-3 py-1 border border-amber-500/20">
            <Scale className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
              Counterfactual Audit Protocol
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 uppercase tracking-wider">
            Audit the Official Explanation
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto font-serif">
            FinTrust cited four primary factors for the rejection. Test each claim by comparing Maria’s data against a peer who received the opposite verdict with the same financial profile.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Section 1: Data Comparison (The Dossiers) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/40 rounded-t-lg">
                <FileSearch className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subject Comparison Dossiers</span>
              </div>
              
              <div className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {[AUDIT_APPLICANTS.maria, AUDIT_APPLICANTS.comparable].map((applicant) => (
                    <div
                      key={applicant.name}
                      className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-500 ${
                        applicant.outcome === 'denied'
                          ? 'border-red-500/30 bg-red-500/[0.02]'
                          : 'border-emerald-500/30 bg-emerald-500/[0.02]'
                      }`}
                    >
                      {/* Decorative corner status */}
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-black uppercase tracking-tighter ${
                        applicant.outcome === 'denied' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {applicant.outcome}
                      </div>

                      <div className="mb-4">
                        <p className="font-serif text-lg font-bold text-slate-100">{applicant.name}</p>
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{applicant.tag}</p>
                      </div>

                      <div className="space-y-1.5">
                        {AUDIT_FACTORS.map((factor) => {
                          const isTargetFactor = activeReason?.factorKey === factor.key;
                          const value = applicant.outcome === 'denied' ? factor.maria : factor.comparable;
                          return (
                            <div
                              key={factor.key}
                              className={`group flex items-center justify-between rounded px-3 py-2 text-xs transition-all duration-300 ${
                                isTargetFactor
                                  ? 'bg-indigo-500/20 border border-indigo-400/40 shadow-inner'
                                  : 'border border-transparent hover:bg-slate-800/40'
                              }`}
                            >
                              <span className={`font-medium transition-colors ${isTargetFactor ? 'text-indigo-200' : 'text-slate-500'}`}>
                                {factor.label}
                              </span>
                              <div className="flex items-center gap-2">
                                {isTargetFactor && (
                                  <motion.div 
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-1 text-[9px] font-bold text-indigo-400"
                                  >
                                    <Check className="h-3 w-3" />
                                    <span>MATCH</span>
                                  </motion.div>
                                )}
                                <span
                                  className={`font-mono font-bold transition-all ${
                                    isTargetFactor
                                      ? 'text-sm text-indigo-100'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {value}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shared Value Highlight */}
                <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 py-3 text-center">
                  <div className="flex -space-x-1">
                    <div className="h-5 w-5 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-slate-400">M</span>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-slate-400">C</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Financial indicators are <span className="text-amber-200 font-bold">100% Identical</span> — Outcome disparity suggests bias.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Audit Verdict Feedback (Appears when reason selected) */}
            <AnimatePresence mode="wait">
              {activeReason ? (
                <motion.div
                  key={activeReason.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="overflow-hidden rounded-xl border border-red-500/30 bg-red-500/[0.03] shadow-lg shadow-red-500/5"
                >
                  <div className="flex items-center justify-between border-b border-red-500/20 bg-red-950/20 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TriangleAlert className="h-4 w-4 text-red-400" />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-200">Testing Verdict: {activeReason.label}</span>
                    </div>
                    <span className="rounded bg-red-900/40 px-2 py-0.5 font-mono text-[9px] font-bold text-red-300 border border-red-500/20">
                      DISPROVEN
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Maria</p>
                        <p className="font-mono text-xl font-black text-slate-200">{currentFactor?.maria}</p>
                      </div>
                      <div className="relative flex flex-col items-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20" 
                          />
                        </div>
                        <Scale className="relative z-10 h-6 w-6 text-amber-400" />
                        <span className="mt-2 text-[10px] font-black text-amber-500 uppercase tracking-tighter">Identical</span>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Peer B</p>
                        <p className="font-mono text-xl font-black text-slate-200">{currentFactor?.comparable}</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-800">
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-300 italic">
                        "{activeReason.note}"
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-red-400 font-mono text-[10px] font-bold">
                      <X className="h-3.5 w-3.5" />
                      <span>REASON NULLIFIED: Values match exactly across outcome disparity.</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-slate-500">
                  <HelpCircle className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-mono uppercase tracking-widest">Select a claim to begin audit scan</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Control Station */}
          <div className="space-y-6">
            {/* Audit Control Panel */}
            <div className="rounded-xl border-2 border-amber-500/40 bg-slate-900 shadow-[0_0_25px_rgba(245,158,11,0.15)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 bg-amber-500/10 border-b border-amber-500/20">
                <div className="relative">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <div className="absolute inset-0 animate-ping opacity-40">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.15em] text-amber-200">
                  Select Claim to Audit
                </span>
              </div>
              
              <div className="p-4 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
                {OFFICIAL_REASONS.map((reason) => {
                  const isTested = testedIds.has(reason.id);
                  const isActive = activeReason?.id === reason.id;
                  return (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => handleTestReason(reason)}
                      className={`group relative w-full overflow-hidden rounded-lg border-2 px-4 py-3 text-left transition-all duration-300 transform active:scale-[0.98] ${
                        isActive
                          ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10'
                          : isTested
                          ? 'border-red-500/30 bg-red-950/20 opacity-80'
                          : 'border-slate-800 bg-slate-950/60 hover:border-amber-500/40 hover:bg-amber-500/5'
                      }`}
                    >
                      <div className="relative z-10 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`font-serif text-[13px] font-bold transition-colors ${
                            isActive ? 'text-white' : isTested ? 'text-red-300/70 line-through decoration-red-500/50' : 'text-slate-300'
                          }`}>
                            {reason.label}
                          </span>
                          {isTested && (
                            <div className="flex items-center gap-1 rounded bg-red-500/20 px-1.5 py-0.5 border border-red-500/30">
                              <X className="h-2.5 w-2.5 text-red-400" />
                              <span className="font-mono text-[8px] font-black text-red-400">DISPROVED</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-slate-800/80 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: isTested ? '100%' : 0 }}
                              className={`h-full ${isActive ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-red-500'}`} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {!isTested && !isActive && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-3.5 w-3.5 text-amber-500/50" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audit Status Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">Progress</span>
                <span className="font-mono text-[10px] font-bold text-amber-500">{Math.round((testedIds.size / OFFICIAL_REASONS.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(testedIds.size / OFFICIAL_REASONS.length) * 100}%` }}
                  className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] rounded-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${testedIds.size > 0 ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 text-slate-600'}`}>
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">System scan initialized</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${allTested ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 text-slate-600'}`}>
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">All official explanations nullified</p>
                </div>
              </div>

              {/* Removed redundant proceed button from sidebar */}
            </div>
          </div>
        </div>

        {/* Forensic Deduction Overlay - Triggered when all tested */}
        <AnimatePresence>
          {allTested && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-slate-950/90"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 25 }}
                className="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-slate-900 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
              >
                {/* Header: Case Status */}
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-amber-400" />
                    <h2 className="font-mono text-sm font-black uppercase tracking-[0.3em] text-amber-200">
                      Audit Deduction: Complete
                    </h2>
                  </div>
                  <div className="rounded-full bg-amber-500/20 px-3 py-1 border border-amber-500/40 text-[10px] font-black text-amber-400 tracking-tighter">
                    STATUS: TRANSPARENCY FAILURE
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* The Deduction Text */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Scale className="h-5 w-5" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold font-serif text-slate-100">
                          Forensic Conclusion
                        </h3>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-serif italic border-l-4 border-amber-500/40 pl-4 py-1">
                          "The audit proves that <span className="text-white font-bold">none of the official reasons are valid</span>. With identical financial metrics, the decision parity fails. This confirms the presence of an <span className="text-amber-400 font-bold underline decoration-amber-500/30">unreported proxy variable</span> driving the disparity."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Priya's Message Block */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-xl bg-sky-500/5 border border-sky-500/20 p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Mail className="h-12 w-12 text-sky-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                      <span className="font-mono text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                        Incoming Dispatch · Priya Vance
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed relative z-10">
                      "I told you the rejections were pure camouflage. The management team is suppressing the true model logic. I've staged an executive access card under the lobby desk for you. Proceed to the Data Lab tonight—we need to uncover what that hidden variable actually is before they purge the registry."
                    </p>
                  </motion.div>

                  {/* Integrated Action Button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="pt-2"
                  >
                    <button
                      onClick={onContinue}
                      className="group relative w-full overflow-hidden rounded-xl bg-amber-500 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <span>Proceed to FinTrust Headquarters</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </div>
                      <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12"
                      />
                    </button>
                    <p className="mt-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Enter Stealth Phase: Model Registry Breach
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Help Button */}
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 shadow-2xl transition-all hover:bg-slate-700 hover:text-sky-300 hover:scale-110 border border-slate-700 group"
        >
          <Info className="h-6 w-6" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 border border-slate-700 pointer-events-none">
            Audit Protocol Guide
          </span>
        </button>

        {/* Full screen guide modal if open */}
        <AnimatePresence>
          {guideOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
              onClick={() => setGuideOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-serif text-slate-100">Audit Methodology</h3>
                  <button onClick={() => setGuideOpen(false)} className="text-slate-500 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 font-mono text-sm font-bold">1</div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm mb-1">Verify Subject Profiles</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Observe Maria and her peer. Their financials are identical across all provided metrics.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 font-mono text-sm font-bold">2</div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm mb-1">Nullify Official Claims</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Scan each reason given by FinTrust. If the value is the same for both, that reason is logically disproven.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 font-mono text-sm font-bold">3</div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm mb-1">Establish Invisible Variables</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Once all reasons fail, it proves the model is using a hidden variable not disclosed in the official notice.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
                  <p className="text-[11px] text-amber-200 italic leading-relaxed">
                    "Counterfactuals explain how to change an outcome, but cannot always explain the causal 'why'. This audit proves transparency failure." — (Wachter, 2018)
                  </p>
                </div>
                
                <button
                  onClick={() => setGuideOpen(false)}
                  className="mt-8 w-full rounded-lg bg-slate-800 py-3 text-xs font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Dismiss Guide
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
