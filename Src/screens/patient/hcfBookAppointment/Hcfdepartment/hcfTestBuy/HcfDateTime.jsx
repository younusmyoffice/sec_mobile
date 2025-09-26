import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DatePicker from '../../../../../components/callendarPicker/DatePickerCallendar';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const HcfDateTime = ({ availableDates, availableSlots,setBookTest,bookTest }) => {
  console.log('availableslotes', availableSlots);

  const [timedetails, setTimedetails] = useState({
    slot: '',
  });

  


console.log(bookTest)
  return (
    <View>
      <View>
        <DatePicker styleprop={false} availableDates={availableDates} SetPatientDetails={setBookTest} patientdetails={bookTest} mode={false} />
        
      </View>
     
    </View>
  );
};

export default HcfDateTime;
