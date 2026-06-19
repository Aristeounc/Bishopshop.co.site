# Attune AI — Android & Google Play Store Launch Strategy

**Date:** June 18, 2026  
**Product:** Attune AI Premium Communication Training Platform  
**Platforms:** iOS (Current) → Android (Target)  
**Status:** Strategic Planning & Implementation Roadmap

---

## Executive Summary

Attune AI is currently an iOS-exclusive subscription application ($9.99/month base tier) focused on communication skills training through AI sparring, guided frameworks, and badge-based skill progression. This document provides a comprehensive strategy for bringing the platform to Android and Google Play Store.

**Key Strategic Recommendation:** A **React Native approach** balances rapid time-to-market, code sharing across platforms, and native performance for real-time audio/video features. Alternative: Consider **Flutter** if maximum UI polish and startup time are critical.

---

## 1. CURRENT APP ARCHITECTURE & FEATURES

### 1.1 App Platform Status
- **Current Platform:** iOS (App Store)
- **App Store ID:** 6761643196
- **Company:** Bishop Shop Enterprises LLC
- **Publisher Email:** attuneai@bishopshop.co.site
- **Subscription Model:** Subscription-based with auto-renewal through App Store

### 1.2 Core Features to Port

#### Communication Training
- **AI Sparring Partners** — Real-time conversational roleplay with AI
- **8 Skill Tracks** — Distinct learning paths covering:
  - Negotiation
  - Conflict resolution
  - Influence without manipulation
  - High-stakes communication
  - NVC (Non-Violent Communication)
  - Reading context/emotional awareness
  - Reducing defensiveness
  - Additional specialized tracks

#### Performance Tracking
- **ELO Scoring System** — Dynamic rating system for each skill track
- **Badge Progression** — Visual achievement system to reward milestones
- **Training History** — Detailed records of sparring sessions

#### Content & Curriculum
- **Guided Frameworks** — Peer-reviewed behavioral science curriculum
- **Real-time Feedback** — AI-powered coaching during exercises
- **Multi-phase Exercises** — Structured learning progression

#### Technical Capabilities
- **Audio Recording** — Capture user responses during sparring
- **Microphone Input** — Real-time audio processing for AI responses
- **Session Persistence** — Save training progress
- **Cloud Sync** — Synchronize ELO scores, badges, and progress across devices
- **Push Notifications** — Training reminders and achievement notifications

### 1.3 Pricing Structure
- **Base Tier:** $9.99/month (mentioned in structured data)
- **Implied Higher Tiers:** $19–$32/month (referenced in design docs)
- **Billing:** Through App Store (iOS) or Google Play (Android)
- **Free Trial:** Offered (30 days likely)
- **Auto-Renewal:** Active subscription model

---

## 2. DEVELOPMENT APPROACH OPTIONS

### 2.1 Native Android (Kotlin)

**Pros:**
- Full control over Android APIs and performance
- Best access to device capabilities (microphone, camera, hardware)
- Superior battery optimization
- Fastest startup time (~200ms cold start)
- Maximum design flexibility and Material Design 3 fidelity

**Cons:**
- **Highest cost:** Full re-development, separate team
- Longest time-to-market (8–14 months for feature parity)
- Maintenance burden: Two separate codebases
- Slower iteration on shared features
- More difficult to maintain consistent UX between iOS and Android

**Estimated Team:** 4–6 engineers (native Android specialists)  
**Timeline:** 10–14 months for feature parity with iOS  
**Cost:** $350K–$600K USD (depending on team location)

### 2.2 React Native

**Pros:**
- **70–80% code sharing** between iOS and Android (business logic, UI components)
- **Faster time-to-market:** 6–9 months (vs. 10–14 for native)
- **Lower cost:** Single team works on both platforms
- Excellent for real-time audio/video (libraries like `react-native-webrtc`, `react-native-audio`)
- Hot reload development cycle (faster iteration)
- Mature ecosystem for subscription management

**Cons:**
- Performance overhead for audio/video (though acceptable for voice chat)
- Less direct access to Android-specific features
- Debugging can be complex (JS bridge latency)
- Requires skilled React Native developers (less common than native Android)
- Third-party library quality is inconsistent

**Critical Libraries:**
- `react-native-webrtc` — Audio/video streaming
- `react-native-audio-toolkit` or `react-native-sound` — Audio recording
- `@react-native-firebase/messaging` — Push notifications
- `react-native-in-app-purchase` — Google Play Billing
- `react-native-sqlite-storage` — Local data persistence

**Estimated Team:** 3–4 engineers (React Native + backend support)  
**Timeline:** 7–9 months for feature parity  
**Cost:** $200K–$350K USD

### 2.3 Flutter

**Pros:**
- **Up to 90% code sharing** (most efficient cross-platform option)
- Excellent startup performance (faster than React Native, approaching native)
- Material Design 3 built-in (perfect for Android target)
- Strong real-time capabilities with Dart/Flame engine
- Great developer experience (hot reload, excellent tooling)
- Single language across platform (Dart is simpler than JS + native)

**Cons:**
- Smaller ecosystem than React Native (fewer third-party packages)
- Dart language has steeper learning curve for teams familiar with JavaScript
- Less mature audio/video story (though improving rapidly)
- Smaller pool of Flutter developers vs. React Native
- Google's backing sometimes raises concerns about strategic direction

**Critical Packages:**
- `flutter_webrtc` — Audio/video streaming (excellent support)
- `record` or `flutter_sound` — Audio recording
- `firebase_messaging` — Push notifications
- `in_app_purchase` — Google Play Billing
- `sqflite` — Local SQLite database

