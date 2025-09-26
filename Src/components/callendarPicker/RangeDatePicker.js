import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DateRangePicker = ({
  Type,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setMarkedDates,
  handleDayPress,
  calculateMarkedDates,
  resetDates,
  markedDates,
  name,

  value='From Date',
  fontSize

}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  console.log(name);

  // const handleDayPress = day => { //   if (Type === 'singleline') { //     resetDates(); //     setStartDate(day.dateString); //     setMarkedDates({ //       [day.dateString]: { //         selected: true, //         color: '#E72B4A', //         textColor: 'white', //       }, //     }); //   } else { //     if (!startDate || (endDate && day.dateString <= startDate)) { //       resetDates(); //       setStartDate(day.dateString); //       setMarkedDates({ //         [day.dateString]: { //           startingDay: true, //           selected: true, //           color: '#E72B4A', //           textColor: 'white', //         }, //       }); //     } else { //       setEndDate(day.dateString); //       setMarkedDates(prev => ({ //         ...prev, //         ...calculateMarkedDates(startDate, day.dateString), //         [day.dateString]: { //           endingDay: true, //           selected: true, //           color: '#E72B4A', //           textColor: 'white', //         }, //       })); //     } //   } // }; // const calculateMarkedDates = (start, end) => { //   const marked = {}; //   let date = new Date(start); //   while (date <= new Date(end)) { //     const dateStr = date.toISOString().split('T')[0]; //     marked[dateStr] = {selected: true, color: '#E72B4A', textColor: 'white'}; //     date.setDate(date.getDate() + 1); //   } //   return marked; // }; // const resetDates = () => { //   setStartDate(''); //   setEndDate(''); //   setMarkedDates({}); // };
  const DateInput = ({label,color}) => (
    <TouchableOpacity
      style={styles.dateBox}
      onPress={() => setModalVisible(true)}>

      <Text style={[styles.dateText,{fontSize:fontSize,color:label==='From Date' || label==='To Date' ||'Date of Birth'?'#AEAAAE':'black'}]}>{label}</Text>


      {Type === 'input' ? (
        <MaterialCommunityIcons name="calendar" size={30} color="#AEAAAE" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {Type === 'normal' ? (
        <View style={styles.dateRow}>
          <DateInput label={startDate || 'From Date'} />
          <Text style={styles.toText}>To</Text>
          <DateInput label={endDate || 'To Date'} />
        </View>
      ) : Type === 'doubleline' ? (
        <View
          style={[
            styles.dateRow,
            {
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'space-between',
              gap: 17,
            },
          ]}>
          <DateInput  label={startDate || 'From Date'} />
          <DateInput label={endDate || 'To Date'} />
        </View>
      ) : Type === 'singleline' ? (
        <DateInput label={startDate || value} />
      ) : null}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={day => handleDayPress(day, name)}
              markedDates={markedDates}
              theme={{
                todayTextColor: '#E72B4A',
                dayTextColor: '#2d4150',
                monthTextColor: '#E72B4A',
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {top: 7},
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 8,
    borderBottomColor: '#AEAAAE',
    borderBottomWidth: 1.5,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Poppins-Medium',
    // fontSize: hp(1.7),
    color: 'black',
  },
  toText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#313033',
    fontFamily: 'Poppins-Medium',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E72B4A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DateRangePicker;
