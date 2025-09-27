#!/bin/bash

# Sharecare Mobile App Setup Script
# This script automates the setup process for the Sharecare Mobile App

set -e

echo "🚀 Starting Sharecare Mobile App Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only"
    exit 1
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_status "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    print_success "Homebrew installed"
else
    print_success "Homebrew already installed"
fi

# Install Node.js 20 LTS
print_status "Setting up Node.js 20 LTS..."
if ! command -v nvm &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

nvm install 20
nvm use 20
print_success "Node.js $(node --version) installed"

# Install JDK 17
print_status "Installing JDK 17..."
brew install openjdk@17
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
print_success "JDK $(java -version 2>&1 | head -n 1) installed"

# Install Android Studio and SDK
print_status "Installing Android Studio..."
brew install --cask android-studio
brew install --cask android-commandlinetools

# Set up Android SDK
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

mkdir -p ~/Library/Android/sdk/cmdline-tools
cp -r /opt/homebrew/share/android-commandlinetools/cmdline-tools ~/Library/Android/sdk/cmdline-tools/latest

print_success "Android Studio and SDK installed"

# Install Ruby using rbenv
print_status "Setting up Ruby 3.1.0..."
brew install rbenv

# Add rbenv to shell profile
if ! grep -q 'rbenv' ~/.zshrc; then
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
    echo 'eval "$(rbenv init -)"' >> ~/.zshrc
fi

export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

rbenv install 3.1.0
rbenv global 3.1.0
print_success "Ruby $(ruby --version) installed"

# Install CocoaPods
print_status "Installing CocoaPods..."
gem install cocoapods
print_success "CocoaPods $(pod --version) installed"

# Install Android SDK components
print_status "Installing Android SDK components..."
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;25.1.8937393"
print_success "Android SDK components installed"

# Install project dependencies
print_status "Installing project dependencies..."
npm ci
print_success "Node.js dependencies installed"

# Install iOS dependencies
print_status "Installing iOS dependencies..."
cd ios
bundle install
bundle exec pod install
cd ..
print_success "iOS dependencies installed"

# Check Xcode installation
print_status "Checking Xcode installation..."
if ! xcode-select --print-path | grep -q "Xcode.app"; then
    print_warning "Xcode is not installed or not properly configured"
    print_warning "Please install Xcode from the App Store and run:"
    print_warning "sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
else
    print_success "Xcode is properly configured"
fi

# Final verification
print_status "Verifying installation..."
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Java: $(java -version 2>&1 | head -n 1)"
echo "Ruby: $(ruby --version)"
echo "CocoaPods: $(pod --version)"
echo "Android SDK: $ANDROID_HOME"
echo "Java Home: $JAVA_HOME"

print_success "Setup completed successfully!"
print_status "Next steps:"
echo "1. Install Xcode from App Store if not already installed"
echo "2. Run 'npm start' to start Metro bundler"
echo "3. Run 'npm run android' to build for Android"
echo "4. Run 'npm run ios' to build for iOS"
echo ""
print_status "For detailed instructions, see SETUP_README.md"
