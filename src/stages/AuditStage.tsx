import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  ChevronDown,
  X,
  HelpCircle,
  TriangleAlert,
  Check,
  ArrowRight,
  Sparkles,
  Info,
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
      className="relative min-h-screen bg-slate-950 px-4 py-8 text-slate-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-500/70">
            Counterfactual Audit
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-amber-100">
            Audit the Official Explanation
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            FinTrust gave four official reasons for denying the loan. Test each one against a real comparable profile.
          </p>
        </div>

        {/* How to audit accordion guide */}
        <div className="mb-6 rounded-lg border border-sky-500/30 bg-sky-950/20 p-4">
          <button
            type="button"
            onClick={() => setGuideOpen(!guideOpen)}
            className="flex w-full items-center justify-between text-left text-xs font-semibold text-sky-200"
          >
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-sky-400" />
              How to perform this audit (click to expand)
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${guideOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {guideOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <ol className="mt-3 space-y-1.5 font-serif text-xs leading-relaxed text-slate-300">
                  <li>
                    <span className="font-mono text-sky-300">1.</span> Look at both applicants' financials below —{' '}
                    <span className="text-amber-200">identical on every metric</span>
                  </li>
                  <li>
                    <span className="font-mono text-sky-300">2.</span> Click each of FinTrust's reasons one at a time → check whether that value is{' '}
                    <span className="text-amber-200">the same or different</span> between the two
                  </li>
                  <li>
                    <span className="font-mono text-sky-300">3.</span> If it is the same = that reason is{' '}
                    <span className="text-red-300">not the real reason</span> (if it were, the approved applicant would have to differ)
                  </li>
                  <li>
                    <span className="font-mono text-sky-300">4.</span> Test every reason → conclude that the official explanations are camouflage, then go examine the model itself in the office
                  </li>
                </ol>
                <p className="mt-3 rounded-md border-l-2 border-sky-400 bg-slate-900/50 p-2 font-serif text-[11px] leading-relaxed text-slate-400">
                  <span className="font-semibold text-sky-200">Example:</span> if FinTrust says "high debt" but the approved applicant carries the exact same debt → debt is not the real reason. Something else is hiding in the model.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Applicants comparison cards with active factor highlighting */}
        <div className="relative mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[AUDIT_APPLICANTS.maria, AUDIT_APPLICANTS.comparable].map((applicant) => (
              <div
                key={applicant.name}
                className={`relative rounded-lg border p-4 transition-all duration-300 ${
                  applicant.outcome === 'denied'
                    ? 'border-red-500/40 bg-red-500/5'
                    : 'border-emerald-500/40 bg-emerald-500/5'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg text-slate-100">{applicant.name}</p>
                    <p className="text-[11px] text-slate-400">{applicant.tag}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      applicant.outcome === 'denied'
                        ? 'bg-red-900/60 text-red-300'
                        : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    {applicant.outcome === 'denied' ? 'Denied' : 'Approved'}
                  </span>
                </div>
                <div className="space-y-2">
                  {AUDIT_FACTORS.map((factor) => {
                    const isTargetFactor = activeReason?.factorKey === factor.key;
                    const value = applicant.outcome === 'denied' ? factor.maria : factor.comparable;
                    return (
                      <div
                        key={factor.key}
                        className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-all duration-300 ${
                          isTargetFactor
                            ? 'border border-amber-400/80 bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'border border-transparent hover:bg-slate-800/30'
                        }`}
                      >
                        <span className={`font-serif ${isTargetFactor ? 'font-semibold text-amber-200' : 'text-slate-400'}`}>
                          {factor.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isTargetFactor && (
                            <span className="rounded bg-amber-400/20 px-1 py-0.2 font-mono text-[10px] text-amber-300">
                              EQUAL
                            </span>
                          )}
                          <span
                            className={`font-mono font-medium ${
                              isTargetFactor
                                ? 'text-sm font-bold text-amber-100'
                                : 'text-slate-200'
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

          {/* Active Connector Banner between cards when a factor is selected */}
          {activeReason && currentFactor && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 flex items-center justify-between rounded-md border border-amber-500/50 bg-slate-900/90 px-4 py-2.5 shadow-lg"
            >
              <div className="flex items-center gap-2 font-serif text-xs text-amber-200">
                <Scale className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  Comparing <span className="font-semibold text-white">"{currentFactor.label}"</span> across applicants:
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="rounded bg-red-950/80 px-2 py-0.5 text-red-300 border border-red-500/40">
                  Maria: {currentFactor.maria}
                </span>
                <span className="text-amber-400 font-bold">==</span>
                <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-emerald-300 border border-emerald-500/40">
                  App B: {currentFactor.comparable}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Identical note banner */}
        <div className="mb-4 flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-center text-xs text-slate-400">
          <Scale className="h-4 w-4 text-slate-500" />
          <span>
            Both applicants' financial profiles are{' '}
            <span className="font-semibold text-slate-200">identical on every metric</span> — so why are the outcomes different?
          </span>
        </div>

        {/* Official reasons buttons */}
        <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-widest text-slate-500">
          FinTrust's official reasons — click each one to test it
        </div>
        <div className="mb-5 grid gap-2 sm:grid-cols-2">
          {OFFICIAL_REASONS.map((reason) => {
            const isTested = testedIds.has(reason.id);
            const isActive = activeReason?.id === reason.id;
            return (
              <button
                key={reason.id}
                type="button"
                onClick={() => handleTestReason(reason)}
                className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-xs transition ${
                  isTested
                    ? 'border-red-500/40 bg-red-500/5 text-red-200'
                    : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-sky-400/50 hover:bg-sky-500/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isTested ? (
                    <X className="h-4 w-4 text-red-400" />
                  ) : (
                    <HelpCircle className="h-4 w-4 text-sky-300" />
                  )}
                  <span className="font-serif">{reason.label}</span>
                </span>
                {isTested && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-red-300/80">
                    Not the real reason
                  </span>
                )}
                {!isTested && isActive && (
                  <span className="font-mono text-[10px] text-sky-300">…</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active reason inspection feedback */}
        <AnimatePresence>
          {activeReason && (
            <motion.div
              key={activeReason.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 rounded-lg border border-red-500/30 bg-slate-900/60 p-4"
            >
              <p className="mb-3 flex items-center gap-2 font-serif text-sm text-red-200">
                <TriangleAlert className="h-4 w-4" />
                Testing reason: "{activeReason.label}"
              </p>
              {isRiskScore ? (
                <div className="mb-2 rounded-md border border-red-500/20 bg-red-500/5 p-3 font-serif text-xs leading-relaxed text-slate-300">
                  {activeReason.note}
                </div>
              ) : (
                <div className="mb-3 rounded-md border border-slate-700 bg-slate-950/50 p-3">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-red-300">
                        Maria · Denied
                      </p>
                      <p className="font-mono text-sm text-slate-200">
                        {currentFactor?.maria}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Scale className="h-5 w-5 text-amber-300" />
                      <span className="mt-0.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                        Identical
                      </span>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wider text-emerald-300">
                        Applicant B · Approved
                      </p>
                      <p className="font-mono text-sm text-slate-200">
                        {currentFactor?.comparable}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-slate-800 pt-2 text-center font-serif text-[11px] leading-relaxed text-slate-400">
                    {activeReason.note}
                  </p>
                </div>
              )}
              <p className="flex items-center gap-1.5 text-[11px] text-red-300">
                <X className="h-3.5 w-3.5" /> Same value → cannot separate the two applicants → not the real reason
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Counter status */}
        <div className="mb-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-mono">
            {testedIds.size}/{OFFICIAL_REASONS.length} reasons
          </span>
          <span>·</span>
          <span>
            {allTested
              ? 'Every reason failed the check'
              : 'Test every reason to reach a conclusion'}
          </span>
        </div>

        {/* Audit Conclusion box (unlocked when all tested) */}
        <AnimatePresence>
          {allTested && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/5 p-5"
            >
              <p className="mb-2 flex items-center gap-2 font-serif text-amber-200">
                <Sparkles className="h-4 w-4" /> Forensic Conclusion & Dead-Drop Signal
              </p>
              <p className="mb-3 font-serif text-sm leading-relaxed text-slate-200">
                None of FinTrust's official reasons is the real differentiator — the two applicants' financials are exactly identical, yet the outcomes differ. That proves a{' '}
                <span className="text-amber-200 font-semibold">hidden variable</span> is what separates them.
              </p>
              <div className="mb-3 rounded-md border-l-2 border-amber-400 bg-slate-900/50 p-3 font-serif text-[11px] leading-relaxed text-slate-300">
                <span className="font-semibold text-amber-200">
                  The limits of counterfactuals:
                </span>{' '}
                they can only prove that a hidden variable exists — they{' '}
                <span className="text-amber-200">cannot tell you which feature the model used</span>{' '}
                (Wachter et al., 2018) — a counterfactual explains how to change the outcome, not why the model decided.
              </div>

              {/* Priya's Incoming Secure Transmission */}
              <div className="rounded-md border border-sky-500/30 bg-sky-950/30 p-3 font-serif text-xs text-sky-200">
                <p className="font-mono text-[10px] uppercase tracking-wider text-sky-400 mb-1">
                  Incoming Encrypted Dispatch · Priya M.
                </p>
                <p className="italic leading-relaxed text-slate-200">
                  "I told you — the rejection letter reasons are pure camouflage. I've staged an executive access card under the lobby reception desk for you tonight. The night guard is on a perimeter sweep. Proceed to my workstation in the Data Lab — I've hidden the key to my suppressed audit tickets and left instructions to unlock the model registry. Let's get the evidence before they purge it."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onContinue}
            disabled={!allTested}
            className={`inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-semibold transition ${
              allTested
                ? 'border-amber-400/60 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 hover:shadow-[0_0_24px_rgba(245,158,11,0.4)]'
                : 'cursor-not-allowed border-slate-800 text-slate-600'
            }`}
          >
            <span>Proceed to FinTrust Headquarters (Covert Entry)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
