import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NoticeStage } from './stages/NoticeStage';
import { AuditStage } from './stages/AuditStage';
import { InvestigationStage } from './stages/InvestigationStage';
import { BuildCaseStage } from './stages/BuildCaseStage';
import { DebriefStage } from './stages/DebriefStage';
import { ReportStage } from './stages/ReportStage';
import {
  initSession,
  recordStage,
  trackEvent,
  saveSessionSummary,
  calculateVerdictCoherence,
} from './utils/session';
import { CoherenceResult, FrameKey, GameStage } from './types';

export default function App() {
  const [stage, setStage] = useState<GameStage>('notice');
  const [unlockedEvidences, setUnlockedEvidences] = useState<number[]>([]);
  const [unlockedOrder, setUnlockedOrder] = useState<number[]>([]);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [pcUnlocked, setPcUnlocked] = useState<boolean>(false);
  const [tabletUnlocked, setTabletUnlocked] = useState<boolean>(false);
  const [verdictFrame, setVerdictFrame] = useState<FrameKey | null>(null);
  const [caseEvidence, setCaseEvidence] = useState<number[]>([]);
  const [result, setResult] = useState<CoherenceResult | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [bonusClues, setBonusClues] = useState<string[]>([]);

  // Initialize session on mount
  useEffect(() => {
    initSession();
    recordStage('notice');
  }, []);

  const navigateTo = (nextStage: GameStage, meta?: Record<string, unknown>) => {
    recordStage(nextStage, meta || {});
    trackEvent('navigate', { to: nextStage });
    setStage(nextStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockEvidence = (id: number) => {
    setUnlockedEvidences((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setUnlockedOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
    trackEvent('evidence_unlocked', { id });
  };

  const handleAddItem = (itemId: string) => {
    setInventory((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
    trackEvent('item_collected', { id: itemId });
  };

  const handleAddNote = (text: string) => {
    setNotes((prev) => [...prev, text]);
    trackEvent('note_added', { text });
  };

  const handleAddBonus = (bonusId: string) => {
    setBonusClues((prev) => (prev.includes(bonusId) ? prev : [...prev, bonusId]));
    trackEvent('bonus_found', { id: bonusId });
  };

  const handleBuildCaseComplete = (
    frame: FrameKey,
    evIds: number[],
    coherence: CoherenceResult
  ) => {
    const evaluated = coherence || calculateVerdictCoherence(frame, evIds);
    setVerdictFrame(frame);
    setCaseEvidence(evIds);
    setResult(evaluated);
    trackEvent('case_built', {
      frame,
      evIds,
      tier: evaluated.tier,
      pct: evaluated.pct,
    });
    navigateTo('debrief', { frame, evIds, tier: evaluated.tier });
  };

  const handleResetGame = () => {
    saveSessionSummary({
      verdictFrame,
      caseEvidence,
      evidenceCount: unlockedEvidences.length,
      bonusCount: bonusClues.length,
    });
    setStage('notice');
    setUnlockedEvidences([]);
    setUnlockedOrder([]);
    setHasKey(false);
    setPcUnlocked(false);
    setTabletUnlocked(false);
    setVerdictFrame(null);
    setCaseEvidence([]);
    setResult(null);
    setInventory([]);
    setNotes([]);
    setBonusClues([]);
    sessionStorage.clear();
    initSession();
    recordStage('notice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="min-h-screen"
        >
          {stage === 'notice' && (
            <NoticeStage onBegin={() => navigateTo('audit')} />
          )}

          {stage === 'audit' && (
            <AuditStage
              onContinue={() => navigateTo('investigation', { auditPassed: true })}
            />
          )}

          {stage === 'investigation' && (
            <InvestigationStage
              unlockedEvidences={unlockedEvidences}
              unlockEvidence={handleUnlockEvidence}
              hasKey={hasKey}
              setHasKey={setHasKey}
              pcUnlocked={pcUnlocked}
              setPcUnlocked={setPcUnlocked}
              tabletUnlocked={tabletUnlocked}
              setTabletUnlocked={setTabletUnlocked}
              onReviewBoard={() =>
                navigateTo('buildcase', { evidenceCount: unlockedEvidences.length })
              }
              inventory={inventory}
              notes={notes}
              bonusClues={bonusClues}
              addItem={handleAddItem}
              addNote={handleAddNote}
              addBonus={handleAddBonus}
            />
          )}

          {stage === 'buildcase' && (
            <BuildCaseStage
              unlockedEvidences={unlockedEvidences}
              onComplete={handleBuildCaseComplete}
            />
          )}

          {stage === 'debrief' && (
            <DebriefStage
              verdictFrame={verdictFrame}
              caseEvidence={caseEvidence}
              result={result}
              onContinue={() => navigateTo('report')}
            />
          )}

          {stage === 'report' && (
            <ReportStage
              unlockedEvidences={unlockedEvidences}
              unlockedOrder={unlockedOrder}
              verdictFrame={verdictFrame}
              caseEvidence={caseEvidence}
              bonusClues={bonusClues}
              result={result}
              onReset={handleResetGame}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
