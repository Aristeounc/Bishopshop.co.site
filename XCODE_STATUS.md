# Attune AI: Xcode Project Status

## Current State

**Platform:** iOS (Swift, SwiftUI)  
**Minimum Target:** iOS 15.0+  
**Latest Build:** In Active Development  
**Status:** Beta Phase → Public Release

---

## Core Modules (Production)

### 1. Authentication & Onboarding
- ✅ Sign-up flow (Apple ID, Email)
- ✅ Subscription management (RevenueCat integration)
- ✅ User profile setup
- ✅ Belt progression initialization
- **Status:** Production-Ready

### 2. Today's Program (Daily Gym Loop)
- ✅ Warm-up phase (concept review UI)
- ✅ Drill phase (focused micro-exercises)
- ✅ Sparring phase (live AI interaction)
- ✅ Recovery phase (coach debrief & ELO update)
- **Status:** Production-Ready

### 3. AI Sparring Engine
- ✅ Persona system (6 characters)
  - The Charmer (Influence Defense)
  - The Closer (Urgency Resistance)
  - The Guilt-Tripper (Emotional Grounding)
  - The Stonewaller (Engagement Skills)
  - The Authority (Confidence Building)
  - The Negotiator (Negotiation Skills)
- ✅ Real-time message streaming
- ✅ Context memory (vector embeddings via OpenAI)
- ⚠️ **In Progress:** Cold start optimization for first-time users
- **Status:** Near Production

### 4. Coach Feedback System
- ✅ Real-time evaluation after each exchange
- ✅ Technique scoring (4 dimensions)
- ✅ ELO update mechanism
- ⚠️ **In Progress:** Feedback clarity improvements based on user testing
- **Status:** Beta

### 5. ELO Skill Tracking
- ✅ 8 skill tracks implemented:
  1. Regulate (emotional self-management)
  2. Connect (active listening)
  3. Boundary (clarity & assertion)
  4. Influence (persuasion without coercion)
  5. Vulnerability (authentic presence)
  6. Negotiate (mutual gain)
  7. Close (decision facilitation)
  8. Recover (resilience & reflection)
- ✅ Belt progression (6 levels: White → Black)
- ✅ Leaderboard infrastructure (local only; global planned Q3)
- **Status:** Production-Ready

### 6. Curriculum Management
- ✅ Framework database (6 experts, 33+ concepts)
- ✅ Scenario library (100+ scenarios across 8 skill tracks)
- ✅ Daily refresh logic
- ⚠️ **In Progress:** Dynamic scenario selection based on ELO
- **Status:** Beta

---

## Advanced Features (Development)

### 7. Articulation Add-on Module
- 🔄 **In Progress**
- Three modes:
  - Gentle (scripted examples + guided practice)
  - Standard (minimal scaffolding, more freeform)
  - Intensive (high pressure, minimal support)
- Timeline: Release Target Q2 2026
- **Dependency:** Coach feedback refinement (see #4)

### 8. IntroProfiles Module
- 🔄 **In Progress**
- Context-aware intro builder
- Reusable profile templates
- Scenario-specific introductions
- Timeline: Release Target Q3 2026

### 9. Spot-the-Influence Mode
- 📋 **Planned**
- Watch pre-recorded scenarios
- Identify manipulation tactics in real-time
- Defense-awareness training
- Timeline: Release Target Q4 2026

### 10. Android Port
- 📋 **Planned**
- Kotlin/Jetpack Compose equivalent
- Shared backend (no API changes)
- Timeline: 2027

---

## Infrastructure & Dependencies

### Backend
- ✅ Node.js/Express API (authentication, ELO updates, scenario delivery)
- ✅ PostgreSQL (user data, ELO history, session logs)
- ✅ OpenAI API (GPT-4 for sparring & coach feedback)
- ✅ Vector database (Pinecone; context memory for coach)
- ✅ RevenueCat (subscription & App Store management)
- **Health:** All systems green

### Mobile
- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Networking:** URLSession + Combine
- **Local Storage:** Core Data (user preferences, offline fallbacks)
- **Analytics:** PostHog (ethical, privacy-first)
- **Push Notifications:** APNs (session reminders, coach feedback alerts)

---

## Known Issues & Roadmap

### High Priority
- **Cold Start Optimization:** First sparring session sometimes takes 3–4s for persona initialization. Target: < 1.5s. Fix in progress (lazy persona loading).
- **Offline Mode:** Currently requires connection. Planned offline drill module for Q3.

### Medium Priority
- **Coach Feedback Clarity:** Some users report feedback feels generic. In user testing iteration.
- **Dark Mode:** Currently light-only. Native dark mode coming Q2.
- **Accessibility:** VoiceOver support partial. Full WCAG 2.1 AA target Q3.

### Low Priority (Nice-to-Have)
- Apple Watch companion app (future)
- Siri Shortcuts integration (future)
- iCloud sync across devices (future)

---

## Testing Status

| Area | Unit Tests | Integration | E2E | Coverage |
|------|-----------|-------------|-----|----------|
| Auth | ✅ | ✅ | ✅ | 92% |
| Sparring Engine | ✅ | ✅ | ⚠️ | 81% |
| ELO System | ✅ | ✅ | ✅ | 95% |
| Coach Feedback | ✅ | ⚠️ | ⚠️ | 74% |
| UI Layer | ✅ | ⚠️ | ⚠️ | 62% |

**Overall App Coverage:** ~82%  
**Target for Release:** 85%+

---

## Release Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Public Beta (TestFlight) | June 2026 | 🟢 On Track |
| iOS App Store Release | July 2026 | 🟢 On Track |
| Articulation Add-on | Q2 2026 | 🟡 In Progress |
| IntroProfiles Module | Q3 2026 | 🟡 Planned |
| Spot-the-Influence | Q4 2026 | 🔵 Planning |
| Android Beta | Q1 2027 | 🔵 Planning |
| Android Release | Q2 2027 | 🔵 Planning |

---

## Last Updated

**Date:** June 9, 2026  
**Updated By:** Development Team  
**Next Review:** June 23, 2026

---

## Contact

For technical questions or feature requests:  
**Lead Engineer:** [Assigned via project management system]  
**Product Lead:** adam.bishop595@gmail.com  
**Support:** attuneai@bishopshop.co.site

---

## Build Commands (for reference)

```bash
# Build for device
xcodebuild -scheme AttuneAI -configuration Release -derivedDataPath ./build

# Run tests
xcodebuild test -scheme AttuneAI -configuration Debug

# Archive for submission
xcodebuild archive -scheme AttuneAI -configuration Release -archivePath ./AttuneAI.xcarchive
```

---

**Attune AI Development Team**  
Building the ethical conversation gym.
