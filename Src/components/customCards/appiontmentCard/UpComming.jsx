import React, { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import AppointmentFailed from '../../customAppointmnetRequestComponent/AppointmentFailed';
import AppointmentCard from './CustomAppointmentCard';
import RescheduleModal from '../../../components/modalReschedule/RescheduleModal';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance';
import RejectModal from '../../customModal/RejectModal';
import CustomToaster from '../../customToaster/CustomToaster';

const UpComming = ({ data, loader, rescheduleEndpiont, rejectEndpiont = "patient/RejectAppointment", isDoctor = false, Refresh, SelfRefresh }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for API call
  const [items, setItems] = useState([])
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // Track current time
  const navigation = useNavigation(); // BUG FIX: Uncomment navigation for appointment navigation

  console.log("upcomming", data)

  // Update current time every minute to check if appointment time has arrived
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Check if any appointment time has been reached and show notification
      if (data && data.length > 0) {
        data.forEach((item) => {
          const timeReached = isAppointmentTimeReached(item.appointment_date, item.appointment_time);
          if (timeReached && item.join_status === 0) {
            CustomToaster.show('info', 'Appointment Ready', {
              duration: 5000,
              text2: `Your ${item.plan_name} appointment with ${item.patientBookedName || item.first_name} is ready to join!`,
            });
          }
        });
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data]);

  // Function to check if appointment time has arrived
  const isAppointmentTimeReached = (appointmentDate, appointmentTime) => {
    try {
      // Check if we have valid date and time data
      if (!appointmentDate || !appointmentTime) {
        console.log('⚠️ Missing appointment date or time:', { appointmentDate, appointmentTime });
        return false;
      }

      // Handle different date formats
      let appointmentDateTime;
      
      // Fix invalid time format like "23:30 PM" -> "11:30 PM"
      let normalizedTime = appointmentTime;
      if (typeof appointmentTime === 'string') {
        // Check for invalid 24-hour format with AM/PM
        const timeMatch = appointmentTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const ampm = timeMatch[3].toUpperCase();
          
          // Fix invalid hours (e.g., 23:30 PM should be 11:30 PM)
          if (hours > 12) {
            hours = hours - 12;
            console.log(`🕐 Fixed invalid time format: ${appointmentTime} -> ${hours}:${minutes} ${ampm}`);
          }
          
          normalizedTime = `${hours}:${minutes} ${ampm}`;
        }
      }

      // Try different date parsing approaches
      if (typeof appointmentDate === 'string') {
        // If appointmentDate is already a full datetime string
        if (appointmentDate.includes('T')) {
          appointmentDateTime = new Date(appointmentDate);
        } else {
          // If separate date and time, combine them
          appointmentDateTime = new Date(`${appointmentDate} ${normalizedTime}`);
        }
      } else {
        appointmentDateTime = new Date(appointmentDate);
      }

      // Check if the date is valid
      if (isNaN(appointmentDateTime.getTime())) {
        console.log('⚠️ Invalid appointment datetime:', { appointmentDate, appointmentTime, normalizedTime, parsed: appointmentDateTime });
        return false;
      }

      const now = new Date();
      
      console.log('🕐 Time Check:', {
        originalTime: appointmentTime,
        normalizedTime: normalizedTime,
        appointmentDateTime: appointmentDateTime.toISOString(),
        currentTime: now.toISOString(),
        isTimeReached: now >= appointmentDateTime
      });
      
      return now >= appointmentDateTime;
    } catch (error) {
      console.error('Error parsing appointment time:', error, { appointmentDate, appointmentTime });
      return false;
    }
  };

  // Function to calculate time remaining until appointment
  const getTimeRemaining = (appointmentDate, appointmentTime) => {
    try {
      // Check if we have valid date and time data
      if (!appointmentDate || !appointmentTime) {
        return 'Date/time not available';
      }

      // Fix invalid time format like "23:30 PM" -> "11:30 PM"
      let normalizedTime = appointmentTime;
      if (typeof appointmentTime === 'string') {
        // Check for invalid 24-hour format with AM/PM
        const timeMatch = appointmentTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const ampm = timeMatch[3].toUpperCase();
          
          // Fix invalid hours (e.g., 23:30 PM should be 11:30 PM)
          if (hours > 12) {
            hours = hours - 12;
          }
          
          normalizedTime = `${hours}:${minutes} ${ampm}`;
        }
      }

      // Handle different date formats
      let appointmentDateTime;
      
      if (typeof appointmentDate === 'string') {
        if (appointmentDate.includes('T')) {
          appointmentDateTime = new Date(appointmentDate);
        } else {
          appointmentDateTime = new Date(`${appointmentDate} ${normalizedTime}`);
        }
      } else {
        appointmentDateTime = new Date(appointmentDate);
      }

      // Check if the date is valid
      if (isNaN(appointmentDateTime.getTime())) {
        return 'Invalid date format';
      }

      const now = new Date();
      const diffMs = appointmentDateTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        return 'Appointment time reached';
      }
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m remaining`;
      } else {
        return `${diffMinutes}m remaining`;
      }
    } catch (error) {
      console.error('Error calculating time remaining:', error, { appointmentDate, appointmentTime });
      return 'Time calculation error';
    }
  };

  // Function to determine if Join button should be enabled
  const shouldEnableJoinButton = (item) => {
    // Enable Join button when join_status is 1 (ready to join)
    const isEnabled = item.join_status === 1;
    
    console.log('🔘 Join Button Status:', {
      appointmentId: item.appointment_id,
      joinStatus: item.join_status,
      shouldEnable: isEnabled,
      planName: item.plan_name
    });
    
    return isEnabled;
  };

  // Handle form submission
  const handleSubmit = async (payload) => {
    console.log('API Response:payload', payload);
    setIsSubmitting(true); // Start loading
    try {
      const response = await axiosInstance.post(`${baseUrl}${rescheduleEndpiont}`,

        payload,
      );
      console.log("firstfdsafdsafda", response)
      setModalVisible(false);
    CustomToaster.show('success', response?.data?.response?.body)
    } catch (error) {
      console.error('Error during API call:', error);
      // Handle network errors (e.g., show a toast or alert)
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleRejectSubmit = async (payload) => {
    console.log('API Response:payload for', payload);
    setIsSubmitting(true); // Start loading
    try {
      const response = await axiosInstance.post(`${baseUrl}${rejectEndpiont}`,

        payload,
      );

      // const result = await response.json();
      console.log('API Response:reject', response.data);

      // Check the statusCode in the response

      setRejectModalVisible(false); // Close modal on success
      CustomToaster.show('success', response?.data?.body)
    } catch (error) {
      console.error('Error during API call:', error);
      // Handle network errors (e.g., show a toast or alert)
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Handle navigation based on appointment type
  const handleAppointmentNavigation = async (item) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 [MOBILE] Starting appointment navigation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📦 [MOBILE] Appointment Item:", JSON.stringify({
      appointment_id: item?.appointment_id,
      patient_id: item?.patient_id,
      doctor_id: item?.doctor_id,
      plan_name: item?.plan_name,
      plan_id: item?.plan_id,
      roomId: item?.roomid,
      status: item?.status,
      patientBookedName: item?.patientBookedName,
      first_name: item?.first_name
    }, null, 2));
    
    if (!item) {
      console.error("❌ [MOBILE] ERROR: Item is undefined!");
      return;
    }

    // Handle join based on plan type
    try {
      if (item.plan_name === "message" || item.plan_name === "chat") {
        // For chat plans, we'll connect to socket server after navigation
        console.log('💬 [MOBILE] Chat plan detected - will connect to socket server after navigation');
        console.log('📡 [MOBILE] Socket server details:', {
          roomID: item.roomid,
          userID: item.doctor_id,
          appointmentId: item.appointment_id
        });
      } else if (item.plan_name === "video" || item.plan_name === "video call") {
        // BUG FIX: For video plans, call PATIENT joinAppointment endpoint (not Doctor endpoint)
        // This ensures the patient can join the video consultation properly
        const videoMeetId = String(item.roomid) || String(item.appointment_id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📹 [MOBILE] VIDEO CONSULTATION FLOW START');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 [MOBILE] Appointment Details:', {
          appointment_id: item.appointment_id,
          patient_id: item.patient_id,
          doctor_id: item.doctor_id,
          roomId: item.roomid,
          roomId_type: typeof item.roomid,
          video_meet_id: videoMeetId,
          plan_name: item.plan_name,
          plan_id: item.plan_id,
          status: item.status
        });
        console.log('🌐 [MOBILE] API Endpoint:', `${baseUrl}patient/joinAppointment`);
        console.log('📤 [MOBILE] Request Payload:', JSON.stringify({
          appointment_id: item.appointment_id,
          patient_id: item.patient_id,
          doctor_id: item.doctor_id,
          option: "join",
          video_meet_id: videoMeetId
        }, null, 2));
        
        const requestStartTime = Date.now();
        try {
          console.log('⏳ [MOBILE] Sending join appointment request to backend...');
          const joinResponse = await axiosInstance.post(`${baseUrl}patient/joinAppointment`, {
            appointment_id: item.appointment_id,
            patient_id: item.patient_id,
            doctor_id: item.doctor_id,
            option: "join",
            video_meet_id: videoMeetId
          });
          const requestDuration = Date.now() - requestStartTime;
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('✅ [MOBILE] BACKEND RESPONSE RECEIVED');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('⏱️  [MOBILE] Request Duration:', `${requestDuration}ms`);
          console.log('📥 [MOBILE] Response Status:', joinResponse?.status);
          console.log('📥 [MOBILE] Response Headers:', JSON.stringify(joinResponse?.headers || {}, null, 2));
          console.log('📥 [MOBILE] Response Data:', JSON.stringify(joinResponse?.data || {}, null, 2));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        } catch (joinError) {
          const requestDuration = Date.now() - requestStartTime;
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('❌ [MOBILE] BACKEND REQUEST FAILED');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('⏱️  [MOBILE] Request Duration:', `${requestDuration}ms`);
          console.error('❌ [MOBILE] Error Type:', joinError?.name || 'Unknown');
          console.error('❌ [MOBILE] Error Message:', joinError?.message || 'No error message');
          console.error('❌ [MOBILE] Error Stack:', joinError?.stack);
          console.error('❌ [MOBILE] HTTP Status:', joinError?.response?.status || 'N/A');
          console.error('❌ [MOBILE] Response Data:', JSON.stringify(joinError?.response?.data || {}, null, 2));
          console.error('❌ [MOBILE] Request Config:', {
            url: joinError?.config?.url,
            method: joinError?.config?.method,
            headers: joinError?.config?.headers,
            data: joinError?.config?.data
          });
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          // Show error toast but continue with navigation (user can still try to join)
          CustomToaster.show('error', 'Error', 'Failed to join appointment. Please try again.');
        }
      }
    } catch (error) {
      console.error('❌ [MOBILE] CRITICAL ERROR in appointment join flow:', error);
      console.error('❌ [MOBILE] Error Stack:', error?.stack);
      // Continue with navigation even if join fails
    }

    // Navigate based on plan type
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🧭 [MOBILE] NAVIGATION FLOW");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 [MOBILE] Plan details:", {
      planName: item.plan_name,
      planId: item.plan_id,
      appointmentId: item.appointment_id,
      roomId: item.roomid
    });

    if (item.plan_name === "message" || item.plan_name === "chat") {
      console.log("💬 [MOBILE] Navigating to ChatHome for message plan");
      console.log("📤 [MOBILE] Navigation Params:", {
        roomID: item?.roomid,
        userID: item.doctor_id,
        appointmentId: item.appointment_id,
        patientId: item.patient_id,
        doctorId: item.doctor_id,
        patientName: item.patientBookedName || item.first_name
      });
      navigation.navigate('ChatHome', {
        roomID: item?.roomid,
        userID: item.doctor_id, // Doctor's ID for socket connection
        appointmentId: item.appointment_id,
        patientId: item.patient_id,
        doctorId: item.doctor_id,
        patientName: item.patientBookedName || item.first_name,
        socketServerUrl: 'http://localhost:4001' // Socket server URL
      });
    } else if (item.plan_name === "video" || item.plan_name === "video call") {
      const navParams = {
        appid: item.appointment_id,
        appointmentId: item.appointment_id,
        roomId: item.roomid,
        patientId: item.patient_id,
        doctorId: item.doctor_id,
        patientName: item.patientBookedName || item.first_name
      };
      console.log("📹 [MOBILE] Navigating to Join_Screen for video plan");
      console.log("📤 [MOBILE] Navigation Params:", JSON.stringify(navParams, null, 2));
      navigation.navigate('Join_Screen', navParams);
      console.log('✅ [MOBILE] Navigation completed to Join_Screen');
    } else {
      console.log("⚠️ [MOBILE] Unknown plan type, defaulting to chat:", item.plan_name);
      // Default to chat for unknown plan types
      navigation.navigate('ChatHome', {
        roomID: item?.roomid,
        userID: item.doctor_id, // Doctor's ID for socket connection
        appointmentId: item.appointment_id,
        patientId: item.patient_id,
        doctorId: item.doctor_id,
        patientName: item.patientBookedName || item.first_name,
        socketServerUrl: 'http://localhost:4001' // Socket server URL
      });
    }

    // Refresh the appointment list
    try {
      await Promise.all([
        Refresh?.(),
        SelfRefresh?.(),
      ]);
      console.log("🔄 Appointment list refreshed");
    } catch (error) {
      console.error("❌ Error refreshing appointment list:", error);
    }
  };
  // const onRefresh = () => {
  //   setRefreshing(true);
  //   Refresh(); // call your API again
  // };
  return (

    // <ScrollView  >
    <SafeAreaView>

      {loader ? (
        <View style={{ gap: 10 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <AppointmentCard key={index} loading={true} />
          ))}
        </View>
      ) : data?.length > 0 ? (
        <View style={{ gap: 10 }}>
          {data?.map((item, i) => {
            const isJoinEnabled = shouldEnableJoinButton(item);
            
            return (
              <AppointmentCard
                key={i}
                btnStatusForJoin={!isJoinEnabled} // Inverted: true = disabled, false = enabled
                showBtn={'Appointmnetcards'}
                btnStatus={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                switches={'upcomming'}
                planname={item.plan_name}
                btnTitle={isJoinEnabled ? 'Join' : 'Not Ready'}
                bgcolor={isJoinEnabled ? '#E72B4A' : '#CCCCCC'}
                textColor={isJoinEnabled ? '#fff' : '#666666'}
                menuList={
                  isDoctor
                    ? [
                      {
                        id: 1,
                        menuItem: 'Reject',
                        func: () => {
                          setRejectModalVisible(true);
                          setItems(item);
                        },
                      },
                    ]
                    : [
                      {
                        id: 1,
                        menuItem: 'Reject',
                        func: () => {
                          setRejectModalVisible(true);
                          setItems(item);
                        },
                      },
                      {
                        id: 2,
                        menuItem: 'Re-Schedule',
                        func: () => {
                          setModalVisible(true);
                          setItems(item);
                        },
                      },
                    ]
                }

                firstname={item.patientBookedName || item.first_name + " " + item.last_name}
                middlename={" "}
                lastname={" "}
                date={item.appointment_date}
                time={item.appointment_time}
                reportname={item.report_name}
                onPress={() => isJoinEnabled ? handleAppointmentNavigation(item) : null}
                profile_picture={item.profile_picture}
              />
            );
          })}
        </View>
      ) : (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <AppointmentFailed
            image={<Image source={require('../../../assets/images/CardDoctor1.png')} />}
            title={'You don’t have any appointment'}
            desc={'Book an appointment'}
            btntitle={'Find Doctor'}
          />
        </View>
      )}
      <RejectModal
        isVisible={rejectModalVisible}
        apptData={items}
        onClose={() => setRejectModalVisible(false)}
        onSubmit={handleRejectSubmit}
        isSubmitting={isSubmitting} // Pass loading state to modal
      />
      <RescheduleModal
        isVisible={isModalVisible}
        apptData={items}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting} // Pass loading state to modal
      />
    </SafeAreaView>
    // </ScrollView>
  );
};

export default UpComming;