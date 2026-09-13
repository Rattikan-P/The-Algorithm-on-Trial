import { GoogleSheetsPayload, SessionLog, FrameKey, CoherenceResult } from '../types';
import { EVIDENCES, VERDICT_FRAMES } from '../data/gameData';
import { getCurrentSession, getDetectiveRank } from './session';

const WEBHOOK_STORAGE_KEY = 'aot_gsheets_webhook_url';
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxFaZdY0rlb3MlHMOxDCJ2Qk2tgmK8EvkZ6IKS7IHaRkiUxayEqOcytflNvuNPpaThMCg/exec';

export const APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (TH)",
        "Session ID",
        "Total Playtime",
        "Total Seconds",
        "Score",
        "Detective Rank",
        "Verdict Frame",
        "Verdict Title",
        "Coherence %",
        "Forensic Tier",
        "Notice Stage Time",
        "Audit Stage Time",
        "Investigation Time",
        "BuildCase Time",
        "Debrief Time",
        "Evidence Count",
        "Bonus Clues Count",
        "Evidence List",
        "Bonus Clues List",
        "Recent Action Logs"
      ]);
      // Format Header styling
      sheet.getRange(1, 1, 1, 20).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");
      sheet.setFrozenRows(1);
    }
    
    // Append player record
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      data.sessionId,
      data.totalDurationStr,
      data.totalDurationSeconds,
      data.score,
      data.rank,
      data.verdict,
      data.verdictLabel,
      data.coherencePct + "%",
      data.coherenceTier,
      data.stageDurations ? data.stageDurations.notice || "-" : "-",
      data.stageDurations ? data.stageDurations.audit || "-" : "-",
      data.stageDurations ? data.stageDurations.investigation || "-" : "-",
      data.stageDurations ? data.stageDurations.buildcase || "-" : "-",
      data.stageDurations ? data.stageDurations.debrief || "-" : "-",
      data.evidenceCount,
      data.bonusCount,
      data.evidencesList,
      data.bonusList,
      data.recentEventsSummary
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export function getSavedWebhookUrl(): string {
  try {
    return localStorage.getItem(WEBHOOK_STORAGE_KEY) || DEFAULT_WEBHOOK_URL;
  } catch {
    return DEFAULT_WEBHOOK_URL;
  }
}

export function saveWebhookUrl(url: string): void {
  try {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
  } catch {
    // ignore
  }
}

export function formatDurationMs(ms: number): string {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function buildGoogleSheetsPayload(params: {
  unlockedEvidences: number[];
  caseEvidence: number[];
  bonusClues: string[];
  verdictFrame: FrameKey | null;
  result: CoherenceResult | null;
}): GoogleSheetsPayload {
  const session = getCurrentSession();
  const now = Date.now();
  const startTime = session?.startedAt || now;
  const totalDurationMs = Math.max(0, now - startTime);
  const totalDurationSeconds = Math.round(totalDurationMs / 1000);

  const evScore = params.unlockedEvidences.length * 10;
  const bonusScore = params.bonusClues.length * 10;
  const auditScore = 60;
  const totalScore = evScore + bonusScore + auditScore;
  const rank = getDetectiveRank(totalScore).label;

  const verdictOption = params.verdictFrame
    ? VERDICT_FRAMES.find((v) => v.key === params.verdictFrame)
    : null;

  const stageDurations: GoogleSheetsPayload['stageDurations'] = {};
  if (session?.stages) {
    Object.entries(session.stages).forEach(([stageName, record]) => {
      let duration = record.durationMs || 0;
      if (record.enteredAt && !record.exitedAt) {
        duration += now - record.enteredAt;
      }
      (stageDurations as Record<string, string>)[stageName] = formatDurationMs(duration);
    });
  }

  const evidenceNames = params.unlockedEvidences
    .map((id) => `#${id}: ${EVIDENCES[id]?.title || 'Unknown'}`)
    .join(' | ');

  const recentEvents = (session?.events || [])
    .slice(-15)
    .map((ev) => `[${ev.type}]`)
    .join(' -> ');

  let coherenceTier = 'Partial Plausibility';
  if (params.result) {
    if (params.result.tier === 'complete') coherenceTier = 'High Forensic Precision';
    else if (params.result.tier === 'narrow') coherenceTier = 'Substantial Alignment';
    else coherenceTier = 'Cognitive Divergence';
  }

  const inferenceErrors = session?.inferenceErrorCount || 0;
  const totalErrors = inferenceErrors + (session?.auditErrorCount || 0) + (session?.debriefErrorCount || 0);

  return {
    timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
    sessionId: session?.id || 'unknown_sess',
    totalDurationSeconds,
    totalDurationStr: formatDurationMs(totalDurationMs),
    startedAtIso: new Date(startTime).toISOString(),
    completedAtIso: new Date(now).toISOString(),
    stageDurations,
    score: totalScore,
    rank,
    verdict: params.verdictFrame ? `Frame ${params.verdictFrame.toUpperCase()}` : 'None',
    verdictLabel: verdictOption?.label || 'Unassigned',
    verdictCombined: params.verdictFrame
      ? `Frame ${params.verdictFrame.toUpperCase()} (${verdictOption?.label || ''})`
      : 'None',
    inferenceErrors,
    totalErrors,
    coherencePct: params.result?.pct ?? 0,
    coherenceTier,
    evidenceCount: params.unlockedEvidences.length,
    bonusCount: params.bonusClues.length,
    evidencesList: evidenceNames || 'None',
    bonusList: params.bonusClues.join(', ') || 'None',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : 'Browser',
    actionLogCount: session?.events?.length || 0,
    recentEventsSummary: recentEvents || 'Started',
  };
}

/**
 * Sends session data to Google Apps Script Webhook.
 * Uses no-cors so cross-origin restrictions from Google Apps Script do not fail the request.
 */
const syncedSessionIds = new Set<string>();

export async function sendToGoogleSheets(
  payload: GoogleSheetsPayload,
  webhookUrl?: string,
  force: boolean = false
): Promise<{ success: boolean; message: string }> {
  const url = (webhookUrl || getSavedWebhookUrl()).trim();
  if (!url) {
    return {
      success: false,
      message: 'No Google Sheets Webhook URL configured',
    };
  }

  // Deduplicate by Session ID to prevent duplicate rows in Google Sheets
  if (!force && payload.sessionId && syncedSessionIds.has(payload.sessionId)) {
    return {
      success: true,
      message: 'Session already synced to Google Sheets',
    };
  }

  if (payload.sessionId) {
    syncedSessionIds.add(payload.sessionId);
  }

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Essential for Google Apps Script Webhook redirects
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Data sent successfully to Google Sheets!',
    };
  } catch (error) {
    console.error('Google Sheets transmission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to Google Sheets',
    };
  }
}
