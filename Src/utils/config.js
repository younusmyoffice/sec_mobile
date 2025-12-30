// Environment Configuration
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};

// Get current environment (you can change this to switch environments)
const CURRENT_ENV = ENV.DEVELOPMENT; // Change to ENV.PRODUCTION for production

const CONFIG = {
  [ENV.DEVELOPMENT]: {
    baseUrl: 'http://localhost:3000/sec/',
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
