# Task Completion

A small mobile app that tells you how far along a task **should** be today. Use it for weekly progress reports instead of counting the days by hand.

Each task has a start date and a deadline. The app shows the share of that period that has passed as a large percentage. That's the expected completion you put in your report.

## How the percentage is calculated

Work is assumed to be spread evenly over every calendar day of the task, counting both the start date and the deadline:

```
expected % = days passed (including today) ÷ total days in the period × 100
```

The start date is day 1, and the deadline is 100%. Before the start date the app shows 0%; after the deadline it stays at 100%.

Example: a work-year task from **1 Jul 2026 to 30 Jun 2027** has 365 days. On **16 Oct 2026** it is day 108, so the expected completion is 108 ÷ 365 = **29.6%**.

## Features

- **Big expected-completion number** for your default task, with a progress bar or ring, plus the day count and days left.
- **Several tasks:** tap a task chip to switch, long-press it (or tap the task name) to edit or delete it, and use **+ New** to add one. The default task (★) is shown when the app opens.
- **Pick start and deadline dates** with date pickers. New tasks are pre-filled with the current work year (1 Jul → 30 Jun).
- **"As of" date:** today by default. Pick another date, such as the Friday your report covers, and tap the round arrow to go back to today.
- **Settings** (gear button):
  - **Report:** preview and copy a ready-to-paste summary of all tasks for the selected date, and choose which tasks to include.
  - **Data:** export a backup file, import a backup, or delete all tasks.
  - **Look:** system, light or dark theme; bar or ring progress style.
  - **About:** app version and how the percentage is calculated.

All data is stored **only on the device**, in a local SQLite store. Nothing is sent to a server. Uninstalling the app deletes your tasks, so export a backup first if you want to keep them.

## Tech stack

- [Expo](https://expo.dev) SDK 57 with React Native and TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) for navigation (routes in `src/app/`)
- `expo-sqlite` key–value store for on-device storage

## Getting started

### Requirements

- [Node.js](https://nodejs.org) (LTS)
- Either:
  - an Android or iOS phone with the [Expo Go](https://expo.dev/go) app, or
  - an Android emulator (Android Studio) or iOS Simulator (macOS only)

### Install and run

```bash
npm install
npm run go
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a` to open the Android emulator.

> `npm start` opens the app in a **development build** instead of Expo Go, because `expo-dev-client` is installed. Use `npm run go` until you've installed a development build (see below). You can also press `s` in the terminal to switch between them.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run go` | Start the dev server for Expo Go |
| `npm start` | Start the dev server for a development build |
| `npm run android` / `npm run ios` | Start and open on an Android emulator / iOS Simulator |
| `npm run lint` | Lint the project |
| `npx tsc --noEmit` | Type-check the project |
| `npm run build-apk` | Build an installable Android APK with EAS |
| `npm run build-dev-client` | Build an Android development build with EAS |
| `npm run build-ios` | Build an iPhone install link (ad hoc) with EAS |
| `npm run register-ios-device` | Register an iPhone so it can install `build-ios` builds |

## Building installable apps

Builds run in the cloud with [EAS Build](https://docs.expo.dev/build/introduction/), so you don't need Android Studio or Xcode. You need a free [Expo account](https://expo.dev/signup). The first build asks you to log in and link the project.

### Android (APK)

```bash
npm run build-apk
```

When the build finishes, EAS gives you a download link and QR code for the `.apk`. Open it on the phone and install it (you may need to allow installing from unknown sources).

### iPhone

iPhones can only install apps signed for them, so you need a **paid Apple Developer account**.

1. Register each iPhone that should install the app:
   ```bash
   npm run register-ios-device
   ```
   Open the link or QR code on the iPhone and follow the steps.
2. Build:
   ```bash
   npm run build-ios
   ```
3. Open the install link or QR code from EAS on a registered iPhone.

Phones registered after a build need a new build. For many testers, use TestFlight instead (`eas build --profile production` then `eas submit -p ios`).

## Project structure

```
src/
  app/          Screens (Expo Router): home, task form, settings sheet
  components/   UI components (percent display, date field, buttons…)
  hooks/        Task and settings state, today's date
  lib/          Date maths, progress calculation, storage, report, backup
  constants/    Theme colors and spacing
```