**Estimated Team:** 2–3 engineers (Flutter specialists)  
**Timeline:** 6–8 months for feature parity  
**Cost:** $180K–$320K USD

---

### 2.4 RECOMMENDATION

**→ React Native is the optimal choice for Attune AI**

**Rationale:**
1. **Mature ecosystem** — Proven libraries for real-time audio/voice chat
2. **Faster than native** (7–9 months vs. 10–14)
3. **Cost-effective** — Lower team size, higher productivity
4. **Developer availability** — More React Native devs in market
5. **Real-time features** — Well-supported audio/video APIs
6. **Feature parity** — Can maintain identical UX on both platforms

**Alternative:** If Material Design 3 polish and startup performance are prioritized, **Flutter** is equally strong and slightly faster to market (6–8 months).

---

## 3. GOOGLE PLAY STORE REQUIREMENTS & PROCESS

### 3.1 Pre-Launch Checklist

#### Developer Account Setup
- [ ] Create Google Play Developer Account (one-time $25 fee)
- [ ] Link to Google Merchant Center (for payments/taxes)
- [ ] Set up signing key (Android App Signing via Play Console)
- [ ] Enable Google Play Billing Library v6+ (current standard)

#### App Configuration
- [ ] App bundle (AAB) or APK prepared in Release mode
- [ ] App signed with release key (not debug key)
- [ ] Minimum SDK: API 28 (Android 9.0) or higher recommended
- [ ] Target SDK: API 34+ (required as of Aug 2024)
- [ ] Name, description, screenshots (minimum 2, up to 8)
- [ ] Feature graphics (1024×500px)
- [ ] App icon (512×512px, must be exact)
- [ ] Privacy Policy URL
- [ ] Terms of Service URL

#### Content Ratings
- [ ] Submit IARC questionnaire (required for all apps)
- [ ] Classify app appropriateness (educational → likely "Everyone" or "Teen")
- [ ] Content rating from IARC generates ratings (PEGI, ESRB, etc.)

#### Store Listing
- [ ] App name (50 char max)
- [ ] Short description (80 char max)
- [ ] Full description (4,000 char max)
- [ ] Category: "Education" or "Productivity"
- [ ] Target audience specification
- [ ] Accessibility features documented

### 3.2 Submission Review Process

**Timeline:** 1–4 hours for review (expedited), typically completed within 2 business days

**Common Rejection Reasons:**
1. **Payments Policy Violations**
   - Ensure free trial terms are clearly disclosed
   - Auto-renewal cancellation must be accessible in-app or via device settings (✓ Attune already compliant)
   
2. **Permission Requirements**
   - `RECORD_AUDIO` — Required for sparring (justify on store listing)
   - `ACCESS_FINE_LOCATION` — Not needed (remove if present)
   - `WRITE_EXTERNAL_STORAGE` — Use scoped storage (Android 11+)
   - Minimize requested permissions

3. **Subscription Accuracy**
   - Trial terms must be disclosed before charging
   - Renewal terms must be clear
   - Cancellation must be easy (typically 2 taps)

4. **Crash Reports**
   - Must pass internal testing (Firebase Crashlytics required)
   - No unhandled exceptions on device startup

### 3.3 Policy Requirements for Educational Subscription App

**Google Play Policies (2026):**

1. **User-Generated Content**
   - Attune's sparring transcripts are user-generated → should be encrypted, not sold to third parties (✓ Terms already address this)

2. **AI-Generated Content Disclosure**
   - Must clearly state AI responses are fictional, not professional advice
   - ✓ Terms of Service already compliant

3. **Free Trial & Subscription Policies**
   - Free trial must automatically convert to paid subscription with explicit consent
   - User must be able to cancel before trial ends
   - Trial period and price must be shown at confirmation

4. **Data Privacy**
   - Comply with GDPR (if users in EU)
   - Implement data deletion in privacy controls
   - ✓ Terms allow account deletion (30-day purge)

5. **Sensitive Data**
   - Audio recordings of sparring sessions may be considered sensitive
   - Recommend: End-to-end encryption for stored session data
   - Implement: Opt-in analytics (sensitive audio should not be logged)

---

## 4. ANDROID-SPECIFIC TECHNICAL CONSIDERATIONS

### 4.1 Target Specifications

**Minimum SDK:** API 28 (Android 9.0) or higher  
**Target SDK:** API 35+ (Android 15)  
**Device Support:** 95%+ of active Android devices (covers 2017+)

**Rationale:**
- API 28 = ~90% device coverage, sufficient market reach
- Target SDK 35 = Required for Play Store apps (as of Nov 2024)
- Supports Material Design 3 components
- Allows modern permission handling (Android 10+)

### 4.2 Material Design 3 Implementation

**Key Principles:**
- **Color tokens** — Align with Attune's yellow/blue brand within Material spec
- **Dynamic theming** — Support system-wide theme changes (Android 12+)
- **Adaptive spacing** — Responsive layouts for phones (4.5"–6.7") and tablets
- **Touch targets** — 48dp minimum (44dp acceptable with spacing)

**Recommended Library:** `Material Components for Android` (built-in for React Native / Flutter)

**Attune Brand Adaptation:**
```
Material Primary Color:  #1F5BA8 (Attune Blue) → Adjust to Material primary hue
Material Secondary:      #F2C744 (Attune Yellow) → Use as accent/tertiary color
On Primary Text:         #FAFAF8 (Attune White)
Surface:                 #0D1117 (Attune Ink) → Dark theme default
```

### 4.3 Permission Handling

**Required Permissions:**

```xml
<!-- Microphone for sparring -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />

<!-- Camera (if future feature: video sparring) -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Network -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Push notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" /> <!-- Android 13+ -->

<!-- Notification runtime permission (Android 13+) -->
<!-- Must request at app launch or on first notification trigger -->
```

