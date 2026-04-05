# Frontend Setup Guide

## Prerequisites

- Node.js 18.x LTS or higher
- npm or yarn package manager
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd poroma-frontend
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Environment Configuration

Create `.env` file (optional for MVP):

```env
API_URL=http://localhost:3000/api/v1
```

## Step 4: Start Development Server

```bash
npx expo start
```

This will show a QR code in the terminal. You can:
- Scan with Expo Go app (Android/iOS)
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web

## Step 5: Setup Android Emulator (Optional)

### Option A: Using Android Studio

1. Install [Android Studio](https://developer.android.com/studio)
2. Create a virtual device (AVD)
3. Start the emulator
4. Run `npx expo run:android`

### Option B: Using Command Line

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator @Pixel_4_API_30

# Run app
npx expo run:android
```

## Step 6: Setup iOS Simulator (macOS Only)

1. Install Xcode from App Store
2. Open Xcode and accept licenses
3. Install simulators via Xcode > Preferences > Components
4. Run `npx expo run:ios`

## Development Commands

| Command | Description |
|---------|-------------|
| `npx expo start` | Start Expo development server |
| `npx expo start --clear` | Clear cache and start |
| `npx expo run:android` | Run on Android device/emulator |
| `npx expo run:ios` | Run on iOS simulator |
| `npx expo build:android` | Build Android APK/AAB |
| `npx expo build:ios` | Build iOS (requires Apple account) |
| `eas build` | Build with EAS (recommended for production) |

## Common Issues

### Metro Bundler Issues

```bash
# Clear Metro cache
npx expo start --clear

# Reset Expo
npx expo reset
```

### Android Build Issues

```bash
# Clean build
cd android && ./gradlew clean
```

### iOS Build Issues

```bash
# Reinstall pods
cd ios && pod install
```

### Cannot Connect to API

1. Check if backend is running
2. Verify API_URL in `.env`
3. For Android emulator, use `10.0.2.2` instead of `localhost`
4. For iOS simulator, use `localhost`

## EAS Build (Recommended for Production)

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure EAS

```bash
eas build:configure
```

### Build Commands

```bash
# Build for Android (APK)
eas build --platform android --profile preview

# Build for Android (AAB for Play Store)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## Project Structure

```
src/
├── api/                   # API client and endpoints
│   ├── client.ts         # Axios instance with interceptors
│   ├── auth.api.ts       # Authentication API
│   ├── medication.api.ts  # Medication API
│   └── log.api.ts        # Log API
├── components/            # Reusable UI components
│   ├── common/          # Generic components
│   ├── medication/      # Medication-specific components
│   └── timeline/        # Timeline components
├── screens/             # Screen components
├── navigation/          # Navigation configuration
├── stores/              # Zustand state stores
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── App.tsx              # App entry point
```

## Next Steps

1. Read [UI Component Guide](./UI_COMPONENT_GUIDE.md)
2. Review [Design Reference](./DESIGN_REFERENCE.md)
3. Start implementing screens

## Support

For questions, refer to:
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [Zustand Docs](https://github.com/pmndrs/zustand)
