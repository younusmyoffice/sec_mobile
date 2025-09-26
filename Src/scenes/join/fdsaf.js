import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { RTCView } from 'react-native-webrtc';
import { Menu, MenuItem } from 'your-menu-component'; // Replace with actual menu component
import TextInputContainer from 'your-text-input-container'; // Replace with actual component
import { colors, ROBOTO_FONTS } from 'your-constants'; // Replace with actual constants
import {
  Speaker,
  CameraSwitch,
  MicOn,
  MicOff,
} from 'your-icon-components'; // Replace with actual icons
import {
  createCameraVideoTrack,
  mediaDevices,
  switchAudioDevice,
  validateMeeting,
} from 'your-video-sdk'; // Replace with actual SDK imports

export default function Join({ navigation, params }) {
  const [tracks, setTrack] = useState(null);
  const [micOn, setMicon] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [name, setName] = useState('saDSA');
  const [meetingId, setMeetingId] = useState('');
  const [isAudioListVisible, setAudioListVisible] = useState(false);
  const [facingMode, setfacingMode] = useState('user');
  const [audioList, setAudioList] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validAppointment, setValidAppointment] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [isVisibleCreateMeetingContainer, setisVisibleCreateMeetingContainer] = useState(false);
  const [isVisibleJoinMeetingContainer, setisVisibleJoinMeetingContainer] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [appointment, setAppointment] = useState(171); // Replace with dynamic appointment ID
  const [isVisibleAppointmentContainer, setisVisibleAppointmentContainer] = useState(false);
  const [meetingType, setMeetingType] = useState({ key: 'video', value: 'Video Meeting' });
  const optionRef = React.useRef(null);

  const baseUrl = 'your-base-url'; // Replace with actual base URL
  const axiosInstance = axios; // Replace with your configured axios instance

  // Meeting types for the dropdown
  const meetingTypes = [
    { key: 'video', value: 'Video Meeting' },
    { key: 'audio', value: 'Audio Meeting' },
  ];

  // Check if the appointment is valid
  const checkAppointmentValidity = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}patient/getAppointmentDateTime/${appointment}`,
      );
      console.log('Appointment Validity Response:', response.data);

      if (response.data?.joinCallflag) {
        setValidAppointment(true);
        await checkSocketId(); // Fetch socket ID if appointment is valid
      } else {
        console.log(
          'Invalid Appointment',
          'The appointment is not available at this time.',
        );
        Toast.show(
          'The appointment is not available at this time.',
          Toast.SHORT,
        );
      }
    } catch (error) {
      console.error('Error checking appointment:', error);
      Toast.show('Failed to check appointment. Please try again.', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Fetch socket ID and room ID
  const checkSocketId = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}patient/getUpdateSocketId/171`,
      );
      console.log('Socket ID Response:', response.data);

      if (response.data?.response?.[0]?.socket_id) {
        const roomId = response.data.response[0].socket_id;
        setRoomId(roomId); // Update state for future use
        setisVisibleJoinMeetingContainer(true); // Show Join Meeting UI
        await joinVideoCall(roomId); // Join the video call with the room ID
      } else {
        console.log('No Socket ID Found', 'Creating a new meeting.');
        setisVisibleCreateMeetingContainer(true); // Show Create Meeting UI
        // Don't call createMeeting here; let the user trigger it via the UI
      }
    } catch (error) {
      console.error('Error checking socket ID:', error);
      Toast.show('Failed to check socket ID. Please try again.', Toast.SHORT);
    }
  };

  // Create a new meeting
  const createMeeting = async () => {
    try {
      setLoading(true);
      if (!name.trim()) {
        Toast.show('Please enter your name', Toast.SHORT);
        return;
      }

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5YzNkMzBiNC05NTgyLTRmOTUtOGQ1YS0yZWZhZDhiMDgxNWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NTA2MTA1NCwiZXhwIjoxNzc2NTk3MDU0fQ.m-fAWIFu2hytS7YMGd1EzzaOekKSwg10F7SH-hkJqtU';
      const meetingId = await createMeeting({ token }); // Assuming createMeeting is available
      console.log('New Meeting Created with ID:', meetingId);

      // Post the meeting ID to the database
      await update_socketID(meetingId);

      setRoomId(meetingId); // Update state for future use
      await joinVideoCall(meetingId); // Join the video call with the new meeting ID
    } catch (error) {
      console.error('Error creating meeting:', error);
      Toast.show('Failed to create meeting. Please try again.', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Update socket ID in the database
  const update_socketID = async (meetingId) => {
    try {
      const response = await axiosInstance.put('/sec/patient/putSocketId/', {
        appointment_id: appointment, // Using appointment state as fallback for params?.appID
        socket_id: meetingId,
      });
      console.log('Socket ID Updated:', response.data);
      Toast.show('Meeting created successfully', Toast.SHORT);
    } catch (error) {
      console.error(`Error while uploading the socket ID: ${error}`);
      Toast.show('Failed to update socket ID', Toast.SHORT);
    }
  };

  // Join the video call
  const joinVideoCall = async (roomId) => {
    console.log('Joining video call with Room ID:', roomId);

    if (!name.trim()) {
      Toast.show('Please enter your name', Toast.SHORT);
      return;
    }

    if (!roomId.trim()) {
      Toast.show('Please enter a valid meeting ID', Toast.SHORT);
      return;
    }

    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5YzNkMzBiNC05NTgyLTRmOTUtOGQ1YS0yZWZhZDhiMDgxNWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NTA2MTA1NCwiZXhwIjoxNzc2NTk3MDU0fQ.m-fAWIFu2hytS7YMGd1EzzaOekKSwg10F7SH-hkJqtU';
      const valid = await validateMeeting({
        meetingId: roomId,
        token: token,
      });
      console.log('join video call function', token, roomId, valid);
      console.log('Valid meeting:', valid);

      if (valid) {
        disposeVideoTrack();

        navigation.navigate('Meeting_Screen', {
          name: name.trim(),
          token: token,
          meetingId: roomId.trim(),
          micEnabled: micOn,
          webcamEnabled: videoOn,
          defaultCamera: facingMode === 'user' ? 'front' : 'back',
        });
      } else {
        console.log('Error', 'Invalid meeting ID.');
        Toast.show('Invalid meeting ID.', Toast.SHORT);
      }
    } catch (error) {
      console.error('Error joining video call:', error);
      Toast.show('Failed to join the meeting. Please try again.', Toast.SHORT);
    }
  };

  // Handle the "Join Meeting" button press
  const handleJoinMeeting = () => {
    if (!appointment) {
      console.log('Error', 'No appointment selected.');
      Toast.show('No appointment selected.', Toast.SHORT);
      return;
    }
    checkAppointmentValidity();
  };

  // Dispose of the video track
  const disposeVideoTrack = () => {
    if (tracks) {
      tracks.getTracks().forEach((track) => track.stop());
      setTrack(null);
    }
  };

  // Fetch available audio devices
  const fetchAudioDevices = async () => {
    const devices = await mediaDevices.getAudioDeviceList();
    setAudioList(devices);
  };

  // Handle audio device selection
  const handleDevicePress = async (device) => {
    await switchAudioDevice(device.deviceId);
    setSelectedDeviceId(device.deviceId);
    toggleAudioList();
  };

  // Toggle audio device list visibility
  const toggleAudioList = () => {
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
            </View>
            {isVisibleCreateMeetingContainer && (
              <View style={styles.createMeetingContainer}>
                <TouchableOpacity
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
                </TouchableOpacity>
                <Menu
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
                </Menu>
                <TextInputContainer
                  placeholder={'Enter your name'}
                  value={name}
                  setValue={setName}
                />
                <TouchableOpacity
                  onPress={createMeeting}
                  disabled={loading}
                  style={[
                    styles.joinButton,
                    loading ? styles.buttonDisabled : styles.buttonEnabled,
                  ]}
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
                <Text style={styles.meetingStatusText}>Joining Meeting...</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Placeholder styles (replace with your actual styles)
const styles = {
  containerVideo: { flex: 1, justifyContent: 'center' },
  videoContainer: { flex: 1 },
  videoStream: { flex: 1 },
  cameraOffContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraOffText: { color: '#fff', fontSize: 18 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'center', padding: 16 },
  controlButton: { padding: 10 },
  micOn: { backgroundColor: '#fff' },
  micOff: { backgroundColor: '#ff0000' },
  joinButton: { padding: 10, borderRadius: 8, marginLeft: 10 },
  buttonEnabled: { backgroundColor: '#007AFF' },
  buttonDisabled: { backgroundColor: '#555' },
  joinButtonText: { color: '#fff', fontSize: 16 },
  createMeetingContainer: { padding: 16, backgroundColor: '#313033' },
  joinMeetingContainer: { padding: 16, alignItems: 'center' },
  meetingStatusText: { color: '#fff', fontSize: 16 },
};