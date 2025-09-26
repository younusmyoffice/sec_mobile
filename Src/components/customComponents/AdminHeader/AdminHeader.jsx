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
import styles from './AdminHeaderCss';
const AdminHeader = () => {
  const screenWidth = Dimensions.get('window').width;
  console.log(screenWidth);
  return (
    // <SafeAreaView style={styles.container}>
    //   <View>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         gap: 7,
    //         justifyContent: 'space-evenly',
    //       }}>
    //       <View>
    //         <TouchableWithoutFeedback>
    //           <Image
    //             source={require('../../../../assets/hcfadmin.png')}
    //             style={styles.logo}
    //           />
    //         </TouchableWithoutFeedback>
    //       </View>
    //       <View style={{flexDirection: 'row'}}>
    //         <View>
    //           <TouchableOpacity>
    //             <MaterialCommunityIcons
    //               name="bell"
    //               size={hp(3)}
    //               color="#AEAAAE"
    //             />
    //           </TouchableOpacity>
    //         </View>
    //         <View>
    //           <TouchableOpacity>
    //             <Icon name="user" size={hp(3)} color="#AEAAAE" />
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // </SafeAreaView>

    <SafeAreaView style={styles.container}>
    <View style={styles.cart}>
      <TouchableWithoutFeedback onPress>
        <Image
          source={require('../../../assets/hcfadmin.png')}
          style={styles.logo}
        />
      </TouchableWithoutFeedback>
    </View>
 
   <View style={{flexDirection:'row',gap:10 }}>

    <View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="bell" size={hp(3)} color="#AEAAAE" />
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity>
        <Icon name="user" size={hp(3)} color="#AEAAAE" />
      </TouchableOpacity>
    </View>
   </View>
  </SafeAreaView>
  );
};

export default AdminHeader;
