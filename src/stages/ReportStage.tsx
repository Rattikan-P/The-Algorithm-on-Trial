import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  FileText,
  RotateCcw,
  Download,
  ExternalLink,
  MessageSquare,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  EVIDENCES,
  MARIA_MESSAGES,
  POSTTEST_URL,
  REPORT_BULLETS,
  REPORT_OFFICIAL_EXPLANATION,
  CONSENT_NOTE,
} from '../data/gameData';
import { exportSessionData, getDetectiveRank } from '../utils/session';
import { CoherenceResult, FrameKey } from '../types';

interface ReportStageProps {
  unlockedEvidences: number[];
  unlockedOrder: number[];
  verdictFrame: FrameKey | null;
  caseEvidence: number[];
  bonusClues: string[];
  result: CoherenceResult | null;
  onReset: () => void;
}

export const ReportStage: React.FC<ReportStageProps> = ({
  unlockedEvidences,
  unlockedOrder,
  caseEvidence,
  bonusClues,
  onReset,
}) => {
  const [showOriginalLetter, setShowOriginalLetter] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);

  // Post-test modal and status tracking
  const [posttestDone, setPosttestDone] = useState<boolean>(() => {
    return localStorage.getItem('posttest_completed') === 'true';
  });
  const [hasOpenedPosttest, setHasOpenedPosttest] = useState<boolean>(() => {
    return localStorage.getItem('posttest_opened') === 'true';
  });
  const [confirmedPosttest, setConfirmedPosttest] = useState<boolean>(false);
  const [showPosttestModal, setShowPosttestModal] = useState<boolean>(() => {
    return localStorage.getItem('posttest_completed') !== 'true';
  });

  const handleOpenPosttest = () => {
    setHasOpenedPosttest(true);
    localStorage.setItem('posttest_opened', 'true');
    window.open(POSTTEST_URL, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmPosttestDone = () => {
    setPosttestDone(true);
    localStorage.setItem('posttest_completed', 'true');
    setShowPosttestModal(false);
  };

  const citedEvidences = (caseEvidence || [])
    .map((id) => EVIDENCES[id])
    .filter(Boolean);

  const mariaNote = MARIA_MESSAGES.complete;

  // Score calculation:
  // 1. Evidence: 10 pts per primary evidence (7 max = 70)
  // 2. Hidden clues: 10 pts per bonus item (4 max = 40)
  // 3. Audit verified events: 15 pts per verified event (4 max = 60)
  const evScore = unlockedEvidences.length * 10;
  const bonusScore = bonusClues.length * 10;
  const weightScore = 60;
  const totalScore = evScore + bonusScore + weightScore;
  const rank = getDetectiveRank(totalScore);

  return (
    <motion.div
      className="min-h-screen bg-slate-950 px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Post-test Pop-up Modal */}
      <AnimatePresence>
        {showPosttestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-sky-500/40 bg-slate-900 shadow-[0_0_60px_rgba(56,189,248,0.3)]"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-sky-300 to-emerald-500" />

              {/* Close icon button */}
              <button
                type="button"
                onClick={() => setShowPosttestModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/15 text-sky-300">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block rounded bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                      Final Step · Research Study
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-100">
                      Post-Game Survey (Post-Test)
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-sm leading-relaxed text-slate-300">
                  <p>
                    Congratulations! You have successfully audited FinTrust's AI and exposed the hidden proxy variables.{' '}
                    <span className="font-semibold text-sky-200">
                      Please take 2–3 minutes to complete this final post-test survey
                    </span>{' '}
                    to conclude the research study.
                  </p>

                  <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3.5 text-xs text-slate-300">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 font-medium text-sky-200">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-[11px] font-bold text-sky-300">
                          1
                        </span>
                        <span>Click the button below to open the post-test in a new tab.</span>
                      </p>
                      <p className="flex items-center gap-2 font-medium text-sky-200">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-[11px] font-bold text-sky-300">
                          2
                        </span>
                        <span>Submit your answers, then return here to view your final report.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Open Form Button */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleOpenPosttest}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition hover:bg-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] cursor-pointer"
                  >
                    <span>{hasOpenedPosttest ? 'Open Survey Again' : 'Take the Post-Test Survey'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  {hasOpenedPosttest && (
                    <p className="mt-1.5 text-center text-xs text-emerald-400">
                      ✓ Post-test opened in a new tab
                    </p>
                  )}
                </div>

                {/* Step 2: Confirmation Checkbox */}
                <div className="mt-5 rounded-lg border border-slate-700/80 bg-slate-950/60 p-3.5">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-300">
                    <input
                      type="checkbox"
                      checked={confirmedPosttest}
                      onChange={(e) => setConfirmedPosttest(e.target.checked)}
                      disabled={!hasOpenedPosttest}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-400 disabled:opacity-40"
                    />
                    <span className={hasOpenedPosttest ? 'text-slate-200' : 'text-slate-500'}>
                      I have completed and submitted the Post-test survey.
                    </span>
                  </label>
                </div>

                {/* Step 3: Confirm & View Report button */}
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleConfirmPosttestDone}
                    disabled={!hasOpenedPosttest || !confirmedPosttest}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      hasOpenedPosttest && confirmedPosttest
                        ? 'border border-emerald-500/50 bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:bg-emerald-500 cursor-pointer'
                        : 'border border-slate-800 bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm & View Final Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPosttestModal(false)}
                    className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
                  >
                    View Report First
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] leading-snug text-slate-500">
                  {CONSENT_NOTE}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-3xl">
        {/* Top Post-Test Alert Banner */}
        <div className="mb-6">
          {posttestDone ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span>
                  <strong className="font-semibold text-emerald-200">Post-test completed:</strong> Thank you for helping with our AI ethics research study!
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenPosttest}
                className="inline-flex items-center gap-1 font-mono text-[11px] underline-offset-2 hover:underline text-emerald-400"
              >
                Review Survey <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-sky-500/50 bg-sky-500/15 p-4 shadow-[0_0_25px_rgba(56,189,248,0.15)]">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400" />
                <div>
                  <p className="text-xs font-semibold text-sky-100">
                    Final Step: Please Complete the Post-Test Survey (2–3 mins)
                  </p>
                  <p className="text-[11px] text-sky-300/80">
                    Your feedback is essential to measuring the educational impact of this case study.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPosttestModal(true)}
                className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-sky-300 transition cursor-pointer"
              >
                <span>Take Post-Test</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Header with Detective Rank & Score */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            <Award className="h-7 w-7 text-amber-300" />
          </motion.div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-300 border border-amber-500/20">
            Case Closed & Verified
          </span>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-amber-100">
            Official Audit & Closing Report
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Detective Rank:{' '}
            <span className={`font-mono font-bold ${rank.color}`}>{rank.label}</span> · Total Score{' '}
            <span className="font-mono text-amber-300 font-bold">{totalScore}</span> / 170
          </p>
        </div>

        {/* Score Breakdown (Clean 3-Column Grid with Explainer Toggle) */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-mono text-lg sm:text-xl font-bold text-amber-300">
                {evScore} <span className="text-xs font-normal text-slate-500">/ 70</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Primary Evidence ({unlockedEvidences.length}/7)
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-mono text-lg sm:text-xl font-bold text-amber-300">
                {bonusScore} <span className="text-xs font-normal text-slate-500">/ 40</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Secret Intel ({bonusClues.length}/4)
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
                {weightScore} <span className="text-xs font-normal text-slate-500">/ 60</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Audit Verified (4/4)
              </p>
            </div>
          </div>

          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => setShowScoreExplainer(!showScoreExplainer)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition"
            >
              <HelpCircle className="h-3 w-3" />
              <span>{showScoreExplainer ? 'Hide score calculation' : 'How is this score calculated?'}</span>
            </button>
          </div>

          {showScoreExplainer && (
            <div className="mt-2 rounded-md border border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-400 space-y-1.5">
              <p>• <strong>Primary Evidence (+10 pts each, max 70):</strong> The 7 official case documents required to build and prove systemic discrimination.</p>
              <p>• <strong>Secret Intel (+10 pts each, max 40):</strong> 4 classified bonus items hidden in the office: Company Plaque, CCTV Footages, Terminal Console, and Paper Shredder.</p>
              <p>• <strong>Room Objects & Puzzles:</strong> Other clickable objects (visitor log, desk calendar, notes, brochure, phone, intercom) contain investigative lore, background context, and puzzle access codes.</p>
              <p>• <strong>Audit Verified (+15 pts each, max 60):</strong> Successfully connecting primary evidence to reconstruct the 4 systemic timeline phases.</p>
            </div>
          )}
        </div>

        {/* Independent Investigation Report Document */}
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-50/[0.02] p-5 sm:p-6 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
          <div className="mb-4 flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-300" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Audit Summary & Decision Findings
              </span>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300 border border-emerald-500/20">
              Case Status: Substantiated
            </span>
          </div>

          <p className="font-serif text-sm text-slate-200">Dear Maria R.,</p>
          <p className="mt-1 font-serif text-xs leading-relaxed text-slate-300">
            Our independent audit compared your application with approved peers possessing identical financial numbers. We found that FinTrust’s official reasons did not determine your rejection. The true drivers were:
          </p>

          {/* Key Findings List */}
          <ul className="my-3 space-y-2 rounded-md border border-slate-800 bg-slate-950/50 p-3.5">
            {REPORT_BULLETS.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 font-serif text-xs leading-relaxed text-slate-200"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Collapsible Original Letter */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowOriginalLetter(!showOriginalLetter)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-200 transition"
            >
              {showOriginalLetter ? (
                <ChevronUp className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              )}
              <span>{showOriginalLetter ? 'Hide original rejection notice' : 'View FinTrust’s original rejection notice (for comparison)'}</span>
            </button>

            {showOriginalLetter && (
              <pre className="mt-2 whitespace-pre-wrap rounded-md border border-slate-800 bg-slate-950/70 p-3 font-serif text-[11px] leading-relaxed text-slate-400">
                {REPORT_OFFICIAL_EXPLANATION}
              </pre>
            )}
          </div>

          {/* Verified Evidence Chain */}
          <div className="border-t border-slate-800/80 pt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Verified Primary Evidence Chain ({citedEvidences.length} items):
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {citedEvidences.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="rounded bg-emerald-500/20 px-1 py-0.2 font-mono text-[9px] font-bold text-emerald-300">
                      #{ev.id}
                    </span>
                    <span className="truncate font-medium text-slate-200 text-[11px]">{ev.title}</span>
                  </div>
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400 ml-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maria's Follow-up Note */}
        <div className="mb-6 rounded-lg border border-sky-500/20 bg-sky-950/15 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-300">
            <MessageSquare className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Two Weeks Later — Maria's Message
            </span>
          </div>
          <p className="font-serif text-xs leading-relaxed text-slate-200">{mariaNote}</p>
          <p className="mt-2 text-right text-[11px] text-slate-500">
            — Maria R., owner of the bakery
          </p>
        </div>

        {/* Post-test Action & Download */}
        <div className="mb-6 flex flex-col items-center gap-3">
          {posttestDone ? (
            <button
              type="button"
              onClick={() => setShowPosttestModal(true)}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-8 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Post-Test Survey Completed · Review Responses</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPosttestModal(true)}
              className="inline-flex items-center gap-2 rounded-md border border-sky-400/60 bg-sky-500/15 px-8 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/25 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 text-sky-300" />
              <span>Complete Post-Test Assessment (Required)</span>
            </button>
          )}
          <button
            type="button"
            onClick={exportSessionData}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export audit session data (.json)</span>
          </button>
        </div>

        {/* Discovery Order Breadcrumb */}
        {unlockedOrder.length > 0 && (
          <div className="text-center text-[11px] text-slate-500">
            Investigation path: [{unlockedOrder.join(' → ')}]
          </div>
        )}

        {/* Restart Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart Investigation</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
