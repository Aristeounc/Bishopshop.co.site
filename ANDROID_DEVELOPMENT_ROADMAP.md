# Attune AI — Android Development Roadmap & Strategy

**Status:** Pre-Development Planning  
**Target Launch:** Q3 2026  
**Primary Goal:** Full feature parity with iOS on Google Play Store  

---

## Executive Summary

Attune AI is currently available exclusively on iOS ($9.99/month subscription). This roadmap outlines the strategy to bring Attune AI to Android, targeting:

- **20-30% user base expansion** within first 6 months
- **Full feature parity** with iOS app
- **Google Play Store** as primary distribution channel
- **Material Design 3** compliance for native Android feel
- **Simultaneous monetization** through Google Play Billing

---

## Section 1: Current State Assessment

### Existing iOS App (6761643196)
**Known Features:**
- AI sparring with 6 personas (Charmer, Closer, Guilt-Tripper, Stonewaller, Authority, Negotiator)
- 8 ELO skill tracks with real-time scoring
- 5 badge progression tiers (Emerging → Master)
- Real-time coach feedback
- Spot-the-Influence mode
- Scenario-based training (salary negotiation, sales, conflict resolution, etc.)
- Humane subscription model with freeze slots
- Session history and progress tracking

**Technical Stack:** (Likely)
- React Native OR Flutter OR Native Swift
- Firebase backend for real-time features
- WebSocket for AI sparring communication
- In-app purchase via Apple StoreKit
- Push notifications (APNs)

---

## Section 2: Development Approach Decision Matrix

### Option A: React Native (Recommended for Timeline & Budget)

**Pros:**
- ✅ Share 60-70% codebase with iOS
- ✅ Faster development (5-6 months vs 8-10)
- ✅ Single team manages both platforms
- ✅ Faster iteration cycles
- ✅ Lower initial development cost

**Cons:**
- ❌ Performance overhead vs native
- ❌ Platform-specific bugs harder to debug
- ❌ Material Design implementation less polished
- ❌ Audio/video handling less optimized

