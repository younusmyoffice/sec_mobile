import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';

import Header from '../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomButton from '../../components/customButton/CustomButton';


const CancellAppointment = () => {
  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <InAppCrossBackHeader showClose={true} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 22,
              color: 'black',
              fontWeight: '400',
            }}>
            Cancel Appointment
          </Text>

          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: 'black',
              marginTop: 30,
              fontWeight: '300',
            }}>
            Are you sure you want to cancel the appointment?
          </Text>

          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: 'gray',
              marginTop: 80,
              marginHorizontal: 20,
            }}>
            Note: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ut tellus quis sapien interdum commodo.
          </Text>

          <View style={{flexDirection: 'column', marginTop: 250, gap: 18}}>
            <CustomButton
              title="No"
              borderColor={'#E72B4A'}
              textColor={'#E72B4A'}
              borderWidth={1}
              borderRadius={30}
              padding={5}
              fontSize={16}
              width={200}
            />
            <CustomButton
              title="Yes, Cancel"
              bgColor={'#E72B4A'}
              textColor={'white'}
              borderRadius={30}
              padding={5}
              fontSize={16}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CancellAppointment;
