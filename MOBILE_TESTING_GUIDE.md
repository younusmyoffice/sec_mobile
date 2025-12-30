# 📱 Mobile App Patient Registration Testing Guide

## 🚀 **Current Status: READY FOR TESTING**

### ✅ **Services Running:**
- **Backend Server**: `localhost:3000/sec/` ✅
- **Metro Bundler**: Port 8081 ✅  
- **iOS Simulator**: Running ✅
- **API Endpoints**: All functional ✅

---

## 🧪 **Step-by-Step Testing Instructions**

### **Step 1: Open the Mobile App**
1. Look for the **Sharecare** app icon in your iOS Simulator
2. Tap to open the app
3. Wait for the app to load completely

### **Step 2: Navigate to Patient Registration**
1. Look for **"Sign Up"** or **"Register"** button
2. Select **Patient** role (role_id: 5)
3. You should see the registration form

### **Step 3: Test the Registration Form**

#### **🔍 Test 1: Dialing Code Dropdown**
- **Action**: Tap on the dialing code dropdown (left side of mobile field)
- **Expected**: 
  - Dropdown opens with countries list
  - Each country shows flag emoji + name + dialing code
  - Examples: 🇮🇳 India (+91), 🇺🇸 United States (+1)
- **Test Search**: Type "India" or "United States" in search box
- **Select**: Choose any country and verify the code updates

#### **🔍 Test 2: Mobile Number Input**
- **Action**: Enter a 10-digit mobile number in the right field
- **Valid Examples**: `9876543210`, `8070338412`
- **Expected**: 
  - Input accepts only numbers
  - Maximum 10 digits allowed
  - Real-time validation

#### **🔍 Test 3: Email Field**
- **Action**: Enter email address
- **Valid Examples**: `test@example.com`, `user123@gmail.com`
- **Expected**: 
  - Email format validation
  - Error message for invalid format

#### **🔍 Test 4: Password Field**
- **Action**: Enter password
- **Valid Examples**: `TestPass123`, `MyPassword456`
- **Expected**: 
  - Minimum 8 characters required
  - Error message for short passwords

#### **🔍 Test 5: Form Submission**
- **Action**: Fill all fields correctly and tap "Register"
- **Expected**: 
  - Form submits to backend
  - Success message or navigation to next screen
  - If mobile exists: "MOBILE_EXISTS" error

---

## 🎯 **Test Scenarios**

### **Scenario A: Successful Registration**
```
Mobile: 9876543210
Dialing Code: 🇮🇳 India (+91)
Email: newuser@example.com
Password: TestPass123
```
**Expected**: Registration successful, navigate to next screen

### **Scenario B: Existing Mobile Number**
```
Mobile: 8070338412 (if already exists)
Dialing Code: 🇮🇳 India (+91)
Email: existing@example.com
Password: TestPass123
```
**Expected**: "MOBILE_EXISTS" error message

### **Scenario C: Form Validation Errors**
```
Mobile: 123 (too short)
Email: invalid-email (wrong format)
Password: 123 (too short)
```
**Expected**: Individual field error messages

### **Scenario D: Dialing Code Dropdown**
```
Action: Tap dropdown
Search: "United States"
Select: 🇺🇸 United States (+1)
```
**Expected**: Dropdown shows flags, search works, selection updates

---

## 🔧 **Troubleshooting**

### **If App Doesn't Load:**
1. Check Metro bundler is running: `lsof -i :8081`
2. Restart Metro: `npx react-native start`
3. Reload app in simulator: `Cmd + R`

### **If API Errors:**
1. Check backend server: `curl http://localhost:3000/sec/countries/codes`
2. Verify config: Check `Src/utils/config.js` has `localhost:3000/sec/`

### **If Dropdown Doesn't Load:**
1. Check network connection
2. Verify countries API: `curl http://localhost:3000/sec/countries/codes`
3. Check console logs for errors

---

## 📊 **Expected API Responses**

### **Countries/Codes Endpoint:**
```json
{
  "response": {
    "in": {
      "name": "India (भारत)",
      "iso2": "in", 
      "dialCode": "91"
    },
    "us": {
      "name": "United States",
      "iso2": "us",
      "dialCode": "1"
    }
  }
}
```

### **Registration Endpoint:**
```json
// Success
{"success": true, "message": "Registration successful"}

// Error
{"error": "MOBILE_EXISTS"}
{"error": "INVALID_EMAIL"}
{"error": "PASSWORD_TOO_SHORT"}
```

---

## 🎉 **Success Criteria**

✅ **App loads without crashes**  
✅ **Registration form displays correctly**  
✅ **Dialing code dropdown shows countries with flags**  
✅ **Form validation works for all fields**  
✅ **API calls reach backend successfully**  
✅ **Error messages display appropriately**  
✅ **Successful registration navigates to next screen**  

---

## 📱 **Testing Checklist**

- [ ] App opens in iOS Simulator
- [ ] Registration form loads
- [ ] Dialing code dropdown works
- [ ] Country flags display correctly
- [ ] Search functionality works
- [ ] Mobile number validation works
- [ ] Email validation works
- [ ] Password validation works
- [ ] Form submission works
- [ ] API integration works
- [ ] Error handling works
- [ ] Success flow works

---

## 🚨 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| App won't load | Restart Metro bundler |
| Dropdown empty | Check countries API endpoint |
| Form validation errors | Check field validation logic |
| API connection failed | Verify backend server running |
| Mobile exists error | Use different mobile number |

---

**Ready to test! 🚀**