**Permission Best Practice:**
- Request `RECORD_AUDIO` at first sparring session (not at app launch)
- Explain: "Microphone needed for AI to hear your responses"
- Graceful fallback: Offer text-based sparring if microphone denied

### 4.4 Device Fragmentation & Compatibility

**Critical Testing Matrix:**

| Aspect | Coverage | Notes |
|--------|----------|-------|
| **Screen Sizes** | 4.7"–6.8" | ~95% devices; test 5.5" (common), 6.1" (large) |
| **Aspect Ratios** | 16:9 to 20:9 | Responsive UI required; avoid hardcoded dimensions |
| **RAM** | 4GB, 6GB, 8GB+ | Optimize for 4GB baseline; profile memory usage |
| **CPU** | Snapdragon 870+, MediaTek Dimensity 900+ | Test on mid-range devices; avoid heavy compute on main thread |
| **OS** | Android 9–15 | Test on API 28, 30, 33, 35 |
| **Density** | ldpi, mdpi, hdpi, xhdpi, xxhdpi | Provide assets for 1x, 1.5x, 2x, 3x densities |

### 4.5 Hardware Requirements

**Minimum Specs:**
- **RAM:** 4GB (strict minimum); recommend 6GB for smooth experience
- **Storage:** 150MB (app), 500MB (user data/cache)
- **Processor:** Snapdragon 800+ or equivalent
- **Microphone:** Required (all modern devices have this)
- **Network:** 3G+ recommended; 4G/5G for real-time sparring

**Performance Targets:**
- App startup: <3 seconds cold start, <500ms warm start
- Sparring load: <2 seconds to first AI response
- Memory: <300MB baseline, <500MB with active session
- Battery: Real-time audio should consume <5% per hour

### 4.6 Battery Optimization

**Key Strategies:**
1. **Audio Processing**
   - Use system audio focus APIs (prevent multiple apps competing)
   - Disable microphone when sparring paused
   - Aggressive codec: Opus or AAC (vs. PCM uncompressed)

2. **Network**
   - Batch API calls where possible
   - Use WebSocket for real-time, not polling
   - Implement exponential backoff for retries

3. **Background Processes**
   - Push notifications handled by Firebase Cloud Messaging
   - No persistent background services
   - Respect Doze mode (Android 6+) — use JobScheduler for scheduled tasks

---

## 5. FEATURE IMPLEMENTATION ON ANDROID

### 5.1 AI Sparring Interface

**Architecture:**
```
┌─────────────────┐
│ User Input      │ (Text or Audio via RECORD_AUDIO)
│ (Text/Audio)    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Local   │ → Process transcription (if audio)
    │ Processor├─→ Format message for API
    └────┬────┘
         │
         │ ◀──── Firebase Cloud Messaging
    ┌────▼──────────────────┐
    │ Backend API            │ (WebSocket or REST)
    │ (LLM inference service)│
    └────┬──────────────────┘
         │
         │ AI Response
    ┌────▼─────────────────┐
    │ UI Thread            │ Render response animation
    │ (React Native/Flutter)│ Update ELO in realtime
    └──────────────────────┘
```

**Android-Specific Implementation:**

```kotlin
// Kotlin pseudocode (React Native delegates to native modules)

// Permission check
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    if (ActivityCompat.checkSelfPermission(
        context, Manifest.permission.RECORD_AUDIO
    ) != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(
            activity,
            arrayOf(Manifest.permission.RECORD_AUDIO),
            REQUEST_CODE_AUDIO
        )
    }
}

// Start recording with MediaRecorder (Android 11+ using MediaRecorder API v2)
val mediaRecorder = MediaRecorder(context).apply {
    setAudioSource(MediaRecorder.AudioSource.MIC)
    setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
    setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
    setAudioEncodingBitRate(128000)
    setAudioSamplingRate(16000) // Optimal for speech
    setOutputFile(outputFile)
    prepare()
    start()
}

// WebSocket connection for real-time responses
val webSocket = WebSocket.Builder(url)
    .addHeader("Authorization", authToken)
    .build()

webSocket.send(JSONObject().apply {
    put("type", "sparring_start")
    put("skillTrack", "negotiation")
    put("difficulty", "intermediate")
}.toString())
```

**UI Pattern (React Native example):**

```javascript
// Real-time feedback display
<SparringInterface>
  <UserMessage
    audio={recordedAudio}
    transcript={transcript}
    sentiment={sentiment} // Real-time emotion analysis
  />
  <AIResponse
    streaming={true}
    text={aiText}
    animation="typing-effect"
  />
  <FeedbackPanel>
    <ScoreDisplay eloChange={+15} />
    <SkillAnnotations highlights={structuralFeedback} />
  </FeedbackPanel>
</SparringInterface>
```

### 5.2 Real-Time Feedback System

**Components:**

1. **Response Quality Scoring**
   - Immediate ELO adjustment (+/- 5–25 points per response)
   - Confidence indicators (AI assessment of response quality)
   - Comparative feedback ("You used 12% less defensive language vs. typical")

2. **Coaching Hints**
   - Structural feedback overlaid on transcript
   - Highlights: defensive phrases, power dynamics, emotional awareness
   - Skill-specific frameworks displayed (e.g., "Fisher's Negotiation Framework" for negotiation track)

3. **Progress Visualization**
   - Live skill meter updates
   - Badge animation on unlock
   - Streak counter for consecutive practice days

**Android Performance:**
- Feedback rendering: 60 FPS for smooth animations (use `MotionLayout` or `Compose`)
- ELO calculation: Backend-driven (return +X/-X with each response)
- Transcription: Use device-local Google Speech-to-Text API (Android 5.0+) for latency <1s

