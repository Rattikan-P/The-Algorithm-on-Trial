import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { AuditSession } from './utils/session';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline or connecting...');
    }
  }
}
testConnection();

/**
 * Synchronize game session data directly to Cloud Firestore.
 * Automatically saves participant score, duration, verdict, and audit outcomes.
 */
export async function syncSessionToCloud(session: AuditSession): Promise<boolean> {
  const path = `game_sessions/${session.id}`;
  try {
    const payload: Record<string, any> = {
      id: session.id,
      startedAt: session.startedAt,
      totalScore: session.totalScore,
      rankLabel: session.rankLabel || 'Investigator',
      evidenceCount: session.evidenceUnlockedCount || 0,
      bonusCount: session.bonusUnlockedCount || 0,
      pretestCompleted: !!session.pretestCompleted,
      posttestCompleted: !!session.posttestCompleted,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 280) : 'unknown',
    };

    if (session.completedAt) {
      payload.completedAt = session.completedAt;
    }
    if (session.verdictFrame) {
      payload.verdictFrame = session.verdictFrame;
    }
    if (session.verdictCoherencePct !== undefined) {
      payload.coherencePct = session.verdictCoherencePct;
      if (payload.coherencePct >= 90) payload.coherenceTier = 'High Forensic Precision';
      else if (payload.coherencePct >= 70) payload.coherenceTier = 'Substantial Alignment';
      else if (payload.coherencePct >= 50) payload.coherenceTier = 'Partial Plausibility';
      else payload.coherenceTier = 'Cognitive Divergence';
    }
    if (session.totalDurationSeconds !== undefined) {
      payload.totalDurationSeconds = session.totalDurationSeconds;
    }

    await setDoc(doc(db, 'game_sessions', session.id), payload, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to sync session to Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.WRITE, path);
    } catch {
      // return false to allow app to continue gracefully without crashing user experience
      return false;
    }
    return false;
  }
}
