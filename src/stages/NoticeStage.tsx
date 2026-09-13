import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  TriangleAlert,
  ArrowRight,
  ExternalLink,
  ClipboardCheck,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  REJECTION_LETTER_TEXT,
  PRETEST_URL,
  CONSENT_NOTE,
} from '../data/gameData';

interface NoticeStageProps {
  onBegin: () => void;
}

export const NoticeStage: React.FC<NoticeStageProps> = ({ onBegin }) => {
  const [pretestDone, setPretestDone] = useState<boolean>(() => {
    return sessionStorage.getItem('pretest_completed') === 'true';
  });
  const [hasOpenedForm, setHasOpenedForm] = useState<boolean>(() => {
    return sessionStorage.getItem('pretest_opened') === 'true';
  });
  const [confirmedSubmitted, setConfirmedSubmitted] = useState<boolean>(false);
  const [showPretestModal, setShowPretestModal] = useState<boolean>(() => {
    return sessionStorage.getItem('pretest_completed') !== 'true';
  });

  const handleOpenPretest = () => {
    setHasOpenedForm(true);
    sessionStorage.setItem('pretest_opened', 'true');
    window.open(PRETEST_URL, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmDone = () => {
    setPretestDone(true);
    sessionStorage.setItem('pretest_completed', 'true');
    setShowPretestModal(false);
  };

  const handleStartGame = () => {
    if (!pretestDone) {
      setShowPretestModal(true);
      return;
    }
    onBegin();
  };

  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Mandatory Pre-test Pop-up Modal */}
      <AnimatePresence>
        {showPretestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-amber-500/40 bg-slate-900 shadow-[0_0_60px_rgba(245,158,11,0.3)]"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/15 text-amber-300">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                      Mandatory · Research Study
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-100">
                      Pre-Game Survey (Pre-Test)
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-sm leading-relaxed text-slate-300">
                  <p>
                    This simulation is part of an AI ethics research study.{' '}
                    <span className="font-semibold text-amber-200">
                      Please complete this short 2–3 minute pre-test
                    </span>{' '}
                    before beginning the investigation so we can measure your starting knowledge.
                  </p>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-slate-300">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 font-medium text-amber-200">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300">
                          1
                        </span>
                        <span>Click the button below to open the survey in a new tab.</span>
                      </p>
                      <p className="flex items-center gap-2 font-medium text-amber-200">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300">
                          2
                        </span>
                        <span>Submit your responses, then return here and check the confirmation box.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Open form button */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleOpenPretest}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                  >
                    <span>{hasOpenedForm ? 'Open Survey Again' : 'Take the Pre-Test Survey'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  {hasOpenedForm && (
                    <p className="mt-1.5 text-center text-xs text-emerald-400">
                      ✓ Form opened in a new tab
                    </p>
                  )}
                </div>

                {/* Step 2: Confirmation Checkbox (only activated after opening) */}
                <div className="mt-5 rounded-lg border border-slate-700/80 bg-slate-950/60 p-3.5">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-300">
                    <input
                      type="checkbox"
                      checked={confirmedSubmitted}
                      onChange={(e) => setConfirmedSubmitted(e.target.checked)}
                      disabled={!hasOpenedForm}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-400 disabled:opacity-40"
                    />
                    <span className={hasOpenedForm ? 'text-slate-200' : 'text-slate-500'}>
                      I have completed and submitted the Pre-test survey.
                    </span>
                  </label>
                </div>

                {/* Step 3: Unlock & Proceed button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleConfirmDone}
                    disabled={!hasOpenedForm || !confirmedSubmitted}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      hasOpenedForm && confirmedSubmitted
                        ? 'border border-emerald-500/50 bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:bg-emerald-500 cursor-pointer'
                        : 'border border-slate-800 bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {hasOpenedForm && confirmedSubmitted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                        <span>Confirm & Enter Investigation</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-slate-500" />
                        <span>Complete survey & check box to unlock</span>
                      </>
                    )}
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

      <div className="relative z-10 w-full max-w-2xl">
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.3em] text-amber-500/70">
          FinTrust AI · Loan Application Outcome
        </p>
        <h1 className="mb-6 text-center font-serif text-4xl font-bold text-amber-100 md:text-5xl">
          The Rejection Letter
        </h1>

        {/* Rejection letter card */}
        <motion.div
          className="relative mx-auto mb-6 max-w-lg rounded-lg border border-amber-500/30 bg-amber-50/[0.03] p-6 shadow-[0_0_30px_rgba(245,158,11,0.12)]"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-3 flex items-center gap-2 border-b border-amber-500/20 pb-3">
            <Mail className="h-4 w-4 text-amber-300" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300/80">
              no-reply@fintrust.ai
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-slate-200">
            {REJECTION_LETTER_TEXT}
          </pre>
        </motion.div>

        {/* Maria's account */}
        <motion.div
          className="mx-auto mb-4 max-w-lg rounded-md border border-slate-700 bg-slate-900/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            — Maria's Account (Client)
          </p>
          <p className="font-serif text-sm italic leading-relaxed text-slate-300">
            "Every one of my numbers was strong, but they turned me down without ever giving me a real reason... I am starting to wonder if it was ever about the numbers at all."
          </p>
        </motion.div>

        {/* Whistleblower Intel */}
        <motion.div
          className="mx-auto mb-6 max-w-lg rounded-md border border-amber-500/30 bg-amber-500/5 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
              — Encrypted Tip · Whistleblower Contact
            </p>
            <span className="font-mono text-[10px] text-amber-500/70">PRIYA M. · LEAD DATA SCIENTIST</span>
          </div>
          <p className="font-serif text-sm leading-relaxed text-slate-300">
            "I built this system, and I watched management bypass our safety audits to close their $40M funding round. Maria was one of dozens flagged by a hidden proxy variable. I can't speak publicly under my NDA, but if you audit their official excuses, I will help you penetrate our systems tonight."
          </p>
        </motion.div>

        {/* Investigator mandate alert */}
        <motion.div
          className="mx-auto mb-6 flex max-w-lg items-start gap-3 rounded-md border border-sky-500/30 bg-sky-500/5 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <TriangleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400" />
          <p className="font-serif text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-slate-100">Investigative Mandate:</span> FinTrust claims objective algorithmic neutrality. You will first audit their official mathematical defenses to expose the discrepancies, then coordinate with Priya's dead-drops to retrieve the suppressed data from corporate headquarters.
          </p>
        </motion.div>

        {/* Pretest status indicator */}
        <motion.div
          className="mx-auto mb-6 max-w-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          {pretestDone ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Pre-test completed · Ready to investigate</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPretestModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/25"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Pre-test survey required · Click here to complete</span>
            </button>
          )}
        </motion.div>

        {/* CTA Button */}
        <div className="text-center">
          <motion.button
            type="button"
            onClick={handleStartGame}
            className={`group inline-flex items-center gap-2 rounded-md px-8 py-3 font-sans text-sm font-semibold transition ${
              pretestDone
                ? 'border border-amber-500/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer'
                : 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:border-amber-500/40 hover:text-amber-300 cursor-pointer'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {pretestDone ? (
              <>
                <span>Demand an Explanation from FinTrust</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-amber-400" />
                <span>Complete Pre-Test to Begin Investigation</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Developer / Reset Option */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            className="text-[10px] text-slate-600 hover:text-slate-400 underline transition cursor-pointer"
          >
            Reset all data (Restart game / Clear Pre-test status)
          </button>
        </div>
      </div>
    </motion.div>
  );
};
