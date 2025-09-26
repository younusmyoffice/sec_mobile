import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../../components/customInputs/CustomInputs';
import authenticationStyle from '../AuthenticationStyle';
import axios from 'axios';

const QualificationInformation = ({
  data,
  formData,
  onChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setMarkedDates,
  handleDayPress,
  calculateMarkedDates,resetDates,markedDates
}) => {



  return (
    <SafeAreaView>
      <View style={{gap: 50}}>
        <Text style={authenticationStyle.signUp}>Qualification Information</Text>
        <View style={{gap: 25}}>
          <View style={{gap: 25}}>
            {data.map(field => (
              <CustomInput
                key={field.id}
                placeholder={field.placeholder}
                name={field.name}
                type={field.type}
                options={field.options}
                value={formData[field.name]}
                onChange={onChange}
                fontSize={20}
                calculateMarkedDates={calculateMarkedDates}
                endDate={endDate}
                startDate={startDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                handleDayPress={(day) => handleDayPress(day, formData[field.name])}

                resetDates={resetDates}
                markedDates={markedDates}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QualificationInformation;
