export const togglePasswordVisibilityHelper = (
  isPasswordVisible,
  setPasswordVisible,
) => {
  setPasswordVisible(!isPasswordVisible);
};

export const formatCardNumberHelper = text => {
  const cleaned = text.replace(/\D/g, '');
  const grouped = cleaned.match(/.{1,4}/g);
  return grouped ? grouped.join(' ') : '';
};

export const handleChangeTextHelper = (text, type, name, onChange,planId) => {
  let formattedText = text;

  if (type === 'cardNumber') {
    formattedText = formatCardNumberHelper(text);
  } else if (type === 'number') {
    formattedText = text.replace(/[^0-9]/g, '');
  }

  onChange(name, formattedText,planId);
};

export const getMaxLengthHelper = (name, value) => {
  if (name === 'mobileOremail') {
    return /^\d*$/.test(value) ? 10 : 100;
  }
  if (name === 'dialing_code') return 4;
  if (name === 'mobile') return 10;
  if (name === 'CVV') return 3;
  if (name === 'account') return 16;
  return 40;
};
