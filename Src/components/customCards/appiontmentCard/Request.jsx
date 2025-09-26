import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import AppointmentCard from './CustomAppointmentCard';
import axiosInstance from '../../../utils/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../../../Store/CommonContext';

const Request = ({ data, loader, reRenderApi, option }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId } = useCommon();
  const navigation = useNavigation();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const acceptAppointment = async (ApiData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('Doctor/AppointmentsRequestsAccept', {
        appointment_id: ApiData.appointment_id,
        patient_id: ApiData.patient_id,
        doctor_id: ApiData.doctor_id,
        status: 'in_progress',
        option: 'accept',
      });

      console.log('Appointment accepted response:', response.data.response);
      reRenderApi();
    } catch (err) {
      console.error('Error accepting appointment:', err);
      const errorMessage =
        err?.response?.data?.message || 'Failed to accept appointment. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {data?.length > 0 ? (
        <View style={{ gap: 10 }}>
          {data?.map((item, index) => {
            const modalList =
              option === 'doctor'
                ? [
                  {
                    func: () => setSelectedAppointment(item), // Open modal instead of navigation
                    menuItem: 'View Details',
                  },
                  {
                    func: () => navigation.navigate('RejectAppointmentReq', { navData: item }),
                    menuItem: 'Reject',
                  },
                ]
                : option === 'clinic'
                  ? [
                    {
                      func: () => setSelectedAppointment(item), // Open modal instead of navigation
                      menuItem: 'View Details',
                    },
                    {
                      func: () => navigation.navigate('rejectpatient-appointment', { navData: item }),
                      menuItem: 'Reject',
                    },
                  ]
                  : [];

            return (
              <AppointmentCard
                key={index}
                firstname={item.first_name}
                middlename={item.middle_name}
                lastname={item.last_name}
                date={item.appointment_date}
                time={item.appointment_time}
                reportname={item.report_name}
                showBtn="Appointmnetcards"
                btnStatus="request"
                btnTitle="Accept"
                bgcolor="#E72B4A"
                textColor="#fff"
                isShowStatus={false}
                menuList={modalList}
                onPress={() => acceptAppointment(item)}
                switches={'request'}
                profile_picture={item.profile_picture}
              />
            );
          })}
        </View>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../../../assets/NoAppointment.png')} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>You don’t have any appointment requests</Text>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>Add Listings to manage your schedule.</Text>
        </View>
      )}

      {/* MODAL */}
      <Modal visible={!!selectedAppointment} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              <TouchableOpacity onPress={() => setSelectedAppointment(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <Image
              source={selectedAppointment?.profile_picture
                ? { uri: selectedAppointment.profile_picture }
                : require('../../../assets/images/ShareecareHeaderLogo.png')}
              style={styles.profileImage}
            />

            {/* Details Section */}
            <ScrollView>
              <View style={styles.detailsContainer}>
                {[
                  { label: 'Name', value: `${selectedAppointment?.first_name} ${selectedAppointment?.middle_name} ${selectedAppointment?.last_name}` },
                  { label: 'Patient Type', value: selectedAppointment?.patient_type },
                  { label: 'Appointment Date', value: selectedAppointment?.appointment_date },
                  { label: 'Appointment Time', value: selectedAppointment?.appointment_time || 'N/A' },
                  { label: 'Report Name', value: selectedAppointment?.report_name }, // Report name added
                ].map((item, idx) => (
                  <View key={idx} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{item.label}:</Text>
                    {item.label === 'Report Name' ? (
                      <TouchableOpacity onPress={() => Linking.openURL(selectedAppointment?.report_path)}>
                        <Text style={[styles.detailValue, styles.downloadText]}>{item.value}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.detailValue}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E72B4A',
  },
  closeButton: {
    fontSize: 20,
    color: '#E72B4A',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 10,
  },
  detailsContainer: {
    paddingHorizontal: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
    maxWidth: '60%',
  },
  downloadText: {
    color: '#E72B4A',
    textDecorationLine: 'underline',
  },
};

export default Request;