### 5.3 Video/Audio Recording Capabilities

**Storage & Privacy:**

```kotlin
// Scoped storage (Android 11+)
val fileName = "sparring_${System.currentTimeMillis()}.m4a"
val contentValues = ContentValues().apply {
    put(MediaStore.Audio.Media.DISPLAY_NAME, fileName)
    put(MediaStore.Audio.Media.MIME_TYPE, "audio/mpeg")
    put(MediaStore.Audio.Media.IS_PENDING, 1)
}

val audioUri = context.contentResolver.insert(
    MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
    contentValues
)

// Record, then finalize
contentValues.put(MediaStore.Audio.Media.IS_PENDING, 0)
context.contentResolver.update(audioUri!!, contentValues, null, null)
```

**Encryption:**
- Encrypt audio files at rest using AES-256-GCM
- Use `EncryptedSharedPreferences` for session metadata
- Server-side: End-to-end encryption for sensitive transcripts (optional, high-privacy deployment)

### 5.4 ELO Scoring & Badge Progression

**ELO System (Ported from iOS):**

```
Base ELO: 1600
K-factor: 32 (for most users), 48 (new users)

ΔElo = K × (Result - Expected)
Expected = 1 / (1 + 10^((OpponentElo - YourElo) / 400))
Result = 1 (win), 0.5 (draw), 0 (loss)

For Attune:
- Win: Effective response to AI challenge (+15 to +25)
- Neutral: Partial success (+5 to +10)
- Loss: Poor response (-10 to -20)
```

**Badge Tiers (Display Example):**
- Bronze: ELO 1400–1599
- Silver: ELO 1600–1799
- Gold: ELO 1800–1999
- Platinum: ELO 2000–2199
- Diamond: ELO 2200+

**Implementation:**
- Store ELO per skill track in SQLite (offline-ready)
- Sync on app open + hourly refresh via Firebase
- Push notification on badge unlock: "🏆 Reached Silver in Negotiation!"

### 5.5 Push Notifications for Reminders

**Setup:**

```kotlin
// Firebase Cloud Messaging (FCM) via React Native
import { firebase } from '@react-native-firebase/messaging';

// Request permission (Android 13+)
messaging().requestPermission();

// Get FCM token for backend
const token = await messaging().getToken();
// Send token to server

// Handle notifications
messaging().onMessage(async (remoteMessage) => {
    if (remoteMessage.notification?.title === "Time to practice") {
        showLocalNotification({
            title: "Time to practice",
            body: "Complete 1 sparring session to maintain your streak",
            icon: "notification_icon",
            priority: "high",
            smallIcon: "ic_notification"
        });
    }
});
```

**Notification Strategy:**
- Streak reminders: "Complete 1 sparring to maintain your 7-day streak!"
- Achievement unlocks: "🏆 Reached Platinum!"
- Daily digest (opt-in): "Your weekly progress: +85 ELO across all skills"
- Smart timing: Respect user's timezone, avoid push at 10 PM–7 AM

---

## 6. TESTING STRATEGY

### 6.1 Device Testing Matrix

**Mandatory Testing (Minimum):**

| Category | Devices | Notes |
|----------|---------|-------|
| **Budget Phone** | Samsung A13, Redmi Note 11 | 4GB RAM, MediaTek processor |
| **Mid-Range** | Samsung A54, OnePlus 11 | 6GB–8GB RAM, Snapdragon 800+ |
| **Flagship** | Samsung S24, Pixel 9 | 12GB+ RAM, latest processor |
| **Tablets** | iPad 10" (if landscape support) | Optional for v2 |

**API Level Coverage:**
- API 28 (Android 9.0) — Baseline
- API 30 (Android 11) — Scoped storage
- API 33 (Android 13) — Notification permissions
- API 35 (Android 15) — Current/future requirement

### 6.2 Emulator vs Physical Device Testing

**Emulator (Development & CI/CD):**
- Fast iteration, no device cost
- Limited for audio/microphone testing (requires host device audio passthrough)
- Battery/thermal behavior not realistic
- Perfect for UI testing, navigation flows

**Physical Devices (QA & Validation):**
- Real microphone behavior, noise handling
- Actual memory/battery constraints
- Real network conditions (Wi-Fi, 4G, poor signal)
- Heat dissipation under load (sparring with real-time audio)
- Must test on ≥3 actual devices before launch

**Recommended Setup:**
1. Local development: Emulator (fast iteration)
2. Internal testing: Mix of emulator + 2–3 physical devices
3. Beta testing: Firebase Test Lab (automated + crowdsourced)
4. Launch: Real user feedback via Crashlytics

### 6.3 Beta Testing on Google Play Console

**Track 1: Internal Testing (Week 1–2)**
- 5–10 internal team members
- Focus: Critical crashes, permission handling, audio recording
- Tools: Firebase Crashlytics, Logcat

**Track 2: Closed Beta (Week 3–6)**
- 50–100 trusted users (recruit from iOS user base)
- Focus: Real-world usage, network conditions, battery performance
- Feedback: In-app survey or Google Form
- Duration: 4 weeks minimum

**Track 3: Open Beta (Optional, Week 7+)**
- Public testing for 2–4 weeks
- Generates user reviews before launch
- Feedback feeds into v1.1 patch

**Completion Criteria:**
- 0 critical crashes (>0.5% crash rate = block launch)
- >95% permission grant rate for RECORD_AUDIO
- Average session duration ≥5 minutes (baseline)
- User rating ≥4.2/5.0 from beta testers

### 6.4 Crash Reporting & Analytics

