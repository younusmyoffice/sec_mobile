import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import CustomRadioButton from '../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../components/customButton/CustomButton';

const { width } = Dimensions.get('window');

const RescheduleModal = ({ isVisible, onClose, onSubmit,apptData }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSubmit = () => {
    const payload = {
      appointment_date: date.toISOString().split('T')[0],
      appointment_time: `${time.getHours()}:${time.getMinutes()} - ${time.getHours() + 1}:${time.getMinutes()}`,
      patient_id: apptData.patient_id,
      doctor_id: apptData.doctor_id,
      appointment_id:   apptData.appointment_id,
      status: "booked",
      reason: selectedReason === 'other reason' ? reason : selectedReason,
      option: "reschedule"
    };

    onSubmit(payload);
  };

  const reasonOptions = [
    { id: 1, label: 'I have a schedule clash.' },
    { id: 2, label: 'I am not available at this time.' },
    { id: 3, label: 'Other reason' },
    { id: 4, label: 'Want to reschedule' },
    { id: 5, label: 'Cannot disclose the reason' },
  ];

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.title}>Reschedule Appointment</Text>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{date.toDateString()}</Text>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
</TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>{time.toLocaleTimeString()}</Text>
          
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          </TouchableOpacity>
          <Text style={styles.radioGroupTitle}>Reason for Rescheduling</Text>
          <View style={{ gap: 10 }}>
            {reasonOptions.map((option) => (
              <CustomRadioButton
                key={option.id}
                label={option.label}
                selected={selectedReason === option.label}
                onPress={() => setSelectedReason(option.label)}
                fontSize={18}
              />
            ))}
          </View>

          {selectedReason === 'Other reason' && (
            <TextInput
              style={styles.input}
              placeholder="Please specify the reason"
              value={reason}
              onChangeText={setReason}
            />
          )}

          <View style={{ alignSelf: 'center', marginTop: 20 }}>
            <CustomButton
              title="Submit"
              borderColor={18}
              bgColor={'#E72B4A'}
              textColor={'white'}
              width={200}
              padding={5}
              borderRadius={30}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.9, // 90% of screen width
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E72B4A',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  radioGroupTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    marginBottom: 10,
  },
});

export default RescheduleModal;