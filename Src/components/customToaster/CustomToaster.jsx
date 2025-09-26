// CustomToaster.js
import Toast from 'react-native-toast-message';

const CustomToaster = {
  show: (type = 'info', text1 = '', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
      
    });
  },
};

export default CustomToaster;
