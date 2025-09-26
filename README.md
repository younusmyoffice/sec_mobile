This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Project Setup (Required Tooling)

The project is currently pinned to the following versions and tooling. Please match these locally for reliable builds on Android and iOS.

- React: `18.3.1`
- React Native: `0.75.4`
- Node: `>= 18` (recommend Node 18 LTS)
- Package manager: Use one — npm or Yarn. This repo contains both `package-lock.json` and `yarn.lock`. Prefer npm (recommended) and keep `package-lock.json` in sync. If you choose Yarn, remove `package-lock.json` to avoid conflicts.
- Gradle Wrapper: `8.8`
- Android SDK:
  - compileSdk: `34`
  - targetSdk: `34`
  - minSdk: `23`
  - buildTools: `34.0.0`
  - Kotlin: `1.9.24`
  - NDK: `25.1.8937393` (required for WebRTC/Video SDK)
- JDK: `17` (set `JAVA_HOME` to JDK 17)
- iOS platform: `13.4` minimum
- Xcode: 15.x with Command Line Tools
- CocoaPods: `>= 1.13`, but not `1.15.0` or `1.15.1`
- Ruby: `>= 2.6.10` (use rbenv/rvm)
- Watchman (macOS): optional, speeds up the Metro bundler

Environment variables (zsh/bash examples):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"   # macOS default
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$JAVA_HOME/bin"
```

Android Studio (SDK Manager) — install:

- Android SDK Platform 34
- Android SDK Build-Tools 34.0.0
- Android SDK Command-line Tools
- NDK 25.1.8937393

Notes specific to this app:

- Hermes is disabled on Android. You can enable later if desired.
- Video/WebRTC/Foreground Service native modules from `@videosdk.live` are linked; ensure the NDK is installed.
- iOS uses react-native-permissions setup; add required keys to `Info.plist` for Camera/Microphone/Location/Bluetooth.

# Installation

From the project root:

```bash
# 1) Install JS dependencies (choose one package manager and stick to it)
npm ci
# or
yarn install

# 2) iOS: install Ruby gems and CocoaPods deps
gem install bundler # if not present
bundle install
cd ios && bundle exec pod install && cd ..
```

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