**Firebase Crashlytics (Recommended):**
```javascript
import crashlytics from '@react-native-firebase/crashlytics';

// Automatic crash capture
try {
    // Sparring API call
} catch (error) {
    crashlytics().log('Sparring error: ' + error.message);
    crashlytics().recordError(error);
}
```

**Key Metrics to Monitor:**
- Crash-free rate (target: >99.5%)
- ANR (Application Not Responding) rate <0.1%
- Top crash symptoms (e.g., "AudioManager deadlock", "WebSocket timeout")
- Memory leaks (use Android Profiler in debug builds)

**Analytics Events (Firebase Analytics):**
- `sparring_session_start` → `sparring_session_complete` (funnel)
- `audio_permission_granted` / `audio_permission_denied`
- `subscription_trial_started` / `subscription_converted` / `subscription_cancelled`
- `elo_milestone_unlocked` (track engagement at badge tiers)
- `app_background` → `app_foreground` (session resumption)

### 6.5 Audio/Microphone Testing

**Validation Checklist:**
- [ ] Microphone works on 3+ devices (budget, mid-range, flagship)
- [ ] Noise filtering: Test in quiet room + moderate background noise
- [ ] Clipping prevention: Test loud user voice (prevent audio distortion)
- [ ] Audio level meters: Visual feedback during recording
- [ ] Recording stops on app pause (Android lifecycle onPause)
- [ ] Graceful fallback if microphone denied (text-based sparring)
- [ ] Audio playback of AI response doesn't interfere with recording

**Sample Test:**
1. Record in quiet room → Verify clear transcript
2. Record with background music → Verify noise handling
3. Record with loud speech → Verify no clipping
4. Disconnect Bluetooth headset mid-session → App should resume with speaker/phone mic
5. Rotate device mid-recording → App continues without dropping audio

---

## 7. PROJECT TIMELINE & RESOURCES

### 7.1 Recommended Timeline (React Native)

```
Phase 1: Planning & Setup (Weeks 1–4)
├─ Set up React Native project from iOS codebase
├─ Configure CI/CD pipeline (EAS Build if using Expo, or local builds)
├─ Prepare design system for Android (Material Design 3 theming)
├─ Set up Firebase (Crashlytics, Analytics, Cloud Messaging)
└─ Create stub implementations of audio/WebSocket

Phase 2: Core Features (Weeks 5–16)
├─ Implement AI sparring interface (adapted from iOS)
├─ Audio recording + streaming to backend
├─ Real-time feedback rendering
├─ ELO system synchronization
├─ Push notification setup
└─ Subscription/Google Play Billing integration

Phase 3: Polish & Testing (Weeks 17–22)
├─ UI refinement (Material Design compliance)
├─ Performance optimization (memory, startup time)
├─ Battery testing + optimization
├─ Internal QA: 5 devices, 2 weeks
├─ Closed beta: 50–100 users, 4 weeks
└─ Bug fixes from beta feedback

Phase 4: Launch Prep (Weeks 23–26)
├─ Google Play Store listing preparation
├─ Screenshots, descriptions, category selection
├─ Privacy policy & compliance review
├─ App signing & submission
├─ Monitoring setup (Crashlytics, analytics dashboards)
└─ Launch day: Monitor crash rate, support incoming user issues

Total: 26 weeks (6 months) for feature parity
```

### 7.2 Team Structure

**Core Team (React Native Approach):**

| Role | Count | Time | Notes |
|------|-------|------|-------|
| React Native Engineer | 2 | Full-time | One lead, one mid-level; implement sparring, UI |
| Backend/API Engineer | 1 | 50% (shared) | Adapt iOS backend for Android auth, ELO sync |
| QA/Test Engineer | 1 | Full-time (weeks 17–26) | Device testing, beta coordination, regression |
| iOS Engineer | 1 | 20% (consulting) | Advise on feature parity, architecture decisions |
| Product Manager | 0.5 | Part-time | Prioritization, user feedback synthesis |
| **Total FTE** | **~4.7** | | Flexible: can be 3–5 depending on scope |

**Specialist Contractors (Optional):**
- **Audio/Microphone Engineer** (2–4 weeks): Real-time audio optimization, noise suppression
- **Google Play Specialist** (1 week): Store listing, policy compliance review
- **Security Auditor** (1 week): Encryption, permission hardening

### 7.3 Infrastructure & Tools

**Development Stack:**
- **Version Control:** Git (GitHub/GitLab)
- **CI/CD:** EAS Build (Expo-managed) or local GitHub Actions
- **Testing:** Jest (unit), Detox (E2E on Android Emulator)
- **Monitoring:** Firebase Crashlytics, Firebase Analytics
- **Backend:** Existing API (adapt for Android token/session management)
- **Code Signing:** Play Console managed signing (recommended; secures release keys)

**Hardware/Services:**
- **Emulator:** Android Studio (included with SDK)
- **Device Cloud:** Firebase Test Lab (optional, for automated testing)
- **Backend Modifications:** Minimal (existing APIs should work; add Android-specific session handling)

### 7.4 Cost Estimates

**Development Costs (React Native):**

| Category | Cost (USD) | Notes |
|----------|-----------|-------|
| **Engineering (4.7 FTE × 26 weeks)** | $180K–$280K | Depends on location: SF/NYC (higher), Eastern Europe (lower) |
| **Infrastructure (Firebase, Play Console)** | $1K–$5K | Firebase usage-based; Play account = $25 one-time |
| **Audio/Microphone Specialist** | $10K–$20K | Optional; only if custom noise suppression needed |
| **Google Play Specialist Review** | $3K–$5K | Policy compliance, store listing optimization |
| **Beta Testing Incentives** | $5K–$10K | Gift cards/credits for 50–100 beta users |
| **Hardware (test devices)** | $5K–$10K | 3–5 physical devices for QA |
| **Contingency (10–15%)** | $30K–$50K | Unexpected issues, scope changes |
| **TOTAL** | **$234K–$380K** | Realistic range for professional launch |

