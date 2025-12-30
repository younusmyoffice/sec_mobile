import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // Import format from date-fns
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TimeRangePicker = ({ Type, startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true); // to distinguish start and end time selection

  // Show the time picker for start or end time
  const showTimePicker = (isStart) => {
    setIsStartTime(isStart);
    setModalVisible(true);
  };

  // Hide the time picker modal
  const hideTimePicker = () => {
    setModalVisible(false);
  };

  // Handle the time selection
  const handleConfirm = (date) => {
    const formattedTime = format(date, 'HH:mm:ss'); // 24-hour format with seconds

    if (isStartTime) {
      onStartTimeChange(formattedTime); // Update the parent state for start time
    } else {
      onEndTimeChange(formattedTime); // Update the parent state for end time
    }
    hideTimePicker();
  };

  const TimeInput = ({ label, onPress }) => (
    <TouchableOpacity style={styles.dateBox} onPress={onPress}>
      <Text style={styles.dateText}>{label}</Text>
      <MaterialCommunityIcons name="clock" size={30} color="#AEAAAE" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {Type === 'normal' ? (
        <View style={styles.dateRow}>
          <TimeInput
            label={startTime ? startTime : 'From Time'}
            onPress={() => showTimePicker(true)}
          />
          <Text style={styles.toText}>To</Text>
          <TimeInput
            label={endTime ? endTime : 'To Time'}
            onPress={() => showTimePicker(false)}
          />
        </View>
      ) : (
        <View style={[styles.dateRow, { flexDirection: 'column', alignItems: 'stretch', gap: 17 }]}>
          <TimeInput
            label={startTime ? startTime : 'From Time'}
            onPress={() => showTimePicker(true)}
          />
          {Type !== 'singleline' && (
            <TimeInput
              label={endTime ? endTime : 'To Time'}
              onPress={() => showTimePicker(false)}
            />
          )}
        </View>
      )}

      {/* DateTimePickerModal to show time picker */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <DateTimePickerModal
              isVisible={isModalVisible}
              mode="time"
              date={new Date()}
              
              onConfirm={handleConfirm}
              onCancel={hideTimePicker}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0, top: -10 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 5,
    borderBottomColor: '#AEAAAE',
    borderBottomWidth: 1.2,
    alignItems: 'center',
  },
  dateText: { fontFamily: 'Poppins-Medium', fontSize: hp(1.7), color: '#AEAAAE' },
  toText: { fontSize: 16, fontWeight: 'bold', color: '#313033', fontFamily: 'Poppins-Medium' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TimeRangePicker;
