# Self-Critique: What's Missing & What to Improve

## Data Models — Gaps

| Current | Missing |
|---------|---------|
| User | Verification tokens (email confirm, phone OTP) |
| User | Login sessions / refresh tokens |
| Listing | Draft state (before publish) |
| Listing | Bump/boost feature |
| Listing | Views count |
| Match | Why this match was suggested (reason) |
| Transaction | Payment method |
| Transaction | Escrow ledger entries |
| Transaction | Shipping carrier / tracking |
| RiskProfile | Historical snapshots |
| — | **Notification table** |
| — | **Message/Chat table** |
| — | **Admin user management** |
| — | **Category-specific rules** |

**Verdict:** Add Notification, Message, and Verification tables at minimum.

---

## Architecture — Gaps

- No API layer spec (REST? GraphQL?)
- No auth flow (JWT? Sessions?)
- No webhook handling for payments
- No external service integration points (Stripe, identity providers)
- No rate limiting defined

**Verdict:** Need API + Auth section before agents can do anything useful.

---

## MVP Features — Gaps

- **Search:** We have matching, but what about keyword search?
- **User Profiles:** No public profile pages
- **Admin Dashboard:** Who's managing flagged listings?
- **Onboarding:** What does a user actually see first?
- **Listicle UI:** How do they browse?

**Verdict:** The MVP is buyer/seller matching, but there's no "app" yet.

---

## What's Good

- Matching engine logic is solid
- Trust tier system is practical
- Escrow flow is clear
- Event logging will help agents learn
- Department structure is clean and expandable

---

## Priority Fix List

1. ✅ Data Models (mostly done)
2. ⚠️ Add: Notifications, Messages, Verification
3. ⚠️ Add: API Layer + Auth
4. ⚠️ Define: Matching Algorithm (code, not just weights)
5. ⬜ Then spawn agents

---

## What I'd Tell Myself

> "You built the skeleton. Now add:
> - The nervous system (notifications, messages)
> - The immune system (verification, fraud patterns)
> - The brain (matching algorithm code)
>
> Then let the agents run."

