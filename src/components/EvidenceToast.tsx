import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EVIDENCES } from '../data/gameData';

interface EvidenceToastProps {
  evidenceId: number | null;
  onClose?: () => void;
  totalCount?: number;
}

export const EvidenceToast: React.FC<EvidenceToastProps> = ({
  evidenceId,
}) => {
  if (!evidenceId || !EVIDENCES[evidenceId]) return null;

  const ev = EVIDENCES[evidenceId];

  return (
    <AnimatePresence>
      <motion.div
        key={evidenceId}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pointer-events-none fixed top-5 right-5 z-50 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-lg shadow-black/10"
      >
        <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-wider text-slate-500 uppercase">
          <span>Evidence Discovered</span>
          <span className="text-slate-300">·</span>
          <span>#{evidenceId} of 7</span>
        </div>

        <p className="mt-1 font-serif text-sm font-semibold text-slate-900">
          {ev.title}
        </p>

        <p className="mt-0.5 font-mono text-xs text-slate-500">
          {ev.source}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
