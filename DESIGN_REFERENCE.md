# Design Reference

## পরমা (Poroma) - Design System

This document defines the design tokens and visual specifications for the পরমা mobile application.

---

## Brand Identity

### App Name

**পরমা (Poroma)**

- Bengali word meaning "loved one" or "dear"
- Represents care for loved ones' health
- Emphasizes family and relationships

### Logo

- Primary: "পরমা" text with medical cross
- Icon: Simplified pill/reminder icon
- Colors: Primary blue (#2196F3)

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | #2196F3 | 33, 150, 243 | Main brand color, buttons, links |
| Primary Dark | #1976D2 | 25, 118, 210 | Pressed states, headers |
| Primary Light | #BBDEFB | 187, 222, 251 | Backgrounds, highlights |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | #4CAF50 | Taken medication, positive feedback |
| Warning | #FF9800 | Refill alerts, pending actions |
| Error | #F44336 | Skipped medication, errors |
| Info | #2196F3 | Information, links |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Black | #212121 | Primary text |
| Dark Gray | #424242 | Secondary text |
| Gray | #757575 | Tertiary text, icons |
| Light Gray | #BDBDBD | Borders, disabled |
| Very Light Gray | #E0E0E0 | Dividers |
| Background | #F5F5F5 | Screen backgrounds |
| White | #FFFFFF | Cards, surfaces |

### Status Colors

| Status | Color | Badge Background |
|--------|-------|-----------------|
| Taken | #4CAF50 | #E8F5E9 |
| Skipped | #F44336 | #FFEBEE |
| Pending | #FF9800 | #FFF3E0 |
| Missed | #F44336 | #FFEBEE |

---

## Typography

### Font Family

- Primary: System default (San Francisco on iOS, Roboto on Android)
- Bengali: Native Bengali font support

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| display | 34px | Bold (700) | 41px | 0 |
| h1 | 32px | Bold (700) | 40px | 0 |
| h2 | 24px | Bold (700) | 32px | 0 |
| h3 | 20px | SemiBold (600) | 28px | 0.15px |
| h4 | 18px | SemiBold (600) | 24px | 0.15px |
| body | 16px | Regular (400) | 24px | 0.5px |
| body2 | 14px | Regular (400) | 20px | 0.25px |
| caption | 12px | Regular (400) | 16px | 0.4px |
| button | 14px | SemiBold (600) | 20px | 1.25px |

### Usage Guidelines

| Style | Usage |
|-------|-------|
| display | Welcome screens, empty states |
| h1 | Screen titles |
| h2 | Section headers |
| h3 | Card titles |
| body | Body text, descriptions |
| body2 | Secondary text |
| caption | Timestamps, hints |
| button | Button labels |

---

## Spacing

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, tight spacing |
| sm | 8px | Between related elements |
| md | 16px | Component padding |
| lg | 24px | Section margins |
| xl | 32px | Screen horizontal padding |
| xxl | 48px | Large section gaps |

### Screen Padding

```
┌────────────────────────────┐
│ ← 24px (left)              │
│                            │
│                            │
│                            │
│ → 24px (right)             │
└────────────────────────────┘
```

### Component Spacing

```
┌────────────────────────────┐
│ Label                      │ ← 8px gap
├────────────────────────────┤
│ Input Field                │ ← 8px gap
├────────────────────────────┤
│ Error Message              │
└────────────────────────────┘
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| none | 0px | Full-width inputs |
| sm | 8px | Buttons, small elements |
| md | 12px | Cards, inputs |
| lg | 16px | Large cards, modals |
| xl | 24px | Bottom sheets |
| full | 9999px | Pills, avatars, FABs |

---

## Shadows / Elevation

### Android (elevation)

| Level | Elevation | Usage |
|-------|-----------|-------|
| 0 | 0dp | Flat elements |
| 1 | 1dp | Cards at rest |
| 2 | 3dp | Raised cards |
| 4 | 6dp | FAB, floating buttons |
| 8 | 12dp | Modals, dialogs |

### iOS (shadow)

```css
shadow-sm: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
}
```

### Shadow Presets

| Name | Usage |
|------|-------|
| sm | Subtle elevation |
| md | Cards |
| lg | Floating elements |
| xl | Modals |

---

## Icons

### Icon Library

Use SF Symbols on iOS and Material Icons on Android via `@expo/vector-icons`:

```typescript
import { Ionicons } from '@expo/vector-icons';

