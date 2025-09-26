// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import Geolocation from '@react-native-community/geolocation';
// import axios from 'axios';
// import NoAppointmentCard from "../../Dashboard/PatientAppointment/NoAppointmentCard/NoAppointmentCard";
// import Drcard from "../../constants/drcard/drcard";
// import { useNavigation } from '@react-navigation/native';

// const LocationModal = () => {
//   const navigation = useNavigation();
//   const [open, setOpen] = useState(false);
//   const [postalCodes, setPostalCodes] = useState([]);
//   const [isButtonClicked, setIsButtonClicked] = useState(false);
//   const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
//   const [searchLocation, setSearchLocation] = useState("");
//   const [centerCoordinates, setCenterCoordinates] = useState(null);
//   const [doctors, setDoctors] = useState([]);
//   const [locname, setLocname] = useState("");
//   const geofenceRadius = 2000;

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const fetchPostalCodesWithinGeofence = async (center, gridSize) => {
//     const postalCodesSet = new Set();
//     const latLngPoints = generateGridPoints(center, geofenceRadius, gridSize);

//     for (let i = 0; i < latLngPoints.length; i++) {
//       const point = latLngPoints[i];
//       const postcode = await fetchPostalCode(point[0], point[1]);
//       if (postcode) {
//         postalCodesSet.add(postcode);
//       }
//     }

//     return Array.from(postalCodesSet);
//   };

//   const fetchPostalCode = async (latitude, longitude) => {
//     try {
//       const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json;`
//       const response = await fetch(url);
//       const data = await response.json();
//       return data?.address?.postcode || null;
//     } catch (error) {
//       console.error("Error fetching reverse geocoding data:", error);
//       return null;
//     }
//   };

//   const generateGridPoints = (center, radius, gridSize) => {
//     const latLngPoints = [];
//     const lat = center[0];
//     const lng = center[1];

//     for (let x = -radius; x <= radius; x += gridSize) {
//       for (let y = -radius; y <= radius; y += gridSize) {
//         if (Math.sqrt(x * x + y * y) <= radius) {
//           const latLng = [
//             lat + y * 0.0000089,
//             lng + (x * 0.0000089) / Math.cos(lat * 0.018),
//           ];
//           latLngPoints.push(latLng);
//         }
//       }
//     }

//     return latLngPoints;
//   };

//   const handleUseCurrentLocation = async () => {
//     try {
//       setIsButtonClicked(true);
//       setLoadingCurrentLocation(true);

//       if ("geolocation" in navigator) {
//         Geolocation.getCurrentPosition(
//           async (position) => {
//             const userCoordinates = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };

//             const response = await fetch(
// `              https://nominatim.openstreetmap.org/reverse?lat=${userCoordinates.latitude}&lon=${userCoordinates.longitude}&format=json
// `            );
//             const locationData = await response.json();
//             const locationName = locationData.display_name || "Unknown Location";

//             setCenterCoordinates([userCoordinates.latitude, userCoordinates.longitude]);
//             setLocname(locationName);

//             const postalCodes = await fetchPostalCodesWithinGeofence(
//               [userCoordinates.latitude, userCoordinates.longitude],
//               1000
//             );
//             setPostalCodes(postalCodes);

//             await fetchDoctors(postalCodes);

//             setLoadingCurrentLocation(false);
//           },
//           (error) => {
//             console.error("Error getting geolocation:", error);
//             setLoadingCurrentLocation(false);
//           }
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching current location:", error);
//       setLoadingCurrentLocation(false);
//     }
//   };

//   const fetchDoctors = async (zipcode) => {
//     try {
//       const response = await axios.post(
//         "/sec/patient/doctornearme",
//         JSON.stringify({
//           zipcodes: zipcode,
//           type: "Good", 
//           page: 1,
//           limit: 5,
//         })
//       );
//       setDoctors(response?.data?.response || []);
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//       setDoctors([]);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       setLoadingCurrentLocation(true);

//       const url = https://nominatim.openstreetmap.org/search?q=${searchLocation}&format=json&limit=1;
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data && data.length > 0) {
//         const { lat, lon, display_name } = data[0];
//         setCenterCoordinates([parseFloat(lat), parseFloat(lon)]);
//         setLocname(display_name);

//         const postalCodes = await fetchPostalCodesWithinGeofence(
//           [parseFloat(lat), parseFloat(lon)],
//           1000
//         );
//         setPostalCodes(postalCodes);

//         await fetchDoctors(postalCodes);
//       } else {
//         console.error("Location not found");
//       }

//       setLoadingCurrentLocation(false);
//     } catch (error) {
//       console.error("Error searching location:", error);
//       setLoadingCurrentLocation(false);
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity onPress={handleOpen} style={styles.locationBox}>
//         <View style={styles.locationTextWrapper}>
//           <Icon name="location-on" size={32} color={locname ? "#E72B4A" : "#AEAAAE"} />
//           <Text style={[styles.locationText, { color: locname ? "#E72B4A" : "#AEAAAE" }]}>
//             {locname ? locname.split(",")[0] : "Set Location.."}
//           </Text>
//         </View>
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={open}
//         onRequestClose={handleClose}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.header}>
//               <Text style={styles.headerText}>Add Your Location</Text>
//               <TouchableOpacity onPress={handleClose}>
//                 <Icon name="close" size={25} color="#313033" />
//               </TouchableOpacity>
//             </View>

//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search location here"
//               value={searchLocation}
//               onChangeText={setSearchLocation}
//               onSubmitEditing={handleSearch}
//             />

//             <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.currentLocationButton}>
//               <Icon name="gps-fixed" size={24} />
//               <Text style={styles.currentLocationText}>Use Current Location</Text>
//  …