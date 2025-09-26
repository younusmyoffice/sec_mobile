
export const validateField = (name, value) => {
    let error = '';
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
  