**Cost:** $120K-180K for Android team + 50% iOS team overlap  
**Timeline:** 5-6 months to feature parity  
**Recommendation:** ⭐⭐⭐⭐ (Best for Attune AI's timeline)

---

### Option B: Native Android (Kotlin)

**Pros:**
- ✅ Best performance and responsiveness
- ✅ Seamless Material Design 3 implementation
- ✅ Native APIs for audio/video recording
- ✅ Best platform integration
- ✅ Future-proof for Android-only features

**Cons:**
- ❌ Separate codebase = 2x development time
- ❌ Longer timeline (8-10 months)
- ❌ Higher ongoing maintenance
- ❌ Larger team required

**Cost:** $200K-280K for dedicated Android team  
**Timeline:** 8-10 months to feature parity  
**Recommendation:** ⭐⭐⭐ (Best for quality, slower)

---

### Option C: Flutter

**Pros:**
- ✅ Single codebase for iOS and Android
- ✅ Excellent performance (near-native)
- ✅ Beautiful Material Design 3 support
- ✅ Fast hot reload for development
- ✅ Growing Google support

**Cons:**
- ❌ Would require iOS rewrite (risky mid-product)
- ❌ Smaller ecosystem than React Native
- ❌ Fewer enterprise libraries
- ❌ Not suitable for existing iOS app

**Cost:** $250K+ for rewrite + new Android development  
**Timeline:** 10-12 months (includes iOS rewrite)  
**Recommendation:** ⭐⭐ (Too disruptive for existing iOS app)

---

### **Recommended Approach: React Native**

**Rationale:**
1. Fastest path to market (5-6 months)
2. Can leverage existing iOS codebase
3. Smaller team requirement
4. Lower initial budget
5. Aligns with current product velocity

---

## Section 3: Android-Specific Feature Implementation

### 3.1 Core App Features Porting

| Feature | iOS Status | Android Approach | Effort | Notes |
|---------|-----------|-----------------|--------|-------|
| **AI Sparring** | ✅ Full | WebSocket re-use | Low | Share same backend |
| **ELO Scoring** | ✅ Full | Firebase re-use | Low | No changes needed |
| **Badge System** | ✅ Full | UI adaptation | Low | Same logic, Material styling |
| **Real-time Coach Feedback** | ✅ Full | WebSocket re-use | Low | No backend changes |
| **Spot-the-Influence Mode** | ✅ Full | Material UI | Medium | Video playback optimization |
| **Session Recording** | ✅ Full | MediaRecorder API | Medium | Android audio/video capture |
| **Push Notifications** | ✅ Full | Firebase Cloud Messaging | Low | Same service, diff setup |
| **In-app Purchases** | ✅ Full | Google Play Billing v7 | Medium | Different API, similar flow |
| **Freeze Slots** | ✅ Full | Business logic re-use | Low | No changes needed |

### 3.2 Material Design 3 Adaptation

**Color Palette Mapping:**
- Primary (Attune Blue #1F5BA8) → Material Primary Blue
- Accent (Yellow #F2C744) → Material Tertiary Gold
- Success (Green #51cf66) → Material Tertiary Green
- Error (Red #ff6b6b) → Material Error Red

**Component Styling:**
- Buttons: Material filled, outlined, text variants
- Cards: Material card elevation (1-3)
- Input Fields: Material underline or filled styles
- Navigation: Bottom navigation for main tabs
- Dialogs: Material dialog for modals
- FABs: Floating Action Button for primary CTA

---

## Section 4: Google Play Store Requirements & Checklist

### 4.1 Pre-Launch Checklist

**Developer Account Setup:**
- [ ] Google Play Developer account ($25 one-time fee)
- [ ] Merchant Center account for payments
- [ ] Firebase project linked
- [ ] Google Analytics 4 configured
- [ ] Firebase Crashlytics enabled

**App Signing & Security:**
- [ ] Generate app signing key (RSA 2048)
- [ ] Store key securely (do NOT commit to git)
- [ ] Configure key in build pipeline
- [ ] Implement certificate pinning (optional but recommended)

**Metadata Preparation:**
- [ ] App title (50 characters max)
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)
- [ ] Screenshots (min 2, max 8 per language)
  - 1080x1920px minimum
  - Show key features (sparring, feedback, badges)
- [ ] Feature graphic (1024x500px)
- [ ] Icon (512x512px, high quality)
- [ ] Promo video (30-60 seconds, optional)

**Content Rating Questionnaire:**
- [ ] Answer Google Play content questions
- [ ] Get IARC rating (automatic)
- [ ] Common rating: 12+ (no violence, mild themes)

**Store Listing:**
- [ ] Category: Education
- [ ] Content rating: Teen (ESRB) / 12+ (IARC)
- [ ] Target audience: Education
- [ ] Requires authentication: Yes (subscription)

### 4.2 Technical Requirements

**Manifest & Permissions:**
```xml
<!-- Required Permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" /> <!-- Sparring -->
<uses-permission android:name="android.permission.CAMERA" /> <!-- Video feedback (optional) -->

<!-- Optional Permissions -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Target API Level -->
<uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />

<!-- Device Features -->
<uses-feature android:name="android.hardware.microphone" android:required="false" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

**Minimum Device Requirements:**
- Minimum SDK: Android 7.0 (API 24)
- Target SDK: Android 14 (API 34)
- RAM: 2GB minimum, 4GB recommended
- Storage: 100MB minimum available
- Screen sizes: All (phones, tablets)
- Orientations: Portrait + Landscape

**Security & Privacy:**
- [ ] Privacy Policy URL (required)
- [ ] Terms of Service URL
- [ ] Data handling disclosure
  - Collect user data for personalization
  - Collect audio for sparring sessions
  - Explain data retention policies
- [ ] Request minimal permissions
- [ ] Implement proper permission handling (runtime permissions)

### 4.3 Policy Compliance

**Content Policy Review Areas:**
- ✅ Educational focus is compliant
- ✅ No violence, explicit content, or hate speech
- ✅ No deceptive practices or misleading ads
- ⚠️ Be careful with AI marketing (don't claim medical benefits)
- ✅ Transparent subscription terms required
- ✅ Cancellation must be easy (in-app settings)

**Common Rejection Reasons to Avoid:**
1. ❌ Crashes on launch (thoroughly test)
2. ❌ Poor or deceptive app quality
3. ❌ Misleading screenshots or description
4. ❌ Missing privacy policy
5. ❌ Hard to cancel subscription
6. ❌ Misleading ads or in-app purchases
7. ❌ Requires phone call to unsubscribe

---

## Section 5: Development Timeline & Phases

### Phase 1: Setup & Architecture (Weeks 1-2)
- [ ] React Native environment setup
- [ ] Firebase Android project configuration
- [ ] Google Play Console account setup
- [ ] Design system (Material Design 3 tokens)
- [ ] CI/CD pipeline setup (GitHub Actions or Fastlane)

**Deliverables:**
- Development environment ready
- First "Hello World" app building
- Firebase connected
- CI/CD pipeline working

### Phase 2: Core Features (Weeks 3-10)
- [ ] Authentication & subscription
- [ ] AI sparring interface
- [ ] ELO scoring system
- [ ] Badge progression system
- [ ] Real-time coach feedback
- [ ] Session recording (audio)
- [ ] Basic UI/UX

**Deliverables:**
- Core sparring functionality working
- Scoring and badges calculating correctly
- Sessions saving and retrieving

### Phase 3: Polish & Material Design (Weeks 11-14)
- [ ] Material Design 3 implementation
- [ ] Animation refinement
- [ ] Dark mode support
- [ ] Accessibility (a11y)
- [ ] Performance optimization

**Deliverables:**
- Professional Material Design UI
- Smooth animations
- Dark mode working
- Meets accessibility standards

### Phase 4: Testing & QA (Weeks 15-18)
- [ ] Unit testing (70%+ coverage)
- [ ] Integration testing
- [ ] E2E testing (key flows)
- [ ] Device testing (10-15 real devices)
- [ ] Beta testing program (TestFlight equivalent)
- [ ] Crash testing and stability

**Deliverables:**
- Test reports
- Bug fixes
- Performance metrics
- Stability verified

### Phase 5: Beta & Submission (Weeks 19-22)
- [ ] Closed beta (Google Play Console)
- [ ] Open beta (500+ testers)
- [ ] Feedback collection and fixes
- [ ] Google Play listing optimization
- [ ] App Store assets finalization
- [ ] Submission & review

**Deliverables:**
- Published on Google Play Store
- Live in 50+ countries
- Monitoring active

**Total Timeline: 5-6 months (22 weeks)**

---

## Section 6: Team & Resource Requirements

### 6.1 Recommended Team Structure

**Core Team (4-5 people):**

1. **Android/React Native Lead** (1 FTE)
   - Experience: 5+ years mobile development
   - Skills: React Native, Kotlin, Firebase
   - Cost: $120K-150K/year
   - Role: Architecture, code review, performance

2. **Android Developer** (2 FTE)
   - Experience: 3+ years Android development
   - Skills: React Native, Material Design, APIs
   - Cost: $100K-130K/year each
   - Role: Feature implementation, bug fixes

3. **QA/Testing Engineer** (1 FTE)
   - Experience: 3+ years mobile QA
   - Skills: Test automation, device testing, Google Play Console
   - Cost: $80K-110K/year
   - Role: Testing, crash reporting, performance

4. **DevOps/CI-CD Engineer** (0.5 FTE, shared)
   - Experience: 2+ years CI/CD
   - Skills: GitHub Actions, Fastlane, App Signing
   - Cost: $40K/year (shared)
   - Role: Build pipeline, deployment automation

**Optional Support:**
- Product Manager (0.5 FTE, shared with iOS)
- Designer (0.5 FTE, for Material Design refinement)
- Backend Engineer (0.25 FTE, for Android-specific APIs)

### 6.2 Budget Estimate

**Development Costs:**
```
Android Lead (1 FTE x 6 mo)      = $60,000
Android Dev #1 (1 FTE x 6 mo)    = $50,000
Android Dev #2 (1 FTE x 6 mo)    = $50,000
QA Engineer (1 FTE x 6 mo)       = $40,000
DevOps (0.5 FTE x 6 mo)          = $20,000
Product/Design (0.5 FTE x 6 mo)  = $20,000
───────────────────────────────────────────
Subtotal (Salaries)              = $240,000
```

**Infrastructure & Tools:**
```
Firebase (Sparking, Realtime DB) = $1,500/mo = $9,000
Testing tools (Firebase Test Lab) = $500/mo = $3,000
Google Play Developer fee        = $25 (one-time)
Code signing certificates        = $200/year
Analytics & Monitoring           = $500/mo = $3,000
───────────────────────────────────────────
Subtotal (Infrastructure)        = $15,225
```

**Contingency & Overhead:**
```
Contingency (20%)                = $48,000
───────────────────────────────────────────
TOTAL PROJECT COST              = ~$303,225
```

**Monthly Run Rate (Post-Launch):**
- Team maintenance: $15,000/month
- Infrastructure: $2,500/month
- Tools/services: $1,000/month
- **Total: $18,500/month**

---

## Section 7: Revenue Projections

### 7.1 Monetization Strategy

**Subscription Model (Match iOS):**
- Basic Plan: $9.99/month
- Premium Plan: $14.99/month (add-ons)
- Annual Plans: 20% discount

**Payment Processing:**
- Google Play Billing v7 (standard)
- Handles subscription management
- Automatic renewal with grace periods
- 15% + $0.30 processing fee

### 7.2 Growth Assumptions

**Conservative Scenario (Year 1):**
```
Month 1-2:    500 downloads, 2% conversion = 10 subscribers
Month 3-4:    2,000 downloads, 3% conversion = 60 subscribers
Month 5-6:    5,000 downloads, 4% conversion = 200 subscribers
Month 7-9:    10,000 downloads, 5% conversion = 500 subscribers
Month 10-12:  15,000 downloads, 6% conversion = 900 subscribers

Year 1 Total: ~50,000 downloads, ~1,400 active subscribers
Average Revenue: $2,000/month by Q4
Annual Revenue: ~$20,000
```

**Optimistic Scenario (Year 1):**
```
Month 1-2:    2,000 downloads, 4% conversion = 80 subscribers
Month 3-4:    8,000 downloads, 5% conversion = 400 subscribers
Month 5-6:    20,000 downloads, 6% conversion = 1,200 subscribers
Month 7-9:    40,000 downloads, 7% conversion = 2,800 subscribers
Month 10-12:  60,000 downloads, 8% conversion = 4,800 subscribers

Year 1 Total: ~200,000 downloads, ~6,000 active subscribers
Average Revenue: $15,000/month by Q4
Annual Revenue: ~$100,000
```

**Break-even Analysis:**
- Development cost: $303,225
- Monthly run rate: $18,500
- Conservative scenario: 21 months to break-even
- Optimistic scenario: 4 months to break-even

---

## Section 8: Risk Assessment & Mitigation

### High Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **App Store Rejection** | 4-6 week delay | Medium | Thorough policy review, legal review of terms |
| **Performance Issues** | User churn | Medium | Early performance testing, Firebase Test Lab |
| **Feature Parity Gaps** | Negative reviews | Medium | Feature checklist, beta testing feedback |
| **Subscription Integration** | Revenue loss | Low | Thorough testing of purchase flow |
| **Audio/Video Bugs** | Core feature broken | Medium | Extensive device testing, automated tests |

### Medium Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Device Fragmentation** | 20-30% of users affected | Medium | Test on 15+ device/OS combinations |
| **Android Version Lag** | 10% of downloads rejected | Medium | Min SDK 24, gradual new API adoption |
| **Firebase Scale** | Cost overruns | Low | Monitor usage, set alerts at 80% |
| **User Acquisition Costs** | Lower ROI | Medium | Organic growth strategy, ASO |

---

## Section 9: Success Metrics & KPIs

### Engagement Metrics

**Target by End of Year 1:**
- 50,000-200,000 total downloads
- 5-8% conversion to paid subscribers
- 2,500-6,000 active monthly subscribers
- 40%+ monthly retention rate
- 4.3+ star rating (1,000+ reviews)

### Financial Metrics

**Target by End of Year 1:**
- $20,000-$100,000 annual revenue
- $1,500-$8,000 monthly recurring revenue (MRR)
- 30%+ gross margin after payment processing
- 6-18 months to profitability

### Quality Metrics

**Target:**
- <0.5% crash rate
- <2% ANR (App Not Responding) rate
- 99% uptime for backend services
- Average session length: 20-30 minutes
- Daily active user ratio: 35-45%

---

## Section 10: Post-Launch Strategy

### Weeks 1-4 (Immediate Post-Launch)
- [ ] Monitor crash reports daily
- [ ] Respond to user reviews
- [ ] Fix critical bugs (24-48 hour turnaround)
- [ ] Gather initial user feedback
- [ ] Optimize app store listing based on trends

### Months 2-3 (Growth Phase)
- [ ] Release v1.1 with polish/fixes
- [ ] Begin marketing push (ASO, PR, social)
- [ ] Add Android-exclusive features (Google Assistant integration?)
- [ ] Expand beta testing program
- [ ] Analyze user cohorts and retention

### Months 4-6 (Scaling Phase)
- [ ] Localization (Spanish, Mandarin, French)
- [ ] Additional sparring personas
- [ ] Advanced reporting/analytics features
- [ ] Expand to tablets (landscape mode)
- [ ] Consider A/B testing framework

### Months 7-12 (Optimization Phase)
- [ ] Performance optimization
- [ ] Feature parity with iOS plus Android exclusives
- [ ] Enterprise features (team/organization management)
- [ ] Expanded integrations (Google Fit, Calendar, etc.)
- [ ] Plan for v2.0

---

## Section 11: Decision & Next Steps

### Recommendation: **Proceed with React Native approach, Target Q2-Q3 2026 launch**

**Rationale:**
1. **Speed**: 5-6 month timeline fits product roadmap
2. **Cost**: ~$300K development vs $500K+ for native
3. **Quality**: React Native mature enough for educational app
4. **Team**: Leverages existing iOS team knowledge
5. **Scalability**: Codebase will support future features

### Immediate Next Steps (Next 2 Weeks)

1. [ ] **Secure Stakeholder Buy-in**
   - Present to leadership
   - Confirm $300K+ budget allocation
   - Lock in team assignments

2. [ ] **Technical Validation**
   - Spike: Build React Native proof-of-concept
   - Test Firebase compatibility
   - Validate audio/video capture APIs
   - Performance test on low-end devices

3. [ ] **Legal & Compliance**
   - Review Google Play policies
   - Prepare privacy policy for Android
   - Consult on subscription terms
   - Plan data handling disclosures

4. [ ] **Infrastructure Setup**
   - Firebase Android project
   - Google Play Console account
   - CI/CD pipeline planning
   - App signing key generation

5. [ ] **Team Onboarding**
   - Hire React Native lead
   - Start Android developers recruitment
   - QA engineer assignment
   - Design system handoff

---

## Appendix A: Device Testing Matrix

**Recommended Devices (15 devices minimum):**

**Low-End (2GB RAM):**
- Samsung Galaxy A11
- Motorola Moto G Power
- realme C15

**Mid-Range (4-6GB RAM):**
- Google Pixel 5a
- Samsung Galaxy A51
- OnePlus 9
- Motorola One Zoom

**High-End (8GB+ RAM):**
- Google Pixel 7
- Samsung Galaxy S22
- OnePlus 11
- OPPO Find X3

**Tablets:**
- Samsung Galaxy Tab S7
- iPad Air (if required)

**OS Versions:**
- Android 7.0 (API 24) - Minimum
- Android 10 (API 29)
- Android 12 (API 31)
- Android 14 (API 34) - Latest

---

## Appendix B: Resources & References

**Official Documentation:**
- [Google Play Console Help](https://support.google.com/googleplay)
- [Android Developer Guide](https://developer.android.com)
- [Material Design 3](https://m3.material.io)
- [React Native Documentation](https://reactnative.dev)
- [Firebase for Android](https://firebase.google.com/docs/android/setup)

**Tools & Services:**
- Google Play Console
- Firebase Test Lab
- Firebase Crashlytics
- Android Studio
- Firebase Emulator Suite
- Fastlane (automation)

**Learning Resources:**
- Google Play Academy
- Android Development course (Udacity/Coursera)
- React Native fundamentals
- Material Design principles

---

**Document Status:** Draft - Ready for Stakeholder Review  
**Last Updated:** June 18, 2026  
**Next Review:** Upon stakeholder approval
