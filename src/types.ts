export type GameStage =
  | 'notice'
  | 'audit'
  | 'investigation'
  | 'buildcase'
  | 'debrief'
  | 'report';

export type RoomId = 'lobby' | 'priya' | 'server' | 'vp';

export type EvidenceKind =
  | 'slack'
  | 'chart'
  | 'email'
  | 'ticket'
  | 'transcript'
  | 'statement'
  | 'registry';

export type FrameKey = 'a' | 'b' | 'c' | 'd';

export interface EvidenceItem {
  id: number;
  title: string;
  source: string;
  kind: EvidenceKind;
  pointsTo: FrameKey[];
  image?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: 'KeyRound' | 'CreditCard' | 'CircleDashed' | 'FileLock';
  desc: string;
  image: string;
}

export interface DialogueTopic {
  id: string;
  q: string;
  a: string;
}

export interface CharacterDialogue {
  name: string;
  role: string;
  topics: DialogueTopic[];
}

export interface AuditFactor {
  key: string;
  label: string;
  maria: string | number;
  comparable: string | number;
}

export interface OfficialReason {
  id: string;
  label: string;
  factorKey: string;
  note: string;
}

export interface CaseStep {
  key: string;
  title: string;
  event: string;
  question: string;
  relevant: number[];
  voice: string;
  confirmed: string;
  hint: string;
}

export interface VerdictOption {
  key: FrameKey;
  label: string;
  text: string;
}

export interface CoherenceResult {
  matched: number;
  total: number;
  dominantFrame: FrameKey | null;
  tally: Record<FrameKey, number>;
  pct: number;
  tier: 'complete' | 'narrow' | 'wrong';
}

export interface SessionStageRecord {
  enteredAt: number;
  exitedAt?: number;
  durationMs?: number;
  meta?: Record<string, unknown>;
}

export interface SessionEventRecord {
  at: number;
  type: string;
  [key: string]: unknown;
}

export interface SessionLog {
  id: string;
  startedAt: number;
  currentStage?: GameStage;
  stages: Record<string, SessionStageRecord>;
  events: SessionEventRecord[];
  summary?: Record<string, unknown>;
}
