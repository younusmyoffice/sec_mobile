import {View, Text, Image} from 'react-native';
import React from 'react';
import CustomButton from '../customButton/CustomButton';

const AppointmnetSent = () => {
  return (
    <View style={{gap: 15}}>
      <View style={{alignSelf: 'center'}}>
        <Image source={require('../../assets/requestsent.png')} />
      </View>
      <View style={{padding: 5, gap: 30}}>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 25,
            fontWeight: '500',
          }}>
          Appointment request sent
        </Text>
        <Text style={{textAlign: 'center', fontSize: 16}}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi
          inventore sunt earum quae quidem voluptatem quisquam rerum id
          voluptatum maxime.
        </Text>
        <View style={{alignSelf: 'center'}}>
          <CustomButton
            title="View Appointmnet"
            borderRadius={30}
            bgColor={'#E72B4A'}
            textColor={'white'}
            padding={5}
            fontSize={18}
            width={250}
          />
        </View>
      </View>
    </View>
  );
};

export default AppointmnetSent;
