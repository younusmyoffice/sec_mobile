
export const validateField = (name, value) => {
    let error = '';
    
    // Special handling for dialing_code
    if (name === 'dialing_code') {
      if (!value || value.toString().trim() === '') {
        return 'Please select a country';
      }
      if (!/^\d{1,4}$/.test(value)) {
        return 'Invalid dialing code (1-4 digits required)';
      }
      return '';
    }
    
    if (!value || value.toString().trim() === '') {
        return 'This field is required';  
      }
    switch (name) {

      case 'mobile':
        if (!/^\d{10}$/.test(value)) {
          error = 'Invalid mobile number (10 digits required)';
        }
        break;
  
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email format';
        }
        break;
  
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
  
      default:
        break;
    }
  
    return error;
  };
  