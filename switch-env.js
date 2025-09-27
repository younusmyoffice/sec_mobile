#!/usr/bin/env node

// Environment Switcher Script
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'Src/utils/config.js');

function switchEnvironment(env) {
  const configContent = `// Environment Configuration
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};

// Get current environment (you can change this to switch environments)
const CURRENT_ENV = ENV.${env.toUpperCase()}; // Change to ENV.PRODUCTION for production

const CONFIG = {
  [ENV.DEVELOPMENT]: {
    baseUrl: 'http://192.168.0.132:3000/sec/',
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
`;

  fs.writeFileSync(configPath, configContent);
  console.log(`✅ Switched to ${env.toUpperCase()} environment`);
  console.log(`🌐 API Base URL: ${env === 'development' ? 'http://0.0.0.0:3000/sec/' : 'https://api.shareecare.com/sec/'}`);
}

const env = process.argv[2];

if (!env || !['development', 'production'].includes(env)) {
  console.log('Usage: node switch-env.js [development|production]');
  console.log('Examples:');
  console.log('  node switch-env.js development  # Switch to local development server');
  console.log('  node switch-env.js production   # Switch to production server');
  process.exit(1);
}

switchEnvironment(env);
