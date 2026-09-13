import React from 'react';
import { Modal } from './Modal';
import { INVENTORY_ITEMS } from '../data/gameData';
import {
  KeyRound,
  CreditCard,
  CircleDashed,
  FileLock,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface JournalModalProps {
  open: boolean;
  onClose: () => void;
  inventory: string[];
  notes: string[];
}

export const JournalModal: React.FC<JournalModalProps> = ({
  open,
  onClose,
  inventory,
  notes,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound':
        return <KeyRound className="h-4 w-4 text-amber-300" />;
      case 'CreditCard':
        return <CreditCard className="h-4 w-4 text-amber-300" />;
      case 'CircleDashed':
        return <CircleDashed className="h-4 w-4 text-amber-300" />;
      case 'FileLock':
        return <FileLock className="h-4 w-4 text-amber-300" />;
      default:
        return <BookOpen className="h-4 w-4 text-amber-300" />;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detective Field Journal"
      subtitle="Collected items & field investigation log"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Inventory Section */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-amber-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Collected Items</span>
            </h4>
            <span className="font-mono text-xs text-slate-400">{inventory.length} item(s)</span>
          </div>

          {inventory.length === 0 ? (
            <p className="rounded-md border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-500">
              No physical items collected yet. Search rooms for access cards, keys, and tools.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {inventory.map((itemId) => {
                const item = INVENTORY_ITEMS[itemId];
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className="flex items-start gap-3 rounded-md border border-amber-500/20 bg-slate-800/40 p-2.5"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border border-amber-500/30 bg-slate-900 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        getIcon(item.icon)
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-200">{item.name}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Investigation Notes */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Field Notes & Logs</span>
            </h4>
            <span className="font-mono text-xs text-slate-400">{notes.length} note(s)</span>
          </div>

          {notes.length === 0 ? (
            <p className="rounded-md border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-500">
              No notes logged yet. Interactions, decryptions, and dialogues will appear here.
            </p>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  className="rounded-md border-l-2 border-amber-500/60 bg-slate-800/30 p-2.5 text-xs text-slate-300"
                >
                  {note}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
