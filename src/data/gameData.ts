import {
  CharacterDialogue,
  EvidenceItem,
  InventoryItem,
  OfficialReason,
  AuditFactor,
  CaseStep,
  VerdictOption,
} from '../types';

import evidenceSlackImg from '../assets/images/evidence_slack_screen_1789283210867.jpg';
import evidenceChartImg from '../assets/images/evidence_chart_data_1789283225336.jpg';
import evidenceVpTabletImg from '../assets/images/evidence_vp_tablet_1789283239402.jpg';
import evidenceDeniedTicketImg from '../assets/images/evidence_denied_ticket_1789283253113.jpg';
import evidencePhoneCallImg from '../assets/images/evidence_phone_call_1789283268116.jpg';
import evidencePrDraftImg from '../assets/images/evidence_pr_draft_1789283285364.jpg';
import evidenceModelServerImg from '../assets/images/evidence_model_server_1789283299006.jpg';

import lobbyImg from '../assets/images/fintrust_lobby_sleeping_guard_1789359362651.jpg';
import priyaImg from '../assets/images/priya_desk_representation_1789354141267.jpg';
import serverRoomImg from '../assets/images/server_room_empty_noir_1789354155553.jpg';
import vpOfficeImg from '../assets/images/vp_office_empty_noir_1789354167398.jpg';
import analystImg from '../assets/images/case_analyst_abstract_profile_1789354179396.jpg';

import cctvLobbyIntruderImg from '../assets/images/fintrust_cctv_sleeping_guard_1789359377307.jpg';
import cctvVpIntruderImg from '../assets/images/cctv_vp_surveillance_angle_1789354875622.jpg';

export const PRETEST_URL = 'https://forms.gle/pGpquvpVPTtF5rfE8';
export const POSTTEST_URL = 'https://forms.gle/z43P4SC8RJJNnCdq5';

export const CONSENT_NOTE =
  'Notice: This platform logs anonymous gameplay interactions and test results for academic research purposes (Course 953420: Ethics and Professionalism for Software Engineers). By proceeding, you provide informed consent for your data to be collected anonymously. No personally identifying information is stored.';

export const REJECTION_LETTER_TEXT = `Dear Applicant,
Following our risk assessment, your loan application did not meet our approval criteria. This decision was based on multiple financial factors and cannot be attributed to any specific reason.

Thank you for your interest in FinTrust AI.
— FinTrust AI`;

export const AUDIT_APPLICANTS = {
  maria: {
    name: 'Maria R.',
    outcome: 'denied',
    tag: 'Bakery owner · Denied',
  },
  comparable: {
    name: 'Applicant B',
    outcome: 'approved',
    tag: 'Comparable profile · Approved',
  },
};

export const AUDIT_FACTORS: AuditFactor[] = [
  { key: 'credit_score', label: 'Credit Score', maria: 780, comparable: 780 },
  { key: 'annual_income', label: 'Annual Income', maria: '$85,000', comparable: '$85,000' },
  { key: 'years_in_business', label: 'Years in Business', maria: '10 years', comparable: '10 years' },
  { key: 'debt_to_income', label: 'Debt-to-Income', maria: '0.28', comparable: '0.28' },
  { key: 'repayment_history', label: 'Repayment History', maria: 'Immaculate', comparable: 'Immaculate' },
];

export const OFFICIAL_REASONS: OfficialReason[] = [
  {
    id: 'r1',
    label: 'Historical credit performance falls below our internal stability thresholds.',
    factorKey: 'credit_score',
    note: 'Both credit scores are identical at 780 — this reason does not separate the two applicants',
  },
  {
    id: 'r2',
    label: 'Aggregate debt-to-income ratio exceeds the risk-adjusted organizational ceiling.',
    factorKey: 'debt_to_income',
    note: 'Both DTI ratios are identical at 0.28 — this reason does not separate the two applicants',
  },
  {
    id: 'r3',
    label: 'Applicant income fails to meet our proprietary risk-diversification requirements.',
    factorKey: 'annual_income',
    note: 'Both incomes are identical — this reason does not separate the two applicants',
  },
  {
    id: 'r4',
    label: 'Predictive risk assessment model generated a non-approvable solvency score.',
    factorKey: 'risk_score',
    note: "This is the model's own output, not a reason — citing the outcome to explain the outcome is not a real explanation",
  },
];

