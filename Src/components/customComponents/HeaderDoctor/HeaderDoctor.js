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
import {useNavigation} from '@react-navigation/native';
const HeaderDoctor = () => {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  console.log(screenWidth);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cart}>
        <TouchableWithoutFeedback onPress>
          <Image
            source={require('../../../assets/images/ShareecareHeaderLogo.png')}
            style={styles.logo}
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={{flexDirection: 'row', gap: 25}}>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notification');
            }}>
            <MaterialCommunityIcons name="bell" size={hp(3)} color="#AEAAAE" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileScreenDoctor');
            }}>
            <Icon name="user" size={hp(3)} color="#AEAAAE" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#E6E1E5',
    borderWidth: 1,
    marginBottom: 3,
    marginTop: 1,
    height: hp(7),
    // top:200,
    // elevation: 2,
    paddingHorizontal: 15,
  },
  logo: {
    width: 50,
    height: 31,
  },
});
export default HeaderDoctor;
