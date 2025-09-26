import {useState} from 'react';

const useFormValidation = validationRules => {
  // Initialize errors state based on validation rules
  const initialErrors = Object.keys(validationRules).reduce((acc, field) => {
    acc[field] = '';
    return acc;
  }, {});
  const [errors, setErrors] = useState(initialErrors);

  // Validate individual field
  const validateField = (name, value) => {
    setErrors(prevErrors => {
      const newErrors = {...prevErrors};

      // Check if field has a validation rule
      if (validationRules[name]) {
        const {required, message, pattern} = validationRules[name];

        // Required field validation
        if (required && !value.toString().trim()) {
          newErrors[name] = message || `${name} is required`;
        }
        // Pattern validation (if provided)
        else if (pattern && !pattern.test(value)) {
          newErrors[name] = message || `Invalid ${name} format`;
        } else {
          newErrors[name] = '';
        }
      }

      return newErrors;
    });
  };

  // Validate entire form
  const validateForm = formData => {
    const newErrors = {...initialErrors};
    let isValid = true;

    // Validate each field based on rules
    Object.keys(validationRules).forEach(field => {
      const {required, message, pattern} = validationRules[field];
      const value = formData[field];

      // Required field validation
      if (required && !value?.toString().trim()) {
        newErrors[field] = message || `${field} is required`;
        isValid = false;
      }
      // Pattern validation (if provided)
      else {
        newErrors[field] = '';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Reset errors to initial state
  const resetErrors = () => {
    setErrors(initialErrors);
  };

  return {
    errors,
    validateField,
    validateForm,
    setErrors,
    resetErrors,
  };
};

export default useFormValidation;
