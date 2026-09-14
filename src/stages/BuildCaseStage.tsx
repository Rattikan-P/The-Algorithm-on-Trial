import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  Lock,
  Lightbulb,
  Compass,
  FileText,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { EvidenceViewer } from '../components/EvidenceViewers';
import {
  BUILD_CASE_EVENTS,
  EVIDENCES,
  FRAME_LABELS,
  IMAGES,
  VERDICT_FRAMES,
} from '../data/gameData';
import { calculateVerdictCoherence, recordErrorAttempt } from '../utils/session';
import { CoherenceResult, EvidenceItem, FrameKey } from '../types';

interface BuildCaseStageProps {
  unlockedEvidences: number[];
  onComplete: (
    verdictFrame: FrameKey,
    citedEvidence: number[],
    result: CoherenceResult
  ) => void;
}

// -------------------------------------------------------------------
// 1. Case Analyst Typewriter Banner with Click-to-Skip
// -------------------------------------------------------------------
const CaseAnalystBanner: React.FC<{
  text: string;
  meta?: string;
  children?: React.ReactNode;
  isComplete: boolean;
  onTextComplete: () => void;
  onSkip: () => void;
}> = ({ text, meta, children, isComplete, onTextComplete, onSkip }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setDisplayedText(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
        onTextComplete();
      }
    }, 18);

    return () => clearInterval(interval);
  }, [text]);

  // When parent triggers skip, instantly show full text
  useEffect(() => {
    if (isComplete && displayedText.length < text.length) {
      setDisplayedText(text);
    }
  }, [isComplete, text]);

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 24 }}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-500/30 bg-slate-950/95 backdrop-blur shadow-[0_-10px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="mx-auto flex max-w-4xl items-stretch gap-4 px-4 py-4">
        {/* Analyst Portrait */}
        <div className="relative hidden h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-500/40 bg-slate-900 shadow-inner sm:block">
          <img
            src={IMAGES.analyst}
            alt="Case Analyst"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Narrative Box with Click to Skip */}
        <div
          onClick={!isComplete ? onSkip : undefined}
          className={`relative flex-1 rounded-md border border-emerald-500/20 bg-slate-900/70 p-4 transition ${
            !isComplete ? 'cursor-pointer hover:border-emerald-400/40' : ''
          }`}
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-emerald-500/70">
              Case Analyst
            </p>
            {!isComplete && (
              <span className="font-mono text-[9px] text-emerald-400/70 animate-pulse">
                Click to skip text ▾
              </span>
            )}
          </div>
          <p className="min-h-[3.5rem] font-serif text-sm leading-relaxed text-slate-100">
            {isComplete ? text : displayedText}
            {!isComplete && (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-emerald-400 align-middle" />
            )}
          </p>
          {isComplete && <div className="mt-3">{children}</div>}
          {meta && (
            <span className="mt-2 block font-mono text-[10px] text-slate-500">
              {meta}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// -------------------------------------------------------------------
// 2. Timeline Steps Tracker (Z3)
// -------------------------------------------------------------------
const StepsTracker: React.FC<{
  steps: typeof BUILD_CASE_EVENTS;
  currentIndex: number;
  phase: string;
  citedByStep: Record<string, number[]>;
}> = ({ steps, currentIndex, phase, citedByStep }) => {
  return (
    <ol className="space-y-1.5">
      {steps.map((step, idx) => {
        const isPast = phase === 'steps' || phase === 'intro' ? idx < currentIndex : true;
        const isCurrent = phase === 'steps' && idx === currentIndex;
        const stepCitations = citedByStep[step.key] || [];

        return (
          <li
            key={step.key}
            className={`flex items-start gap-2 rounded border px-2.5 py-1.5 transition ${
              isCurrent
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : isPast
                ? 'border-slate-800 bg-slate-950/40'
                : 'border-slate-800/50 opacity-50'
            }`}
          >
            <span className="mt-0.5 flex-shrink-0">
              {isPast ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : isCurrent ? (
                <span className="mt-0.5 block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              ) : (
                <Lock className="h-3 w-3 text-slate-600" />
              )}
            </span>
            <div className="min-w-0">
              <p
                className={`text-[11px] font-semibold ${
                  isCurrent
                    ? 'text-emerald-200'
                    : isPast
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}
              >
                {step.title}
              </p>
              {isPast && stepCitations.length > 0 && (
                <p className="mt-1 flex flex-wrap gap-1">
                  {stepCitations.map((evId) => (
                    <span
                      key={evId}
                      className="rounded border border-emerald-500/30 bg-emerald-500/5 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300"
                    >
                      #{evId}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

// -------------------------------------------------------------------
// 3. Evidence Tile (Y3)
// -------------------------------------------------------------------
const EvidenceTile: React.FC<{
  ev: EvidenceItem;
  selected: boolean;
  alreadyCited?: { stepIndex: number; stepTitle: string; stepNum: number } | null;
  onToggle: (id: number) => void;
  onInspect: (id: number) => void;
}> = ({ ev, selected, alreadyCited, onToggle, onInspect }) => {
  const isLocked = Boolean(alreadyCited);

  return (
    <div
      onClick={() => {
        if (!isLocked) {
          onToggle(ev.id);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-lg border p-2.5 transition ${
        isLocked
          ? 'cursor-default border-slate-800/80 bg-slate-950/60 opacity-60'
          : selected
          ? 'cursor-pointer border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40'
          : 'cursor-pointer border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/80'
      }`}
    >
      {/* Selected Indicator */}
      {selected && !isLocked && (
        <span className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400 bg-emerald-500 text-slate-950 shadow-md">
          <Check className="h-3 w-3 stroke-[3]" />
        </span>
      )}

      {/* Already Cited Badge */}
      {isLocked && alreadyCited && (
        <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded border border-emerald-500/40 bg-slate-900/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-300 shadow backdrop-blur">
          <Check className="h-2.5 w-2.5 text-emerald-400" />
          Event {alreadyCited.stepNum}
        </span>
      )}

      {/* Inspect Evidence Button - Always clickable even when locked */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onInspect(ev.id);
        }}
        className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/90 text-slate-300 shadow transition hover:scale-105 hover:border-emerald-400 hover:bg-slate-800 hover:text-emerald-200"
        title="Inspect Evidence Document"
        aria-label={`Inspect evidence #${ev.id}`}
      >
        <Eye className="h-3.5 w-3.5" />
      </button>

      {/* Real Object Image Thumbnail */}
      <div className="relative mb-2 h-24 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950">
        {ev.image ? (
          <img
            src={ev.image}
            alt={ev.title}
            className={`h-full w-full object-cover object-center transition-transform duration-300 ${
              isLocked ? 'grayscale-[35%] contrast-90' : 'group-hover:scale-105'
            }`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/50">
              {ev.kind}
            </span>
          </div>
        )}

        {/* Kind tag */}
        <div className="absolute bottom-1.5 left-1.5 rounded bg-slate-950/85 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-300 backdrop-blur">
          {ev.kind}
        </div>

        {/* Already cited overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[0.5px]">
            <span className="rounded border border-slate-700/80 bg-slate-950/85 px-2 py-0.5 font-mono text-[9px] text-slate-300">
              Already Cited
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold leading-tight text-slate-100">
          #{ev.id} {ev.title}
        </p>
        <p className="mt-0.5 truncate text-[9px] text-slate-500">{ev.source}</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 4. Main BuildCase Stage Component (eO)
// -------------------------------------------------------------------
export const BuildCaseStage: React.FC<BuildCaseStageProps> = ({
  unlockedEvidences,
  onComplete,
}) => {
  const [inspectModalId, setInspectModalId] = useState<number | null>(null);
  const [showClueHint, setShowClueHint] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [citedByStep, setCitedByStep] = useState<Record<string, number[]>>({});
  const [status, setStatus] = useState<'asking' | 'ok' | 'incomplete' | 'wrong'>('asking');
  const [phase, setPhase] = useState<'intro' | 'steps' | 'conclude' | 'done'>('intro');
  const [showMismatchedAlert, setShowMismatchedAlert] = useState(false);
  const [mismatchedIds, setMismatchedIds] = useState<number[]>([]);
  const [missingCount, setMissingCount] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameKey | null>(null);
  const [coherenceResult, setCoherenceResult] = useState<CoherenceResult | null>(null);
  const [isBannerTextComplete, setIsBannerTextComplete] = useState(false);

  const availableEvidences = Object.values(EVIDENCES).filter((ev) =>
    unlockedEvidences.includes(ev.id)
  );

  const currentStep = BUILD_CASE_EVENTS[stepIdx];
  const isLastStep = stepIdx === BUILD_CASE_EVENTS.length - 1;
  const allCitedIds: number[] = Object.values(citedByStep).flat() as number[];

  // Mismatched items in current selection
  const wrongItems = selectedIds.filter((id) => !currentStep.relevant.includes(id));
  const canToggle =
    phase === 'steps' && (status === 'asking' || status === 'wrong' || status === 'incomplete');

  const getCitedStepInfo = (evId: number) => {
    for (let i = 0; i < BUILD_CASE_EVENTS.length; i++) {
      const step = BUILD_CASE_EVENTS[i];
      const citedIds = citedByStep[step.key] || [];
      if (citedIds.includes(evId)) {
        return { stepIndex: i, stepTitle: step.title, stepNum: i + 1 };
      }
    }
    return null;
  };

  const handleToggle = (id: number) => {
    if (!canToggle) return;
    // Do not allow toggling clues already cited in a previous event
    if (getCitedStepInfo(id)) return;

    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= currentStep.relevant.length) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleConfirmEvidence = () => {
    if (selectedIds.length === 0) return;
    if (wrongItems.length > 0) {
      setMismatchedIds(wrongItems);
      setStatus('wrong');
      recordErrorAttempt('inference', `Timeline Event ${stepIdx + 1}: wrong evidence selected [${wrongItems.join(',')}]`);
      return;
    }
    const missing = currentStep.relevant.filter((id) => !selectedIds.includes(id));
    if (missing.length > 0) {
      setMissingCount(missing.length);
      setStatus('incomplete');
      recordErrorAttempt('inference', `Timeline Event ${stepIdx + 1}: incomplete evidence (${missing.length} missing)`);
      return;
    }
    setCitedByStep((prev) => ({ ...prev, [currentStep.key]: selectedIds }));
    setStatus('ok');
  };

  const handleNextStep = () => {
    if (isLastStep) {
      setPhase('conclude');
      return;
    }
    setStepIdx((prev) => prev + 1);
    setSelectedIds([]);
    setStatus('asking');
  };

  const handleSelectVerdict = (option: { key: FrameKey }) => {
    const coherence = calculateVerdictCoherence(option.key, allCitedIds);
    setSelectedFrame(option.key);
    setCoherenceResult(coherence);
    if (coherence.tier === 'complete') {
      setPhase('done');
    } else {
      recordErrorAttempt('inference', `Verdict selection mismatched: ${option.key}`);
      setShowMismatchedAlert(true);
    }
  };

  // Compose Voice narration text, meta tag, and action button
  let voiceText = '';
  let metaTag = '';
  let actionButton: React.ReactNode = null;

  if (phase === 'intro') {
    voiceText =
      "Alright, let's walk through the case one event at a time — four events in all, from the source of the data to the people it hit hardest. For each event I'll narrate what happened, then you bring me the evidence relevant to that event.";
    metaTag = 'Ready to begin';
    actionButton = (
      <button
        type="button"
        onClick={() => setPhase('steps')}
        className="rounded-md border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 hover:shadow-[0_0_18px_rgba(16,185,129,0.4)]"
      >
        Start the first event
      </button>
    );
  } else if (phase === 'steps') {
    metaTag = `Event ${stepIdx + 1}/${BUILD_CASE_EVENTS.length}`;
    if (status === 'asking') {
      voiceText = currentStep.voice;
      actionButton = (
        <button
          type="button"
          onClick={handleConfirmEvidence}
          disabled={selectedIds.length === 0}
          className={`rounded-md border px-4 py-2 text-xs font-semibold transition ${
            selectedIds.length === 0
              ? 'cursor-not-allowed border-slate-800 bg-slate-900/50 text-slate-600'
              : 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:shadow-[0_0_18px_rgba(16,185,129,0.4)]'
          }`}
        >
          Confirm evidence ({selectedIds.length})
        </button>
      );
    } else if (status === 'ok') {
      voiceText = currentStep.confirmed;
      actionButton = (
        <button
          type="button"
          onClick={handleNextStep}
          className="rounded-md border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
        >
          {isLastStep ? 'Go to the verdict' : 'Next event'}
        </button>
      );
    } else if (status === 'incomplete') {
      voiceText = `We're not quite there yet. This event requires ${currentStep.relevant.length} pieces of evidence. You've brought ${selectedIds.length}; ${missingCount === 1 ? '1 key clue is still missing' : `${missingCount} key clues are still missing`} — ${currentStep.hint}`;
      metaTag = 'Evidence missing';
      actionButton = (
        <button
          type="button"
          onClick={() => setStatus('asking')}
          className="rounded-md border border-slate-700 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/5"
        >
          Select more
        </button>
      );
    } else {
      voiceText = `Hold on... ${mismatchedIds.length === 1 ? 'that piece' : 'those pieces'} of evidence (${mismatchedIds.map((id) => `#${id}`).join(', ')}) don't connect to this part of the timeline — ${currentStep.hint}`;
      metaTag = 'Re-evaluate evidence';
      actionButton = (
        <button
          type="button"
          onClick={() => setStatus('asking')}
          className="rounded-md border border-slate-700 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/5"
        >
          Choose again
        </button>
      );
    }
  } else if (phase === 'conclude') {
    if (showMismatchedAlert && coherenceResult) {
      voiceText = `Audit findings inconsistency: Your conclusion is not supported by the forensic evidence package you have consolidated. Re-evaluate your audit report and ensure the verdict corresponds with the internal data.`;
      metaTag = 'Review Conclusion';
      actionButton = (
        <button
          type="button"
          onClick={() => setShowMismatchedAlert(false)}
          className="rounded-md border border-slate-700 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/5"
        >
          Choose again
        </button>
      );
    } else {
      voiceText = `Audit complete. You have consolidated ${allCitedIds.length} pieces of forensic evidence. Based on your findings, what is your official forensic verdict regarding the systemic failure at FinTrust?`;
      actionButton = (
        <div className="grid gap-2 sm:grid-cols-2">
          {VERDICT_FRAMES.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSelectVerdict(option)}
              className="rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-left text-xs transition hover:border-emerald-400/60 hover:bg-emerald-500/5"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                {option.label}
              </span>
              <span className="mt-0.5 block font-serif text-[11px] text-slate-400">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      );
    }
  } else {
    // phase === 'done'
    voiceText = `Good... the conclusion "${
      selectedFrame ? FRAME_LABELS[selectedFrame] : ''
    }" is supported by ${coherenceResult?.matched}/${coherenceResult?.total} pieces of evidence. This accusation holds up.`;
    metaTag = 'Accusation accepted';
    actionButton = (
      <button
        type="button"
        onClick={() => {
          if (selectedFrame && coherenceResult) {
            onComplete(selectedFrame, allCitedIds, coherenceResult);
          }
        }}
        className="rounded-md border border-amber-400/60 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/20 hover:shadow-[0_0_18px_rgba(245,158,11,0.4)]"
      >
        Present the case
      </button>
    );
  }

  // Reset typewriter state whenever speech text changes
  useEffect(() => {
    setIsBannerTextComplete(false);
  }, [voiceText]);

  // Support pressing Space or Enter to skip typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isBannerTextComplete && (e.code === 'Space' || e.key === 'Enter')) {
        // Prevent default spacebar page scrolling
        e.preventDefault();
        setIsBannerTextComplete(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBannerTextComplete]);

  // Determine whether top section should have dimmed backdrop & interaction lock
  const isUpperDimmed =
    !isBannerTextComplete ||
    phase === 'intro' ||
    status === 'ok' ||
    status === 'incomplete' ||
    status === 'wrong' ||
    phase === 'done' ||
    (phase === 'conclude' && showMismatchedAlert);

  const activeTab =
    phase === 'steps' || phase === 'intro'
      ? 'evidence'
      : phase === 'conclude'
      ? 'analysis'
      : 'verdict';

  const progressTabs = [
    { key: 'evidence', label: 'I · Evidence' },
    { key: 'analysis', label: 'II · Inference' },
    { key: 'verdict', label: 'III · Verdict' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Grid Pattern Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-emerald-500/15 px-5 py-3">
        <div className="flex items-center gap-2 text-emerald-300">
          <Sparkles className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">
            Clue Analysis
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowClueHint(true)}
          className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium text-emerald-200 transition hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
        >
          <Lightbulb className="h-3.5 w-3.5 text-amber-300" />
          <span>Clue Hint</span>
        </button>
      </header>

      {/* Main Layout Grid */}
      <main className="relative z-10 mx-auto grid max-w-6xl gap-5 px-4 py-5 pb-48 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Left Column: Clue Inventory */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
              Clue Inventory
            </h3>
            <span className="font-mono text-[10px] text-emerald-500/60">
              {availableEvidences.length} pieces
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {availableEvidences.map((ev) => {
              const alreadyCited = getCitedStepInfo(ev.id);
              return (
                <EvidenceTile
                  key={ev.id}
                  ev={ev}
                  selected={selectedIds.includes(ev.id)}
                  alreadyCited={alreadyCited}
                  onToggle={handleToggle}
                  onInspect={(id) => setInspectModalId(id)}
                />
              );
            })}
          </div>
        </section>

        {/* Right Column: Steps & Citation Board */}
        <section className="rounded-lg border border-emerald-500/15 bg-slate-950/60 p-5">
          {/* Progress Tabs */}
          <div className="mb-5 flex gap-6 border-b border-slate-800">
            {progressTabs.map((tab) => {
              const tabIdx = progressTabs.findIndex((t) => t.key === tab.key);
              const activeIdx = progressTabs.findIndex((t) => t.key === activeTab);
              const isPastOrActive = activeIdx >= tabIdx;
              const isCurrent = activeTab === tab.key;

              return (
                <div
                  key={tab.key}
                  className={`relative pb-2 text-[11px] font-medium transition ${
                    isCurrent
                      ? 'text-emerald-300'
                      : isPastOrActive
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isPastOrActive && !isCurrent ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    ) : (
                      <Lock className="h-3 w-3 text-slate-600" />
                    )}
                    {tab.label}
                  </span>
                  {isCurrent && (
                    <motion.span
                      layoutId="activeTabUnderline"
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Steps Timeline Tracker */}
          <StepsTracker
            steps={BUILD_CASE_EVENTS}
            currentIndex={stepIdx}
            phase={phase}
            citedByStep={citedByStep}
          />

          <div className="my-5 border-t border-slate-800" />

          {/* Event Content Panel */}
          {phase === 'steps' || phase === 'intro' ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/60">
                {phase === 'intro' ? 'How this works' : `Event ${stepIdx + 1} · ${currentStep.title}`}
              </p>
              {phase === 'intro' && (
                <p className="mt-2 font-serif text-xs leading-relaxed text-slate-400">
                  The analyst will narrate the events one at a time — listen to each event, then select the evidence relevant to it from the panel on the left. Confirm every event before moving to your verdict.
                </p>
              )}
              <p className="mt-2 font-serif text-xs leading-relaxed text-slate-400">
                {currentStep.event}
              </p>
              <h2 className="mt-3 font-serif text-lg text-slate-100">
                {currentStep.question}
              </h2>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Evidence cited for this event
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300">
                    {selectedIds.length}/{currentStep.relevant.length}
                  </span>
                </div>
                <div className="flex min-h-[2.5rem] flex-wrap gap-1.5 rounded-md border border-slate-800 bg-slate-950/50 p-2">
                  {selectedIds.length === 0 ? (
                    <span className="self-center px-1 text-[11px] text-slate-600">
                      Select evidence related to this event from the panel on the left...
                    </span>
                  ) : (
                    selectedIds.map((id) => (
                      <span
                        key={id}
                        className="rounded border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-[10px] text-emerald-200"
                      >
                        #{id} {EVIDENCES[id]?.title}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/60">
                Question · The Accusation
              </p>
              <h2 className="mt-1 font-serif text-xl text-slate-100">
                All cited evidence ({allCitedIds.length})
              </h2>
              <div className="mt-4 flex min-h-[2.5rem] flex-wrap gap-1.5 rounded-md border border-slate-800 bg-slate-950/50 p-2">
                {allCitedIds.map((id) => (
                  <span
                    key={id}
                    className="rounded border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-[10px] text-emerald-200"
                  >
                    #{id} {EVIDENCES[id]?.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Dim Gradient Backdrop & Interaction Shield for Upper Area */}
      <AnimatePresence>
        {isUpperDimmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              if (!isBannerTextComplete) {
                setIsBannerTextComplete(true);
              }
            }}
            className={`fixed inset-0 z-20 ${
              !isBannerTextComplete ? 'cursor-pointer' : 'cursor-default'
            }`}
            style={{
              background:
                'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.75) 40%, rgba(2, 6, 23, 0.45) 100%)',
              backdropFilter: 'blur(2px)',
            }}
          >
            {!isBannerTextComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-36 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-900/90 px-4 py-1.5 text-xs font-mono text-emerald-300 shadow-xl backdrop-blur select-none"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Click anywhere to reveal text</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clue Hint Modal */}
      <Modal
        open={showClueHint}
        onClose={() => setShowClueHint(false)}
        title="Case Analyst's Clue Hint"
        subtitle={
          phase === 'steps'
            ? `Event ${stepIdx + 1} of ${BUILD_CASE_EVENTS.length} · ${currentStep.title}`
            : 'Investigation Guidance'
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-slate-200">
          {phase === 'steps' ? (
            <>
              {/* Focus Question */}
              <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  Current Investigation Objective
                </p>
                <p className="mt-1 font-serif text-sm text-slate-100">
                  "{currentStep.question}"
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-emerald-300/90">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-semibold">
                    Target: {currentStep.relevant.length} pieces of evidence
                  </span>
                  <span>·</span>
                  <span>Currently selected: {selectedIds.length}</span>
                </div>
              </div>

              {/* Clue Guidance */}
              <div className="rounded-md border border-amber-500/25 bg-amber-500/5 p-3.5">
                <div className="flex items-center gap-2 text-amber-300">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    Analyst's Clue Hint
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-amber-100/90">
                  {currentStep.hint}
                </p>
              </div>

              {/* Where to Look */}
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3.5 text-xs">
                <div className="mb-2 flex items-center gap-2 text-slate-300">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    Department & Source Tips
                  </span>
                </div>
                {stepIdx === 0 && (
                  <p className="leading-relaxed text-slate-400">
                    Check Priya's computer in the data science department. Look for datasets with demographic distributions and early team Slack chats before the model was finalized.
                  </p>
                )}
                {stepIdx === 1 && (
                  <p className="leading-relaxed text-slate-400">
                    Examine the governance trail. Look for formal fairness audit tickets filed in the cabinet, alongside high-level emails sent from executive tablets regarding launch deadlines.
                  </p>
                )}
                {stepIdx === 2 && (
                  <p className="leading-relaxed text-slate-400">
                    Inspect the technical specifications from the server room. You need the configuration registry that exposes what input features or proxy variables the algorithm actually scored.
                  </p>
                )}
                {stepIdx === 3 && (
                  <p className="leading-relaxed text-slate-400">
                    Compare corporate communications with ground reality. Look for draft public statements prepared for press release, and listen to recorded voicemail calls from denied applicants like Maria.
                  </p>
                )}
              </div>

              {/* Tip on inspect */}
              <div className="flex items-center gap-2 rounded-md border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-[11px] text-slate-400">
                <Eye className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                <span>
                  Tip: Click the <strong className="text-slate-200">Eye (👁️)</strong> icon on any clue tile on the left to read its full document before citing it.
                </span>
              </div>
            </>
          ) : phase === 'intro' ? (
            <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs leading-relaxed text-slate-300">
              <p className="mb-2 font-serif text-sm text-emerald-200">
                Case Construction Rules
              </p>
              <p>
                The case analyst will walk you through 4 chronological events. For each event, carefully review the available clues in your inventory on the left. Pick the evidence that directly proves that specific event, then confirm to advance.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs leading-relaxed text-slate-300">
              <p className="mb-2 font-serif text-sm text-emerald-200">
                Final Verdict Analysis
              </p>
              <p>
                Review all evidence you have cited across the four events. Consider whether the breakdown was primarily technical negligence, a rogue executive decision, or a systemic organizational culture that prioritizes launch speed over fairness.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowClueHint(false)}
              className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>

      {/* Inspect Evidence Modal */}
      <Modal
        open={inspectModalId !== null}
        onClose={() => setInspectModalId(null)}
        title={inspectModalId !== null ? `Evidence #${inspectModalId}` : ''}
        subtitle={inspectModalId !== null ? EVIDENCES[inspectModalId]?.title : ''}
        maxWidth="max-w-2xl"
      >
        {inspectModalId !== null && <EvidenceViewer id={inspectModalId} />}
      </Modal>

      {/* Bottom Narrator Voice Banner */}
      <CaseAnalystBanner
        text={voiceText}
        meta={metaTag}
        isComplete={isBannerTextComplete}
        onTextComplete={() => setIsBannerTextComplete(true)}
        onSkip={() => setIsBannerTextComplete(true)}
      >
        {actionButton}
      </CaseAnalystBanner>
    </div>
  );
};
