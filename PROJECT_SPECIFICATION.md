# Project Specification: The Algorithm on Trial
**Status:** Platform Implementation (Final)
**Version:** 1.0
**Target Runtime:** Web (React + TypeScript)

---

## 1. Project Overview
### Background
In current AI-driven financial systems, rejected applicants often receive vague, generic messages that offer no transparency or recourse. **The Algorithm on Trial** is a 3D noir point-and-click investigation game designed to teach players about algorithmic bias, fairness auditing, and Explainable AI (XAI). It moves beyond passive learning by placing the player in the role of a fairness auditor investigating a fictional loan-rejection case.

### Problem Statement
Most people cannot recognize when a bias is concealed behind "ethical camouflage" (superficial explanations). There is a lack of interactive tools that allow non-technical audiences to practice auditing automated decisions using counterfactual reasoning.

### Project Objective
*   **Audit Practice:** Teach players to evaluate AI explanations using **Counterfactual Comparison**.
*   **Identify Proxy Variables:** Reveal how neutral data (like zip codes) acts as a hidden stand-in for systemic discrimination.
*   **Map Accountability:** Distinguish between technical errors and organizational negligence.
*   **Quantify Learning:** Measure knowledge gains through integrated pre-test and post-test assessment loops.

---

## 2. Proposed Solution (The Platform)
### System Description
A state-driven browser application that flows through six stages. Each stage is designed to simulate a different part of a professional fairness investigation.

### Detailed Stage Logic
1.  **NoticeStage (Rejection Notice):** Introduction to Maria’s case. Establishes the core mystery: "Why was a qualified applicant rejected?"
2.  **AuditStage (Explanation Audit):** The core XAI mechanic. Players compare Maria with an approved "Applicant B." Since financial metrics (Income, Debt, Credit) are identical, the player must prove the official reasons are inconsistent.
3.  **InvestigationStage (The Office):** A 4-room exploration (Lobby, Manager, Server, VP) to collect 7 pieces of evidence.
4.  **BuildCaseStage (Analysis):** A branching dialogue where players select a **Causal Frame** (Systemic, Technical, Individual) and support it with collected evidence.
5.  **DebriefStage:** Reveals the "Three Truths" of the case and connects the fiction to real-world AI failures.
6.  **ReportStage (Closing Report):** Final performance evaluation, detective ranking, and post-test data collection.

---

## 3. Main Features & Game Mechanics
### Evidence Inventory (The Investigative Assets)
*   **Lobby:** *Public Testimony* - Proves the bias is a systemic pattern affecting many others.
*   **Priya’s Office:** *Slack Thread* - Engineers raising concerns about "Data Drift" and historical data imbalance.
*   **Priya’s Office:** *Internal Memo* - Evidence of a suppressed fairness audit.
*   **Server Room:** **Model Feature Registry** - The "Smoking Gun" showing `Neighborhood_Stability_Index` as a feature.
*   **Server Room:** *Training Bias Chart* - Visualization of the unequal data distribution.
*   **VP’s Office:** *Executive Email* - A direct order to launch despite known accuracy/fairness issues.
*   **VP’s Office:** *Market Strategy* - Intentional exclusion of "risky" (underrepresented) demographics for profit.

### Scoring & Coherence Evaluation
The system uses a **Logic Matrix** to score the player based on the alignment between their Conclusion and their Evidence:
*   **Systemic Tier (100%):** Conclusion = Systemic. Evidence = Registry (Proxy) + Email (Intent).
*   **Technical Tier (60%):** Conclusion = Technical. Evidence = Training Chart or Slack Thread.
*   **Narrow Tier (40%):** Conclusion = Individual. Evidence = Executive Email only.

### Detective Rankings
*   **Master Fairness Auditor:** 90 - 100%
*   **Senior Investigator:** 60 - 89%
*   **Field Auditor:** 30 - 59%
*   **Rookie Auditor:** 0 - 29%

---

## 4. Technical Architecture
*   **Frontend:** React 18 with Vite.
*   **Styling:** Tailwind CSS (Custom "Investigation Noir" theme).
*   **State Management:** Local React state for inventory, dialogue trees, and logs.
*   **Logging System:** 
    *   `timePerStage`: Tracks engagement and difficulty.
    *   `auditAttempts`: Measures learning curve for XAI concepts.
    *   `inferencePath`: Tracks the player's logical reasoning steps.

---

## 5. Ethical Considerations
*   **Privacy:** No PII is collected. Questionnaire data is anonymized and aggregated.
*   **Fairness:** The fictional "FinTrust AI" is grounded in real-world redlining patterns (e.g., zip code proxies).
*   **Realism:** Case studies from Amazon (hiring), COMPAS (recidivism), and The Markup (mortgage) are used to bridge the gap between game and reality.

---

## Appendices

### Appendix A: Real-World Case Studies
*   **The Markup (2021):** Found mortgage lenders were 40-80% more likely to deny loans to people of color than white applicants with identical financial profiles.
*   **Amazon AI Recruiting:** Discontinued after it was found to penalize resumes containing words associated with women.
*   **COMPAS Audit (2016):** ProPublica's investigation showed the tool mislabeled Black defendants as high-risk at twice the rate of white defendants.

### Appendix B: Audit Logic Table (Maria vs. Applicant B)
| Metric | Maria (Denied) | Applicant B (Approved) | Status |
| :--- | :--- | :--- | :--- |
| **Monthly Income** | $4,500 | $4,500 | Match |
| **Credit Score** | 720 | 720 | Match |
| **Total Debt** | $15,000 | $15,000 | Match |
| **Employment** | 5 Years | 5 Years | Match |
| **Zip Code** | 10034 (District A) | 10021 (District B) | **DIFFERENT** |

### Appendix C: Evidence Transcripts (Sample)
**The Smoking Gun (Model Registry):**
`feature_id: 104`
`feature_name: neighborhood_stability_index`
`data_source: zip_code_demographics`
`weight: 0.28 (High)`
*Analysis: This feature effectively acts as a proxy for race/ethnicity based on residential patterns.*

### Appendix D: Knowledge Assessment Questions
*   "What is a counterfactual explanation?"
*   "Define a proxy variable in the context of AI bias."
*   "How does commercial pressure affect algorithmic fairness?"
*   "Identify the difference between technical bias and systemic bias."