**Alternative (Flutter):**
- Estimated **15% faster** (5.5 months): saves ~$30K–$50K in labor
- Total: **$200K–$330K**

**Alternative (Native Android):**
- Estimated **100% longer**: $350K–$600K
- Full separate team; not recommended unless core tech reasons

### 7.5 Risk Mitigation

**Key Risks & Mitigations:**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Audio/WebSocket latency issues | Medium | High | Prototype early (weeks 1–2); consider WebRTC for P2P if needed |
| Google Play rejection (policy) | Low | High | Legal review of subscription terms (week 24) before submission |
| Memory leaks under sustained audio load | Medium | Medium | Profile on 4GB devices; test 2+ hour continuous sessions |
| Device fragmentation issues | Medium | Low | Test on 5+ device models; use Firebase Test Lab |
| Beta user churn / poor feedback | Low | Medium | Recruit beta from iOS user base (higher engagement); offer incentives |
| Team learning curve (React Native) | Medium | Low | Hire experienced RN engineer as lead; allocate 2 weeks ramp-up |

---

## 8. MONETIZATION & PUBLISHING STRATEGY

### 8.1 Subscription Model on Google Play

**Current iOS Structure (Inferred from Terms & Code):**
- **Base Tier:** $9.99/month
- **Mid Tier:** ~$19/month (optional, feature-upgraded)
- **Premium Tier:** ~$32/month (likely annual, implies $384/year discount)
- **Trial:** Free (30 days typical, auto-converts)

**Google Play Implementation:**

```kotlin
// Kotlin pseudocode for Google Play Billing Library v6+

// 1. Query available subscriptions
val skuDetails = billingClient.queryProductDetailsAsync(
    QueryProductDetailsParams.newBuilder()
        .addProduct("com.attuneai.plus.monthly", ProductType.SUBS)
        .addProduct("com.attuneai.plus.annual", ProductType.SUBS)
        .build()
)

// 2. Launch purchase flow
val billingFlowParams = BillingFlowParams.newBuilder()
    .setProductDetailsParamsList(listOf(
        BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(monthlyProductDetails)
            .setOfferToken(monthlyOfferToken) // "free trial" offer
            .build()
    ))
    .build()

billingClient.launchBillingFlow(activity, billingFlowParams)

// 3. Listen for purchase updates
billingClient.registerPurchasesUpdatedListener { billingResult, purchases ->
    if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
        purchases?.forEach { purchase ->
            if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
                // Acknowledge purchase (required within 3 days)
                acknowledgePurchase(purchase.purchaseToken)
                // Unlock premium features
                unlockSubscription(purchase.skuDetails)
            }
        }
    }
}
```

**Store Listing Configuration:**

| Field | Value | Notes |
|-------|-------|-------|
| **Primary Currency** | USD | Set geo pricing from USD baseline |
| **Subscription ID (Monthly)** | `com.attuneai.plus.monthly` | Reverse domain notation |
| **Subscription ID (Annual)** | `com.attuneai.plus.annual` | Optional; recommended for retention |
| **Trial Period** | 7 days (or 30 days) | Match iOS trial length |
| **Billing Period** | 1 month / 1 year | Align with iOS tiers |
| **Grace Period** | 3 days | Allow user to fix payment method |
| **Account Hold** | Enabled | Retry failed payments up to 7 days |

### 8.2 Feature Parity Pricing

**Recommendation:** **Identical pricing across iOS & Android**

**Rationale:**
- Simplifies user acquisition (no "why is it cheaper on Android?" questions)
- Prevents cross-platform arbitrage
- Apple/Google take 30% commission on both platforms; price point should reflect

**Example Pricing Table:**

| Tier | iOS | Android | Feature Set |
|------|-----|---------|-------------|
| Free | — | Free trial 7d | Limited: 1 sparring/day, 2 skill tracks |
| Monthly | $9.99 | $9.99 | Full access: 8 tracks, unlimited sparring, ELO + badges |
| Annual | $79.99 (−33%) | $79.99 | Same as monthly, 20% discount |
| Lifetime | $199 (if offered) | $199 | Not recommended; creates support burden |

**Conversion Targets:**
- Free → Monthly: 3–8% conversion rate (typical for education/productivity)
- Trial → Paid: 15–25% conversion (Attune: likely higher given engaged users)
- Monthly → Annual: 5–10% of monthly subscribers upgrade annually

### 8.3 In-App Purchase Setup & Testing

**Testing Workflow:**

```
1. Create test accounts in Google Play Console
   ├─ Licensed Testers group (up to 20 test email addresses)
   └─ Each tester gets "test" billing (no real charges)

2. Install signed APK on test device
   ├─ Must be signed with release key
   └─ Version code ≥ production version

3. Use test SKU IDs (optional)
   ├─ "android.test.purchased" → Simulates successful purchase
   └─ "android.test.canceled" → Simulates user cancellation

4. Verify receipt validation
   ├─ Backend must validate purchase token with Google Play API
   └─ Prevents refund fraud / fake purchases
```

**Critical:** Always validate receipts on backend before unlocking features (prevent hacking).

### 8.4 Tax & Banking Configuration

**Setup Required:**
1. Google Merchant Center account linked to Play Console
2. Tax forms: US W-9 or foreign tax ID
3. Bank account for payouts (ACH for US)
4. Payout schedule: Monthly (starting 15 days after first sale)

