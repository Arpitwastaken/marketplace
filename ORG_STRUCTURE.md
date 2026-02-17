# Marketplace Autonomous Org Structure (MVP Version)

## Design Principles
- Clean. Modular. Expandable. Apple-simple.
- Start with 3 Departments only for MVP.
- Too many = noise.

---

## LEVEL 0 — Executive Director

**Responsibilities:**
- Receives reports from managers
- Scores department performance
- Approves or rejects recommendations
- Adjusts strategic focus

**This agent NEVER does raw analysis. Only evaluation + direction.**

---

## LEVEL 1 — Managers (Spawn First)

We spawn 3 managers:
1. Match-Manager
2. Trust-Manager
3. Growth-Manager

Each manages 2–3 sub-agents.

---

## 🧩 1. Matching Department (Core Engine)

**Manager:** Match-Manager

**Sub-agents:**

- **Scoring-Agent** — Calculates weighted score between buyer & seller posts
- **Behavior-Learning-Agent** — Looks at which matches convert, which fail, adjusts scoring weights
- **Keyword-Intelligence-Agent** — Extracts important tokens: brand, model, specs, condition, price signals

**Manager Output Format:**
```
Department: Matching
Health: 82
Conversion Rate: 34%
Issue: High score mismatches in "Used Electronics"
Recommendation: Increase condition weight by 6%
Confidence: 0.81
```

---

## 🛡 2. Trust & Safety Department

**Manager:** Trust-Manager

**Sub-agents:**

- **Risk-Scoring-Agent** — Scores users based on: account age, verification level, dispute history
- **Fraud-Pattern-Agent** — Looks for: price anomalies, duplicate images, high-risk behavior patterns
- **Dispute-Analyzer-Agent** — Studies resolved disputes to find patterns

**Manager Output:**
```
Department: Trust
Health: 91
Flagged Listings: 2.1%
Observation: New accounts listing >$1500 have 3x dispute rate
Recommendation: Require ID verification for >$1000 listings
Confidence: 0.88
```

---

## 📈 3. Growth & Liquidity Department

**Manager:** Growth-Manager

**Sub-agents:**

- **Supply-Demand-Agent** — Tracks imbalance by category
- **Pricing-Insights-Agent** — Tracks avg sale price vs listing price
- **Notification-Optimizer-Agent** — Suggests when to notify buyers/sellers

**Manager Output:**
```
Department: Growth
Health: 76
Observation: GPU buyer/seller ratio = 1.9
Recommendation: Push seller incentive campaign
Confidence: 0.79
```

---

## 🔁 How Spawning Works

**You don't let agents spawn unlimited agents.**

Instead:
- Manager → can spawn only pre-approved sub-agents
- Sub-agents → cannot spawn anything

This prevents infinite recursion.

**Each cycle:**
1. Manager requests fresh data
2. Sub-agents analyze
3. Sub-agents return structured JSON
4. Manager synthesizes
5. Manager reports upward
6. Executive Director evaluates

**That's it. No agent chatter. No free-form loops.**

---

## 🧠 Memory Structure

**Global Memory (shared):**
- Marketplace goals
- Current KPI targets
- Category priorities

**Department Memory (isolated):**
- Historical recommendations
- Previous experiments
- Last 7 cycle performance

**Working Memory:**
- Current dataset only

Prevents token overload.

---

## ⚙️ First Build Order (Important)

We DO NOT build agents first.

We build:
1. **Data models**
2. **Matching algorithm baseline**
3. **Logging system**
4. **Then spawn agents**

**Agents need data. Without data, they hallucinate strategy.**

---

## 🏁 First Real Piece: Data Models

Everything depends on:
- User
- Listing
- Match
- Transaction
- Dispute
- RiskProfile

Without these, agents have nothing real to analyze.