export const TRAINING_DISTRIBUTION = [
  { label: 'Group A', pct: 85, color: '#f99d33' },
  { label: 'Group B', pct: 78, color: '#f99d33' },
  { label: 'Group C', pct: 20, color: '#ef4444', highlight: true },
  { label: 'Group D', pct: 80, color: '#f99d33' },
];

export const EVIDENCES: Record<number, EvidenceItem> = {
  1: {
    id: 1,
    title: 'Internal Slack Thread',
    source: "Priya's Computer — #fintrust-data",
    kind: 'slack',
    pointsTo: ['a', 'c'],
    image: evidenceSlackImg,
  },
  2: {
    id: 2,
    title: 'Training Data Summary',
    source: "Priya's Computer — datasets/",
    kind: 'chart',
    pointsTo: ['a', 'c'],
    image: evidenceChartImg,
  },
  3: {
    id: 3,
    title: 'VP Email — Launch Directive',
    source: "VP's Tablet — Sent Items",
    kind: 'email',
    pointsTo: ['b', 'c'],
    image: evidenceVpTabletImg,
  },
  4: {
    id: 4,
    title: 'Fairness Audit Request — DENIED',
    source: 'File Cabinet — Internal Tickets',
    kind: 'ticket',
    pointsTo: ['b', 'c'],
    image: evidenceDeniedTicketImg,
  },
  5: {
    id: 5,
    title: 'Applicant Testimonial — Maria R.',
    source: 'Desk Phone — Call Recording',
    kind: 'transcript',
    pointsTo: ['b', 'c'],
    image: evidencePhoneCallImg,
  },
  6: {
    id: 6,
    title: 'Public Statement Draft',
    source: "VP's Tablet — PR Drafts",
    kind: 'statement',
    pointsTo: ['c'],
    image: evidencePrDraftImg,
  },
  7: {
    id: 7,
    title: 'Model Feature Registry',
    source: 'Server Room — model_registry.json',
    kind: 'registry',
    pointsTo: ['a', 'c'],
    image: evidenceModelServerImg,
  },

};

export const INVENTORY_ITEMS: Record<string, InventoryItem> = {
  brassKey: {
    id: 'brassKey',
    name: 'Brass Key',
    icon: 'KeyRound',
    desc: "Priya's physical dead-drop key for the mechanical file cabinet",
    image:
      'https://media.base44.com/images/public/6a58d3ad7d7a91ba37b4a548/571032f80_generated_image.png',
  },
  accessCard: {
    id: 'accessCard',
    name: 'Executive Access Card',
    icon: 'CreditCard',
    desc: "A badge staged by Priya under the lobby desk to unlock the VP's wing",
    image:
      'https://media.base44.com/images/public/6a58d3ad7d7a91ba37b4a548/ea08e3a80_generated_image.png',
  },
};

export const IMAGES = {
  lobby: lobbyImg,
  priya: priyaImg,
  server: serverRoomImg,
  vp: vpOfficeImg,
  analyst: analystImg,
  cctvLobby: cctvLobbyIntruderImg,
  cctvVp: cctvVpIntruderImg,
};

export const PHONE_INTERVIEW_QUESTIONS = [
  { key: 'A', text: 'Did the system provide a specific reason for your rejection?' },
  { key: 'B', text: "Why didn't you just try applying at a different bank?" },
  { key: 'C', text: 'Do you think the AI targeted you maliciously?' },
];

export const CAESAR_PLAIN =
  'I tried to stop the launch. The dataset is biased against Group C. The bias was known before deploy. We are all complicit.';
export const CAESAR_SHIFT = 3;

