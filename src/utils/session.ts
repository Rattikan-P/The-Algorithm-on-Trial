import { CoherenceResult, FrameKey, GameStage, SessionLog } from '../types';
import { EVIDENCES } from '../data/gameData';

const SESSION_STORAGE_KEY = 'aot_session';

export function generateSessionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  }
}

export function initSession(): SessionLog {
  const session: SessionLog = {
    id: generateSessionId(),
    startedAt: Date.now(),
    currentStage: 'notice',
    stages: {
      notice: { enteredAt: Date.now() },
    },
    events: [],
    inferenceErrorCount: 0,
    auditErrorCount: 0,
    debriefErrorCount: 0,
  };
  saveSession(session);
  return session;
}

export function getCurrentSession(): SessionLog | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: SessionLog): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function resetStageTimer(stageName: GameStage): void {
  const session = getCurrentSession();
  if (!session) return;
  const now = Date.now();
  if (!session.stages[stageName]) {
    session.stages[stageName] = { enteredAt: now };
  } else {
    session.stages[stageName].enteredAt = now;
    session.stages[stageName].durationMs = 0;
  }
  saveSession(session);
}

export function recordStageTransition(toStage: GameStage, meta: Record<string, unknown> = {}): void {
  const session = getCurrentSession();
  if (!session) return;
  const now = Date.now();
  const prevStage = session.currentStage;
  if (prevStage && prevStage !== toStage && session.stages[prevStage]) {
    const prev = session.stages[prevStage];
    prev.exitedAt = now;
    prev.durationMs = (prev.durationMs || 0) + (now - prev.enteredAt);
  }
  session.currentStage = toStage;
  if (session.stages[toStage]) {
    session.stages[toStage].enteredAt = now;
    session.stages[toStage].meta = { ...(session.stages[toStage].meta || {}), ...meta };
  } else {
    session.stages[toStage] = { enteredAt: now, meta };
  }
  saveSession(session);
}

export function logSessionEvent(type: string, data: Record<string, unknown> = {}): void {
  const session = getCurrentSession();
  if (!session) return;
  session.events.push({
    at: Date.now(),
    type,
    ...data,
  });
  saveSession(session);
}

export function recordErrorAttempt(type: 'inference' | 'audit' | 'debrief', context?: string): void {
  const session = getCurrentSession();
  if (!session) return;
  if (type === 'inference') {
    session.inferenceErrorCount = (session.inferenceErrorCount || 0) + 1;
  } else if (type === 'audit') {
    session.auditErrorCount = (session.auditErrorCount || 0) + 1;
  } else if (type === 'debrief') {
    session.debriefErrorCount = (session.debriefErrorCount || 0) + 1;
  }
  logSessionEvent('error_attempt', { type, context: context || '' });
  saveSession(session);
}

export function finishStage(summaryData: Record<string, unknown> = {}): SessionLog | null {
  const session = getCurrentSession();
  if (!session) return null;
  const now = Date.now();
  const cur = session.currentStage;
  if (cur && session.stages[cur] && !session.stages[cur].exitedAt) {
    session.stages[cur].exitedAt = now;
    session.stages[cur].durationMs = (session.stages[cur].durationMs || 0) + (now - session.stages[cur].enteredAt);
  }
  session.completedAt = now;
  session.totalDurationMs = Math.max(0, now - session.startedAt);
  session.summary = summaryData;
  saveSession(session);
  return session;
}

export function downloadSessionData(): void {
  const session = getCurrentSession();
  if (!session) return;
  const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aot_session_${session.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSessionCsv(): void {
  const session = getCurrentSession();
  if (!session) return;
  const now = Date.now();
  const totalDurationSeconds = Math.round(((session.completedAt || now) - session.startedAt) / 1000);

  const headers = ['Metric', 'Value'];
  const rows = [
    ['Session ID', session.id],
    ['Started At', new Date(session.startedAt).toLocaleString('th-TH')],
    ['Completed At', session.completedAt ? new Date(session.completedAt).toLocaleString('th-TH') : '-'],
    ['Total Duration (Seconds)', totalDurationSeconds.toString()],
    ['Event Logs Count', (session.events?.length || 0).toString()],
  ];

  if (session.stages) {
    Object.entries(session.stages).forEach(([stageName, record]) => {
      const durationSec = Math.round((record.durationMs || 0) / 1000);
      rows.push([`Stage Time: ${stageName}`, `${durationSec}s`]);
    });
  }

  const csvContent = [headers.join(','), ...rows.map((r) => `"${r[0]}","${r[1]}"`)].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aot_session_${session.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function calculateVerdictCoherence(
  chosenFrame: FrameKey,
  selectedEvidenceIds: number[]
): CoherenceResult {
  const items = (selectedEvidenceIds || []).map((id) => EVIDENCES[id]).filter(Boolean);
  if (items.length === 0) {
    return {
      matched: 0,
      total: 0,
      dominantFrame: null,
      tally: { a: 0, b: 0, c: 0, d: 0 },
      pct: 0,
      tier: 'wrong',
    };
  }

  const tally: Record<FrameKey, number> = { a: 0, b: 0, c: 0, d: 0 };
  let matched = 0;

  items.forEach((item) => {
    (item.pointsTo || []).forEach((fr) => {
      tally[fr] += 1;
    });
    if ((item.pointsTo || []).includes(chosenFrame)) {
      matched += 1;
    }
  });

  const dominant = (Object.entries(tally) as [FrameKey, number][]).sort((x, y) => y[1] - x[1])[0][0];
  const pct = Math.round((matched / items.length) * 100);

  let tier: 'complete' | 'narrow' | 'wrong' = 'narrow';
  if (pct >= 60 && dominant === chosenFrame) {
    tier = 'complete';
  }
  if (pct === 0) {
    tier = 'wrong';
  }
  if (chosenFrame === 'd' && tally.d === 0) {
    tier = 'wrong';
  }

  return {
    matched,
    total: items.length,
    dominantFrame: dominant,
    tally,
    pct,
    tier,
  };
}

export function getDetectiveRank(score: number): { label: string; color: string } {
  if (score >= 153) {
    return { label: 'Master Fairness Auditor', color: 'text-amber-300' };
  }
  if (score >= 102) {
    return { label: 'Senior Investigator', color: 'text-amber-200' };
  }
  if (score >= 51) {
    return { label: 'Field Auditor', color: 'text-emerald-300' };
  }
  return { label: 'Rookie Auditor', color: 'text-slate-400' };
}

export function caesarShift(text: string, shift: number): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode((((char.charCodeAt(0) - base + shift) % 26) + 26) % 26 + base);
  });
}

export const recordStage = recordStageTransition;
export const trackEvent = logSessionEvent;
export const saveSessionSummary = finishStage;
export const exportSessionData = downloadSessionData;