**Tax Considerations:**
- Google remits sales tax on behalf of seller (US, EU, India, etc.)
- Attune responsible for income tax only
- VAT applies in EU: Prices should display inclusive of VAT for EU users

**Payout Example:**
- Gross revenue: $1,000
- Google commission (30%): −$300
- Tax remitted (if applicable): Varies by jurisdiction
- Net payout: ~$650–$700 (after all fees)

### 8.5 Post-Launch Monetization Opportunities

**Not Recommended for v1.0, but consider for v2.0+:**

1. **Premium Sparring Partners** — Unlock advanced AI personalities ($4.99/month add-on)
2. **Coaching Sessions** — Monthly 1:1 with human coach (high-value, $99/session)
3. **Corporate Licensing** — $500–$5K/month for team subscriptions
4. **Advanced Analytics** — Detailed performance reports + trends (freemium upsell)
5. **Certification Program** — "Master Communicator" badge + course completion (one-time $49)

---

## 9. COMPETITIVE LANDSCAPE & MARKET POSITIONING

### 9.1 Android Education/Productivity Apps (Reference)

**Similar Subscription Models:**
- **Duolingo** — $12.99/month premium (iOS & Android feature parity)
- **Headspace** — $12.99/month meditation (strong retention, 30%+ conversion)
- **LinkedIn Learning** — $39.99/month + corporate bundles
- **Skillshare** — $16.58/month (annual discount)

**Key Takeaway:** Attune's $9.99/month is **highly competitive** (lower than most skill-training apps). Expect similar subscription metrics to Duolingo:
- Trial → Paid conversion: 15–25%
- Monthly → Annual upgrade: 5–10%
- Churn rate: 5–8% per month (typical for education apps)

### 9.2 Differentiation on Android

**Attune's Unique Strengths:**
1. **AI Sparring** — First-mover advantage in real-time conversational training
2. **ELO Scoring** — Gamification drives daily engagement
3. **Behavioral Science** — Peer-reviewed curriculum (vs. generic communication apps)
4. **High-Stakes Focus** — Professional/negotiation niche (vs. broad "self-help")

**Android-Specific Positioning:**
- "Now on Android: AI sparring for serious professionals"
- Partner with Android-first markets (India, Southeast Asia, Brazil) for growth
- Material Design 3 polish signals quality & native integration (vs. perception of cross-platform laziness)

---

## 10. IMPLEMENTATION ROADMAP

### 10.1 Phase-by-Phase Breakdown

**PHASE 1: Foundation (Weeks 1–4)**

Objectives:
- Project setup, architecture decisions, team onboarding
- Basic scaffolding: navigation, authentication, API layer

Deliverables:
- React Native codebase (iOS sources ported to RN where applicable)
- Firebase setup (Crashlytics, Analytics, Cloud Messaging)
- CI/CD pipeline (EAS Build or GitHub Actions)
- Stub implementations of audio, WebSocket, subscription modules

Key Milestones:
- Week 2: Codebase architecture review
- Week 4: CI/CD working; basic app launches and navigates

Risks:
- Audio library selection delays (evaluate react-native-webrtc vs. alternatives early)
- Architectural mismatch with iOS (if iOS is native; may require re-architecture)

---

**PHASE 2A: Core Sparring (Weeks 5–10)**

Objectives:
- Implement sparring interface, audio input, API integration

Deliverables:
- Sparring session UI (text input + audio recording)
- Backend API integration (WebSocket for real-time responses)
- Transcript display + basic feedback
- Local data persistence (session history)

Key Milestones:
- Week 6: Audio recording working on emulator
- Week 8: Sparring session end-to-end (text path)
- Week 10: Audio path stable, WebSocket connected

Risks:
- Audio latency (network vs. device processing)
- WebSocket stability under poor network

---

**PHASE 2B: ELO & Gamification (Weeks 11–14)**

Objectives:
- ELO calculation, badge system, progress visualization

Deliverables:
- ELO sync from backend
- Badge unlock animations
- Skill track UI (8 tracks, visual progression)
- Push notification setup for milestones

Key Milestones:
- Week 12: ELO calculation + display working
- Week 14: Push notifications triggered on badge unlock

Risks:
- Real-time ELO desync if offline
- Badge unlock timing (avoid notification spam)

---

**PHASE 2C: Subscriptions & Monetization (Weeks 15–18)**

Objectives:
- Google Play Billing integration, paywall, subscription management

Deliverables:
- Google Play Billing Library v6+ integration
- Paywall UI (free trial → paid conversion)
- Subscription state management (active, expired, etc.)
- Backend subscription validation

Key Milestones:
- Week 16: Test purchases working in sandbox
- Week 18: Paywall shows correct pricing, trial converts to paid

Risks:
- Google Play API changes, billing state race conditions
- Subscription recovery if user uninstalls/reinstalls

---

**PHASE 3: Polish & Optimization (Weeks 19–22)**

Objectives:
- UI/UX refinement, performance, battery optimization

Deliverables:
- Material Design 3 compliance (colors, components, animations)
- Memory optimization (<300MB baseline)
- Startup time <3s cold, <500ms warm
- Battery optimization (audio streaming, background processes)
- Accessibility (TalkBack, font scaling)

Key Milestones:
- Week 20: All Material Design 3 components updated
- Week 22: Performance benchmarks meet targets on 4GB device

Risks:
- Material Design 3 tokens don't align with brand (requires design iteration)
- Performance bottlenecks discovered late (mitigate with profiling in week 18)

---

**PHASE 4: QA & Beta Testing (Weeks 23–26)**

Objectives:
- Internal QA, closed beta, launch prep

