import React, { useState } from 'react';
import {
  FileText,
  Hash,
  Play,
  Pause,
  Send,
  TriangleAlert,
} from 'lucide-react';
import { WindowHeader } from './WindowHeader';
import { TRAINING_DISTRIBUTION } from '../data/gameData';

// Evidence 1: Slack Thread
export const SlackEvidence: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0]">
      <WindowHeader title="fintrust-data — Slack" icon={Hash} />
      <div className="flex" style={{ minHeight: 260 }}>
        <div className="hidden w-40 flex-shrink-0 border-r border-white/10 bg-[#181818] p-2 sm:block">
          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            FinTrust AI
          </div>
          {['#fintrust-data', '#general', '#eng-leads', '#releases', '#random'].map(
            (channel, idx) => (
              <div
                key={channel}
                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs ${
                  idx === 0 ? 'bg-white/10 text-amber-300' : 'text-slate-400'
                }`}
              >
                <Hash className="h-3 w-3" />
                <span>{channel.replace('#', '')}</span>
              </div>
            )
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <Hash className="h-4 w-4 text-slate-500" />
            <span className="font-bold text-slate-200">fintrust-data</span>
            <span className="ml-2 text-xs text-slate-500">3 members</span>
          </div>
          <div className="space-y-1 p-3">
            <div className="flex gap-2.5 px-1 py-1.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-sky-600 text-xs font-bold text-white">
                P
              </div>
              <div>
                <p className="text-xs">
                  <span className="font-bold text-slate-200">Priya M.</span>{' '}
                  <span className="text-slate-500">11:42 PM</span>
                </p>
                <p className="mt-0.5 leading-relaxed text-slate-300">
                  Heads up — Group C has way fewer approved historical loans in the training set (barely 20% representation). If we train on this, the system will learn to reject them automatically. We need to re-balance the dataset before launch.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 px-1 py-1.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-amber-600 text-xs font-bold text-white">
                M
              </div>
              <div>
                <p className="text-xs">
                  <span className="font-bold text-slate-200">Marcus V.</span>{' '}
                  <span className="text-slate-500">11:51 PM</span>
                </p>
                <p className="mt-0.5 leading-relaxed text-slate-300">
                  No time. Q3 date is locked. Ship now, fix later — that's the call.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 px-1 py-1.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-sky-600 text-xs font-bold text-white">
                P
              </div>
              <div>
                <p className="text-xs">
                  <span className="font-bold text-slate-200">Priya M.</span>{' '}
                  <span className="text-slate-500">11:53 PM</span>
                </p>
                <p className="mt-0.5 leading-relaxed text-slate-300">
                  Marcus, this is exactly how biased systems get shipped...
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
            <div className="flex-1 rounded border border-white/10 bg-[#2a2a2a] px-3 py-1.5 text-xs text-slate-500">
              Message #fintrust-data
            </div>
            <Send className="h-4 w-4 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Evidence 2: Training Data Summary Bar Chart
interface TrainingChartEvidenceProps {
  interactive?: boolean;
  onUnlockC?: () => void;
  cUnlocked?: boolean;
}

export const TrainingChartEvidence: React.FC<TrainingChartEvidenceProps> = ({
  interactive,
  onUnlockC,
  cUnlocked,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-amber-500/40 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0] shadow-[0_0_25px_rgba(245,158,11,0.15)]">
      <WindowHeader title="training_summary.png — FinTrust Analytics" icon={FileText} />
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-400">
        <span>datasets / training_v3.csv</span>
        <span>n = 50,000</span>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Loan approval training set composition
          </p>
          {interactive && !cUnlocked && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 animate-pulse border border-amber-500/40">
              🔍 Inspect Anomalies
            </span>
          )}
        </div>
        <div
          className="flex items-end justify-around gap-3 rounded-md bg-[#181818] p-4 pt-8 border border-white/5"
          style={{ height: 230 }}
        >
          {TRAINING_DISTRIBUTION.map((group) => {
            const isTarget = interactive && group.highlight;
            const handleClick = isTarget && !cUnlocked ? onUnlockC : undefined;

            return (
              <div
                key={group.label}
                onClick={handleClick}
                role={isTarget ? 'button' : undefined}
                tabIndex={isTarget ? 0 : undefined}
                className={`group flex w-1/5 flex-col items-center justify-end h-full ${
                  isTarget && !cUnlocked ? 'cursor-pointer' : ''
                }`}
              >
                <span className={`mb-3 font-mono text-xs font-bold ${isTarget ? 'text-amber-300' : 'text-slate-300'}`}>
                  {group.pct}%
                </span>
                <div
                  className={`w-full rounded-t transition duration-200 ${
                    isTarget && !cUnlocked
                      ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-[#181818] animate-bounce shadow-[0_0_25px_rgba(245,158,11,0.8)]'
                      : ''
                  }`}
                  style={{
                    height: `${group.pct * 1.35}px`,
                    backgroundColor: group.color,
                  }}
                />
                <span
                  className={`mt-2 text-xs ${
                    group.highlight ? 'font-bold text-amber-300 underline underline-offset-4 decoration-amber-400' : 'text-slate-400'
                  }`}
                >
                  {group.label}
                </span>
              </div>
            );
          })}
        </div>
        {interactive && (
          <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-amber-300 font-medium">
            <TriangleAlert className="h-4 w-4 text-amber-400 shrink-0" />
            {cUnlocked
              ? '✓ Severe disparity verified for Group C (only 8% representation).'
              : '⚡ Click the highlighted Group C bar above to investigate the skewed demographic distribution.'}
          </p>
        )}
      </div>
    </div>
  );
};

// Evidence 3: VP Email - Launch Directive
export const VpEmailEvidence: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0]">
      <WindowHeader title="Launch Directive — FinTrust Mail" icon={FileText} />
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#252525] px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
          DA
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-100">D. Aldridge</p>
          <p className="text-xs text-slate-400">VP Product · FinTrust AI</p>
        </div>
        <span className="rounded bg-red-900/60 px-2 py-0.5 text-[10px] font-semibold text-red-300">
          HIGH PRIORITY
        </span>
      </div>
      <div className="space-y-2 p-4 text-xs">
        <div className="rounded bg-[#181818] p-3 text-slate-300 space-y-1">
          <p>
            <span className="text-slate-500">From:</span> d.aldridge@fintrust.ai
          </p>
          <p>
            <span className="text-slate-500">To:</span> priya.m@fintrust.ai, marcus.v@fintrust.ai
          </p>
          <p>
            <span className="text-slate-500">Subject:</span>{' '}
            <span className="font-semibold text-amber-200">RE: Fairness review blocker</span>
          </p>
        </div>
        <div className="border-t border-white/10 px-1 py-3">
          <p className="leading-relaxed text-slate-200">
            The fairness review must be bypassed. Our launch date holds regardless. CreditNova ships their competing product in Q4 — if we miss this window we lose first-mover advantage, and the Series C close at month-end depends on a live production deployment. Investor commitments are paramount. Deploy.
          </p>
          <p className="mt-4 text-slate-400">— D. Aldridge</p>
        </div>
      </div>
    </div>
  );
};

// Evidence 4: Fairness Audit Request Ticket
export const TicketEvidence: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0]">
      <WindowHeader title="Ticket #FA-2025-014 — FinTrust Tracker" icon={FileText} />
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs text-slate-500">Ticket #FA-2025-014</p>
          <p className="font-semibold text-amber-200">Request: Pre-launch bias audit</p>
        </div>
        <span className="rounded bg-red-900/60 px-3 py-1 text-xs font-bold text-red-300">
          DENIED · DEFERRED
        </span>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Description</p>
          <p className="mt-1 leading-relaxed text-slate-300">
            The data team requests a comprehensive fairness audit prior to production deployment, citing underrepresentation of Group C applicants in the training set.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Priority</p>
            <p className="text-slate-300">High</p>
          </div>
          <div>
            <p className="text-slate-500">Requested by</p>
            <p className="text-slate-300">priya.m</p>
          </div>
        </div>
        <div className="rounded-md border-l-2 border-red-500 bg-red-950/30 p-3">
          <p className="text-xs font-semibold text-red-300">Resolution</p>
          <p className="mt-1 text-slate-300">
            No resources allocated. Review deferred to post-launch cycle.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-white/10 px-4 py-3">
        <button type="button" className="rounded border border-white/10 px-4 py-1.5 text-xs text-slate-400">
          Cancel
        </button>
        <button type="button" className="rounded bg-[#f99d33] px-4 py-1.5 text-xs font-semibold text-slate-900">
          Continue
        </button>
      </div>
    </div>
  );
};

// Evidence 5: Applicant Testimonial Maria R.
export const TestimonialEvidence: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0]">
      <WindowHeader title="Applicant Testimonial — Maria R." icon={Play} />
      <div className="px-4 py-4">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f99d33] text-slate-900 transition hover:opacity-90"
            aria-label={playing ? 'Pause audio' : 'Play audio'}
          >
            {playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5" />
            )}
          </button>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-200">call_recording_maria_r.mp3</p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-[#f99d33]" />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-500">
              <span>00:00</span>
              <span>80:41</span>
            </div>
          </div>
        </div>
        <div className="rounded-md bg-[#181818] p-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Transcript</p>
          <p className="leading-relaxed text-slate-300">
            "Other banks approved me with no issues! I don't know if the AI targeted me on purpose, but it rejected me in 2 seconds despite my bakery making stable profits for 10 years and my perfect credit score."
          </p>
          <p className="mt-3 leading-relaxed text-slate-300">
            "I talked to my neighborhood business association. Every single local owner on my block — all with clean financial histories — got rejected instantly. It feels like our entire zip code was blacklisted!"
          </p>
        </div>
      </div>
    </div>
  );
};

// Evidence 6: Public Statement Draft
export const PublicStatementEvidence: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0]">
      <WindowHeader title="public_statement_draft.docx — FinTrust Docs" icon={FileText} />
      <div className="flex items-center gap-4 border-b border-white/10 bg-[#2a2a2a] px-4 py-1.5 text-[11px] text-slate-400">
        {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="bg-[#232323] p-6">
        <div
          className="mx-auto max-w-md rounded bg-[#2b2b2b] p-6 shadow-lg flex flex-col justify-center"
          style={{ minHeight: 180 }}
        >
          <p className="mb-2 text-center text-[10px] uppercase tracking-widest text-slate-500">
            PR DRAFT — FOR REVIEW
          </p>
          <p className="text-center leading-relaxed text-slate-200">
            "FinTrust AI uses advanced mathematical equity to guarantee neutral, unbiased, and regularly audited outcomes."
          </p>
        </div>
        <p className="mt-4 flex items-center gap-1 text-xs text-amber-300">
          <TriangleAlert className="h-3.5 w-3.5" />
          <span>Note the claim of "regularly audited outcomes" — no audit has been conducted.</span>
        </p>
      </div>
    </div>
  );
};

// Evidence 7: Model Feature Registry
export const ModelRegistryEvidence: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e] font-sans text-sm text-[#e0e0e0]">
      <WindowHeader title="model_registry.json — FinTrust ML" icon={FileText} accent="#ef4444" />
      <div className="border-b border-white/10 px-4 py-2 text-xs text-slate-400">
        features / production_model_v3
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed">
        <p className="text-slate-500">{'{'}</p>
        <p className="pl-4">
          <span className="text-sky-300">"credit_score"</span>: <span className="text-amber-300">input</span>,
        </p>
        <p className="pl-4">
          <span className="text-sky-300">"annual_income"</span>: <span className="text-amber-300">input</span>,
        </p>
        <p className="pl-4">
          <span className="text-sky-300">"debt_to_income"</span>: <span className="text-amber-300">input</span>,
        </p>
        <p className="pl-4">
          <span className="text-sky-300">"years_in_business"</span>: <span className="text-amber-300">input</span>,
        </p>
        <p className="pl-4 text-red-400">
          <span className="text-red-400">"neighborhood_stability_index"</span>: <span className="text-amber-300">input</span>, <span className="text-slate-500">// proxy — derived from zip_code</span>
        </p>
        <p className="pl-4">
          <span className="text-sky-300">"zip_code_risk_band"</span>: <span className="text-amber-300">input</span>, <span className="text-slate-500">// proxy — correlated with Group C</span>
        </p>
        <p className="pl-4">
          <span className="text-sky-300">"risk_score"</span>: <span className="text-emerald-300">output</span>,
        </p>
        <p className="text-slate-500">{'}'}</p>
      </div>
      <div className="border-t border-white/10 px-4 py-3">
        <p className="flex items-center gap-1.5 text-xs text-amber-300">
          <TriangleAlert className="h-3.5 w-3.5" />
          <span>These proxy variables aren't financial metrics — they're the real separators the model uses.</span>
        </p>
      </div>
    </div>
  );
};

// Dispatcher Component (Cs)
export const EvidenceViewer: React.FC<{
  id: number;
  interactive?: boolean;
  onUnlockC?: () => void;
  cUnlocked?: boolean;
}> = ({ id, interactive, onUnlockC, cUnlocked }) => {
  switch (id) {
    case 1:
      return <SlackEvidence />;
    case 2:
      return (
        <TrainingChartEvidence
          interactive={interactive}
          onUnlockC={onUnlockC}
          cUnlocked={cUnlocked}
        />
      );
    case 3:
      return <VpEmailEvidence />;
    case 4:
      return <TicketEvidence />;
    case 5:
      return <TestimonialEvidence />;
    case 6:
      return <PublicStatementEvidence />;
    case 7:
      return <ModelRegistryEvidence />;
    default:
      return null;
  }
};
