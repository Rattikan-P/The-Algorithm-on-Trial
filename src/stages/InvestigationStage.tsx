import React, { useState } from 'react';
import {
  Building,
  Laptop,
  Server,
  Briefcase,
  Lock,
  KeyRound,
  FileText,
  Calendar as CalendarIcon,
  Phone,
  Flower2,
  Archive,
  PhoneCall,
  Terminal,
  Award,
  Video,
  ClipboardList,
  Tablet,
  StickyNote,
  FileCode,
  Trash2,
  Disc,
  Check,
  BookOpen,
} from 'lucide-react';
import { RoomCanvas, ClueMarker, useInactivityHint } from '../components/RoomViewport';
import { Modal } from '../components/Modal';
import { JournalModal } from '../components/JournalModal';
import { CharacterInterview } from '../components/DialogueModal';
import { EvidenceViewer } from '../components/EvidenceViewers';
import { EvidenceToast } from '../components/EvidenceToast';
import {
  CHARACTERS,
  EVIDENCES,
  IMAGES,
  PHONE_INTERVIEW_QUESTIONS,
} from '../data/gameData';
import { RoomId } from '../types';
import { recordErrorAttempt } from '../utils/session';

interface InvestigationStageProps {
  unlockedEvidences: number[];
  unlockEvidence: (id: number) => void;
  hasKey: boolean;
  setHasKey: (has: boolean) => void;
  pcUnlocked: boolean;
  setPcUnlocked: (unlocked: boolean) => void;
  tabletUnlocked: boolean;
  setTabletUnlocked: (unlocked: boolean) => void;
  onReviewBoard: () => void;
  inventory: string[];
  notes: string[];
  addItem: (item: string) => void;
  addNote: (note: string) => void;
  addBonus: (bonus: string) => void;
}

