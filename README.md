# পরমা (Poroma) - Frontend Mobile App

> React Native Mobile Application for Medication Reminders

## Overview

This is the mobile application for পরমা (Poroma), a medication reminder application designed for the Bangladesh market. The app is built with React Native (Expo) and targets both Android and iOS platforms.

## Quick Links

- [Setup Guide](./SETUP.md)
- [UI Component Guide](./UI_COMPONENT_GUIDE.md)
- [Design Reference](./DESIGN_REFERENCE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| State Management | Zustand |
| Navigation | React Navigation 6.x |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Storage | AsyncStorage |
| Notifications | expo-notifications |

## Project Status

```
Phase: Development
Current: Frontend Foundation
Target: MVP - Medication Alert + Refill Alert
```

## Getting Started

```bash
# Navigate to project
cd poroma-frontend

# Install dependencies
npm install

# Start Expo development
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

## Design Source

Designs are available in Stitch:
- Project ID: `11641936393330190866`
- Project Name: Medication Reminder App - Clinical Curator

## Key Features (MVP)

- [x] User Authentication (Phone + Password)
- [x] Home Dashboard with Timeline
- [x] Add/Edit/Delete Medications
- [x] Mark Medication (Taken/Skipped)
- [ ] Push Notifications
- [ ] Timeline Sharing (Family/Caregiver)
- [ ] Pharmacy Integration
- [ ] Refill Alerts

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | Complete setup instructions |
| [UI_COMPONENT_GUIDE.md](./UI_COMPONENT_GUIDE.md) | Component library documentation |
| [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) | Design tokens and specifications |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development guidelines |

## Related Projects

- [Backend API](../poroma-backend/) - Node.js API service
- [Business Plan](../BUSINESS_PLAN.md) - Project vision and strategy
- [System Architecture](../SYSTEM_ARCHITECTURE.md) - Technical architecture

## Screens (MVP)

1. **Splash Screen** - App loading
2. **Login Screen** - Phone + Password authentication
3. **Sign Up Screen** - New user registration
4. **Home Dashboard** - Today's medications and progress
5. **Add Medication** - Add new medication form
6. **My Medications** - List of all medications
7. **Medication Detail** - Individual medication view
8. **Settings** - App settings and profile

## License

Proprietary - All rights reserved
