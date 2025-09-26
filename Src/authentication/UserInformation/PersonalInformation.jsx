import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../../components/customInputs/CustomInputs';
import authenticationStyle from '../AuthenticationStyle';
import axios from 'axios';

const PersonalInformation = ({
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
        <Text style={authenticationStyle.signUp}>Personal Information</Text>
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
                handleDayPress={handleDayPress}
                resetDates={resetDates}
                markedDates={markedDates}
                format={field.format}
                datevalue="Date of Birth"

              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalInformation;
