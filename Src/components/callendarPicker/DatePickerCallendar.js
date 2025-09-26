import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const DatePicker = ({
  availableDates = [],
  patientdetails,
  SetPatientDetails,
  styleprop=true,
  mode=true
}) => {
  // console.log("under date time",fieldName)
  const [selectedDates, setSelectedDates] = useState([]);
  const bookedDates = ['2024-12-13', '2024-11-30', '2024-12-17'];
  const currentYear = new Date().getFullYear(); // Get the current year
  const currentMonth = new Date().getMonth(); // Get the current month (0-11)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const handleDayPress = day => {
    const date = day.dateString;
    if (availableDates.includes(date)) {
      if (selectedDates.includes(date)) {
        setSelectedDates(selectedDates.filter(d => d !== date));
        if(mode){
          SetPatientDetails({...patientdetails, appointment_date: ''});
          console.log("no hcf appointment")

        }else{
          SetPatientDetails({...patientdetails, book_date: ''});

        }
        // SetPatientDetails({...patientdetails, book_date: ''});
      } else {
        console.log(date);
        setSelectedDates([date]);
        if(mode){
          console.log("no hcf appointment")
          SetPatientDetails({...patientdetails, appointment_date: date});

        }else{
          SetPatientDetails({...patientdetails, book_date: date});

        }        
      }
    }
  };

  const markedDates = {
    // Handle available dates
    ...availableDates.reduce((acc, date) => {
      acc[date] = {
        selected: selectedDates.includes(date),
        disableTouchEvent: false, // Available for interaction
        selectedColor: selectedDates.includes(date) ? '#E72B4A' : '#90EE90', // Red if selected, Green if available
        selectedTextColor: '#FFFFFF',
      };
      return acc;
    }, {}),

    // Handle unselectable dates (those not in availableDates)
    ...availableDates.reduce((acc, date) => {
      const allDates = generateAllDatesForYearMonth(date); // Function to generate all dates for a year-month pair
      allDates.forEach(d => {
        if (!availableDates.includes(d)) {
          acc[d] = {
            selected: true,
            disableTouchEvent: true, // Block interaction
            selectedColor: '#D3D3D3', // Gray for unselected dates
            selectedTextColor: '#000000', // Black text color for contrast
          };
        }
      });
      return acc;
    }, {}),
  };

  // Helper function to generate all dates for a given year and month
  function generateAllDatesForYearMonth(date) {
    const [year, month] = date.split('-');
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month
    return Array.from(
      {length: daysInMonth},
      (_, i) =>
        `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(
          2,
          '0',
        )}`,
    );
  }

  return (
    <View
      style={{
       
        flex: 1,
        padding:styleprop? 20:0,
        paddingVertical:styleprop?0:10,
        gap: 10,
      }}>
      <View style={{borderWidth: 1, borderColor: '#E6E1E5', borderRadius: 5,width:widthPercentageToDP(80)}}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#E72B4A',
            todayTextColor: '#E72B4A',
            dayTextColor: '#2d4150',
            monthTextColor: '#E72B4A',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DatePicker;
