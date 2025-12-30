import {
  RTCView,
  createCameraVideoTrack,
  switchAudioDevice,
} from '@videosdk.live/react-native-sdk';
// BUG FIX: Import wrapped version to prevent iOS crashes
// Removed useMediaDevice import - it was causing automatic device enumeration on iOS
import { wrappedMediaDevices } from '../../utils/videosdkWrapper';
const mediaDevices = wrappedMediaDevices;
import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  MicOff,
  MicOn,
  VideoOff,
  VideoOn,
  CameraSwitch,
  Speaker,
} from '../../assets/icons';
import TextInputContainer from '../../components/TextInputContainer';
import Button from '../../components/Button';
import colors from '../../styles/colors';
import {createMeeting, getToken, validateMeeting} from '../../api/api';
import {SCREEN_NAMES} from '../../navigators/screenNames';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import Menu from '../../components/Menu';
import MenuItem from '../meeting/Components/MenuItem';
import {ROBOTO_FONTS} from '../../styles/fonts';
import Modal from 'react-native-modal';
import axios from 'axios';
import {baseUrl} from '../../utils/baseUrl';
import axiosInstance from '../../utils/axiosInstance';



export default function Join({ navigation }) {
  const [tracks, setTrack] = useState(null);
  const [micOn, setMicon] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [name, setName] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [isAudioListVisible, setAudioListVisible] = useState(false);
  const [facingMode, setfacingMode] = useState('user');
  const [audioList, setAudioList] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [deviceEnumerationFailed, setDeviceEnumerationFailed] = useState(false);
  const [isEnumeratingDevices, setIsEnumeratingDevices] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validAppointment, setValidAppointment] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [isVisibleCreateMeetingContainer, setisVisibleCreateMeetingContainer] = useState(false);
  const [isVisibleJoinMeetingContainer, setisVisibleJoinMeetingContainer] = useState(false);
  const [appointment, setAppointment] = useState(179); // Replace with dynamic appointment ID
  const [isVisibleAppointmentContainer, setisVisibleAppointmentContainer] = useState(false);
  const [meetingType, setMeetingType] = useState({ key: 'video', value: 'Video Meeting' });
  const optionRef = React.useRef(null);
