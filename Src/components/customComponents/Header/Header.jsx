import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  // Modal,
  Pressable,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import styles from '../Header/HeaderCss';
import CustomNotificationList from '../../customNotificationList/CustomNotificationList';
import CustomLocationModal from '../../customModal/CustomLocationModal';
import { useLoc } from '../../../Store/LocationContext';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../Store/Authentication';

// Helper function to determine profile navigation based on user role
const getProfileNavigation = async () => {
  try {
    const roleIdString = await AsyncStorage.getItem('role_id');
    if (!roleIdString || roleIdString === 'null') return null;
    
    const roleId = JSON.parse(roleIdString);
    
    // Map role_id to their respective profile screens
    const profileRoutes = {
      2: 'admin-profile',      // HCF Admin
      3: 'ProfileScreenDoctor', // Doctor
      4: 'diagnostic-profile',   // Diagnostic
      5: 'Profile',               // Patient
      6: 'clinic-profile',        // Clinic
    };
    
    return profileRoutes[roleId] || null;
  } catch (error) {
    console.error('Error getting profile navigation:', error);
    return null;
  }
};

const Header = ({
  logo,
  showLocationMark,
  locationIcon,
  notificationUserIcon,
  width = 50,
  height = 31,
  resize,
  onlybell,
  navigationProps,
  notification,
  id,
}) => {
  const { locName } = useLoc();
  const { handleLogout } = useAuth();
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  console.log("length",notification?.length);
  const notificationModal = 1;
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [location, setLocation] = useState(false);
  const [locationname, setLocationName] = useState();
  
  // Handle profile navigation based on user role
  const handleProfileNavigation = async () => {
    try {
      const profileRoute = await getProfileNavigation();
      if (profileRoute) {
        navigation.navigate(profileRoute);
      } else {
        console.log('⚠️ No profile route found for current user role');
      }
    } catch (error) {
      console.error('Error navigating to profile:', error);
    }
  };
  const locnameReciever = locname => {
    setLocationName(locname);
  };

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false); // Close the modal
        return true; // Prevent default back button behavior
      }
      return false; // Allow default behavior (exit the app or go back)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the listener
  }, [modalVisible]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cart}>
        <TouchableWithoutFeedback >
          <Image
            source={logo}
            style={[
              styles.logo,
              { width: width, height: height, resizeMode: resize },
            ]}
          />
          {/* <Text style={{}}>{notification?.length}</Text> */}
        </TouchableWithoutFeedback>
      </View>
      {/* {location mark props} */}

      {modalVisible === true ? (
        // <Modal
        //   // style={{height:500}}

        //   animationType="fade"
        //   transparent={true}
        //   visible={modalVisible}
        //   onRequestClose={() => {
        //     // Alert.alert('Modal has been closed.');
        //     setModalVisible(!modalVisible);
        //   }}>
        //   <View style={styles.centeredView}>
        //     <View style={styles.modalView}>
        //       <CustomNotificationList
        //         setModalVisible={setModalVisible}
        //         modalVisible={modalVisible}
        //       />
        //     </View>
        //   </View>
        // </Modal>
        <Modal
          isVisible={modalVisible}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          deviceWidth={true}
          onRequestClose={() => setModalVisible(false)}>
          <View
            style={{
              // padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              // alignItems: 'center',
              height: '100%',
              gap: 20,
              // width: '100%',
            }}>
            <CustomNotificationList
              notification={notification}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              id={id}
            />
          </View>
        </Modal>
      ) : null}
      {showLocationMark && (
        <>
          {location && (
            <CustomLocationModal
              visible={location}
              setLocation={setLocation}
              locnameReciever={locnameReciever}
            />
          )}
          <View style={{ marginHorizontal: 5 }}>
            <TouchableOpacity
              onPress={() => setLocation(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                justifyContent: 'space-evenly',
              }}>
              <FontAwesome5
                name="map-marker-alt"
                size={hp(3)}
                color="#AEAAAE"
              />

              <Text
                style={[
                  styles.location,
                  {
                    color: '#AEAAAE',
                    fontSize: 10 * 1.6,
                    fontFamily: 'Poppins-Medium',
                  },
                ]}>
                {locName?.split(',')[0] || 'Set Location'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* {location icon props} */}
      {locationIcon && (
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(navigationProps);
            }}>
            <Icon name="user" size={hp(3)} color="#AEAAAE" />
          </TouchableOpacity>
        </View>
      )}
      {notificationUserIcon && (
        <>
          <View >
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons
                  name="bell"
                  size={hp(3)}
                  color="#AEAAAE"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleProfileNavigation}>
                <MaterialCommunityIcons
                  name="account"
                  size={hp(3)}
                  color="#AEAAAE"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <MaterialCommunityIcons
                  name="logout"
                  size={hp(3)}
                  color="#AEAAAE"
                />
              </TouchableOpacity>
              </View>
            {/* {!onlybell ?(
               <TouchableOpacity
               onPress={() => {
                 navigation.navigate(navigationProps);
               }}>
               <Icon name="user" size={hp(3)} color="#AEAAAE" />
             </TouchableOpacity>
            ):(
              <></>
            )} */}
          </View>
        </>
      )}

      {/* {notification props} */}
    </SafeAreaView>
  );
};

export default Header;