// Common icons
<Ionicons name="home" size={24} color="#757575" />
<Ionicons name="settings" size={24} color="#757575" />
<Ionicons name="add" size={24} color="#2196F3" />
```

### Icon Sizes

| Size | Usage |
|------|-------|
| 16px | Inline with text |
| 20px | Small buttons |
| 24px | Default |
| 32px | Section icons |
| 48px | Empty state icons |

### Icon Colors

| Context | Color |
|---------|-------|
| Default | #757575 |
| Active | #2196F3 |
| Inactive | #BDBDBD |

---

## Components

### Button States

| State | Primary | Secondary |
|-------|---------|-----------|
| Default | Primary background | Outline |
| Pressed | Primary Dark | Light fill |
| Disabled | 50% opacity | 50% opacity |
| Loading | Spinner replaces text | Spinner replaces text |

### Input States

| State | Border | Label |
|-------|--------|-------|
| Default | #E0E0E0 | Gray |
| Focused | Primary | Primary |
| Error | Error color | Error |
| Disabled | #E0E0E0 | Gray |

### Card States

| State | Elevation |
|-------|-----------|
| Default | 2dp |
| Pressed | 1dp |
| Disabled | 0dp, 50% opacity |

---

## Navigation

### Bottom Tab Bar

- Height: 56px + safe area
- Background: #FFFFFF
- Active icon: Primary color
- Inactive icon: Gray
- Labels: 12px, below icons

### Stack Navigation

- Header: White background, shadow
- Back button: Left arrow icon
- Title: h3 style, centered

### Modals

- Background overlay: rgba(0,0,0,0.5)
- Card: White, lg radius, lg shadow
- Close button: Top right

---

## Animations

### Duration

| Type | Duration |
|------|----------|
| Instant | 0ms |
| Fast | 150ms |
| Normal | 300ms |
| Slow | 500ms |

### Easing

```typescript
// Standard easing
easing: Easing.bezier(0.4, 0, 0.2, 1)

// Enter easing (decelerate)
Easing.out(Easing.cubic)

// Exit easing (accelerate)
Easing.in(Easing.cubic)
```

### Common Animations

| Animation | Duration | Easing |
|-----------|----------|--------|
| Button press | 100ms | ease-out |
| Card press | 150ms | ease-out |
| Modal appear | 300ms | ease-out |
| Page transition | 300ms | ease-in-out |
| Loading spinner | 1000ms | linear (loop) |

---

## Accessibility

### Touch Targets

- Minimum size: 44x44px
- Recommended: 48x48px

### Contrast Ratios

| Text Type | Minimum Ratio |
|-----------|---------------|
| Body text | 4.5:1 |
| Large text | 3:1 |
| Icons | 3:1 |

### Font Scaling

- Support Dynamic Type (iOS)
- Support font scaling (Android)
- Test with 200% scaling

---

## Platform Considerations

### iOS

- Safe area insets for notch devices
- Native iOS styling for inputs
- SF Symbols for system icons
- Haptic feedback on interactions

### Android

- Material Design principles
- Material Icons
- Status bar: Transparent or Primary Dark
- Navigation bar: Match system

---

## Design Tools

### Figma

Design files available at:
- Stitch Project: `11641936393330190866`

### Export

- SVG for icons
- PNG @1x, @2x, @3x for images
- Assets in `assets/` folder

---

## Reference

For detailed component specifications, see:
- [UI Component Guide](./UI_COMPONENT_GUIDE.md)
- [Branding Guidelines](../BRANDING_GUIDELINE.md)