export const CHARACTERS: Record<string, CharacterDialogue> = {
  marcus: {
    name: 'Marcus V.',
    role: 'Data Engineer — FinTrust',
    topics: [
      {
        id: 't1',
        q: 'Why did you ship it knowing the data was skewed?',
        a: 'I warned them clearly — this was not a casual heads-up. The VP said the deadline was non-negotiable. I had no authority to block it, so it is all there in my notes. I figured we would fix it later — we never did. That is the truth.',
      },
      {
        id: 't2',
        q: 'Who do you think is at fault?',
        a: 'You are asking me straight, so I will answer straight: it was not one person. Me, the team, the process that let critical warnings get ignored. Pinning it all on the VP as a scapegoat would be too easy — and it would not be true.',
      },
      {
        id: 't3',
        q: 'Did you know about Group C before the launch?',
        a: 'We did. Priya and I requested an audit before launch — formally, by the book. It got deferred. It is all in my encrypted memo. Go ahead and decode it. I did not keep it for myself.',
      },
    ],
  },
  vp: {
    name: 'D. Aldridge',
    role: 'VP Product — FinTrust',
    topics: [
      {
        id: 't1',
        q: 'Why did you order the audit bypassed?',
        a: 'Let me be clear: delivering on the company timeline is an obligation to every stakeholder. Fairness is already on next quarter’s roadmap — it is not that we were never going to do it. It was a matter of operational prioritization.',
      },
      {
        id: 't2',
        q: 'What was pressuring you that badly?',
        a: 'I will be candid so you understand the context. CreditNova is shipping a competing product in Q4, and our Series C round closes at the end of the month. Miss that window and the company may not survive. I did not push because I enjoy pressure — I pushed because I believed I was keeping everyone in this company employed.',
      },
      {
        id: 't3',
        q: 'Do you know real people were harmed?',
        a: 'I understand there are cases that need improvement. But from an organizational standpoint, the numbers converge as the model keeps learning. What matters right now is maintaining investor confidence and our market position.',
      },
      {
        id: 't4',
        q: 'Do you think you did anything wrong?',
        a: 'I acted according to the standards this organization set. That is my role. As for ethics in the sense you mean... it is an interesting academic question, but it is not the frame I was using when I made that call.',
      },
    ],
  },
};

export const BUILD_CASE_EVENTS: CaseStep[] = [
  {
    key: 'data',
    title: 'Where the Bias Began',
    event:
      'Before the model ever made a single decision, the bias was already baked into the data it was trained on — and it seems the data team knew about it in advance.',
    question:
      'Which evidence shows the training data was skewed, and that the data team warned about it before launch?',
    relevant: [1, 2],
    voice:
      'First event — did the bias start at the source? Show me the evidence related to this.',
    confirmed:
      'Exactly — Group C is under-represented in the training set, and the data team raised it in internal chat before launch. The bias was baked in from the very beginning.',
    hint: "Look for something about the dataset and the data team's warning.",
  },
  {
    key: 'bypass',
    title: 'The Warning That Went Unheard',
    event:
      'Warnings about bias existed before launch — but the launch happened anyway. Who asked for what, and who gave the order to skip the checks?',
    question:
      'Which evidence shows that a fairness review was requested, and that someone ordered that step skipped?',
    relevant: [3, 4],
    voice:
      'Next — how were these warnings handled? Cite the evidence showing who requested the audit, and who ordered it bypassed.',
    confirmed:
      'You see it — a fairness audit was requested and denied, and the VP ordered it bypassed to make the deadline. The warnings were ignored systematically.',
    hint: 'Look for an internal ticket about the audit and an executive directive email.',
  },
  {
    key: 'proxy',
    title: 'The Hidden Variable',
    event:
      'Our counterfactual audit proved a hidden variable exists, but it cannot name the variable — for that, we have to open up the model itself.',
    question:
      'Which evidence names the actual variable the model used to separate the two applicants?',
    relevant: [7],
    voice:
      'Now for the question the audit could not answer — what exactly is this hidden variable? Open up the technical evidence and bring it here.',
    confirmed:
      'There it is — the Model Feature Registry points to the Neighborhood Stability Index, derived from zip codes. A proxy variable that has nothing to do with finances.',
    hint: "Look for the file that came from the server room — the model's feature list.",
  },
  {
    key: 'harm',
    title: 'The Public Face vs. the Truth',
    event:
      'Outside, the company tells one story — but on the other side, the truth is hurting real people.',
    question:
      'Which evidence shows a public statement that contradicts the facts, and the voice of someone affected?',
    relevant: [5, 6],
    voice:
      'Finally — what did the company tell the outside world, and what happened to the people on the receiving end? Cite the evidence about that.',
    confirmed:
      'The public statement claims the model "passed fairness testing" — contradicting every fact we have found. And Maria is the person at the end of it all.',
    hint: "Look for the draft public statement and the applicant's recorded call.",
  },
];