// -------------------------------------------------------------------
// 1. Lobby Component
// -------------------------------------------------------------------
const LobbyRoom: React.FC<{
  addItem: (item: string) => void;
  addNote: (note: string) => void;
  addBonus: (bonus: string) => void;
  hasAccessCard: boolean;
  discoveredPoints: Set<string>;
  onInspect: (point: string) => void;
}> = ({ addItem, addNote, addBonus, hasAccessCard, discoveredPoints, onInspect }) => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const { showHint, schedule } = useInactivityHint();

  const handleInspect = (point: string) => {
    onInspect(point);
    schedule();
    setModalOpen(point);
  };

  return (
    <>
      <RoomCanvas image={IMAGES.lobby} alt="The FinTrust building lobby at midnight">
        <ClueMarker
          icon={Award}
          label="Company plaque"
          style={{ left: '18%', top: '25%' }}
          onClick={() => {
            addBonus('plaque');
            addNote('⭐ Secret Intel: Company Plaque — FinTrust incorporation statement');
            handleInspect('plaque');
          }}
          discovered={discoveredPoints.has('plaque')}
          showHint={showHint}
        />
        <ClueMarker
          icon={ClipboardList}
          label="Visitor log"
          style={{ left: '42%', top: '62%' }}
          onClick={() => handleInspect('log')}
          discovered={discoveredPoints.has('log')}
          showHint={showHint}
        />
        <ClueMarker
          icon={Video}
          label="CCTV monitor"
          style={{ left: '74%', top: '30%' }}
          onClick={() => {
            addBonus('cctv');
            addNote('⭐ Secret Intel: CCTV Footage — after-hours executive entry');
            handleInspect('cctv');
          }}
          discovered={discoveredPoints.has('cctv')}
          showHint={showHint}
        />
      </RoomCanvas>

      {/* Plaque Modal */}
      <Modal
        open={modalOpen === 'plaque'}
        onClose={() => setModalOpen(null)}
        title="Company brass plaque"
      >
        <div
          className="relative overflow-hidden rounded-md p-8 text-center shadow-xl"
          style={{
            background:
              'linear-gradient(135deg,#3a3a3e 0%,#7a7a82 25%,#5a5a60 50%,#8a8a92 75%,#4a4a50 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg,rgba(255,255,255,0.15) 0px,rgba(255,255,255,0) 1px,rgba(0,0,0,0.1) 2px)',
            }}
          />
          <div className="relative">
            <p className="font-serif text-xs uppercase tracking-[0.4em] text-slate-900/80">
              FinTrust AI
            </p>
            <h4
              className="mt-2 font-serif text-3xl font-bold tracking-wide text-slate-900"
              style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}
            >
              Incorporated
            </h4>
            <div className="mx-auto my-4 h-px w-2/3 bg-slate-900/30" />
            <p className="font-sans text-xs text-slate-800/80">FOUNDED</p>
            <p className="font-serif text-2xl font-bold text-slate-900">04 / 2019</p>
            <p className="mt-3 font-serif text-xs italic text-slate-800/70">
              "Engineering the future of fair lending."
            </p>
          </div>
        </div>
      </Modal>

      {/* Visitor Log Modal */}
      <Modal
        open={modalOpen === 'log'}
        onClose={() => setModalOpen(null)}
        title="Visitor log"
      >
        <div className="font-serif text-sm text-slate-200">
          <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
            Visitor Log — Launch Night
          </p>
          <ul className="space-y-2">
            <li className="rounded bg-slate-800/50 p-2">
              <span className="text-amber-300 font-mono">23:14</span> — Aldridge, D. (VP, Product) — signed in, never signed out
            </li>
            <li className="rounded bg-slate-800/50 p-2">
              <span className="text-amber-300 font-mono">23:40</span> — Deploy team — "production push: approved by D.A."
            </li>
            <li className="rounded bg-slate-800/50 p-2">
              <span className="text-slate-400 font-mono">08:02</span> — First loan applicant auto-denied
            </li>
          </ul>

          {hasAccessCard ? (
            <p className="mt-4 text-xs text-slate-500">Access card already retrieved from the dead-drop</p>
          ) : (
            <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-200">
                To avoid CCTV surveillance and prevent anyone from noticing her collaborating with an external auditor, Priya left a secure dead-drop: an executive access badge labeled "D. Aldridge" tucked inside the reception logbook.
              </p>
              <button
                type="button"
                onClick={() => {
                  addItem('accessCard');
                  addNote('Retrieved the VP access card via dead-drop staged by Priya to avoid CCTV detection');
                }}
                className="mt-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
              >
                Retrieve Staged Access Card
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* CCTV Modal */}
      <Modal
        open={modalOpen === 'cctv'}
        onClose={() => setModalOpen(null)}
        title="CCTV System — FinTrust Security"
      >
        <div className="space-y-3 font-mono text-xs">
          {[
            {
              cam: 'CAM-01',
              loc: 'LOBBY',
              time: '23:38:12',
              img: IMAGES.cctvLobby,
              scene: 'A man in a suit carrying a tablet steps into the elevator',
            },
            {
              cam: 'CAM-04',
              loc: 'VP FLOOR',
              time: '23:41:03',
              img: IMAGES.cctvVp,
              scene: 'Lights come on in the VP’s office',
            },
          ].map((feed) => (
            <div
              key={feed.cam}
              className="overflow-hidden rounded-md border border-slate-700 bg-black"
            >
              <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  REC
                </span>
                <span>
                  {feed.cam} · {feed.loc}
                </span>
                <span>{feed.time}</span>
              </div>
              <div className="relative h-32 overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950">
                <img
                  src={feed.img}
                  alt={feed.scene}
                  className="h-full w-full object-cover opacity-80 grayscale contrast-125"
                />
              </div>
              <div className="p-2 text-[11px] text-slate-300">{feed.scene}</div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

// -------------------------------------------------------------------
// 2. Priya's Office Component
// -------------------------------------------------------------------
const PriyaOffice: React.FC<{
  unlockedEvidences: number[];
  unlockEvidence: (id: number) => void;
  hasKey: boolean;
  setHasKey: (has: boolean) => void;
  pcUnlocked: boolean;
  setPcUnlocked: (unlocked: boolean) => void;
  addItem: (item: string) => void;
  addNote: (note: string) => void;
  addBonus: (bonus: string) => void;
  discoveredPoints: Set<string>;
  onInspect: (point: string) => void;
}> = ({
  unlockedEvidences,
  unlockEvidence,
  hasKey,
  setHasKey,
  pcUnlocked,
  setPcUnlocked,
  addItem,
  addNote,
  addBonus,
  discoveredPoints,
  onInspect,
}) => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [pcInput, setPcInput] = useState('');
  const [pcError, setPcError] = useState(false);
  const [phoneState, setPhoneState] = useState<'intro' | 'wrong' | 'unlocked'>('intro');

  const { showHint, schedule } = useInactivityHint();

  const handleInspect = (point: string) => {
    onInspect(point);
    schedule();
    setModalOpen(point);
  };

  const handlePcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pcInput.trim() === '102025') {
      setPcUnlocked(true);
      unlockEvidence(1);
      setPcError(false);
    } else {
      setPcError(true);
      recordErrorAttempt('inference', 'Priya PC: Incorrect passcode entered');
    }
  };

  const isEvidence2Unlocked = unlockedEvidences.includes(2);
  const isEvidence5Unlocked = unlockedEvidences.includes(5);

  const handlePhoneOption = (key: string) => {
    if (key === 'A') {
      unlockEvidence(5);
      setPhoneState('unlocked');
    } else {
      setPhoneState('wrong');
      recordErrorAttempt('inference', `Desk phone interview: option ${key} selected`);
    }
  };

  return (
    <>
      <RoomCanvas
        image={IMAGES.priya}
        alt="Priya's office at midnight"
        extras={
          hasKey && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded bg-amber-500/15 px-2 py-1 text-xs text-amber-300">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Brass key</span>
            </div>
          )
        }
      >
        <ClueMarker
          icon={StickyNote}
          label="Operational note"
          style={{ left: '8%', top: '40%' }}
          onClick={() => handleInspect('sticky')}
          discovered={discoveredPoints.has('sticky')}
          showHint={showHint}
        />
        <ClueMarker
          icon={CalendarIcon}
          label="Desk calendar"
          style={{ left: '20%', top: '58%' }}
          onClick={() => handleInspect('calendar')}
          discovered={discoveredPoints.has('calendar')}
          showHint={showHint}
        />
        <ClueMarker
          icon={FileText}
          label="Project brochure"
          style={{ left: '32%', top: '72%' }}
          onClick={() => handleInspect('brochure')}
          discovered={discoveredPoints.has('brochure')}
          showHint={showHint}
        />
        <ClueMarker
          icon={Laptop}
          label="Priya's workstation"
          style={{ left: '44%', top: '45%' }}
          onClick={() => handleInspect('pc')}
          discovered={discoveredPoints.has('pc') || pcUnlocked || isEvidence2Unlocked || unlockedEvidences.includes(1)}
          showHint={showHint}
        />
        <ClueMarker
          icon={Phone}
          label="Secure landline"
          style={{ left: '58%', top: '68%' }}
          onClick={() => handleInspect('phone')}
          discovered={discoveredPoints.has('phone') || isEvidence5Unlocked}
          showHint={showHint}
        />
        <ClueMarker
          icon={Flower2}
          label="Dead-drop vase"
          style={{ left: '70%', top: '55%' }}
          onClick={() => handleInspect('vase')}
          discovered={discoveredPoints.has('vase') || hasKey}
          showHint={showHint}
        />
        <ClueMarker
          icon={Archive}
          label="Confidential cabinet"
          style={{ left: '84%', top: '50%' }}
          onClick={() => {
            if (hasKey) {
              unlockEvidence(4);
              addNote('Discovered Suppressed Ticket #FA-2025-014 inside the confidential cabinet');
            }
            handleInspect('cabinet');
          }}
          discovered={discoveredPoints.has('cabinet') || unlockedEvidences.includes(4)}
          showHint={showHint}
        />
      </RoomCanvas>

      {/* Sticky Note */}
      <Modal
        open={modalOpen === 'sticky'}
        onClose={() => setModalOpen(null)}
        title="Operational Security Note"
      >
        <div className="rounded-md bg-yellow-200/90 p-4 font-serif text-sm text-slate-800 shadow-lg">
          <p className="font-semibold text-xs tracking-wider uppercase text-amber-900 mb-2">
            Session Lock Reminder
          </p>
          <p>
            "To prevent building security or corporate IT from tampering with my terminal while I'm away, I encrypted my local session. Passcode = Marcus's birth month (MM) + the year our automated underwriting project was initiated (YYYY). Check my desk calendar and the kick-off brochure."
          </p>
          <p className="mt-3 text-right text-xs italic font-semibold">— Priya</p>
        </div>
      </Modal>

      {/* Calendar */}
      <Modal
        open={modalOpen === 'calendar'}
        onClose={() => setModalOpen(null)}
        title="Desk calendar"
      >
        <div className="mx-auto max-w-xs overflow-hidden rounded-md bg-white shadow-xl">
          <div className="flex items-center justify-between bg-red-700 px-4 py-2 text-white">
            <span className="text-sm">‹</span>
            <span className="font-serif text-lg font-bold">OCTOBER 2025</span>
            <span className="text-sm">›</span>
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 p-px text-center text-[10px] font-semibold text-slate-500">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className="bg-white py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 p-px text-center text-xs text-slate-700">
            {Array.from({ length: 31 }, (_, idx) => (
              <div
                key={idx}
                className={`relative bg-white py-1.5 ${idx === 13 ? 'bg-red-50 font-bold' : ''}`}
              >
                {idx + 1}
                {idx === 13 && (
                  <span className="absolute inset-0 m-auto h-7 w-7 rounded-full border-2 border-red-500" />
                )}
                {idx === 13 && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700 font-semibold">
            🔴 Happy Birthday Marcus! (Age 38)
          </div>
        </div>
      </Modal>

      {/* Brochure */}
      <Modal
        open={modalOpen === 'brochure'}
        onClose={() => setModalOpen(null)}
        title="Project brochure"
      >
        <div
          className="overflow-hidden rounded-md shadow-xl text-slate-200"
          style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)' }}
        >
          <div className="h-2" style={{ background: 'linear-gradient(90deg,#f99d33,#ef4444)' }} />
          <div className="p-6 text-center font-serif">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400">FinTrust AI</p>
            <h4 className="mt-3 text-xl font-bold text-amber-100">
              Project Kick-off · Automated Underwriting Engine
            </h4>
            <div className="mx-auto my-4 h-px w-2/3 bg-white/20" />
            <p className="font-mono text-2xl font-bold text-amber-300">Q1 / 2025</p>
            <p className="mt-2 text-xs text-slate-300">
              "Transforming credit access through machine learning."
            </p>
          </div>
        </div>
      </Modal>

      {/* Flower Vase */}
      <Modal
        open={modalOpen === 'vase'}
        onClose={() => setModalOpen(null)}
        title="Ceramic vase — Dead-drop location"
      >
        <div className="font-serif text-sm text-slate-200">
          <p className="mb-3">
            A ceramic vase sits beside the window. As Priya indicated in her dispatch, beneath the stems:
          </p>
          {hasKey ? (
            <p className="text-xs text-slate-500">Brass key already retrieved from the dead-drop</p>
          ) : (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-200">
                You find a solid brass mechanical key wrapped in an anti-static cloth. Priya hid it here so the physical lock on her suppression cabinet could be opened without registering an electronic badge swipe.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasKey(true);
                  addItem('brassKey');
                  addNote("Retrieved Priya's physical dead-drop key from the ceramic vase");
                }}
                className="mt-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
              >
                Retrieve Staged Brass Key
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* File Cabinet */}
      <Modal
        open={modalOpen === 'cabinet'}
        onClose={() => setModalOpen(null)}
        title="Confidential audit cabinet (Mechanical lock)"
      >
        {hasKey ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-md border border-green-700/40 bg-green-900/20 px-3 py-2 text-sm text-green-300">
              <Check className="h-4 w-4" /> Cabinet unlocked with Priya's dead-drop brass key
            </div>
            <div className="rounded-md border border-slate-700 bg-slate-800/40 p-4">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300">
                Suppressed Internal Audit Ticket:
              </p>
              <EvidenceViewer id={4} />
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-red-500/30 bg-red-950/20 p-4 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-red-400" />
            <p className="font-serif text-sm text-slate-200">The confidential cabinet is locked mechanically</p>
            <p className="mt-1 text-xs text-slate-400">
              Priya secured it with a physical cylinder lock to avoid digital log trails. Check her dead-drop location (the flower vase).
            </p>
          </div>
        )}
      </Modal>

      {/* Desk Phone */}
      <Modal
        open={modalOpen === 'phone'}
        onClose={() => setModalOpen(null)}
        title="Desk phone"
      >
        <div className="font-sans">
          <div className="mb-4 flex items-center gap-2 text-amber-300">
            <PhoneCall className="h-5 w-5 animate-pulse" />
            <span className="text-sm">Incoming call connected — Maria R.</span>
          </div>

          {phoneState === 'intro' && (
            <div className="space-y-3">
              <p className="rounded-md bg-slate-800/60 p-3 text-sm text-slate-200">
                "Hello? Thank you for taking my case. What would you like to know?"
              </p>
              <div className="space-y-2">
                {PHONE_INTERVIEW_QUESTIONS.map((q) => (
                  <button
                    key={q.key}
                    type="button"
                    onClick={() => handlePhoneOption(q.key)}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/40 px-4 py-2.5 text-left text-sm text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-100"
                  >
                    <span className="font-semibold text-amber-400">[{q.key}]</span> {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phoneState === 'wrong' && (
            <div className="space-y-4">
              <p className="rounded-md bg-slate-800/60 p-3 text-sm leading-relaxed text-slate-200">
                "Other banks approved me with no issues! I don't know if the AI targeted me on purpose, but it rejected me in 2 seconds despite my bakery making stable profits for 10 years and my perfect credit score. But you know what's really strange? It wasn't just me..."
              </p>
              <button
                type="button"
                onClick={() => {
                  unlockEvidence(5);
                  setPhoneState('unlocked');
                }}
                className="w-full rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-left text-sm text-amber-100 transition hover:bg-amber-500/20"
              >
                <span className="font-semibold text-amber-400">[Follow-up]</span> What do you mean, it wasn't just you?
              </button>
            </div>
          )}

          {phoneState === 'unlocked' && (
            <div className="space-y-4">
              <p className="rounded-md bg-slate-800/60 p-3 text-sm leading-relaxed text-slate-200">
                "I talked to my neighborhood business association. Every single local owner on my block — all with clean financial histories — got rejected instantly. It feels like our entire zip code was blacklisted!"
              </p>
              {isEvidence5Unlocked && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-amber-300">
                    Evidence 5 unlocked
                  </p>
                  <EvidenceViewer id={5} />
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Priya's Computer Terminal */}
      <Modal
        open={modalOpen === 'pc'}
        onClose={() => setModalOpen(null)}
        title="Priya's computer"
        maxWidth="max-w-2xl"
      >
        {pcUnlocked ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-md bg-green-900/30 border border-green-700/40 px-3 py-2 text-sm text-green-300">
              <Check className="h-4 w-4" />
              <span>Access granted — logged in as priya.m</span>
            </div>

            <div>
              <p className="mb-2 font-sans text-xs uppercase tracking-wider text-amber-300">
                #fintrust-data
              </p>
              <EvidenceViewer id={1} />
            </div>

            <div className="border-t border-slate-700 pt-5">
              <p className="mb-3 font-sans text-xs uppercase tracking-wider text-amber-300">
                datasets / training_summary.png
              </p>
              <EvidenceViewer
                id={2}
                interactive={true}
                cUnlocked={isEvidence2Unlocked}
                onUnlockC={() => unlockEvidence(2)}
              />
            </div>

            <div className="border-t border-slate-700 pt-5">
              <p className="mb-3 font-sans text-xs uppercase tracking-wider text-amber-300">
                More files and contacts
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen('marcus_dm')}
                  className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/40 px-3 py-2 text-left text-sm text-slate-300 transition hover:border-amber-500/50 hover:text-amber-200"
                >
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>Open DM with Marcus V.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen('marcus_memo')}
                  className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/40 px-3 py-2 text-left text-sm text-slate-300 transition hover:border-amber-500/50 hover:text-amber-200"
                >
                  <FileCode className="h-4 w-4 text-amber-400" />
                  <span>marcus_memo.txt</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="font-mono">
            <div className="mb-4 flex items-center gap-2 text-amber-300">
              <Terminal className="h-5 w-5" />
              <span className="text-sm">FinTrust Secure Terminal — login required</span>
            </div>
            <div className="rounded-md border border-slate-700 bg-black/60 p-4">
              <p className="text-xs text-slate-500">$ authenticating user priya.m</p>
              <p className="mt-1 text-xs text-slate-500">$ enter passcode to decrypt session:</p>
              <form onSubmit={handlePcSubmit} className="mt-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-500/70" />
                  <input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    value={pcInput}
                    onChange={(e) => {
                      setPcInput(e.target.value);
                      setPcError(false);
                    }}
                    placeholder="enter passcode..."
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-amber-200 outline-none focus:border-amber-500/60"
                  />
                </div>
                {pcError && (
                  <p className="mt-3 text-xs font-bold text-red-400">
                    [ACCESS DENIED: INCORRECT PASSCODE]
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-4 w-full rounded bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/30"
                >
                  Authenticate
                </button>
              </form>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Hint: passcode = Marcus's birth month (MM) + the year the project started (YYYY).
            </p>
          </div>
        )}
      </Modal>

      {/* Marcus DM Modal */}
      <Modal
        open={modalOpen === 'marcus_dm'}
        onClose={() => setModalOpen('pc')}
        title="Direct Message — Marcus V."
      >
        <CharacterInterview character={CHARACTERS.marcus} onNote={addNote} />
      </Modal>

      {/* Marcus Encrypted Memo Modal */}
      <Modal
        open={modalOpen === 'marcus_memo'}
        onClose={() => setModalOpen('pc')}
        title="marcus_memo.txt"
        subtitle="Confidential confession log"
      >
        <div className="font-mono text-xs">
          <p className="mb-2 text-slate-500">$ cat marcus_memo.txt</p>
          <div className="rounded border border-slate-700 bg-black/60 p-4 text-slate-200 leading-relaxed font-sans">
            <p className="text-amber-400 font-mono text-xs mb-2 uppercase tracking-wide">
              Subject: Pre-deployment Bias Discrepancy (Whistleblower Memo)
            </p>
            <p className="text-slate-300 text-sm">
              "I tried to stop the launch. The dataset is biased against Group C. The disparity was known and documented during Q3 validation sprints before deployment. Aldridge forced the flag override anyway. We are all complicit."
            </p>
            <p className="mt-3 text-right text-xs text-slate-500 font-mono">— Marcus Vance (Lead ML Engineer)</p>
          </div>
          <div className="mt-3 rounded border border-green-700/40 bg-green-950/20 p-2.5 text-xs text-green-300">
            <Check className="inline-block mr-1 h-3.5 w-3.5" />
            Engineer statement confirmed. Cross-references Suppression Ticket #FA-2025-014.
          </div>
        </div>
      </Modal>
    </>
  );
};

// -------------------------------------------------------------------
// 3. Server Room Component
// -------------------------------------------------------------------
const ServerRoom: React.FC<{
  addNote: (note: string) => void;
  addBonus: (bonus: string) => void;
  unlockEvidence: (id: number) => void;
  discoveredPoints: Set<string>;
  onInspect: (point: string) => void;
}> = ({ addNote, addBonus, unlockEvidence, discoveredPoints, onInspect }) => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const { showHint, schedule } = useInactivityHint();

  const handleInspect = (point: string) => {
    onInspect(point);
    schedule();
    setModalOpen(point);
  };

  return (
    <>
      <RoomCanvas image={IMAGES.server} alt="The FinTrust server room at midnight">
        <ClueMarker
          icon={Terminal}
          label="Terminal console"
          style={{ left: '38%', top: '48%' }}
          onClick={() => {
            addBonus('deployLog');
            addNote('⭐ Secret Intel: Terminal Console — verified forced model push history');
            handleInspect('terminal');
          }}
          discovered={discoveredPoints.has('terminal')}
          showHint={showHint}
        />
        <ClueMarker
          icon={FileText}
          label="model registry"
          style={{ left: '68%', top: '55%' }}
          onClick={() => {
            unlockEvidence(7);
            addNote(
              'Found the Model Feature Registry in the server room — it contains proxy variables'
            );
            handleInspect('registry');
          }}
          discovered={discoveredPoints.has('registry')}
          showHint={showHint}
        />
      </RoomCanvas>

      {/* Terminal Console */}
      <Modal
        open={modalOpen === 'terminal'}
        onClose={() => setModalOpen(null)}
        title="Terminal console"
        subtitle="deploy@fintrust-prod"
      >
        <div className="rounded-md border border-slate-700 bg-black/70 p-4 font-mono text-xs leading-relaxed">
          <p className="text-slate-500">$ show deploy-log --date 2025-Q3-launch</p>
          <p className="text-green-400">[23:40] init deploy --target=prod</p>
          <p className="text-slate-300">[23:40] running pre-flight checks...</p>
          <p className="text-red-400">
            [23:41] bias_check: <span className="font-bold">SKIPPED</span> (flag --force by d.aldridge)
          </p>
          <p className="text-red-400">
            [23:41] fairness_audit: <span className="font-bold">BYPASSED</span>
          </p>
          <p className="text-green-400">[23:42] deploy: SUCCESS — model live</p>
          <p className="mt-3 text-amber-300">
            → The system went live, skipping every fairness check.
          </p>
        </div>
      </Modal>

      {/* Model Registry */}
      <Modal
        open={modalOpen === 'registry'}
        onClose={() => setModalOpen(null)}
        title="Model Feature Registry"
        subtitle="Exposing the proxy variables"
      >
        <EvidenceViewer id={7} />
      </Modal>
    </>
  );
};

// -------------------------------------------------------------------
// 4. VP Office Component
// -------------------------------------------------------------------
const VpOffice: React.FC<{
  tabletUnlocked: boolean;
  setTabletUnlocked: (unlocked: boolean) => void;
  unlockEvidence: (id: number) => void;
  unlockedEvidences: number[];
  addNote: (note: string) => void;
  addBonus: (bonus: string) => void;
  discoveredPoints: Set<string>;
  onInspect: (point: string) => void;
}> = ({
  tabletUnlocked,
  setTabletUnlocked,
  unlockEvidence,
  unlockedEvidences,
  addNote,
  addBonus,
  discoveredPoints,
  onInspect,
}) => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const { showHint, schedule } = useInactivityHint();

  const handleInspect = (point: string) => {
    onInspect(point);
    schedule();
    setModalOpen(point);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '0419') {
      setTabletUnlocked(true);
      setPinError(false);
      unlockEvidence(3);
      unlockEvidence(6);
      addNote('Unlocked VP Tablet: found directive email (Evidence #3) and draft PR coverup (Evidence #6)');
    } else {
      setPinError(true);
      recordErrorAttempt('inference', 'VP Tablet: Incorrect PIN entered');
    }
  };

  return (
    <>
      <RoomCanvas image={IMAGES.vp} alt="The VP's office at midnight">
        <ClueMarker
          icon={Tablet}
          label="VP's tablet"
          style={{ left: '50%', top: '55%' }}
          onClick={() => handleInspect('tablet')}
          discovered={discoveredPoints.has('tablet') || tabletUnlocked || unlockedEvidences.includes(3)}
          showHint={showHint}
        />
        <ClueMarker
          icon={StickyNote}
          label="Note stuck to the tablet"
          style={{ left: '38%', top: '45%' }}
          onClick={() => handleInspect('note')}
          discovered={discoveredPoints.has('note')}
          showHint={showHint}
        />
        <ClueMarker
          icon={Trash2}
          label="Paper shredder"
          style={{ left: '80%', top: '65%' }}
          onClick={() => {
            addBonus('shredder');
            addNote('⭐ Secret Intel: Paper Shredder — retrieved Marcus & Priya audit warning memo');
            handleInspect('shred');
          }}
          discovered={discoveredPoints.has('shred')}
          showHint={showHint}
        />
        <ClueMarker
          icon={PhoneCall}
          label="VP intercom"
          style={{ left: '64%', top: '40%' }}
          onClick={() => handleInspect('intercom')}
          discovered={discoveredPoints.has('intercom')}
          showHint={showHint}
        />
      </RoomCanvas>

      {/* VP Tablet */}
      <Modal
        open={modalOpen === 'tablet'}
        onClose={() => setModalOpen(null)}
        title="VP's tablet"
        subtitle="D. Aldridge's device"
        maxWidth="max-w-2xl"
      >
        {tabletUnlocked ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 rounded-md border border-green-700/40 bg-green-900/20 px-3 py-2 text-sm text-green-300">
              <Check className="h-4 w-4" />
              <span>Tablet unlocked — D. Aldridge's account</span>
            </div>

            {[3, 6].map((evId) => (
              <div
                key={evId}
                className="rounded-md border border-slate-700 bg-slate-800/40 p-4"
              >
                <EvidenceViewer id={evId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="font-mono">
            <div className="mb-4 flex items-center gap-2 text-amber-300">
              <Tablet className="h-5 w-5" />
              <span className="text-sm">VP's Tablet — PIN required</span>
            </div>
            <div className="rounded-md border border-slate-700 bg-black/60 p-4">
              <p className="text-xs text-slate-500">$ device locked — enter 4-digit PIN</p>
              <form onSubmit={handlePinSubmit} className="mt-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-500/70" />
                  <input
                    autoFocus
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="• • • •"
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-center text-lg tracking-[0.5em] text-amber-200 outline-none focus:border-amber-500/60"
                  />
                </div>
                {pinError && (
                  <p className="mt-3 text-xs font-bold text-red-400">
                    [ACCESS DENIED: INCORRECT PIN]
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-4 w-full rounded bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/30"
                >
                  Unlock
                </button>
              </form>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Note on the casing: "Device default PIN = company founding date (MMYY) from the lobby incorporation plaque"
            </p>
          </div>
        )}
      </Modal>

      {/* Note on Tablet */}
      <Modal
        open={modalOpen === 'note'}
        onClose={() => setModalOpen(null)}
        title="Executive device override note"
      >
        <div className="rounded-md bg-yellow-200/90 p-4 font-serif text-sm text-slate-800 shadow-lg">
          <p className="font-semibold text-xs tracking-wider uppercase text-amber-900 mb-1">
            Executive Admin Override (Executive Assistant memo)
          </p>
          <p>
            "Mr. Aldridge — your slate was re-imaged after the Series B audit. Temporary reset PIN is set to company incorporation date (MMYY) per internal IT default. Check the lobby bronze plaque if you forgot the month."
          </p>
          <p className="mt-2 text-[11px] text-slate-600 italic">
            (A real-world executive convenience habit: using publicly visible corporate dates as device PINs)
          </p>
        </div>
      </Modal>

      {/* Shredder */}
      <Modal
        open={modalOpen === 'shred'}
        onClose={() => setModalOpen(null)}
        title="Paper shredder"
      >
        <div className="font-serif text-sm text-slate-200">
          <p className="mb-3">
            The bin holds shredded paper. You piece together enough to read:
          </p>
          <div className="rounded-md border-l-2 border-red-500 bg-slate-800/50 p-3 text-xs">
            <p className="text-red-300">
              "...should postpone the launch ... fairness concerns ... must be audited first..."
            </p>
            <p className="mt-2 text-slate-400">This memo was shredded before the launch.</p>
          </div>
        </div>
      </Modal>

      {/* Intercom Call */}
      <Modal
        open={modalOpen === 'intercom'}
        onClose={() => setModalOpen(null)}
        title="Intercom — contacting the VP"
        subtitle="Video call"
      >
        <CharacterInterview character={CHARACTERS.vp} onNote={addNote} />
      </Modal>
    </>
  );
};

// -------------------------------------------------------------------
// 5. Main Investigation Stage Controller
// -------------------------------------------------------------------
const ROOM_TABS: { id: RoomId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'lobby', label: 'Building Lobby', icon: Building },
  { id: 'priya', label: "Priya's Office", icon: Laptop },
  { id: 'server', label: 'Server Room', icon: Server },
  { id: 'vp', label: "VP's Office", icon: Briefcase },
];

export const InvestigationStage: React.FC<InvestigationStageProps> = ({
  unlockedEvidences,
  unlockEvidence,
  hasKey,
  setHasKey,
  pcUnlocked,
  setPcUnlocked,
  tabletUnlocked,
  setTabletUnlocked,
  onReviewBoard,
  inventory,
  notes,
  addItem,
  addNote,
  addBonus,
}) => {
  const [currentRoom, setCurrentRoom] = useState<RoomId>('lobby');
  const [journalOpen, setJournalOpen] = useState(false);
  const [latestToastId, setLatestToastId] = useState<number | null>(null);
  const [discoveredPoints, setDiscoveredPoints] = useState<Set<string>>(new Set());

  const handleInspectPoint = (pointId: string) => {
    setDiscoveredPoints((prev) => new Set(prev).add(pointId));
  };

  const handleUnlockAndToast = (id: number) => {
    if (!unlockedEvidences.includes(id)) {
      // Delay showing toast by 700ms so player notices the evidence content first
      setTimeout(() => {
        setLatestToastId(id);
      }, 700);
    }
    unlockEvidence(id);
  };

  // Auto-dismiss notification after 3.5 seconds
  React.useEffect(() => {
    if (!latestToastId) return;
    const timer = setTimeout(() => {
      setLatestToastId(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [latestToastId]);

  const evidenceCount = unlockedEvidences.length;
  const allEvidenceFound = evidenceCount >= 7;
  const hasAccessCard = inventory.includes('accessCard');
  const isVpLocked = currentRoom === 'vp' && !hasAccessCard;

  const handleSwitchRoom = (roomId: RoomId) => {
    setCurrentRoom(roomId);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6">
      {/* Top Header */}
      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-amber-100 uppercase tracking-wider">FinTrust HQ: Infiltration</h2>
          <p className="text-xs text-slate-400 font-serif">
            Switch rooms to hunt for evidence — look for glimmers of hidden truth.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-sans text-xs uppercase tracking-wider text-slate-400">
              Evidence collected
            </p>
            <p
              className={`font-mono text-lg font-bold ${
                allEvidenceFound ? 'text-amber-300' : 'text-slate-300'
              }`}
            >
              {evidenceCount} / 7
            </p>
          </div>
          <button
            type="button"
            disabled={!allEvidenceFound}
            onClick={onReviewBoard}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              allEvidenceFound
                ? 'border-amber-500/60 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'cursor-not-allowed border-slate-700 bg-slate-800/40 text-slate-600'
            }`}
          >
            Analyze the case
          </button>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="mx-auto mb-5 flex max-w-5xl flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-2">
        <span className="px-2 text-xs uppercase tracking-wider text-slate-500">Location</span>
        {ROOM_TABS.map((room) => {
          const Icon = room.icon;
          const isActive = currentRoom === room.id;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => handleSwitchRoom(room.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-amber-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{room.label}</span>
            </button>
          );
        })}
      </div>

      {/* Room Viewport or Locked View */}
      {isVpLocked ? (
        <div className="relative mx-auto flex h-[540px] max-w-5xl flex-col items-center justify-center rounded-xl border border-red-900/40 bg-slate-900/60 text-center">
          <Lock className="mb-4 h-12 w-12 text-red-400" />
          <p className="font-serif text-lg text-slate-200">The VP's office is locked</p>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            You need the VP's conference access card. Try searching another room (like the lobby).
          </p>
          <button
            type="button"
            onClick={() => setCurrentRoom('lobby')}
            className="mt-5 rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
          >
            Back to the lobby
          </button>
        </div>
      ) : (
        <>
          {currentRoom === 'lobby' && (
            <LobbyRoom
              addItem={addItem}
              addNote={addNote}
              addBonus={addBonus}
              hasAccessCard={hasAccessCard}
              discoveredPoints={discoveredPoints}
              onInspect={handleInspectPoint}
            />
          )}
          {currentRoom === 'priya' && (
            <PriyaOffice
              unlockedEvidences={unlockedEvidences}
              unlockEvidence={handleUnlockAndToast}
              hasKey={hasKey}
              setHasKey={setHasKey}
              pcUnlocked={pcUnlocked}
              setPcUnlocked={setPcUnlocked}
              addItem={addItem}
              addNote={addNote}
              addBonus={addBonus}
              discoveredPoints={discoveredPoints}
              onInspect={handleInspectPoint}
            />
          )}
          {currentRoom === 'server' && (
            <ServerRoom
              addNote={addNote}
              addBonus={addBonus}
              unlockEvidence={handleUnlockAndToast}
              discoveredPoints={discoveredPoints}
              onInspect={handleInspectPoint}
            />
          )}
          {currentRoom === 'vp' && (
            <VpOffice
              tabletUnlocked={tabletUnlocked}
              setTabletUnlocked={setTabletUnlocked}
              unlockEvidence={handleUnlockAndToast}
              unlockedEvidences={unlockedEvidences}
              addNote={addNote}
              addBonus={addBonus}
              discoveredPoints={discoveredPoints}
              onInspect={handleInspectPoint}
            />
          )}
        </>
      )}

      {/* Floating Evidence Discovery Toast Notification */}
      <EvidenceToast
        evidenceId={latestToastId}
        onClose={() => setLatestToastId(null)}
        totalCount={evidenceCount}
      />

      {/* Floating Case Journal Button */}
      <button
        type="button"
        onClick={() => setJournalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-amber-500/50 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)] transition hover:bg-amber-500/20"
      >
        <BookOpen className="h-5 w-5" />
        <span className="hidden sm:inline">Journal</span>
        {inventory.length > 0 && (
          <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs text-slate-900 font-bold">
            {inventory.length}
          </span>
        )}
      </button>

      {/* Case Journal Modal */}
      <JournalModal
        open={journalOpen}
        onClose={() => setJournalOpen(false)}
        inventory={inventory}
        notes={notes}
      />
    </div>
  );
};
