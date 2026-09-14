import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  FileText,
  RotateCcw,
  ExternalLink,
  MessageSquare,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  Table,
  Settings,
  Copy,
  Send,
  User,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import {
  EVIDENCES,
  MARIA_MESSAGES,
  POSTTEST_URL,
  REPORT_BULLETS,
  REPORT_OFFICIAL_EXPLANATION,
  CONSENT_NOTE,
} from '../data/gameData';
import {
  getDetectiveRank,
  getCurrentSession,
  finishStage,
} from '../utils/session';
import {
  buildGoogleSheetsPayload,
  sendToGoogleSheets,
  getSavedWebhookUrl,
  saveWebhookUrl,
  APPS_SCRIPT_TEMPLATE,
  formatDurationMs,
} from '../utils/googleSheets';
import { CoherenceResult, FrameKey } from '../types';

interface ReportStageProps {
  unlockedEvidences: number[];
  unlockedOrder: number[];
  verdictFrame: FrameKey | null;
  caseEvidence: number[];
  bonusClues: string[];
  result: CoherenceResult | null;
  onReset: () => void;
}

export const ReportStage: React.FC<ReportStageProps> = ({
  unlockedEvidences,
  unlockedOrder,
  verdictFrame,
  caseEvidence,
  bonusClues,
  result,
  onReset,
}) => {
  const [showOriginalLetter, setShowOriginalLetter] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);
  const [showSheetsConfig, setShowSheetsConfig] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Webhook URL state
  const [webhookUrl, setWebhookUrl] = useState<string>(() => getSavedWebhookUrl());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'no_url'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Post-test modal and status tracking
  const [posttestDone, setPosttestDone] = useState<boolean>(() => {
    return sessionStorage.getItem('posttest_completed') === 'true';
  });
  const [hasOpenedPosttest, setHasOpenedPosttest] = useState<boolean>(() => {
    return sessionStorage.getItem('posttest_opened') === 'true';
  });
  const [confirmedPosttest, setConfirmedPosttest] = useState<boolean>(false);
  const [showPosttestModal, setShowPosttestModal] = useState<boolean>(() => {
    return sessionStorage.getItem('posttest_completed') !== 'true';
  });

  // Calculate scores
  const evScore = unlockedEvidences.length * 10;
  const bonusScore = bonusClues.length * 10;
  const weightScore = 60;
  const totalScore = evScore + bonusScore + weightScore;
  const rank = getDetectiveRank(totalScore);

  // Mark session finished and auto-sync to Google Sheets on mount if webhook is configured
  useEffect(() => {
    finishStage({
      verdictFrame,
      caseEvidence,
      evidenceCount: unlockedEvidences.length,
      bonusCount: bonusClues.length,
      totalScore,
      rank: rank.label,
    });

    const currentSavedUrl = getSavedWebhookUrl();
    if (currentSavedUrl) {
      triggerSheetsSync(currentSavedUrl);
    }
  }, []);

  const triggerSheetsSync = async (targetUrl?: string) => {
    const url = targetUrl || webhookUrl;
    if (!url || !url.trim()) {
      setSyncStatus('no_url');
      setSyncMessage('กรุณาใส่ Webhook URL ของ Google Sheets เพื่อส่งข้อมูลอัตโนมัติ');
      return;
    }

    setSyncStatus('sending');
    setSyncMessage('กำลังส่งข้อมูลและสถิติเวลาเข้า Google Sheets...');

    const payload = buildGoogleSheetsPayload({
      unlockedEvidences,
      caseEvidence,
      bonusClues,
      verdictFrame,
      result,
    });

    const res = await sendToGoogleSheets(payload, url);
    if (res.success) {
      setSyncStatus('success');
      setSyncMessage('บันทึกข้อมูลและสถิติเวลาเข้า Google Sheets สำเร็จ!');
    } else {
      setSyncStatus('error');
      setSyncMessage(res.message);
    }
  };

  const handleSaveWebhook = () => {
    saveWebhookUrl(webhookUrl);
    triggerSheetsSync(webhookUrl);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleOpenPosttest = () => {
    setHasOpenedPosttest(true);
    sessionStorage.setItem('posttest_opened', 'true');
    window.open(POSTTEST_URL, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmPosttestDone = () => {
    setPosttestDone(true);
    sessionStorage.setItem('posttest_completed', 'true');
    setShowPosttestModal(false);
  };

  const citedEvidences = (caseEvidence || [])
    .map((id) => EVIDENCES[id])
    .filter(Boolean);

  const mariaNote = MARIA_MESSAGES.complete;
  const session = getCurrentSession();
  const sessionId = session?.id?.slice(0, 8).toUpperCase() || 'FIN-2026';
  const totalPlaytimeMs = session ? Math.max(0, (session.completedAt || Date.now()) - session.startedAt) : 0;

  return (
    <motion.div
      className="min-h-screen bg-slate-950 px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Google Sheets Apps Script Setup Modal */}
      <AnimatePresence>
        {showSheetsConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-emerald-500/40 bg-slate-900 shadow-[0_0_60px_rgba(16,185,129,0.3)]"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />
              
              <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                      <Table className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-100">
                        ตั้งค่า Google Sheets Webhook (สำหรับรับผลคะแนน & เวลา)
                      </h3>
                      <p className="text-xs text-slate-400">
                        รับข้อมูลคะแนน เวลาที่เล่นแต่ละด่าน และคำตอบของผู้เล่นทุกคนเข้าตารางอัตโนมัติ
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSheetsConfig(false)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Webhook Input */}
                <div className="mb-6 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Google Apps Script Web App URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-1 rounded border border-slate-700 bg-slate-900 px-3.5 py-2 font-mono text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveWebhook}
                      className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>บันทึก & ทดสอบ</span>
                    </button>
                  </div>
                  {syncMessage && (
                    <p className={`mt-2 text-xs font-medium ${syncStatus === 'success' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {syncMessage}
                    </p>
                  )}
                </div>

                {/* Step by Step Instructions */}
                <div className="space-y-4 text-xs text-slate-300 font-sans">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 space-y-2.5">
                    <p className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">1</span>
                      สร้าง Google Sheet & เปิด Apps Script
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      เปิด Google Sheets ใหม่ใน Google Drive ของคุณ ➔ ไปที่เมนูด้านบนเลือก <strong>"ส่วนขยาย" (Extensions)</strong> ➔ <strong>"Apps Script"</strong>
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-100 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">2</span>
                        คัดลอกโค้ด Apps Script นี้ไปวางแทนที่ทั้งหมด
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-slate-700 cursor-pointer"
                      >
                        {copiedScript ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedScript ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                      </button>
                    </div>
                    <pre className="max-h-40 overflow-y-auto rounded bg-slate-950 p-3 font-mono text-[10px] text-slate-300 border border-slate-800 leading-relaxed">
                      {APPS_SCRIPT_TEMPLATE}
                    </pre>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 space-y-2.5">
                    <p className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">3</span>
                      กด Deploy (ทำให้ใช้งานได้)
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      ในหน้า Apps Script กดปุ่มสีน้ำเงินมุมขวาบน <strong>"ทำให้ใช้งานได้" (Deploy)</strong> ➔ <strong>"การทำให้ใช้งานได้รายการใหม่" (New deployment)</strong> ➔ เลือกประเภท <strong>"เว็บแอป" (Web app)</strong> ➔ ตรงช่อง <strong>"ผู้ที่มีสิทธิ์เข้าถึง" (Who has access)</strong> ให้เลือกเป็น <strong>"ทุกคน" (Anyone)</strong> ➔ กด Deploy แล้วนำ Web app URL ที่ได้มาแปะในช่องด้านบน
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSheetsConfig(false)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post-test Pop-up Modal */}
      <AnimatePresence>
        {showPosttestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-sky-500/40 bg-slate-900 shadow-[0_0_60px_rgba(56,189,248,0.3)]"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-sky-300 to-emerald-500" />

              <button
                type="button"
                onClick={() => setShowPosttestModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/15 text-sky-300">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block rounded bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                      Final Step · Research Study
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-100">
                      Post-Game Survey (Post-Test)
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-sm leading-relaxed text-slate-300">
                  <p>
                    Congratulations! You have successfully audited FinTrust's AI and exposed the hidden proxy variables.{' '}
                    <span className="font-semibold text-sky-200">
                      Please take 2–3 minutes to complete this final post-test survey
                    </span>{' '}
                    to conclude the research study.
                  </p>

                  <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3.5 text-xs text-slate-300">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 font-medium text-sky-200">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-[11px] font-bold text-sky-300">
                          1
                        </span>
                        <span>Click the button below to open the post-test in a new tab.</span>
                      </p>
                      <p className="flex items-center gap-2 font-medium text-sky-200">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-[11px] font-bold text-sky-300">
                          2
                        </span>
                        <span>Submit your answers, then return here to view your final report.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Open Form Button */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleOpenPosttest}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition hover:bg-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] cursor-pointer"
                  >
                    <span>{hasOpenedPosttest ? 'Open Survey Again' : 'Take the Post-Test Survey'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  {hasOpenedPosttest && (
                    <p className="mt-1.5 text-center text-xs text-emerald-400">
                      ✓ Post-test opened in a new tab
                    </p>
                  )}
                </div>

                {/* Step 2: Confirmation Checkbox */}
                <div className="mt-5 rounded-lg border border-slate-700/80 bg-slate-950/60 p-3.5">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-300">
                    <input
                      type="checkbox"
                      checked={confirmedPosttest}
                      onChange={(e) => setConfirmedPosttest(e.target.checked)}
                      disabled={!hasOpenedPosttest}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-400 disabled:opacity-40"
                    />
                    <span className={hasOpenedPosttest ? 'text-slate-200' : 'text-slate-500'}>
                      I have completed and submitted the Post-test survey.
                    </span>
                  </label>
                </div>

                {/* Step 3: Confirm & View Report button */}
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleConfirmPosttestDone}
                    disabled={!hasOpenedPosttest || !confirmedPosttest}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      hasOpenedPosttest && confirmedPosttest
                        ? 'border border-emerald-500/50 bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:bg-emerald-500 cursor-pointer'
                        : 'border border-slate-800 bg-slate-800/60 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm & View Final Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPosttestModal(false)}
                    className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
                  >
                    View Report First
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] leading-snug text-slate-500">
                  {CONSENT_NOTE}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-3xl">
        {/* Top Post-Test Alert Banner */}
        <div className="mb-6">
          {posttestDone ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span>
                  <strong className="font-semibold text-emerald-200">Post-test completed:</strong> Thank you for helping with our AI ethics research study!
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenPosttest}
                className="inline-flex items-center gap-1 font-mono text-[11px] underline-offset-2 hover:underline text-emerald-400"
              >
                Review Survey <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-sky-500/50 bg-sky-500/15 p-4 shadow-[0_0_25px_rgba(56,189,248,0.15)]">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-sky-500/30 px-1.5 py-0.2 font-mono text-[10px] font-bold uppercase text-sky-200">
                      Step 2 of 2
                    </span>
                    <h4 className="font-serif text-sm font-bold text-sky-100">
                      Complete the Post-Test Survey
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    To finalize the AI ethics research experiment, please submit the post-test survey.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPosttestModal(true)}
                className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-sky-400 bg-sky-500 px-4 py-2 font-mono text-xs font-semibold text-slate-950 shadow-md hover:bg-sky-400 cursor-pointer"
              >
                <span>Take Post-Test</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Investigator Score Card */}
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-50/[0.03] p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-amber-300">
                  Audit Session #{sessionId}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-100 mt-1 uppercase tracking-wider">
                Final Investigation Audit Report
              </h2>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Overall Score</span>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-300">
                {totalScore} <span className="text-sm font-normal text-slate-400">/ 170</span>
              </p>
            </div>
          </div>

          {/* Detective Rank Badge */}
          <div className="my-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Award className={`h-5 w-5 ${rank.color}`} />
              <span className="text-xs font-semibold text-slate-200">Forensic Clearance Level:</span>
              <span className={`font-mono text-sm font-bold ${rank.color}`}>{rank.label}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Total Playtime: {formatDurationMs(totalPlaytimeMs)}</span>
            </div>
          </div>

          {/* Time per stage breakdown */}
          {session?.stages && (
            <div className="mb-4 rounded-md border border-slate-800 bg-slate-950/60 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>Playtime by Investigation Stage:</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded bg-slate-900 p-2 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Notice Stage</p>
                  <p className="font-mono font-bold text-amber-300">
                    {formatDurationMs(session.stages.notice?.durationMs || 0)}
                  </p>
                </div>
                <div className="rounded bg-slate-900 p-2 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Audit Phase</p>
                  <p className="font-mono font-bold text-amber-300">
                    {formatDurationMs(session.stages.audit?.durationMs || 0)}
                  </p>
                </div>
                <div className="rounded bg-slate-900 p-2 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Office Infiltration</p>
                  <p className="font-mono font-bold text-amber-300">
                    {formatDurationMs(session.stages.investigation?.durationMs || 0)}
                  </p>
                </div>
                <div className="rounded bg-slate-900 p-2 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Build Case & Verdict</p>
                  <p className="font-mono font-bold text-amber-300">
                    {formatDurationMs((session.stages.buildcase?.durationMs || 0) + (session.stages.debrief?.durationMs || 0))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Score breakdown pillars */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-mono text-lg sm:text-xl font-bold text-amber-300">
                {evScore} <span className="text-xs font-normal text-slate-500">/ 70</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Primary Evidence ({unlockedEvidences.length}/7)
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-mono text-lg sm:text-xl font-bold text-amber-300">
                {bonusScore} <span className="text-xs font-normal text-slate-500">/ 40</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Secret Intel ({bonusClues.length}/4)
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
                {weightScore} <span className="text-xs font-normal text-slate-500">/ 60</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Audit Verified (4/4)
              </p>
            </div>
          </div>

          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => setShowScoreExplainer(!showScoreExplainer)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition cursor-pointer"
            >
              <HelpCircle className="h-3 w-3" />
              <span>{showScoreExplainer ? 'Hide score calculation' : 'How is this score calculated?'}</span>
            </button>
          </div>

          {showScoreExplainer && (
            <div className="mt-2 rounded-md border border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-400 space-y-1.5">
              <p>• <strong>Primary Evidence (+10 pts each, max 70):</strong> The 7 official case documents required to build and prove systemic discrimination.</p>
              <p>• <strong>Secret Intel (+10 pts each, max 40):</strong> 4 classified bonus items hidden in the office: Company Plaque, CCTV Footages, Terminal Console, and Paper Shredder.</p>
              <p>• <strong>Audit Verified (+15 pts each, max 60):</strong> Successfully connecting primary evidence to reconstruct the 4 systemic timeline phases.</p>
            </div>
          )}
        </div>

        {/* Independent Investigation Report Document (Email / Formal Audit Memo Style) */}
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Email Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Mail className="h-4 w-4" />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Official Correspondence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                VERIFIED
              </span>
            </div>
          </div>

          {/* Email Content Area */}
          <div className="bg-slate-900/50 p-6 sm:p-8">
            {/* Email Metadata Header (TO / FROM / SUBJECT) */}
            <div className="mb-8 space-y-3 border-b border-slate-800 pb-6 text-sm">
              <div className="flex items-baseline gap-4">
                <span className="w-16 font-mono font-bold text-slate-500 uppercase text-[10px] tracking-wider">To</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-100">Priya Vance</span>
                  <span className="text-slate-500 text-xs">&lt;p.vance@fintrust.ai&gt;</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="w-16 font-mono font-bold text-slate-500 uppercase text-[10px] tracking-wider">From</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-amber-200">Independent Audit Team</span>
                  <span className="text-slate-500 text-xs">&lt;auditor-external@xai-unit.org&gt;</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4 pt-1">
                <span className="w-16 font-mono font-bold text-slate-500 uppercase text-[10px] tracking-wider">Subject</span>
                <span className="font-bold text-slate-100 italic">
                  Forensic XAI Model Review & Audit Findings
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400/80 mb-3">
                  Executive Summary
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 font-sans">
                  Our independent counterfactual audit compared rejected qualified loan applicants with approved peers possessing identical financial numbers. We verified that FinTrust’s official rejection reasons served as ethical camouflage. The true systemic drivers uncovered by our XAI investigation are:
                </p>
              </div>

              {/* Key Findings List formatted as Email Bullet Points */}
              <div className="space-y-4 py-2">
                {REPORT_BULLETS.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono text-[10px] font-bold transition-colors group-hover:border-amber-500/30 group-hover:bg-amber-500/5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans pt-0.5">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>

              {/* Original Letter Toggle */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowOriginalLetter(!showOriginalLetter)}
                  className="flex items-center gap-2 rounded-md bg-slate-800/50 px-3 py-1.5 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-amber-200 transition cursor-pointer border border-slate-700/50"
                >
                  {showOriginalLetter ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  <span>{showOriginalLetter ? 'Hide Original Rejection Notice' : 'Compare with FinTrust Original Rejection Notice'}</span>
                </button>

                <AnimatePresence>
                  {showOriginalLetter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-4 font-serif text-[11px] leading-relaxed text-slate-500 italic">
                        {REPORT_OFFICIAL_EXPLANATION}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Verified Evidence Footer */}
              <div className="mt-8 border-t border-slate-800 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">
                    Verified Evidence Chain ({citedEvidences.length} Artifacts)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {citedEvidences.map((ev) => (
                    <div
                      key={ev.id}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-medium text-slate-300"
                    >
                      <span className="font-mono font-bold text-emerald-400">#{ev.id}</span>
                      <span>{ev.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maria's Follow-up Note */}
        <div className="mb-6 rounded-lg border border-sky-500/20 bg-sky-950/15 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-300">
            <MessageSquare className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Two Weeks Later — Maria's Message
            </span>
          </div>
          <p className="font-serif text-xs leading-relaxed text-slate-200">{mariaNote}</p>
          <p className="mt-2 text-right text-[11px] text-slate-500">
            — Maria R., owner of the bakery
          </p>
        </div>

        {/* Post-test Action */}
        <div className="mb-6 flex flex-col items-center gap-3">
          {posttestDone ? (
            <button
              type="button"
              onClick={() => setShowPosttestModal(true)}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-8 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Post-Test Survey Completed · Review Responses</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPosttestModal(true)}
              className="inline-flex items-center gap-2 rounded-md border border-sky-400/60 bg-sky-500/15 px-8 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/25 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 text-sky-300" />
              <span>Complete Post-Test Assessment (Required)</span>
            </button>
          )}
        </div>

        {/* Discovery Order Breadcrumb */}
        {unlockedOrder.length > 0 && (
          <div className="text-center text-[11px] text-slate-500">
            Investigation path: [{unlockedOrder.join(' → ')}]
          </div>
        )}

        {/* Restart Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart Investigation</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
