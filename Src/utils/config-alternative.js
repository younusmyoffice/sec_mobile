// Alternative Configuration for different testing scenarios
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  LOCALHOST: 'localhost'
};

// Get current environment
const CURRENT_ENV = ENV.DEVELOPMENT; // Change this as needed

const CONFIG = {
  [ENV.DEVELOPMENT]: {
    baseUrl: 'http://192.168.0.132:3000/sec/', // Your computer's IP
    apiTimeout: 10000,
    debug: true
  },
  [ENV.LOCALHOST]: {
    baseUrl: 'http://localhost:3000/sec/', // For iOS Simulator
    apiTimeout: 10000,
    debug: true
  },
  [ENV.PRODUCTION]: {
    baseUrl: 'https://api.shareecare.com/sec/',
    apiTimeout: 15000,
    debug: false
  }
};

export const config = CONFIG[CURRENT_ENV];
export const baseUrl = config.baseUrl;

// Log current configuration
console.log('🔧 Current Environment:', CURRENT_ENV);
console.log('🌐 API Base URL:', baseUrl);
