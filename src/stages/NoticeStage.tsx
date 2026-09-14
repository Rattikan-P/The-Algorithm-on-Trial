import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  FileSearch,
  Cpu,
  BrainCircuit,
  SearchCode,
  MessageSquare
} from 'lucide-react';
import {
  PRETEST_URL,
  CONSENT_NOTE,
} from '../data/gameData';

interface NoticeStageProps {
  onBegin: () => void;
}

const DIALOGUE_LINES = [
  { sender: 'system', text: 'ENCRYPTED CONNECTION ESTABLISHED. CHANNEL: OMEGA-6.' },
  { sender: 'priya', text: 'Are you there? This is Priya. I’m bypassing the main FinTrust server to talk to you.' },
  { sender: 'priya', text: 'Management has officially blocked the audit. They’re calling it a "Black Box" to hide the truth, but the rejection rates are purely discriminatory.' },
  { sender: 'priya', text: 'The Series C funding round closes in 24 hours, and they’re launching the new AI model at dawn. They’ll do anything to keep the data clean until the check clears.' },
  { sender: 'priya', text: 'I’ve left the back entrance unlocked for tonight. If we don’t find the raw model logs now, they’ll scrub the evidence and ship the bias worldwide.' },
];

export const NoticeStage: React.FC<NoticeStageProps> = ({ onBegin }) => {
  const [pretestDone, setPretestDone] = useState<boolean>(() => {
    return sessionStorage.getItem('pretest_completed') === 'true';
  });
  const [hasOpenedForm, setHasOpenedForm] = useState<boolean>(() => {
    return sessionStorage.getItem('pretest_opened') === 'true';
  });
  const [confirmedSubmitted, setConfirmedSubmitted] = useState<boolean>(false);
  const [showPretestModal, setShowPretestModal] = useState<boolean>(false);
  
  // Dialogue state
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDossier, setShowDossier] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-advance initial system message
  useEffect(() => {
    if (dialogueIndex === 0 && !showDossier) {
      const timer = setTimeout(() => setDialogueIndex(1), 1200);
      return () => clearTimeout(timer);
    }
  }, [dialogueIndex, showDossier]);

  // Scroll to bottom of chat when dialogueIndex changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueIndex]);

  const handleNextDialogue = () => {
    if (dialogueIndex < DIALOGUE_LINES.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      setShowDossier(true);
    }
  };

  const handleSkipDialogue = () => {
    setShowDossier(true);
  };

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 font-sans text-slate-100">
      {/* Background ambient elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <div className="h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {!showDossier ? (
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 w-full max-w-2xl"
          >
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-200">Secure Transmission</h2>
                    <p className="text-[11px] text-slate-400 font-mono">Priya Vance • FinTrust Compliance</p>
                  </div>
                </div>
                <button 
                  onClick={handleSkipDialogue}
                  className="rounded px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  [ SKIP INTRO ]
                </button>
              </div>

              {/* Chat Messages Container with Fixed Height & Scroll */}
              <div className="h-[340px] overflow-y-auto p-6 space-y-4 bg-slate-950/40">
                <AnimatePresence>
                  {DIALOGUE_LINES.slice(0, dialogueIndex + 1).map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${line.sender === 'system' ? 'justify-center my-2' : 'items-start'}`}
                    >
                      {line.sender === 'priya' && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow">
                          PV
                        </div>
                      )}
                      <div
                        className={`rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[80%] ${
                          line.sender === 'system'
                            ? 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 font-mono text-xs text-center w-full py-2 shadow-inner'
                            : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 shadow-md'
                        }`}
                      >
                        {line.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Footer / Action Control */}
              <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
                <div className="text-xs font-mono text-slate-500">
                  SECURE_SESSION // {dialogueIndex + 1} of {DIALOGUE_LINES.length}
                </div>
                {dialogueIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleNextDialogue}
                    className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    {dialogueIndex === DIALOGUE_LINES.length - 1 ? 'OPEN MISSION BRIEFING' : 'NEXT'}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dossier"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full max-w-2xl"
          >
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden font-sans">
              {/* Header */}
              <div className="bg-slate-950/50 px-6 py-5 border-b border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-amber-500 font-mono text-xs tracking-[0.2em] uppercase font-bold">Mission Briefing</span>
                  <span className="text-slate-500 font-mono text-xs flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3 text-rose-500" />
                    CONFIDENTIAL
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-100 font-display tracking-widest uppercase">The Algorithm on Trial</h1>
              </div>

              {/* Body: Sectioned Content */}
              <div className="p-6 space-y-5">
                
                {/* Section 1: The Incident */}
                <section className="flex gap-3.5 items-start">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <BrainCircuit className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200 mb-1 font-display uppercase tracking-wider">1. The Incident</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-serif">
                      FinTrust's automated loan-approval system has begun rejecting qualified applicants unexpectedly. The exact internal mechanism behind these rejections remains unverified.
                    </p>
                  </div>
                </section>

                {/* Section 2: The Black Box */}
                <section className="flex gap-3.5 items-start">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                    <Cpu className="h-4 w-4 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200 mb-1 font-display uppercase tracking-wider">2. The Barrier: The "Black Box"</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-serif">
                      Management maintains that the algorithm functions as a complex <strong className="text-slate-200 font-sans">"Black Box"</strong>, claiming its inner workings cannot be easily audited or explained.
                    </p>
                  </div>
                </section>

                {/* Section 3: Explainable AI (XAI) */}
                <section className="flex gap-3.5 items-start">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <SearchCode className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-400 mb-1 font-display uppercase tracking-wider">3. The Methodology: XAI</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-serif">
                      As an independent auditor, you will apply <strong className="text-emerald-300 font-sans">Explainable AI (XAI)</strong> principles to inspect feature importance, analyze model decisions, and pierce through the black box.
                    </p>
                  </div>
                </section>

                {/* Section 4: The Objective */}
                <section className="flex gap-3.5 items-start">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <FileSearch className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200 mb-1 font-display uppercase tracking-wider">4. Your Objective</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-serif">
                      Gather physical clues, examine audit reports, and uncover the true factors driving the algorithm's verdicts to determine whether the system operates fairly.
                    </p>
                  </div>
                </section>

              </div>

              {/* Footer / Call to action */}
              <div className="bg-slate-950/80 px-6 py-5 border-t border-slate-800 flex flex-col items-center">
                <p className="mb-5 text-center text-xs text-slate-400 leading-normal">
                  {CONSENT_NOTE}
                </p>
                
                <button
                  onClick={handleStartGame}
                  className="group relative flex w-full max-w-xs items-center justify-center gap-2 overflow-hidden rounded-md bg-amber-500 px-5 py-3 font-bold text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer text-sm"
                >
                  <span className="relative z-10 uppercase tracking-wider">Accept Mission</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="mt-4 text-[10px] text-slate-600 hover:text-slate-400 underline transition cursor-pointer"
                >
                  Reset all data (Restart game / Clear Pre-test status)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pretest Modal */}
      <AnimatePresence>
        {showPretestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
            >
              <div className="bg-amber-500/10 p-6 text-center border-b border-amber-500/20">
                <Lock className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-100">Security Clearance Required</h3>
                <p className="mt-2 text-sm text-amber-200/80">
                  Mission access requires completing a mandatory Pre-Test evaluation.
                </p>
              </div>
              <div className="p-6 space-y-6">
                {!hasOpenedForm ? (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-slate-300">
                      Please complete the pre-test form in a new tab. Once submitted, return here to unlock the system.
                    </p>
                    <button
                      onClick={handleOpenPretest}
                      className="inline-flex w-full items-center justify-center gap-2 rounded bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Pre-Test Form
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded border border-emerald-500/30 bg-emerald-950/30 p-4 text-center">
                      <p className="text-sm text-emerald-300">
                        Form opened. Have you submitted your answers?
                      </p>
                    </div>
                    <label className="flex items-start gap-3 rounded bg-slate-950/50 p-3 cursor-pointer border border-slate-800 hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={confirmedSubmitted}
                        onChange={(e) => setConfirmedSubmitted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500/20"
                      />
                      <span className="text-sm text-slate-300">
                        I confirm that I have submitted the Pre-test completely.
                      </span>
                    </label>
                    <button
                      onClick={handleConfirmDone}
                      disabled={!confirmedSubmitted}
                      className="inline-flex w-full items-center justify-center gap-2 rounded bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm & Unlock Access
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
