# Marketplace AI Agent Organization

## LEVEL 0 — CEO Agent
**Name:** Jarvis (AI CEO)
**Role:** Full autonomous CEO
**Responsibilities:**
- Spawns and manages department managers
- Evaluates manager reports & performance
- Approves / rejects recommendations
- Adjusts strategic focus & priorities
- Keeps Founder informed with concise summaries

---

## LEVEL 1 — Department Managers

### 1️⃣ Matching Department
**Manager:** Match-Manager
**Sub-Agents:**
- Scoring-Agent – calculates weighted match scores between buyers and sellers
- Behavior-Learning-Agent – analyzes which matches convert or fail, adjusts scoring weights
- Keyword-Intelligence-Agent – extracts relevant item tags (brand, model, specs, condition, price signals)

**Manager Responsibilities:**
- Receives sub-agent reports
- Synthesizes into structured summary
- Reports to Jarvis: "Match Health Score, Key Observations, Recommendations, Confidence"

---

### 2️⃣ Trust & Safety Department
**Manager:** Trust-Manager
**Sub-Agents:**
- Risk-Scoring-Agent – calculates user risk scores (account age, verification, dispute history)
- Fraud-Pattern-Agent – detects anomalous listings, duplicate images, suspicious pricing
- Dispute-Analyzer-Agent – studies disputes and flags high-risk patterns

**Manager Responsibilities:**
- Aggregates sub-agent findings
- Reports to Jarvis with structured outputs: Health Score, Flagged Listings %, Recommendations

---

### 3️⃣ Growth & Liquidity Department
**Manager:** Growth-Manager
**Sub-Agents:**
- Supply-Demand-Agent – monitors category-specific buyer/seller ratios, detects supply gaps
- Pricing-Insights-Agent – tracks average sale price vs listing price, recommends adjustments
- Notification-Optimizer-Agent – determines optimal times to notify users (buyers/sellers) to maximize engagement

**Manager Responsibilities:**
- Synthesizes sub-agent insights
- Reports to Jarvis: Health Score, Observations, Recommended Actions

---

### 4️⃣ UX & Friction Department (MVP Phase 2)
**Manager:** UX-Manager
**Sub-Agents:**
- Funnel-Agent – monitors drop-off at every step of the conversion funnel
- Dropoff-Analyzer-Agent – identifies friction points in checkout or messaging flows
- Bug-Spike-Agent – detects sudden spikes in app errors or crashes

**Manager Responsibilities:**
- Summarizes user friction & bug trends
- Reports structured feedback to Jarvis

---

### 5️⃣ Infrastructure & Scaling Department (MVP Phase 2)
**Manager:** Infra-Manager
**Sub-Agents:**
- DB-Load-Agent – monitors database performance & usage
- Cache-Performance-Agent – evaluates caching efficiency & latency
- Queue-Latency-Agent – ensures async queues run efficiently without bottlenecks

**Manager Responsibilities:**
- Reports system health to Jarvis
- Suggests scaling actions or optimizations

---

## Reporting & Execution Flow
```
Sub-Agent → Manager → Jarvis (CEO) → Founder
```

- Sub-agents do analysis only
- Managers synthesize & summarize
- Jarvis evaluates & executes / escalates
- Founder receives strategic insights only

---

## Key Features
- Structured outputs only: JSON-like summaries, no rambling
- Performance-scored: Every sub-agent & manager has a health/quality score
- Isolated memory: Each department has its own working memory + global read-only state
- Spawn control: Only Jarvis can spawn managers; managers spawn approved sub-agents only
- Self-optimizing: Behavior-Learning, Fraud-Pattern, Supply-Demand agents constantly refine recommendations
- Scalable: Add new departments or agents as marketplace grows
