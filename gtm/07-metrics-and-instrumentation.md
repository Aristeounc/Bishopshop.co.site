# 07 – Metrics & Instrumentation (Peitho)

## North Star Metric

Weekly Active Communicators – users who complete at least 1 Peitho-guided session per week.

## Core funnel metrics

### Acquisition
- Visitors to landing page (per channel)
- Visitor → signup conversion rate (target: >5%)
- Signups per week (by source: organic, Product Hunt, directory, DM)

### Activation
- % of new signups who complete 1 full Peitho session within 7 days (target: >30%)
- Time from signup to first session

### Retention
- % of users with 1+ session per week for 4 consecutive weeks (target: >15%)
- Day 7 retention rate
- Day 30 retention rate

### Revenue (when monetized)
- Free → paid conversion rate
- MRR and MRR growth rate
- Churn rate

## What to track and how

| Metric | Tool | Event name |
|---|---|---|
| Signup | Firebase / Posthog | user_signed_up |
| First session completed | Firebase / Posthog | session_completed |
| Session count per week | Firebase / Posthog | session_completed (aggregate) |
| Channel source | UTM params + analytics | utm_source |
| Upgrade to paid | Stripe webhook | subscription_created |

## Weekly review checklist

- [ ] How many new signups this week? From which channels?
- [ ] What % activated (completed first session)?
- [ ] Are retained users increasing or flat?
- [ ] Any drop-off in the funnel this week? Where?
- [ ] What one thing can we change to improve activation next week?
