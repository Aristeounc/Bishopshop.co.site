# Attune AI - Android App

Premium Communication Training Platform for Android.

## Project Overview

This is the React Native implementation of Attune AI for Android, supporting real-time AI sparring, skill tracking with ELO scoring, and badge-based progression.

## Architecture

### Technology Stack
- **Framework**: React Native 0.73
- **Navigation**: React Navigation 6.1
- **State Management**: Zustand 4.4
- **Backend**: Firebase (Auth, Firestore, Messaging, Analytics)
- **Real-time Communication**: WebRTC (via react-native-webrtc)
- **Audio**: react-native-audio, react-native-sound
- **UI Components**: React Native Material Design
- **TypeScript**: Full type safety throughout

### Project Structure

```
attune-ai-android/
├── src/
│   ├── screens/                # Main app screens
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── HomeScreen.tsx       # Main dashboard
│   │   ├── SkillsScreen.tsx     # Skill list and selection
│   │   ├── SparringScreen.tsx   # AI conversation interface
│   │   ├── ProgressScreen.tsx   # Progress tracking and badges
│   │   └── SettingsScreen.tsx   # App settings
│   ├── components/             # Reusable components (to be created)
│   │   ├── BadgeDisplay.tsx
│   │   ├── SkillCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ...
│   ├── services/
│   │   └── firebase.ts         # Firebase service layer
│   ├── stores/
│   │   └── appStore.ts         # Zustand state management
│   ├── models/
│   │   └── index.ts            # TypeScript interfaces and types
│   ├── constants/
│   │   ├── colors.ts           # Colors, spacing, typography
│   │   └── ...
│   ├── utils/                  # Utility functions (to be created)
│   ├── App.tsx                 # Main app component with navigation
│   └── index.tsx               # App entry point
├── android/                    # Android-specific native code
├── node_modules/
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Core Models

### User
```typescript
{
  id: string;
  email: string;
  displayName: string;
  createdAt: number;
  subscriptionTier: 'free' | 'premium' | 'max';
  subscriptionStatus: 'active' | 'expired' | 'pending' | 'paused';
  preferences: { notifications, darkMode, reduceMotion };
}
```

### SkillProgress
```typescript
{
  trackId: SkillTrack;
  trackName: string;
  currentScore: number;           // 0-100
  currentTier: BadgeTier;
  progressToNextTier: number;     // 0-100%
  sessionsCompleted: number;
  bestScore: number;
}
```

### SparringSession
```typescript
{
  id: string;
  userId: string;
  trackId: SkillTrack;
  startTime: number;
  duration: number;
  userResponses: string[];
  aiResponses: string[];
  feedback: SessionFeedback;
  scoreGained: number;
  recordingUrl?: string;
}
```

## Badge Tiers (ELO System)

- **Emerging** (0-24 points): 🌱 Initium Sapientiae
- **Competent** (25-49): ⭐ Firmus et Fortis
- **Proficient** (50-74): 🏅 Aureus Animus
- **Expert** (75-89): 🎯 Viridis Victoriae
- **Master** (90-100): 👑 Summum Fastigium

## Skill Tracks

1. Negotiation
2. Conflict Resolution
3. Influence Without Manipulation
4. High-Stakes Communication
5. Non-Violent Communication (NVC)
6. Emotional Awareness
7. Reducing Defensiveness
8. Advanced (Custom scenarios)

## Firebase Configuration

### Required Services
1. **Authentication**: Email/password authentication
2. **Firestore**: Real-time database
   - `users/{userId}/` - User profiles
   - `users/{userId}/skills/{trackId}` - Skill progress
   - `users/{userId}/sessions/{sessionId}` - Session history
3. **Cloud Messaging**: Push notifications
4. **Analytics**: User analytics tracking
5. **In-App Messaging**: Campaign management

### Firestore Structure
```
users/
  {userId}/
    - id, email, displayName, createdAt
    - subscriptionTier, subscriptionStatus
    - preferences
    skills/
      {trackId}/
        - trackId, trackName, currentScore
        - currentTier, progressToNextTier
        - sessionsCompleted, bestScore
    sessions/
      {sessionId}/
        - trackId, startTime, endTime, duration
        - userResponses[], aiResponses[]
        - feedback, scoreGained
    achievements/
      {achievementId}/
        - type, title, description, unlockedAt
