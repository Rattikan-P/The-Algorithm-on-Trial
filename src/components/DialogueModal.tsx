import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Check } from 'lucide-react';
import { CharacterDialogue, DialogueTopic } from '../types';

interface DialogueModalProps {
  character: CharacterDialogue | null;
  onNote?: (note: string) => void;
}

export const CharacterInterview: React.FC<DialogueModalProps> = ({
  character,
  onNote,
}) => {
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());
  const [activeTopic, setActiveTopic] = useState<DialogueTopic | null>(null);

  if (!character) return null;

  const handleSelectTopic = (topic: DialogueTopic) => {
    setActiveTopic(topic);
    setAskedIds((prev) => new Set(prev).add(topic.id));
    onNote?.(`${character.name}: "${topic.q}" → logged`);
  };

  return (
    <div className="font-sans">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10">
          <User className="h-5 w-5 text-amber-300" />
        </div>
        <div>
          <p className="font-serif text-sm font-bold text-amber-200">{character.name}</p>
          <p className="text-xs text-slate-400">{character.role}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTopic && (
          <motion.div
            key={activeTopic.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 rounded-md bg-slate-800/60 p-3"
          >
            <p className="text-xs text-amber-300">You: "{activeTopic.q}"</p>
            <p className="mt-2 font-serif text-sm leading-relaxed text-slate-200">
              {activeTopic.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Choose a question</p>
      <div className="space-y-2">
        {character.topics.map((topic) => {
          const isAsked = askedIds.has(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleSelectTopic(topic)}
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition ${
                isAsked
                  ? 'border-slate-700 bg-slate-800/30 text-slate-400'
                  : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-amber-500/50 hover:text-amber-100'
              }`}
            >
              <span className="font-serif">{topic.q}</span>
              {isAsked && <Check className="h-4 w-4 text-green-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
