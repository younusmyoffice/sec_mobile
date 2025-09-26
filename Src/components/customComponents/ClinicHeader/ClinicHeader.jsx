import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styles from './ClinicHeaderStyles'
import { useNavigation } from '@react-navigation/native';
const ClinicHeader = () => {
  const navigation=useNavigation();
  const handleNotificationOpen=()=>{
navigation.navigate('notification-open')
  }
  const screenWidth = Dimensions.get('window').width;
  console.log(screenWidth);
  return (
   
    <SafeAreaView style={styles.container}>
    <View style={styles.cart}>
      <TouchableWithoutFeedback onPress>
        <Image
          source={require('../../../assets/Clinic1.jpeg')}
          style={styles.logo}
        />
      </TouchableWithoutFeedback>
    </View>
 
   <View style={{flexDirection:'row',gap:10 }}>

    <View>
      <TouchableOpacity onPress={handleNotificationOpen}>
        <MaterialCommunityIcons name="bell" size={hp(3)} color="#AEAAAE" />
      </TouchableOpacity>
    </View>
    {/* <View>
      <TouchableOpacity>
        <Icon name="user" size={hp(3)} color="#AEAAAE" />
      </TouchableOpacity>
    </View> */}
   </View>
  </SafeAreaView>
  );
};

export default ClinicHeader;
