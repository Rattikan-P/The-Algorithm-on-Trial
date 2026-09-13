import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  Building,
  Target,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { REAL_WORLD_CASES } from '../data/gameData';
import { KNOWLEDGE_CONCEPTS } from '../data/knowledgeData';
import { CoherenceResult, FrameKey } from '../types';

interface DebriefStageProps {
  verdictFrame?: FrameKey | null;
  caseEvidence?: number[];
  result?: CoherenceResult | null;
  onContinue: () => void;
}

export const DebriefStage: React.FC<DebriefStageProps> = ({ onContinue }) => {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  return (
    <motion.div
      className="min-h-screen bg-slate-950 px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
          >
            <ShieldCheck className="h-6 w-6 text-amber-300" />
          </motion.div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-300 border border-amber-500/20">
            Debrief & Academic Takeaway
          </span>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-amber-100">
            The Truth Behind the Explanation
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            What your investigation proved — and the AI ethics principles at stake.
          </p>
        </div>

        {/* Section 1: 3 Core Revelations (Visual cards with bite-sized text) */}
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-wider text-amber-200">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>3 Investigative Takeaways</span>
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-lg border border-red-500/30 bg-slate-900/60 p-4 transition hover:border-red-500/50">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-red-200">
                1. Camouflage Reasons
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                FinTrust’s official letter was generic marketing text meant to disguise the actual model features.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-amber-500/30 bg-slate-900/60 p-4 transition hover:border-amber-500/50">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Building className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-amber-200">
                2. Proxy Discrimination
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                The "Neighborhood Stability Index" was calculated from zip codes—penalizing entire districts unlawfully.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-emerald-500/30 bg-slate-900/60 p-4 transition hover:border-emerald-500/50">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-emerald-200">
                3. Systemic Failure
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Not a lone coding error. Executives bypassed fairness audits to secure Series C funding on time.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: AI Ethics & XAI Knowledge Bank (Clean accordion cards) */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-wider text-amber-200">
              <GraduationCap className="h-4 w-4 text-amber-400" />
              <span>AI Ethics & XAI Knowledge Bank</span>
            </h2>
            <span className="text-[11px] text-slate-500">Click to explore core concepts</span>
          </div>

          <div className="space-y-2.5">
            {KNOWLEDGE_CONCEPTS.map((concept) => {
              const isExpanded = expandedConcept === concept.id;
              return (
                <div
                  key={concept.id}
                  className={`overflow-hidden rounded-lg border transition ${
                    isExpanded
                      ? 'border-amber-500/50 bg-slate-900/90 shadow-md'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  {/* Header / Clickable Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedConcept(isExpanded ? null : concept.id)}
                    className="flex w-full items-center justify-between p-3.5 text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase text-amber-400 border border-amber-500/20">
                        {concept.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-slate-200">
                        {concept.term}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-amber-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                  </button>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 px-4 pb-4 pt-3 text-xs space-y-2.5">
                      <div>
                        <p className="font-semibold text-slate-300">Simple Definition:</p>
                        <p className="mt-0.5 text-slate-400 leading-relaxed">
                          {concept.definition}
                        </p>
                      </div>

                      <div className="rounded-md border border-emerald-500/20 bg-emerald-950/20 p-2.5">
                        <p className="font-semibold text-emerald-300">What Happened in FinTrust:</p>
                        <p className="mt-0.5 text-slate-300 leading-relaxed">
                          {concept.caseApplication}
                        </p>
                      </div>

                      <div className="rounded-md border border-amber-500/20 bg-amber-950/20 p-2.5">
                        <p className="font-semibold text-amber-300">Key Ethical Rule:</p>
                        <p className="mt-0.5 text-amber-100/80 leading-relaxed">
                          {concept.takeaway}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Grounded in Real World Cases */}
        <div className="mb-8 rounded-lg border border-sky-500/20 bg-sky-950/15 p-4">
          <div className="mb-2.5 flex items-center gap-2 text-sky-300">
            <FileText className="h-4 w-4" />
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider">
              Real-World Precedents (Ground Truth)
            </h3>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {REAL_WORLD_CASES.map((c) => (
              <div
                key={c.name}
                className="rounded border border-sky-500/15 bg-slate-900/50 p-2.5 text-xs"
              >
                <p className="font-semibold text-sky-200">{c.name}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/20 px-8 py-3 text-sm font-semibold text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.25)] transition hover:bg-amber-500/30"
          >
            <span>Proceed to Official Closing Report</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