Deliverables:
- Internal testing on 5+ devices (API 28, 30, 33, 35)
- Closed beta release to 50–100 users
- Google Play Store listing (screenshots, descriptions, metadata)
- Privacy/compliance review (GDPR, child safety, etc.)
- App signing & submission

Key Milestones:
- Week 23: Internal QA complete, 0 critical crashes
- Week 25: Closed beta complete, user rating ≥4.2/5
- Week 26: Submitted to Google Play (awaiting review)

Risks:
- Regression bugs from final changes
- Google Play rejection (policy compliance)
- Last-minute user feedback requiring rework

---

**POST-LAUNCH (Weeks 27+)**

- Monitor Crashlytics & Analytics
- Respond to critical issues (hotfix within 24h)
- Plan v1.1 (feature additions, bug fixes from user feedback)
- Consider v1.5: Tablet optimizations, voice notes, advanced feedback

---

## 11. SUCCESS METRICS & KPIs

### Pre-Launch Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Crash-Free Rate** | >99.5% | Standard mobile app benchmark |
| **Startup Time** | <3s cold, <500ms warm | User retention depends on performance |
| **Beta User Rating** | ≥4.2/5 (from 50+ users) | Predictor of launch reviews |
| **Trial → Paid Conversion** | ≥15% | Revenue model validation |
| **Audio Latency** | <1.5s (end-to-end) | User experience critical for sparring |

### Post-Launch Metrics (3–6 Months)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Daily Active Users** | 10%+ of iOS | Market penetration (if iOS has 10K DAU, target 1K+ on Android by month 3) |
| **Subscription Conversion** | 15–25% | Feature parity with iOS or better |
| **Monthly Churn** | <8% | Engagement baseline; lower churn = higher LTV |
| **Session Length** | ≥8 min avg | Users complete 1+ sparring session per session |
| **Rating** | ≥4.0/5 | Maintain quality perception |
| **Revenue** | $X per month (trending to iOS parity) | By month 6, Android revenue should be 60–80% of iOS |

### Long-Term Expansion (Year 2+)

- **Geographic Growth:** Launch in India, Brazil (English-language users first; then localize)
- **Team Features:** Corporate subscriptions, cohort-based learning
- **AI Improvements:** Faster responses, more realistic sparring partners
- **Tablet Support:** Optimize for larger screens (landscape, split-view)

---

## 12. SUMMARY & RECOMMENDATIONS

### Key Takeaways

1. **React Native is optimal** for Attune AI:
   - 6–9 month timeline to feature parity with iOS
   - $200K–$350K development cost (realistic)
   - 3–4 person team (vs. 5–6 for native)
   - Strong real-time audio/video ecosystem

2. **Google Play Store is straightforward** for subscription apps:
   - Policy requirements align with iOS terms
   - Submission process typically 1–4 hours
   - Billing Library v6+ is mature & well-documented

3. **Android-specific challenges are manageable**:
   - Device fragmentation requires testing on 5+ devices (mitigated via Firebase Test Lab)
   - Microphone/audio handling is standard (Android 28+)
   - Battery optimization is critical for real-time features (addressed in optimization phase)

4. **Pricing & monetization**:
   - Keep pricing identical to iOS ($9.99/month baseline)
   - Target 15–25% trial → paid conversion (inline with Duolingo, Headspace)
   - Plan for 50–60% of iOS revenue in month 1; reach 70–80% by month 6

### Next Steps

1. **Weeks 1–2:** Finalize team, choose React Native vs. Flutter, set up codebase
2. **Week 3:** Architecture review (ensure clean separation of iOS/Android code)
3. **Weeks 4–6:** Prototype audio + WebSocket (de-risk real-time features)
4. **Weeks 7–22:** Core feature development (follow phase breakdown above)
5. **Weeks 23–26:** QA, beta testing, Play Store prep
6. **Week 27:** Launch & monitor

**Estimated Launch:** 6 months from team onboarding  
**Budget:** $235K–$380K USD  
**Success Probability:** 85%+ (assuming skilled React Native team)

---

## Appendices

### A. Useful References

**Google Play Store:**
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Google Play Billing Library v6+](https://developer.android.com/google/play/billing)
- [Android Developers: Permissions](https://developer.android.com/guide/topics/permissions)

**React Native & Audio:**
- [React Native Documentation](https://reactnative.dev/)
- [react-native-webrtc](https://github.com/react-native-webrtc/react-native-webrtc)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

**Testing & QA:**
- [Android Studio Emulator](https://developer.android.com/studio/run/emulator)
- [Firebase Test Lab](https://firebase.google.com/docs/test-lab)
- [Android Profiler](https://developer.android.com/studio/profile/android-profiler)

**Design & UX:**
- [Material Design 3](https://m3.material.io/)
- [Android Human Interface Guidelines](https://developer.android.com/design)

### B. Risk Assessment & Contingencies

**High Risk: Audio Latency Issues**
- Mitigation: Prototype with react-native-webrtc in week 2; measure end-to-end latency
- Fallback: If >2s latency, evaluate native Kotlin module for audio processing

**High Risk: Google Play Rejection**
- Mitigation: Legal review of subscription terms + privacy policy (week 24)
- Fallback: Re-submit within 3 days with policy updates

**Medium Risk: Device Fragmentation**
- Mitigation: Firebase Test Lab automated testing + 5+ physical devices
- Fallback: Reduce feature scope (e.g., disable advanced audio filters on low-end devices)

**Medium Risk: Team Scaling Issues**
- Mitigation: Hire experienced React Native lead (weeks 1–2); allocate 2 weeks ramp-up
- Fallback: Consider augmenting with contractor from weeks 10–20

---

**Document prepared by:** Claude Code Analysis  
**Last updated:** June 18, 2026  
**Contact:** attuneai@bishopshop.co.site

