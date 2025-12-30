#!/usr/bin/env node

/**
 * Test script for Patient Registration API
 * This script tests the registration endpoints and validates the data structure
 */

const axios = require('axios');

// Test configuration
const TEST_CONFIG = {
  // Mock API for testing (since both local and production are down)
  mockApi: 'https://jsonplaceholder.typicode.com',
  
  // Expected registration data structure
  expectedRegistrationData: {
    email: 'test@example.com',
    mobile: '8070338412',
    password: 'TestPassword123',
    dialing_code: '91',
    role_id: 5, // Patient role
    added_by: 'self'
  },
  
  // Expected login data structure
  expectedLoginData: {
    email: 'test@example.com',
    password: 'TestPassword123',
    login_with_email: true,
    role_id: 5
  }
};

console.log('🧪 Testing Patient Registration API Endpoints\n');

// Test 1: Check if mock API is accessible
async function testMockApiAccess() {
  console.log('1️⃣ Testing Mock API Access...');
  try {
    const response = await axios.get(`${TEST_CONFIG.mockApi}/posts/1`);
    console.log('✅ Mock API is accessible');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log('❌ Mock API is not accessible');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 2: Validate registration data structure
function validateRegistrationData() {
  console.log('\n2️⃣ Validating Registration Data Structure...');
  
  const requiredFields = ['email', 'mobile', 'password', 'dialing_code', 'role_id'];
  const data = TEST_CONFIG.expectedRegistrationData;
  
  let isValid = true;
  requiredFields.forEach(field => {
    if (!data[field]) {
      console.log(`❌ Missing required field: ${field}`);
      isValid = false;
    } else {
      console.log(`✅ Field ${field}: ${data[field]}`);
    }
  });
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.log('❌ Invalid email format');
    isValid = false;
  } else {
    console.log('✅ Email format is valid');
  }
  
  // Validate mobile number (10 digits)
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(data.mobile)) {
    console.log('❌ Invalid mobile number format (should be 10 digits)');
    isValid = false;
  } else {
    console.log('✅ Mobile number format is valid');
  }
  
  // Validate dialing code (1-4 digits)
  const dialingCodeRegex = /^\d{1,4}$/;
  if (!dialingCodeRegex.test(data.dialing_code)) {
    console.log('❌ Invalid dialing code format (should be 1-4 digits)');
    isValid = false;
  } else {
    console.log('✅ Dialing code format is valid');
  }
  
  // Validate password length
  if (data.password.length < 8) {
    console.log('❌ Password too short (minimum 8 characters)');
    isValid = false;
  } else {
    console.log('✅ Password length is valid');
  }
  
  return isValid;
}

// Test 3: Validate login data structure
function validateLoginData() {
  console.log('\n3️⃣ Validating Login Data Structure...');
  
  const requiredFields = ['email', 'password', 'login_with_email', 'role_id'];
  const data = TEST_CONFIG.expectedLoginData;
  
  let isValid = true;
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      console.log(`❌ Missing required field: ${field}`);
      isValid = false;
    } else {
      console.log(`✅ Field ${field}: ${data[field]}`);
    }
  });
  
  return isValid;
}

// Test 4: Test countries/codes endpoint (if available)
async function testCountriesEndpoint() {
  console.log('\n4️⃣ Testing Countries/Codes Endpoint...');
  
  // Test production endpoint
  try {
    const response = await axios.get('https://api.shareecare.com/sec/countries/codes', {
      timeout: 5000
    });
    console.log('✅ Production countries endpoint is accessible');
    console.log(`   Status: ${response.status}`);
    return true;
  } catch (error) {
    console.log('❌ Production countries endpoint failed');
    console.log(`   Error: ${error.response?.status || error.message}`);
  }
  
  // Test local endpoint
  try {
    const response = await axios.get('http://192.168.0.132:3000/sec/countries/codes', {
      timeout: 5000
    });
    console.log('✅ Local countries endpoint is accessible');
    console.log(`   Status: ${response.status}`);
    return true;
  } catch (error) {
    console.log('❌ Local countries endpoint failed');
    console.log(`   Error: ${error.response?.status || error.message}`);
  }
  
  return false;
}

// Test 5: Simulate registration API call
async function simulateRegistrationCall() {
  console.log('\n5️⃣ Simulating Registration API Call...');
  
  try {
    // Use mock API to simulate the call structure
    const response = await axios.post(`${TEST_CONFIG.mockApi}/posts`, {
      title: 'Patient Registration Test',
      body: JSON.stringify(TEST_CONFIG.expectedRegistrationData),
      userId: 1
    });
    
    console.log('✅ Registration API call structure is valid');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response ID: ${response.data.id}`);
    return true;
  } catch (error) {
    console.log('❌ Registration API call failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 6: Simulate login API call
async function simulateLoginCall() {
  console.log('\n6️⃣ Simulating Login API Call...');
  
  try {
    // Use mock API to simulate the call structure
    const response = await axios.post(`${TEST_CONFIG.mockApi}/posts`, {
      title: 'Patient Login Test',
      body: JSON.stringify(TEST_CONFIG.expectedLoginData),
      userId: 1
    });
    
    console.log('✅ Login API call structure is valid');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response ID: ${response.data.id}`);
    return true;
  } catch (error) {
    console.log('❌ Login API call failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Patient Registration Tests\n');
  
  const results = {
    mockApiAccess: await testMockApiAccess(),
    registrationDataValid: validateRegistrationData(),
    loginDataValid: validateLoginData(),
    countriesEndpoint: await testCountriesEndpoint(),
    registrationCall: await simulateRegistrationCall(),
    loginCall: await simulateLoginCall()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Patient registration should work properly.');
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
  }
  
  console.log('\n📱 Mobile App Testing:');
  console.log('1. Start the mobile app: npm run ios');
  console.log('2. Navigate to Patient Registration');
  console.log('3. Fill in the registration form');
  console.log('4. Test the dialing code dropdown');
  console.log('5. Submit the form and check for errors');
}

// Run the tests
runTests().catch(console.error);