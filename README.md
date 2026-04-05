# পরমা (Poroma) - Frontend Mobile App

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-Proprietary-orange)

**Medication Reminder Mobile Application for Bangladesh**

[Setup Guide](#getting-started) • [Documentation](#documentation) • [Screens](#screens) • [Contributing](./CONTRIBUTING.md)

</div>

## Overview

পরমা (Poroma) is a medication reminder application designed for the Bangladesh market. Built with React Native (Expo), it helps users manage their medications, set reminders, and track their medication intake schedule.

### Key Features (MVP)

- User Authentication (Phone + Password)
- Home Dashboard with Today's Timeline
- Add/Edit/Delete Medications
- Mark Medication (Taken/Skipped)
- Push Notifications (Coming Soon)
- Refill Alerts (Coming Soon)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| State Management | Zustand |
| Navigation | React Navigation 6.x |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Storage | AsyncStorage |
| Notifications | expo-notifications |
| UI Components | Custom + React Native Elements |

## Getting Started

### Prerequisites

- Node.js 18.x LTS or higher
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
# Navigate to project directory
cd poroma-frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

### Running the App

```bash
# Run on Android
npx expo run:android

# Run on iOS (macOS only)
npx expo run:ios

# Run on Web
npx expo start --web
```

## Project Structure

```
poroma-frontend/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.ts           # Axios instance with interceptors
│   │   ├── auth.api.ts         # Authentication API
│   │   ├── medication.api.ts   # Medication API
│   │   ├── log.api.ts          # Medication log API
│   │   └── analytics.api.ts    # Analytics API
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Generic components
│   │   ├── medication/         # Medication-specific components
│   │   ├── timeline/           # Timeline components
│   │   └── form/               # Form components
│   ├── screens/                # Screen components
│   │   └── auth/               # Authentication screens
│   ├── navigation/             # Navigation configuration
│   ├── stores/                 # Zustand state stores
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── validators/             # Zod validation schemas
│   └── App.tsx                 # App entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## API Configuration

The app connects to the backend API. Configure the API URL in development:

- **Development:** `http://localhost:3000/api/v1`
- **Production:** `https://api.poroma.app/api/v1`

For Android emulators, use `10.0.2.2` instead of `localhost`.

## Design Source

Designs are available in Stitch:
- **Project ID:** `11641936393330190866`
- **Project Name:** Medication Reminder App - Clinical Curator

## Screens (MVP)

1. **Splash Screen** - App loading with logo
2. **Login Screen** - Phone + Password authentication
3. **Sign Up Screen** - New user registration
4. **Home Dashboard** - Today's medications and progress
5. **Add Medication** - Add new medication form
6. **My Medications** - List of all medications
7. **Medication Detail** - Individual medication view
8. **Settings** - App settings and profile

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | Complete setup and installation instructions |
| [UI_COMPONENT_GUIDE.md](./UI_COMPONENT_GUIDE.md) | Component library and usage guide |
| [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) | Design tokens and specifications |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development guidelines and contribution process |
| [FRONTEND_DEVELOPMENT_INSTRUCTIONS.md](./FRONTEND_DEVELOPMENT_INSTRUCTIONS.md) | Step-by-step implementation guide |

## Related Projects

- [Backend API](../poroma-backend/) - Node.js API service
- [Business Plan](../BUSINESS_PLAN.md) - Project vision and strategy
- [System Architecture](../SYSTEM_ARCHECTURE.md) - Technical architecture

## Project Status

```
Phase: Development
Current: Frontend Foundation
Target: MVP - Medication Alert + Refill Alert
```

## License

Proprietary - All rights reserved

---

<div align="center">

Built with ❤️ for Bangladesh

</div>