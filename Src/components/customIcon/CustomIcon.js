import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const iconExists = (iconName) => {
  return MaterialCommunityIcons.getImageSourceSync(iconName, 24, '#E72B4A') !== undefined;
};

const CustomIcon = ({ iconName, focused }) => {
  const color = focused ? '#E72B4A' : '#AEAAAE';
  const size = 26;

  if (iconExists(iconName)) {
    return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
  } else {
    return <FontAwesome name={iconName} color={color} size={size} />;
  }
};
export default CustomIcon