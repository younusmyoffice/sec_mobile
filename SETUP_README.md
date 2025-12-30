npm # Sharecare Mobile App - Complete Setup Guide

This guide provides step-by-step instructions to set up the Sharecare Mobile App development environment with exact versions and dependencies.

## 📋 System Requirements

### Core Versions (Exact Requirements)
- **Node.js**: `20.19.5` (LTS)
- **React**: `18.3.1`
- **React Native**: `0.75.4`
- **JDK**: `17.0.16` (set JAVA_HOME to JDK 17)
- **Gradle Wrapper**: `8.8`
- **Ruby**: `3.1.0` (using rbenv)
- **CocoaPods**: `1.16.2`

### Android Requirements
- **Android SDK**:
  - compileSdk: `34`
  - targetSdk: `34`
  - minSdk: `23`
  - buildTools: `34.0.0`
  - Kotlin: `1.9.24`
  - NDK: `25.1.8937393` (required for WebRTC/Video SDK)

### iOS Requirements
- **iOS Platform**: `13.4` minimum
- **Xcode**: 15.x with Command Line Tools (REQUIRED - install from App Store)
- **macOS**: Required for iOS development

## 🛠️ Installation Steps

### 1. Prerequisites Installation

#### Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Install Node.js 20 LTS
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### Install JDK 17
```bash
# macOS using Homebrew
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
```

#### Install Android Studio & SDK
```bash
# Install Android Studio
brew install --cask android-studio

# Install Android Command Line Tools
brew install --cask android-commandlinetools

# Set up Android SDK
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

# Create SDK directory structure
mkdir -p ~/Library/Android/sdk/cmdline-tools
cp -r /opt/homebrew/share/android-commandlinetools/cmdline-tools ~/Library/Android/sdk/cmdline-tools/latest

# Accept licenses and install required components
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;25.1.8937393"
```

#### Install Ruby using rbenv
```bash
# Install rbenv
brew install rbenv

# Set up rbenv in shell
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc

# Install Ruby 3.1.0
rbenv install 3.1.0
rbenv global 3.1.0
```

#### Install CocoaPods
```bash
gem install cocoapods
```

#### Install Xcode (REQUIRED)
**Important**: Xcode must be installed from the App Store for iOS development.

1. Open App Store
2. Search for "Xcode"
3. Install Xcode (this is a large download, ~15GB)
4. After installation, run:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### 2. Environment Variables Setup

Add these to your `~/.zshrc` or `~/.bash_profile`:

```bash
# Node.js
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"

# Android
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

# Java
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$PATH:$JAVA_HOME/bin"

# Ruby
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# Reload your shell
source ~/.zshrc
```

### 3. Project Setup

#### Clone and Navigate to Project
```bash
cd /Users/apple/Documents/code/sec/sec_mobile/Sharecare-MobileApp-main
```

#### Install JavaScript Dependencies
```bash
# Install dependencies
npm ci
```

#### Install iOS Dependencies
```bash
# Install Ruby gems
cd ios
bundle install

# Install CocoaPods dependencies
bundle exec pod install
cd ..
```

### 4. Running the App

#### Start Metro Bundler
```bash
# In terminal 1
npm start
```

#### Run Android App
```bash
# In terminal 2
npm run android
```

#### Run iOS App
```bash
# In terminal 2
npm run ios
```

## 🔧 Key Dependencies

### Major Libraries Used
- **Navigation**: `@react-navigation/native` v6.1.18
- **Video SDK**: `@videosdk.live/react-native-sdk` v0.1.19
- **UI Components**: `react-native-paper` v5.12.5
- **State Management**: Context API
- **HTTP Client**: `axios` v1.7.7
- **Real-time**: `socket.io-client` v4.8.1

### Native Modules
- WebRTC/Video calling functionality
- Camera and microphone permissions
- Location services
- Document picker
- File system access

## ⚠️ Important Notes

