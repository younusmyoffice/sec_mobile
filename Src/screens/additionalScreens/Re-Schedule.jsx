import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';

import Header from '../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomRadioButton from '../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../components/customButton/CustomButton';


const ReSchedule = () => {
  const [selectReschedule, setselectReschedule] = useState();

  const reschedule = [
    {id: 1, label: 'I have a schedule clash.'},
    {id: 2, label: 'I am not available at the schedule'},
    {id: 3, label: 'Reason 3'},
    {id: 4, label: 'Reason 4'},
    {id: 5, label: 'Reason 5'},
  ];

  const handleChange = radio => {
    setselectReschedule(radio);
  };

  console.log(selectReschedule);

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <InAppCrossBackHeader showClose={true} />
        </View>
        <View style={{gap: 30}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                color: 'black',
                fontWeight: '400',
              }}>
              Reschedule Appointment
            </Text>
          </View>
          <View style={{padding: 15, gap: 25}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
              Reason for reschedule
            </Text>
            <View style={{gap: 10}}>
              {reschedule.map((radio, id) => (
                <CustomRadioButton
                  key={radio.id}
                  label={radio.label}
                  selected={selectReschedule === radio.label}
                  onPress={() => handleChange(radio.label)}
                  fontSize={18}
                  //   fontweight={200}
                />
              ))}
            </View>
          </View>
          <View style={{paddingHorizontal: 25}}>
            <Text style={{fontSize: 16, lineHeight: 22}}>
              Note : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo
              non dolor bibendum,
            </Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Continue"
              borderColor={18}
              bgColor={'#E72B4A'}
              textColor={'white'}
              width={250}
              padding={5}
              borderRadius={30}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ReSchedule;
