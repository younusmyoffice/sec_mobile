import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseUrl} from '../utils/baseUrl';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, PermissionsAndroid } from 'react-native';

export const Location = createContext({});

export const useLoc = () => {
  const loc = useContext(Location);
  if (!loc) {
    throw new Error(' error error ');
  }
  return loc;
};

const LocationProvider = ({children}) => {
  const navigation = useNavigation();
  const [postalCodes, setPostalCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchLocation, setSearchLocation] = useState(locName);
  const [centerCoordinates, setCenterCoordinates] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locName, setLocName] = useState('');
  const [load, setLoad] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const geofenceRadius = 2000;

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
  useEffect(() => {
    const initLocation = async () => {
      await requestLocationPermission();
      handleUseCurrentLocation();
    };
    initLocation();
  }, []);
/**
 * Requests location permission from the user.
 *
 * For Android, it prompts the user to grant access to fine location.
 * For iOS, it checks the current permission status and requests location permission if not already granted.
 * Logs the result of the permission request to the console.
 * Handles and logs any errors encountered during the permission request process.
 */


  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status === RESULTS.DENIED) {
          const requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (requestStatus === RESULTS.GRANTED) {
            console.log('iOS Location permission granted');
          } else {
            console.log('iOS Location permission denied');
          }
        }
      } catch (error) {
        console.warn('iOS Permission error:', error);
      }
    }
  }
  const fetchPostalCode = async (latitude, longitude) => {
    try {
      const {data} = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );
      return data?.address?.postcode || null;
    } catch (error) {
      console.error('Error fetching postal code:', error);
      return null;
    }
  };

  const fetchPostalCodesWithinGeofence = async (center, gridSize) => {
    const postalCodesSet = new Set();
    const latLngPoints = generateGridPoints(center, geofenceRadius, gridSize);

    for (const point of latLngPoints) {
      const postcode = await fetchPostalCode(point[0], point[1]);
      if (postcode) {
        postalCodesSet.add(postcode);
      }
    }
    return Array.from(postalCodesSet);
  };

  const generateGridPoints = (center, radius, gridSize) => {
    const points = [];
    const [lat, lng] = center;

    for (let x = -radius; x <= radius; x += gridSize) {
      for (let y = -radius; y <= radius; y += gridSize) {
        if (Math.sqrt(x * x + y * y) <= radius) {
          points.push([
            lat + y * 0.0000089,
            lng + (x * 0.0000089) / Math.cos(lat * 0.018),
          ]);
        }
      }
    }
    return points;
  };

  const handleUseCurrentLocation = async () => {
    setIsPressed(true);
    requestLocationPermission();
    console.log('im called');
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        setCenterCoordinates([latitude, longitude]);

        try {
          const {data} = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          setLocName(data.display_name || 'Unknown Location');
          setSearchLocation(data.display_name || 'Unknown Location');
          //   locnameReciever(data.display_name);

          const codes = await fetchPostalCodesWithinGeofence(
            [latitude, longitude],
            1000,
          );
          setPostalCodes(codes);
          await fetchDoctors(codes);
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
        setLoading(false);
      },
      error => {
        console.error('Error getting geolocation:', error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchLocation}&format=json&limit=1`,
      );
      if (data.length > 0) {
        const {lat, lon, display_name} = data[0];
        setCenterCoordinates([parseFloat(lat), parseFloat(lon)]);
        setLocName(display_name);
        setSearchLocation(display_name);
        // locnameReciever(display_name);

        const codes = await fetchPostalCodesWithinGeofence(
          [parseFloat(lat), parseFloat(lon)],
          1000,
        );
        setPostalCodes(codes);
        await fetchDoctors(codes);
      } else {
        console.error('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
    setLoading(false);
  };
  const handleInputChange = text => {
    setSearchLocation(text);
    if (text.trim() === '') {
      setLoad(false);
      // setSearchedData([]);
    } else {
      setLoad(true);
    }
  };
  const fetchDoctors = async zipcodes => {
    setIsSearching(true);
    try {
      // console.log('🔍 Fetching doctors with zipcodes:', zipcodes);
      
      // Validate zipcodes before making the request
      if (!zipcodes || !Array.isArray(zipcodes) || zipcodes.length === 0) {
        // console.log('⚠️ No valid zipcodes provided, skipping doctor fetch');
        setDoctors([]);
        return;
      }

      const requestPayload = {
        zipcodes: zipcodes,
        type: 'Good',
        page: 1,
        limit: 5,
      };
      
      // console.log('📡 Sending request to patient/doctornearme with payload:', requestPayload);
      
      const response = await axiosInstance.post('patient/doctornearme', requestPayload);
      // console.log('✅ Doctors API response:', response.data);
      setDoctors(response.data.response || []);
      setLoading(false);
    } catch (error) {
      // Only log actual errors, not "no doctors found" responses
      if (error.response?.status !== 400 || !error.response?.data?.error?.includes('No doctors')) {
        console.error('❌ Error fetching doctors:', error);
      }
      setDoctors([]);
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <Location.Provider
      value={{
        handleSearch,
        handleInputChange,
        searchLocation,
        handleUseCurrentLocation,
        isPressed,
        loading,
        doctors,
        locName,
        postalCodes
      }}>
      {children}
    </Location.Provider>
  );
};
export default LocationProvider;