```

## Getting Started

### Prerequisites
- Node.js 16+
- Android SDK 30+
- Java JDK 11+
- React Native CLI

### Installation

```bash
# Install dependencies
npm install

# Install native dependencies
cd android && ./gradlew clean && cd ..

# Set up Firebase
# 1. Create Firebase project at https://console.firebase.google.com
# 2. Add Android app to project
# 3. Download google-services.json to android/app/

# Set environment variables
cp .env.example .env
# Edit .env with Firebase credentials
```

### Running the App

```bash
# Start Metro bundler
npm start

# In another terminal, build and run on Android
npm run android

# Or use Android Studio
# Open android/ folder and run from IDE
```

## Key Features to Implement

### Phase 1: Core Infrastructure ✅
- [x] Navigation structure
- [x] Authentication (sign in/sign up)
- [x] Firebase integration
- [x] State management with Zustand
- [x] UI components and theming

### Phase 2: Sparring Engine (In Progress)
- [ ] AI sparring interface with WebRTC
- [ ] Real-time audio recording
- [ ] Text/voice input handling
- [ ] AI response generation (Anthropic API integration)
- [ ] Session feedback and scoring

### Phase 3: Skill Tracking
- [ ] ELO scoring algorithm
- [ ] Badge progression visualization
- [ ] Session history tracking
- [ ] Progress analytics

### Phase 4: Notifications
- [ ] Push notification setup
- [ ] Achievement notifications
- [ ] Daily reminders
- [ ] Training streak tracking

### Phase 5: Monetization
- [ ] Google Play Billing integration
- [ ] Subscription management
- [ ] In-app purchases
- [ ] Freemium features

### Phase 6: Polish & Launch
- [ ] Material Design 3 refinements
- [ ] Accessibility (WCAG AA+)
- [ ] Performance optimization
- [ ] Testing and QA
- [ ] Google Play Store submission

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components and hooks
- Implement proper error handling

### State Management
- Use Zustand for app-wide state
- Keep component state for UI-only concerns
- Avoid prop drilling with context

### Firebase Rules
```javascript
// Firestore Security Rules
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
  match /skills/{document=**} {
    allow read, write: if request.auth.uid == userId;
  }
  match /sessions/{document=**} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

### API Integration Points
1. **AI Sparring**: Anthropic Claude API for conversational responses
2. **Google Play Billing**: For subscription management
3. **Firebase Cloud Functions**: For complex server-side logic
4. **Analytics**: Firebase Analytics + custom events

## Testing

```bash
# Run tests
npm run test

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Build & Release

### Development Build
```bash
npm run android:build
```

### Production Build
```bash
cd android && ./gradlew bundleRelease && cd ..
```

### Google Play Store Submission
See `ANDROID_DEVELOPMENT_ROADMAP.md` for detailed submission checklist

## Performance Targets
- Cold start: < 3 seconds
- First interactive: < 2 seconds
- Sparring session load: < 1 second
- Audio latency: < 300ms
- Battery drain: < 100mA during active sparring

## Known Limitations & TODOs

1. **Audio Recording**: Requires native module implementation
2. **WebRTC**: May need platform-specific tuning for low latency
3. **AI Integration**: Placeholder responses - needs API integration
4. **Google Play Billing**: Not yet implemented
5. **Offline Support**: Not implemented

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### Firebase Connection
- Verify google-services.json is in android/app/
- Check Firebase project settings
- Ensure Android app package name matches Firebase config

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Firebase React Native SDK](https://rnfirebase.io/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Android Development Roadmap](../ANDROID_DEVELOPMENT_ROADMAP.md)
- [Android Strategy](../ANDROID_STRATEGY.md)

## License

Copyright © 2026 Bishop Shop Enterprises LLC. All rights reserved.

## Support

For issues, questions, or suggestions, contact: attuneai@bishopshop.co.site

---

**Status**: Phase 1 Complete - Navigation and Core Infrastructure  
**Next Phase**: Sparring Engine Implementation  
**Target Launch**: Q3 2026
