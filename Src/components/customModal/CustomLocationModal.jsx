import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Modal from 'react-native-modal';
import CustomSearch from '../customSearch/CustomSearch';
import axiosInstance from '../../utils/axiosInstance';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DoctorCard from '../customCards/doctorCard/DoctorCard';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useLoc} from '../../Store/LocationContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomLocationModal = ({visible, setLocation, locnameReciever}) => {
  const {
    handleSearch,
    handleInputChange,
    searchLocation,
    handleUseCurrentLocation,
    isPressed,
    loading,
    doctors,
  } = useLoc();
  const navigation = useNavigation();
  // const [postalCodes, setPostalCodes] = useState([]);
  // const [loading, setLoading] = useState(false);

  // const [searchLocation, setSearchLocation] = useState(locName);
  // const [centerCoordinates, setCenterCoordinates] = useState(null);
  // const [doctors, setDoctors] = useState([]);
  // const [isSearching, setIsSearching] = useState(false);
  // const [locName, setLocName] = useState('');
  // const [load, setLoad] = useState(false);
  // const [isPressed, setIsPressed] = useState(false);
  // const geofenceRadius = 2000;

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     requestLocationPermission();
  //   }
  // }, []);

  // async function requestLocationPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Permission',
  //         message: 'This app requires access to your location.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   } catch (err) {
  //     console.warn('Permission error:', err);
  //     return false;
  //   }
  // }

  // const fetchPostalCode = async (latitude, longitude) => {
  //   try {
  //     const {data} = await axios.get(
  //       `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  //     );
  //     return data?.address?.postcode || null;
  //   } catch (error) {
  //     console.error('Error fetching postal code:', error);
  //     return null;
  //   }
  // };

  // const fetchPostalCodesWithinGeofence = async (center, gridSize) => {
  //   const postalCodesSet = new Set();
  //   const latLngPoints = generateGridPoints(center, geofenceRadius, gridSize);

  //   for (const point of latLngPoints) {
  //     const postcode = await fetchPostalCode(point[0], point[1]);
  //     if (postcode) {
  //       postalCodesSet.add(postcode);
  //     }
  //   }
  //   return Array.from(postalCodesSet);
  // };

  // const generateGridPoints = (center, radius, gridSize) => {
  //   const points = [];
  //   const [lat, lng] = center;

  //   for (let x = -radius; x <= radius; x += gridSize) {
  //     for (let y = -radius; y <= radius; y += gridSize) {
  //       if (Math.sqrt(x * x + y * y) <= radius) {
  //         points.push([
  //           lat + y * 0.0000089,
  //           lng + (x * 0.0000089) / Math.cos(lat * 0.018),
  //         ]);
  //       }
  //     }
  //   }
  //   return points;
  // };

  // const handleUseCurrentLocation = async () => {
  //   setIsPressed(true);
  //   requestLocationPermission();
  //   console.log('im called');
  //   setLoading(true);
  //   Geolocation.getCurrentPosition(
  //     async position => {
  //       const {latitude, longitude} = position.coords;
  //       setCenterCoordinates([latitude, longitude]);

  //       try {
  //         const {data} = await axios.get(
  //           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  //         );
  //         setLocName(data.display_name || 'Unknown Location');
  //         setSearchLocation(data.display_name || 'Unknown Location');
  //         locnameReciever(data.display_name);

  //         const codes = await fetchPostalCodesWithinGeofence(
  //           [latitude, longitude],
  //           1000,
  //         );
  //         setPostalCodes(codes);
  //         await fetchDoctors(codes);
  //       } catch (error) {
  //         console.error('Error fetching location data:', error);
  //       }
  //       setLoading(false);
  //     },
  //     error => {
  //       console.error('Error getting geolocation:', error);
  //       setLoading(false);
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };

  // const handleSearch = async () => {
  //   setLoading(true);
  //   try {
  //     const {data} = await axios.get(
  //       `https://nominatim.openstreetmap.org/search?q=${searchLocation}&format=json&limit=1`,
  //     );
  //     if (data.length > 0) {
  //       const {lat, lon, display_name} = data[0];
  //       setCenterCoordinates([parseFloat(lat), parseFloat(lon)]);
  //       setLocName(display_name);
  //       setSearchLocation(display_name);
  //       locnameReciever(display_name);

  //       const codes = await fetchPostalCodesWithinGeofence(
  //         [parseFloat(lat), parseFloat(lon)],
  //         1000,
  //       );
  //       setPostalCodes(codes);
  //       await fetchDoctors(codes);
  //     } else {
  //       console.error('Location not found');
  //     }
  //   } catch (error) {
  //     console.error('Error searching location:', error);
  //   }
  //   setLoading(false);
  // };
  // const handleInputChange = text => {
  //   setSearchLocation(text);
  //   if (text.trim() === '') {
  //     setLoad(false);
  //     // setSearchedData([]);
  //   } else {
  //     setLoad(true);
  //   }
  // };
  // const fetchDoctors = async zipcodes => {
  //   setIsSearching(true);
  //   try {
  //     const response = await axiosInstance.post('patient/doctornearme', {
  //       zipcodes: zipcodes,
  //       type: 'Good',
  //       page: 1,
  //       limit: 5,
  //     });
  //     console.log(response.data.response);
  //     setDoctors(response.data.response || []);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching doctors:', error);
  //     setDoctors([]);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  const handleNavigateDoctor = item => {
    console.log('ids', item);
    navigation.navigate('DoctorBookAppointment', {data: item.toString()});
  };
  // console.log(postalCodes);
  // console.log(locName);
  console.log(doctors);

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      deviceWidth={true}
      onRequestClose={() => setLocation(false)}>
        <SafeAreaView>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          height: '100%',
          gap: 20,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{alignSelf: 'flex-end',top:30}}
          onPress={() => setLocation(false)}>
          <Ionicons name={'close'} size={28} color={'#313003'} />
        </TouchableOpacity>
        <CustomSearch
          placeholderTextColor={'black'}
          elevation={5}
          onSearch={handleSearch}
          handleInputChange={handleInputChange}
          query={searchLocation}
        />

        <TouchableOpacity onPress={handleUseCurrentLocation}>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <MaterialIcons
                name="my-location"
                color={isPressed ? '#E72B4A' : 'black'}
              />
              <Text style={{color: isPressed ? '#E72B4A' : 'black'}}>
                Use your current location
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{marginTop: 10}}
          />
        ) : doctors === null ? ( // Before API call
          <Image
            source={require('../..//assets/location.png')}
            style={{
              height: heightPercentageToDP(50),
              width: widthPercentageToDP(50),
              resizeMode: 'contain',
            }}
          />
        ) : doctors.length > 0 ? ( // If doctors are available
          doctors.map((item, i) => (
            <DoctorCard
              profile_picture={item?.profile_picture}
              key={i}
              firstname={item?.first_name}
              middlename={item?.middle_name}
              lastname={item?.last_name}
              onClick={() => handleNavigateDoctor(item?.suid)}
              reviews={item?.review_name}
              speciality={item?.department_name}
              hospital={item?.hospital_org}
              reviewstar={
                [1, 2, 3, 4, 5].includes(item?.average_review)
                  ? item?.average_review
                  : ''
              }
            />
          ))
        ) : (
          <Text style={{textAlign: 'center', marginTop: 20, color: 'gray'}}>
            No doctors available
          </Text>
        )}

        {/* {locName && (
          <Text style={{marginTop: 10, color: 'black'}}>
            Location: {locName}
          </Text>
        )} */}
      </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CustomLocationModal;
