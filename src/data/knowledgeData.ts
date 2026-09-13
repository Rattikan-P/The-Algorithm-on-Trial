export interface KnowledgeConcept {
  id: string;
  term: string;
  category: string;
  definition: string;
  caseApplication: string;
  takeaway: string;
}

export const KNOWLEDGE_CONCEPTS: KnowledgeConcept[] = [
  {
    id: 'proxy-variable',
    term: 'Proxy Variable (Digital Redlining)',
    category: 'AI Bias & Fairness',
    definition:
      'A feature that seems neutral on paper (like postal zip code) but strongly mirrors sensitive data (like race, neighborhood income, or social background). The AI ends up discriminating without ever looking at the protected label.',
    caseApplication:
      'FinTrust claimed they never looked at demographics. But their "Neighborhood Stability Index" was mapped directly from zip codes, secretly disqualifying applicants from minority neighborhoods.',
    takeaway:
      'Removing sensitive labels (race, gender) is not enough. Models easily find proxy features that act as hidden stand-ins.',
  },
  {
    id: 'representation-bias',
    term: 'Representation Bias (Training Data Skew)',
    category: 'Data Quality',
    definition:
      'When certain groups are underrepresented in the training data, the AI fails to learn their patterns accurately and produces much higher error and rejection rates for them.',
    caseApplication:
      'FinTrust trained their loan model on historical loans where Group C made up only ~20% of samples. The AI learned to view Group C as inherently higher risk.',
    takeaway:
      'An AI is only as fair as the history it was trained on. Imbalanced training data leads to automated inequality.',
  },
  {
    id: 'counterfactual',
    term: 'Counterfactual Explanation',
    category: 'Explainable AI (XAI)',
    definition:
      'An explanation method that asks: "What is the minimum change required to flip the AI’s decision from rejected to approved?" It allows applicants to see what truly drove the decision.',
    caseApplication:
      'Our audit matched Maria with Applicant B (who was approved). Both had identical financial numbers. The only difference that flipped the decision was the zip code.',
    takeaway:
      'Counterfactual testing proves whether an AI decision is based on real merits or arbitrary bias.',
  },
  {
    id: 'ethical-camouflage',
    term: 'Ethical Camouflage & The Right to Explanation',
    category: 'Transparency & Rights',
    definition:
      'When organizations hide behind vague automated statements (e.g. "complex combination of factors") to avoid accountability and prevent users from challenging unfair decisions.',
    caseApplication:
      'FinTrust sent Maria a generic list of standard financial reasons that could not distinguish her from approved peers. It was a camouflage to conceal the zip code penalty.',
    takeaway:
      'Under modern AI laws (EU AI Act, GDPR), people have a right to meaningful, contestable explanations—not black-box excuses.',
  },
  {
    id: 'systemic-accountability',
    term: 'Systemic Accountability & Fairness Auditing',
    category: 'AI Governance',
    definition:
      'Recognizing that AI harm is rarely just a "coding bug" or one engineer’s fault. It is usually caused by organizational pressure, rushed launches, and leadership bypassing safety audits.',
    caseApplication:
      'Marcus and Priya warned about unfair error rates. But executives bypassed the audit to meet investor deadlines for the Series C funding round.',
    takeaway:
      'Ethical AI requires organizational checks and balances. Executives and institutions must remain accountable for what their algorithms do.',
  },
];