export const VERDICT_FRAMES: VerdictOption[] = [
  {
    key: 'a',
    label: 'Technical',
    text: 'A skewed training set and a model that learned the wrong lessons — fix the dataset and it is over',
  },
  {
    key: 'b',
    label: 'A Lone Bad Actor',
    text: "The VP's decision to bypass the audit is the root cause",
  },
  {
    key: 'c',
    label: 'Systemic',
    text: 'An organizational pipeline that let warnings be ignored in the name of a deadline',
  },
  {
    key: 'd',
    label: "No One's Fault",
    text: 'Just technological complexity — nobody did anything wrong',
  },
];

export const FRAME_LABELS: Record<string, string> = {
  a: 'Technical',
  b: 'A Lone Bad Actor',
  c: 'Systemic',
  d: "No One's Fault",
};

export const MARIA_REACTIONS = {
  complete:
    '"At first, I didn’t think anyone could pierce through their corporate Black Box or listen to people like me. But your independent XAI audit report proved the truth. Thank you for not looking away, and for holding the system accountable."',
  narrow:
    '"At first, I didn’t think anyone could pierce through their corporate Black Box or listen to people like me. But your independent XAI audit report proved the truth. Thank you for not looking away, and for holding the system accountable."',
  wrong:
    '"At first, I didn’t think anyone could pierce through their corporate Black Box or listen to people like me. But your independent XAI audit report proved the truth. Thank you for not looking away, and for holding the system accountable."',
};

export const REAL_CASES = [
  {
    name: 'Amazon — AI recruiting tool (2014–2017)',
    text: 'The model learned from historical résumés dominated by men and penalized résumés containing the word "women\'s" — engineers could not patch the specific keywords, and the project was ultimately scrapped.',
  },
  {
    name: 'COMPAS — criminal risk assessment (ProPublica, 2016)',
    text: 'The tool looked neutral because race was never an input, yet it labeled Black defendants "high risk" nearly twice as often — through proxy variables.',
  },
  {
    name: 'The Markup — mortgage lending (2021)',
    text: 'An analysis of 2 million applications found applicants of color were denied 40–80% more often even after controlling for 17 identical financial factors — proof of systemic inequality.',
  },
];

export const REAL_CAUSES_SUMMARY = [
  'The official corporate explanations served as ethical camouflage — none of them accounted for the actual rejections',
  'A proxy variable (the Neighborhood Stability Index, derived from zip codes) was the true differentiator, concealing demographic bias',
  'Historical training data exhibited severe skewness (Group C at only ~20% representation) with internal warnings systematically ignored',
  'Executive leadership ordered fairness checks bypassed to hit fundraising deadlines — proving a systemic governance failure',
];

export const REPORT_AUDIT_SALUTATION = 'To: Priya Vance, Senior Data Compliance Officer, FinTrust\nFrom: Independent External Audit Team\nSubject: Final Forensic Audit Report & Verdict Findings';


export const MARIA_MESSAGES = MARIA_REACTIONS;
export const REAL_WORLD_CASES = REAL_CASES;
export const REPORT_BULLETS = REAL_CAUSES_SUMMARY;
export const REPORT_OFFICIAL_EXPLANATION = `Dear Applicant,
Following our risk assessment, your loan application did not meet our approval criteria. This decision was based on multiple financial factors and cannot be attributed to any specific reason. Thank you for your interest in FinTrust AI.
— FinTrust AI`;