1. **Hermes**: Disabled on Android (can be enabled later)
2. **NDK**: Required for Video SDK WebRTC functionality
3. **Permissions**: iOS requires Camera/Microphone/Location/Bluetooth permissions in Info.plist
4. **Package Manager**: Use npm consistently (don't mix with yarn)
5. **Ruby Version**: Must be 3.1.0+ for CocoaPods compatibility
6. **Xcode**: Must be installed from App Store for iOS development

## 🐛 Troubleshooting

### Common Issues

1. **JDK Version**: Ensure JAVA_HOME points to JDK 17
   ```bash
   java -version  # Should show 17.0.16
   ```

2. **Android SDK**: Verify all required SDK components are installed
   ```bash
   sdkmanager --list | grep -E "(platforms|build-tools|ndk)"
   ```

3. **CocoaPods**: Use exact version constraints specified
   ```bash
   pod --version  # Should show 1.16.2
   ```

4. **Node Version**: Must be Node 20 or higher
   ```bash
   node --version  # Should show v20.19.5
   ```

5. **NDK**: Required for Video SDK - install version 25.1.8937393
   ```bash
   ls $ANDROID_HOME/ndk/25.1.8937393
   ```

6. **Xcode**: Must be properly installed and configured
   ```bash
   xcode-select --print-path  # Should point to Xcode.app
   xcodebuild -version        # Should show Xcode version
   ```

### Verification Commands
```bash
# Check all versions
node --version          # Should be v20.19.5
npm --version           # Should be 10.8.2
java -version           # Should be JDK 17.0.16
ruby --version          # Should be 3.1.0
pod --version           # Should be 1.16.2

# Check Android setup
echo $ANDROID_HOME       # Should point to Android SDK
echo $JAVA_HOME          # Should point to JDK 17
sdkmanager --version     # Should work without errors

# Check iOS setup
xcode-select --print-path
xcodebuild -version
```

## 📱 Project Structure

```
Sharecare-MobileApp-main/
├── android/                 # Android-specific code
│   ├── app/
│   ├── gradle/
│   └── build.gradle
├── ios/                     # iOS-specific code
│   ├── shareecare/
│   ├── Podfile
│   └── Podfile.lock
├── Src/                     # Main source code
│   ├── api/
│   ├── authentication/
│   ├── components/
│   ├── screens/
│   └── utils/
├── package.json            # Node.js dependencies
├── App.js                  # Main app entry point
└── README.md              # Original project README
```

## 🚀 Next Steps

After successful setup:

1. **Test the build**: Run `npm run android` and `npm run ios`
2. **Configure API endpoints**: The app is configured to use your local development server
3. **Switch environments**: Use the environment switcher to toggle between dev and production
4. **Test Video SDK**: Ensure WebRTC functionality works
5. **Configure permissions**: Add required iOS permissions to Info.plist

## 🔧 Environment Configuration

The app supports two environments:

### Development (Local Server)
- **URL**: `http://0.0.0.0:3000/sec/`
- **Status**: ✅ Currently Active
- **Switch to**: `node switch-env.js development`

### Production (Live Server)
- **URL**: `https://api.shareecare.com/sec/`
- **Status**: ⚠️ Currently returning 503 errors
- **Switch to**: `node switch-env.js production`

### Quick Environment Switching
```bash
# Switch to local development server
node switch-env.js development

# Switch to production server
node switch-env.js production
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all required software is installed
4. Check that Xcode is properly installed and configured
5. Verify Android SDK components are installed

## ✅ Setup Checklist

- [ ] Node.js 20.19.5 installed
- [ ] JDK 17.0.16 installed and JAVA_HOME set
- [ ] Android Studio installed
- [ ] Android SDK 34 with NDK 25.1.8937393 installed
- [ ] Ruby 3.1.0 installed via rbenv
- [ ] CocoaPods 1.16.2 installed
- [ ] Xcode installed from App Store
- [ ] Environment variables configured
- [ ] Project dependencies installed (`npm ci`)
- [ ] iOS dependencies installed (`pod install`)
- [ ] Android build works (`npm run android`)
- [ ] iOS build works (`npm run ios`)

---

**Last Updated**: January 2025
**Setup Verified On**: macOS Sequoia 24.6.0
**Architecture**: Apple Silicon (ARM64)