const routes=useRoute()
// BUG FIX: Extract route params - renamed appointmentId to routeAppointmentId to avoid conflict with state
const{appid, roomId: routeRoomId, appointmentId: routeAppointmentId, patientId: routePatientId, doctorId: routeDoctorId, patientName: routePatientName}=routes?.params || {};
  const baseUrl = 'https://api.shareecare.com/sec/'; // Replace with actual base URL
  
  // BUG FIX: Extract all route params for proper video SDK connection
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎬 [MOBILE] JOIN SCREEN INITIALIZED");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📹 [MOBILE] Join Screen Route Params:", JSON.stringify({
    appid: routes?.params?.appid || appid,
    appointmentId: routeAppointmentId,
    roomId: routeRoomId,
    roomId_type: typeof routeRoomId,
    patientId: routePatientId,
    doctorId: routeDoctorId,
    patientName: routePatientName
  }, null, 2));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // WEB IMPLEMENTATION PATTERN: Initialize appointment validation on mount
  useEffect(() => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔄 [MOBILE] Component Mounted - Initializing");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 [MOBILE] Route Params:", {
      appid: appid || routeAppointmentId,
      routeRoomId: routeRoomId,
      routePatientName: routePatientName
    });

    // Set patient name if available
    if (routePatientName && !name) {
      const patientNameStr = String(routePatientName).trim();
      console.log('👤 [MOBILE] Setting patient name from route params:', patientNameStr);
      setName(patientNameStr);
    }

    // WEB PATTERN: Check appointment validity FIRST (like web MeetingDetailsScreen)
    if (appid || routeAppointmentId) {
      console.log('🔍 [MOBILE] Starting appointment validation flow (web pattern)...');
      checkAppointmentValidity();
    } else {
      console.warn('⚠️ [MOBILE] No appointment ID available - showing manual meeting entry');
      setisVisibleCreateMeetingContainer(true);
    }
  }, []);

  // Meeting types for the dropdown
  const meetingTypes = [
    { key: 'video', value: 'Video Meeting' },
    { key: 'audio', value: 'Audio Meeting' },
  ];

  // WEB PATTERN: Step 1 - Check appointment window validity (like web MeetingDetailsScreen.checkAppointmentWindow)
  const checkAppointmentValidity = async () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 [MOBILE] Step 1: Checking Appointment Window");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const appointmentIdToUse = appid || routeAppointmentId;
    console.log("📋 [MOBILE] Appointment ID:", appointmentIdToUse);
    
    if (!appointmentIdToUse) {
      console.error('❌ [MOBILE] ERROR: No appointment ID available');
      Toast.show('Appointment ID is required', Toast.SHORT);
      setisVisibleCreateMeetingContainer(true);
      return;
    }

    setLoading(true);
    try {
      console.log('⏳ [MOBILE] Fetching appointment validity from backend...');
      console.log('🌐 [MOBILE] API Endpoint:', `patient/getAppointmentDateTime/${appointmentIdToUse}`);
      const requestStartTime = Date.now();
      const response = await axiosInstance.get(
        `patient/getAppointmentDateTime/${appointmentIdToUse}`,
      );
      const requestDuration = Date.now() - requestStartTime;
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ [MOBILE] Appointment Validity Response Received');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⏱️  [MOBILE] Request Duration:', `${requestDuration}ms`);
      console.log('📥 [MOBILE] Response Status:', response?.status);
      console.log('📥 [MOBILE] Response Data:', JSON.stringify(response?.data || {}, null, 2));
      console.log('📋 [MOBILE] joinCallflag:', response?.data?.joinCallflag);
      console.log('📋 [MOBILE] remainingTime:', response?.data?.remainingTime);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (response.data?.joinCallflag) {
        console.log('✅ [MOBILE] Appointment is valid - joinCallflag is true');
        setValidAppointment(true);
        // WEB PATTERN: Step 2 - Fetch existing socket_id if appointment is valid
        await fetch_getSocketID();
      } else {
        console.warn('⚠️ [MOBILE] Invalid Appointment - joinCallflag is false');
        console.warn('⚠️ [MOBILE] Appointment is not in valid time window');
        setValidAppointment(false);
        Toast.show(
          'The appointment is not available at this time.',
          Toast.SHORT,
        );
        // Don't show create/join UI if appointment is invalid
        setisVisibleCreateMeetingContainer(false);
        setisVisibleJoinMeetingContainer(false);
      }
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] ERROR Checking Appointment Validity');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] Error Type:', error?.name || 'Unknown');
      console.error('❌ [MOBILE] Error Message:', error?.message || 'No error message');
      console.error('❌ [MOBILE] Error Stack:', error?.stack);
      console.error('❌ [MOBILE] HTTP Status:', error?.response?.status || 'N/A');
      console.error('❌ [MOBILE] Response Data:', JSON.stringify(error?.response?.data || {}, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Fallback: Allow manual meeting creation if API fails
      console.warn('⚠️ [MOBILE] Falling back to manual meeting creation');
      setisVisibleCreateMeetingContainer(true);
      Toast.show('Could not validate appointment. You can still create a meeting.', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // WEB PATTERN: Step 2 - Fetch existing socket_id (like web MeetingDetailsScreen.fetch_getSocketID)
  const fetch_getSocketID = async () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 [MOBILE] Step 2: Fetching Existing Socket ID");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const appointmentIdToUse = appid || routeAppointmentId;
    
    // WEB PATTERN: Check if roomId was passed from route params (backward compatibility)
    const roomIdStr = routeRoomId ? String(routeRoomId).trim() : '';
    if (roomIdStr) {
      console.log('✅ [MOBILE] Using roomId from route params:', roomIdStr);
      console.log('✅ [MOBILE] Setting meeting ID and room ID from route params');
      // BUG FIX: Ensure both are set as strings
      setRoomId(roomIdStr);
      setMeetingId(roomIdStr);
      console.log('✅ [MOBILE] Meeting ID and Room ID set from route:', {
        meetingId: roomIdStr,
        roomId: roomIdStr
      });
      // WEB PATTERN: Show join UI with pre-filled meeting ID (don't auto-join)
      setisVisibleJoinMeetingContainer(true);
      setisVisibleCreateMeetingContainer(false);
      return;
    }
    
    try {
      console.log('⏳ [MOBILE] Fetching socket ID from API for appointment:', appointmentIdToUse);
      console.log('🌐 [MOBILE] API Endpoint:', `patient/getUpdateSocketId/${appointmentIdToUse}`);
      const requestStartTime = Date.now();
      const response = await axiosInstance.get(
        `patient/getUpdateSocketId/${appointmentIdToUse}`,
      );
      const requestDuration = Date.now() - requestStartTime;
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ [MOBILE] Socket ID Response Received');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⏱️  [MOBILE] Request Duration:', `${requestDuration}ms`);
      console.log('📥 [MOBILE] Response Status:', response?.status);
      console.log('📥 [MOBILE] Response Data:', JSON.stringify(response?.data || {}, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // WEB PATTERN: Check response format (can be array or string "Generate SocketID")
      if (response.data?.response === "Generate SocketID") {
        // WEB PATTERN: No meeting exists - show create meeting UI
        console.log('📝 [MOBILE] No meeting exists - showing Create Meeting UI');
        setMeetingId("");
        setRoomId(null);
        setisVisibleCreateMeetingContainer(true);
        setisVisibleJoinMeetingContainer(false);
      } else if (response.data?.response?.[0]?.socket_id) {
        // WEB PATTERN: Meeting exists - pre-fill meeting ID and show join UI
        const fetchedRoomId = String(response.data.response[0].socket_id).trim(); // Ensure it's a string
        console.log('✅ [MOBILE] Existing meeting found:', {
          socket_id: fetchedRoomId,
          type: typeof fetchedRoomId,
          length: fetchedRoomId.length
        });
        // BUG FIX: Set both roomId and meetingId, ensuring they're strings
        setRoomId(fetchedRoomId);
        setMeetingId(fetchedRoomId);
        console.log('✅ [MOBILE] Meeting ID and Room ID set:', {
          meetingId: fetchedRoomId,
          roomId: fetchedRoomId
        });
        // WEB PATTERN: Show join UI (don't auto-join - wait for user to click "Join Meeting")
        setisVisibleJoinMeetingContainer(true);
        setisVisibleCreateMeetingContainer(false);
      } else {
        // Fallback: Show create meeting UI
        console.warn('⚠️ [MOBILE] Unexpected response format - showing Create Meeting UI');
        setisVisibleCreateMeetingContainer(true);
        setisVisibleJoinMeetingContainer(false);
      }
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] ERROR Fetching Socket ID');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] Error Type:', error?.name || 'Unknown');
      console.error('❌ [MOBILE] Error Message:', error?.message || 'No error message');
      console.error('❌ [MOBILE] HTTP Status:', error?.response?.status || 'N/A');
      console.error('❌ [MOBILE] Response Data:', JSON.stringify(error?.response?.data || {}, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      // Fallback: Show create meeting UI
      console.warn('⚠️ [MOBILE] Falling back to Create Meeting UI');
      setisVisibleCreateMeetingContainer(true);
      setisVisibleJoinMeetingContainer(false);
    }
  };

  // WEB PATTERN: Step 3 - Create new meeting (like web MeetingDetailsScreen.handleCreateMeeting)
  const createMeetingApi = async () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📹 [MOBILE] Step 3: Creating New Meeting");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (!name.trim()) {
      console.error('❌ [MOBILE] ERROR: Name is required');
      Toast.show('Please enter your name', Toast.SHORT);
      return;
    }

    setLoading(true);
    try {
      // Get VideoSDK token
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5YzNkMzBiNC05NTgyLTRmOTUtOGQ1YS0yZWZhZDhiMDgxNWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NTA2MTA1NCwiZXhwIjoxNzc2NTk3MDU0fQ.m-fAWIFu2hytS7YMGd1EzzaOekKSwg10F7SH-hkJqtU';
      
      console.log('⏳ [MOBILE] Creating meeting via VideoSDK API...');
      const createStartTime = Date.now();
      const newMeetingId = await createMeeting({ token });
      const createDuration = Date.now() - createStartTime;
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ [MOBILE] Meeting Created Successfully');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⏱️  [MOBILE] Creation Duration:', `${createDuration}ms`);
      console.log('📥 [MOBILE] New Meeting ID:', newMeetingId);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (!newMeetingId) {
        throw new Error('Failed to create meeting - no meeting ID returned');
      }

      // WEB PATTERN: Store meeting ID in database (like web MeetingDetailsScreen.update_socketID)
      console.log('💾 [MOBILE] Storing meeting ID in database...');
      await update_socketID(newMeetingId);

      // WEB PATTERN: Update local state and navigate to meeting (don't auto-join)
      setRoomId(newMeetingId);
      setMeetingId(newMeetingId);
      setisVisibleCreateMeetingContainer(false);
      
      // WEB PATTERN: Navigate to active meeting (like web onClickStartMeeting)
      console.log('🧭 [MOBILE] Navigating to active meeting...');
      await joinVideoCall(newMeetingId);
      
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] ERROR Creating Meeting');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] Error Type:', error?.name || 'Unknown');
      console.error('❌ [MOBILE] Error Message:', error?.message || 'No error message');
      console.error('❌ [MOBILE] Error Stack:', error?.stack);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      Toast.show('Failed to create meeting. Please try again.', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Update socket ID in the database
  const update_socketID = async (meetingId) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💾 [MOBILE] Updating Socket ID in Database");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    try {
      // BUG FIX: Use appid from route params or fallback to routeAppointmentId
      const appointmentIdToUse = appid || routeAppointmentId;
      if (!appointmentIdToUse) {
        console.error('❌ [MOBILE] ERROR: No appointment ID available for updating socket ID');
        Toast.show('Missing appointment information', Toast.SHORT);
        return;
      }

      const payload = {
        appointment_id: appointmentIdToUse,
        socket_id: meetingId,
      };
      console.log('📋 [MOBILE] Update Payload:', JSON.stringify(payload, null, 2));
      console.log('🌐 [MOBILE] API Endpoint:', 'patient/putSocketId/');
      
      const requestStartTime = Date.now();
      const response = await axiosInstance.put(`patient/putSocketId/`, payload);
      const requestDuration = Date.now() - requestStartTime;
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ [MOBILE] Socket ID Update Response');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⏱️  [MOBILE] Request Duration:', `${requestDuration}ms`);
      console.log('📥 [MOBILE] Response Status:', response?.status);
      console.log('📥 [MOBILE] Response Data:', JSON.stringify(response?.data || {}, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      Toast.show('Meeting created successfully', Toast.SHORT);
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] ERROR Updating Socket ID');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] Error Type:', error?.name || 'Unknown');
      console.error('❌ [MOBILE] Error Message:', error?.message || 'No error message');
      console.error('❌ [MOBILE] Error Stack:', error?.stack);
      console.error('❌ [MOBILE] HTTP Status:', error?.response?.status || 'N/A');
      console.error('❌ [MOBILE] Response Data:', JSON.stringify(error?.response?.data || {}, null, 2));
      console.error('❌ [MOBILE] Request Config:', {
        url: error?.config?.url,
        method: error?.config?.method,
        data: error?.config?.data
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      Toast.show('Failed to update socket ID', Toast.SHORT);
    }
  };

  // Join the video call
  const joinVideoCall = async (roomId) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📹 [MOBILE] JOIN VIDEO CALL FLOW START");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log('📋 [MOBILE] Input Parameters:', {
      roomId: roomId,
      roomId_type: typeof roomId,
      name: name.trim() || 'Not set',
      micOn: micOn,
      videoOn: videoOn,
      facingMode: facingMode
    });

    // BUG FIX: Convert roomId to string if it's a number
    const roomIdStr = String(roomId).trim();
    console.log('🔧 [MOBILE] Converted roomId to string:', roomIdStr);

    if (!name.trim()) {
      console.error('❌ [MOBILE] ERROR: Name is required');
      Toast.show('Please enter your name', Toast.SHORT);
      return;
    }

    if (!roomIdStr) {
      console.error('❌ [MOBILE] ERROR: Room ID is required');
      Toast.show('Please enter a valid meeting ID', Toast.SHORT);
      return;
    }

    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5YzNkMzBiNC05NTgyLTRmOTUtOGQ1YS0yZWZhZDhiMDgxNWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NTA2MTA1NCwiZXhwIjoxNzc2NTk3MDU0fQ.m-fAWIFu2hytS7YMGd1EzzaOekKSwg10F7SH-hkJqtU';
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 [VIDEO SDK] Validating Meeting');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 [VIDEO SDK] Validation Parameters:', {
        meetingId: roomIdStr,
        meetingId_length: roomIdStr?.length,
        meetingId_type: typeof roomIdStr,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...'
      });
      
      // BUG FIX: Check if meeting ID format matches VideoSDK format BEFORE validation
      // VideoSDK meeting IDs are in format: xxxx-xxxx-xxxx (alphanumeric with dashes)
      const videosdkFormatRegex = /^[\w]{4}-[\w]{4}-[\w]{4}$/;
      const isValidFormat = videosdkFormatRegex.test(roomIdStr);
      
      console.log('🔍 [VIDEO SDK] Format Check:', {
        meetingId: roomIdStr,
        isValidFormat: isValidFormat,
        expectedFormat: 'xxxx-xxxx-xxxx'
      });
      
      let validationResult = null;
      
      // Only validate if format matches VideoSDK format
      if (isValidFormat) {
        const validationStartTime = Date.now();
        validationResult = await validateMeeting({
          meetingId: roomIdStr,
          token: token,
        });
        const validationDuration = Date.now() - validationStartTime;
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ [VIDEO SDK] Validation Response');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⏱️  [VIDEO SDK] Validation Duration:', `${validationDuration}ms`);
        console.log('📥 [VIDEO SDK] Validation Result:', JSON.stringify(validationResult || {}, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } else {
        // Invalid format - skip validation, will create new meeting below
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.warn('⚠️ [VIDEO SDK] Invalid meeting ID format - skipping validation');
        console.warn('⚠️ [VIDEO SDK] Meeting ID from database:', roomIdStr);
        console.warn('⚠️ [VIDEO SDK] Expected format: xxxx-xxxx-xxxx');
        console.warn('⚠️ [VIDEO SDK] This appears to be an old/invalid meeting ID');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        // Set validation result to indicate invalid format
        validationResult = { meetingId: null, err: 'Invalid meeting ID format. Please create a new meeting.' };
      }

      let meetingIdToUse = roomIdStr;

      // CRITICAL BUG FIX: Prioritize using existing meeting if validation succeeds
      // Check validation success FIRST - if meeting exists, join it!
      const isValidationSuccess = validationResult && 
                                   validationResult.meetingId && 
                                   !validationResult.err &&
                                   validationResult.meetingId.trim().length > 0;
      
      // Check for error conditions that require creating a new meeting (only if validation didn't succeed):
      const isInvalidFormat = !isValidFormat || validationResult?.err?.includes('Invalid meeting ID format');
      const isRoomNotFound = validationResult?.err === 'Room not found.' || validationResult?.err?.includes('Room not found');
      const isNetworkError = validationResult?.err?.includes('Network') || validationResult?.err?.includes('network');
      
      console.log('🔍 [VIDEO SDK] Validation Decision:', {
        isValidationSuccess,
        isInvalidFormat,
        isRoomNotFound,
        isNetworkError,
        validationResult_meetingId: validationResult?.meetingId,
        validationResult_err: validationResult?.err,
        roomIdStr: roomIdStr,
        isValidFormat: isValidFormat
      });
      
      // CRITICAL BUG FIX: Prioritize using existing meeting if validation succeeds
      // This ensures patient joins the same meeting created by doctor
      if (isValidationSuccess) {
        // ✅ Validation succeeded - meeting exists, use existing meeting ID
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ [VIDEO SDK] Meeting validated successfully - JOINING EXISTING MEETING');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ [VIDEO SDK] Original meeting ID from database:', roomIdStr);
        console.log('✅ [VIDEO SDK] Validated meeting ID:', validationResult.meetingId);
        console.log('✅ [VIDEO SDK] This meeting was created by doctor, patient will join same meeting');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        meetingIdToUse = validationResult.meetingId;
        // IMPORTANT: Don't update database - meeting already exists and is valid
      } else if (isInvalidFormat || isRoomNotFound || isNetworkError) {
        // ❌ Validation failed or error occurred - create new meeting
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (isInvalidFormat) {
          console.warn('⚠️ [VIDEO SDK] Invalid meeting ID format detected, creating new meeting...');
          console.warn('⚠️ [VIDEO SDK] Old meeting ID:', roomIdStr);
        } else if (isNetworkError) {
          console.warn('⚠️ [VIDEO SDK] Network error during validation, creating new meeting...');
        } else if (isRoomNotFound) {
          console.warn('⚠️ [VIDEO SDK] Room not found, creating new meeting...');
          console.warn('⚠️ [VIDEO SDK] Original meeting ID:', roomIdStr);
        } else {
          console.warn('⚠️ [VIDEO SDK] Validation error, creating new meeting...');
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
          const createStartTime = Date.now();
          const newMeetingId = await createMeeting({ token });
          const createDuration = Date.now() - createStartTime;
          
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('✅ [VIDEO SDK] New Meeting Created');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('⏱️  [VIDEO SDK] Creation Duration:', `${createDuration}ms`);
          console.log('📥 [VIDEO SDK] New Meeting ID:', newMeetingId);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          
          if (newMeetingId) {
            meetingIdToUse = newMeetingId;
            
            // Update the database with the new meeting ID
            console.log('💾 [MOBILE] Updating database with new meeting ID...');
            try {
              await update_socketID(newMeetingId);
              console.log('✅ [MOBILE] Database updated successfully with new meeting ID:', newMeetingId);
            } catch (updateError) {
              console.error('⚠️ [MOBILE] Failed to update database, but continuing with join:', updateError);
              console.error('⚠️ [MOBILE] Update Error Details:', {
                message: updateError?.message,
                stack: updateError?.stack
              });
            }
          } else {
            throw new Error('Failed to create meeting - no meeting ID returned');
          }
        } catch (createError) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('❌ [VIDEO SDK] ERROR Creating Meeting');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('❌ [VIDEO SDK] Error Type:', createError?.name || 'Unknown');
          console.error('❌ [VIDEO SDK] Error Message:', createError?.message || 'No error message');
          console.error('❌ [VIDEO SDK] Error Stack:', createError?.stack);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          Toast.show('Failed to create meeting. Please try again.', Toast.SHORT);
          return;
        }
      } else {
        // Fallback: Unknown state - show error
        const errorMsg = validationResult?.err || 'Invalid meeting ID';
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ [VIDEO SDK] Validation Failed - Unknown State');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ [VIDEO SDK] Error Message:', errorMsg);
        console.error('❌ [VIDEO SDK] Validation Result:', JSON.stringify(validationResult || {}, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        Toast.show(errorMsg || 'Invalid meeting ID.', Toast.SHORT);
        return;
      }

      // WEB PATTERN: Navigate to meeting screen with all required parameters
      // Note: meetingType defaults to undefined for one-to-one (MeetingContainer handles this)
      const navParams = {
        name: name.trim(),
        token: token,
        meetingId: meetingIdToUse,
        micEnabled: micOn,
        webcamEnabled: videoOn,
        defaultCamera: facingMode === 'user' ? 'front' : 'back',
        meetingType: undefined, // One-to-one consultation (default)
      };
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🧭 [MOBILE] Navigating to Meeting Screen');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 [MOBILE] Navigation Params:', JSON.stringify(navParams, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      disposeVideoTrack();

      navigation.navigate('Meeting_Screen', navParams);
      console.log('✅ [MOBILE] Navigation completed to Meeting_Screen');
      
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] CRITICAL ERROR Joining Video Call');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [MOBILE] Error Type:', error?.name || 'Unknown');
      console.error('❌ [MOBILE] Error Message:', error?.message || 'No error message');
      console.error('❌ [MOBILE] Error Stack:', error?.stack);
      console.error('❌ [MOBILE] Error Details:', {
        roomId: roomIdStr,
        name: name.trim(),
        errorCode: error?.code,
        errorResponse: error?.response?.data
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      Toast.show('Failed to join the meeting. Please try again.', Toast.SHORT);
    }
  };

  // WEB PATTERN: Handle "Join Meeting" button (like web MeetingDetailsScreen.handleJoinMeeting)
  const handleJoinMeeting = async () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📹 [MOBILE] Join Meeting Button Clicked");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log('📋 [MOBILE] Current State:', {
      meetingId: meetingId,
      roomId: roomId,
      meetingId_type: typeof meetingId,
      roomId_type: typeof roomId,
      meetingId_length: meetingId?.length,
      roomId_length: roomId?.length,
    });
    
    if (!name.trim()) {
      console.error('❌ [MOBILE] ERROR: Name is required');
      Toast.show('Please enter your name', Toast.SHORT);
      return;
    }

    // BUG FIX: Use roomId if meetingId is empty (roomId is set when socket ID is fetched)
    // VideoSDK meeting IDs can be in format: xxxx-xxxx-xxxx OR just alphanumeric string
    const meetingIdToUse = meetingId?.trim() || String(roomId || '').trim();
    
    console.log('🔍 [MOBILE] Meeting ID Resolution:', {
      meetingId_original: meetingId,
      roomId_original: roomId,
      meetingIdToUse: meetingIdToUse,
      resolvedFrom: meetingId?.trim() ? 'meetingId' : 'roomId'
    });

    if (!meetingIdToUse) {
      console.error('❌ [MOBILE] ERROR: Meeting ID is required');
      Toast.show('Please enter a meeting ID', Toast.SHORT);
      return;
    }

    // BUG FIX: VideoSDK meeting IDs can be in multiple formats:
    // 1. xxxx-xxxx-xxxx (standard format)
    // 2. Plain alphanumeric string (some cases)
    // Make validation more flexible - only check if it's a non-empty string
    // The actual validation will happen via VideoSDK API
    const meetingIdRegex = /^[\w-]+$/; // Allow alphanumeric, dashes, underscores
    if (!meetingIdRegex.test(meetingIdToUse) || meetingIdToUse.length < 4) {
      console.error('❌ [MOBILE] ERROR: Invalid meeting ID format');
      console.error('❌ [MOBILE] Meeting ID:', meetingIdToUse);
      console.error('❌ [MOBILE] Meeting ID length:', meetingIdToUse.length);
      Toast.show('Invalid meeting ID format. Please check and try again.', Toast.SHORT);
      return;
    }

    setLoading(true);
    try {
      // WEB PATTERN: Validate meeting exists before joining
      console.log('🔍 [MOBILE] Validating meeting before joining...');
      console.log('📋 [MOBILE] Using meeting ID:', meetingIdToUse);
      await joinVideoCall(meetingIdToUse);
    } catch (error) {
      console.error('❌ [MOBILE] Error joining meeting:', error);
      Toast.show('Failed to join meeting. Please try again.', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Dispose of the video track
  const disposeVideoTrack = () => {
    if (tracks) {
      tracks.getTracks().forEach((track) => track.stop());
      setTrack(null);
    }
  };

  // Fetch available audio devices
  // CRITICAL BUG FIX: Disable device enumeration on iOS due to native crash
  // The WebRTC native module crashes when enumerating devices with nil values
  // Since we can't fix the native module, we disable this feature on iOS
  const fetchAudioDevices = async () => {
    // BUG FIX: Completely disable device enumeration on iOS to prevent native crash
    // The crash happens in native code before JavaScript can catch it
    if (Platform.OS === 'ios') {
      console.warn('⚠️ [MOBILE] Device enumeration disabled on iOS to prevent native crash');
      setDeviceEnumerationFailed(true);
      setAudioList([]);
      Toast.show('Device selection unavailable on iOS', Toast.SHORT);
      return;
    }

    // BUG FIX: If enumeration previously failed, don't retry to prevent crashes
    if (deviceEnumerationFailed) {
      console.warn('⚠️ [MOBILE] Device enumeration previously failed, skipping to prevent crash');
      Toast.show('Device selection unavailable', Toast.SHORT);
      return;
    }

    // BUG FIX: Prevent multiple simultaneous calls
    if (isEnumeratingDevices) {
      console.warn('⚠️ [MOBILE] Device enumeration already in progress');
      return;
    }

    setIsEnumeratingDevices(true);
    
    try {
      console.log('🔍 [MOBILE] Fetching audio devices...');
      
      // BUG FIX: Wrap in setTimeout to allow React Native to catch native crashes better
      // Use a small delay to ensure the previous operation completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // BUG FIX: Wrap the native call in a promise that can catch crashes
      // React Native should catch native exceptions and convert them to JS errors
      const devices = await new Promise((resolve, reject) => {
        try {
          // Use setTimeout to ensure this runs on the next tick
          // This helps React Native's error boundary catch native crashes
          setTimeout(async () => {
            try {
              const result = await mediaDevices.getAudioDeviceList();
              resolve(result);
            } catch (err) {
              reject(err);
            }
          }, 50);
        } catch (err) {
          reject(err);
        }
      });
      
      // BUG FIX: Filter out devices with nil/invalid properties to prevent crash
      // The WebRTC module crashes when trying to create dictionaries with nil values
      const validDevices = (devices || []).filter((device) => {
        // Ensure all required properties are present and non-nil
        const isValid = device && 
                        device.deviceId != null && 
                        device.deviceId !== 'null' &&
                        device.deviceId !== 'undefined' &&
                        device.label != null &&
                        device.label !== 'null' &&
                        device.label !== 'undefined';
        
        if (!isValid) {
          console.warn('⚠️ [MOBILE] Filtered out invalid device:', device);
        }
        
        return isValid;
      }).map((device) => {
        // Ensure all string properties are properly formatted
        return {
          deviceId: String(device.deviceId || '').trim(),
          label: String(device.label || 'Unknown Device').trim(),
          ...(device.kind && { kind: String(device.kind).trim() }),
        };
      });
      
      console.log('✅ [MOBILE] Audio devices fetched:', {
        total: devices?.length || 0,
        valid: validDevices.length,
        filtered: (devices?.length || 0) - validDevices.length
      });
      
      setAudioList(validDevices);
      setDeviceEnumerationFailed(false); // Reset on success
    } catch (error) {
      console.error('❌ [MOBILE] ERROR fetching audio devices:', error);
      console.error('❌ [MOBILE] Error Type:', error?.name);
      console.error('❌ [MOBILE] Error Message:', error?.message);
      console.error('❌ [MOBILE] Error Stack:', error?.stack);
      
      // BUG FIX: Mark as failed to prevent future crashes
      setDeviceEnumerationFailed(true);
      setAudioList([]);
      Toast.show('Failed to load audio devices. Using default device.', Toast.SHORT);
    } finally {
      setIsEnumeratingDevices(false);
    }
  };

  // Handle audio device selection
  const handleDevicePress = async (device) => {
    try {
      // BUG FIX: Validate device before switching
      if (!device || !device.deviceId) {
        console.error('❌ [MOBILE] Invalid device selected:', device);
        Toast.show('Invalid device selected', Toast.SHORT);
        return;
      }
      
      console.log('🔧 [MOBILE] Switching audio device:', device.deviceId);
      await switchAudioDevice(device.deviceId);
      setSelectedDeviceId(device.deviceId);
      toggleAudioList();
    } catch (error) {
      console.error('❌ [MOBILE] ERROR switching audio device:', error);
      console.error('❌ [MOBILE] Error Message:', error?.message);
      Toast.show('Failed to switch audio device', Toast.SHORT);
    }
  };

  // Toggle audio device list visibility
  const toggleAudioList = () => {
    // BUG FIX: Only fetch devices when user explicitly opens the list
    // This prevents automatic enumeration that can cause crashes
    if (!isAudioListVisible && !deviceEnumerationFailed) {
      // User is opening the list, fetch devices now
      fetchAudioDevices();
    }
    setAudioListVisible(!isAudioListVisible);
  };

  // Get the camera track
  const getTrack = async () => {
    const track = await createCameraVideoTrack({
      optimizationMode: 'motion',
      encoderConfig: 'h720p_w960p',
      facingMode: facingMode,
    });
    setTrack(track);
  };

  // Toggle camera facing mode
  const toggleCameraFacing = () => {
    disposeVideoTrack();
    setfacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!isMainScreen()) {
          setisVisibleCreateMeetingContainer(false);
          setisVisibleJoinMeetingContainer(false);
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [isVisibleCreateMeetingContainer, isVisibleJoinMeetingContainer]),
  );

  // Check if the main screen is visible
  const isMainScreen = () => {
    return !isVisibleCreateMeetingContainer && !isVisibleJoinMeetingContainer;
  };

  // Fetch camera track on focus
  useFocusEffect(
    React.useCallback(() => {
      getTrack();
    }, []),
  );

  // Re-fetch camera track when facing mode changes
  useEffect(() => {
    getTrack();
  }, [facingMode]);

 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#313033' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.primary['900'],
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 16,
            }}
          >
            {/* BUG FIX: Hide speaker/device selection button on iOS to prevent native crash */}
            {Platform.OS !== 'ios' && (
              <TouchableOpacity
                onPress={toggleAudioList}
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  padding: 20,
                  marginRight: 10,
                }}
              >
                <Speaker width={25} height={25} fill={colors.primary[100]} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={toggleCameraFacing}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                padding: 20,
                marginRight: 10,
              }}
            >
              <CameraSwitch width={25} height={25} fill={colors.primary[100]} />
            </TouchableOpacity>
          </View>
          <View style={styles.containerVideo}>
            <View style={styles.videoContainer}>
              {videoOn && tracks ? (
                <RTCView
                  streamURL={tracks.toURL()}
                  objectFit="cover"
                  mirror
                  style={styles.videoStream}
                />
              ) : (
                <View style={styles.cameraOffContainer}>
                  <Text style={styles.cameraOffText}>Camera Off</Text>
                </View>
              )}
              {!isVisibleCreateMeetingContainer && (
                <View style={styles.controlsContainer}>
                <TouchableOpacity
                  onPress={() => setMicon(!micOn)}
                  style={[styles.controlButton, micOn ? styles.micOn : styles.micOff]}
                >
                  {micOn ? (
                    <MicOn width={24} height={24} fill={colors.black} />
                  ) : (
                    <MicOff width={24} height={24} fill={colors.primary['100']} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleJoinMeeting}
                  disabled={loading}
                  style={[
                    styles.joinButton,
                    loading ? styles.buttonDisabled : styles.buttonEnabled,
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.black} size="small" />
                  ) : (
                    <Text style={styles.joinButtonText}>Join Meeting</Text>
                  )}
                </TouchableOpacity>
              </View>
              )}
            </View>
            {isVisibleCreateMeetingContainer && (
              <View style={styles.createMeetingContainer}>
                {/* <TouchableOpacity
                  onPress={() => optionRef.current.show()}
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#202427',
                    borderRadius: 12,
                    marginVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary['100'],
                      fontSize: 16,
                      fontFamily: ROBOTO_FONTS.RobotoBold,
                    }}
                  >
                    {meetingType.value}
                  </Text>
                </TouchableOpacity> */}
                {/* <Menu
                  ref={optionRef}
                  menuBackgroundColor={colors.primary[700]}
                  fullWidth
                >
                  {meetingTypes.map((mt, index) => (
                    <React.Fragment key={mt.key}>
                      <MenuItem
                        title={mt.value}
                        onPress={() => {
                          optionRef.current.close(true);
                          setMeetingType(mt);
                        }}
                      />
                      {index !== meetingTypes.length - 1 && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: colors.primary['600'],
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </Menu> */}
                <TextInputContainer
                  placeholder={'Enter your name'}
                  value={name}
                  setValue={setName}
                />
                <TouchableOpacity
                  onPress={createMeetingApi}
                  disabled={loading}
                  style={[
                    styles.joinButton,
                    loading ? styles.buttonDisabled : styles.buttonEnabled
                  ,{flex:0}]}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.black} size="small" />
                  ) : (
                    <Text style={styles.joinButtonText}>Create Meeting</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {isVisibleJoinMeetingContainer && (
              <View style={styles.joinMeetingContainer}>
                <TextInputContainer
                  placeholder={'Enter your name'}
                  value={name}
                  setValue={setName}
                />
                <TextInputContainer
                  placeholder={'Meeting ID'}
                  value={meetingId || String(roomId || '')}
                  setValue={setMeetingId}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={handleJoinMeeting}
                  disabled={loading || !name.trim() || (!meetingId?.trim() && !roomId)}
                  style={[
                    styles.joinButton,
                    (loading || !name.trim() || (!meetingId?.trim() && !roomId)) ? styles.buttonDisabled : styles.buttonEnabled
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.black} size="small" />
                  ) : (
                    <Text style={styles.joinButtonText}>Join Meeting</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    fontSize: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDeviceButton: {
    backgroundColor: '#BBB5B4', // Lighter background color for selected device
  },
  containerVideo: {
    flex: 1,
    backgroundColor: '#121212', // Dark background for better contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '80%', // Changed from 90% to 65%
    aspectRatio: 8 / 10, // Adjusted from 16/9 to 16/10 for slightly taller video
    backgroundColor: '#202427',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  videoStream: {
    flex: 1,
    borderRadius: 12,
  },
  cameraOffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202427',
    borderRadius: 12,
  },
  cameraOffText: {
    color: '#E0E0E0', // Lighter text for readability
    fontSize: 18,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  micOn: {
    backgroundColor: '#4CAF50', // Green when mic is on
  },
  micOff: {
    backgroundColor: '#F44336', // Red when mic is off
  },
  joinButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginLeft: 12,
  },
  buttonEnabled: {
    backgroundColor: '#E72B4A', // Vibrant purple for enabled state
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5', // Gray for disabled state
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
