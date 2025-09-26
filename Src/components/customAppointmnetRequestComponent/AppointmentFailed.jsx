import {View, Text, Image} from 'react-native';
import React from 'react';
import CustomButton from '../customButton/CustomButton';

const AppointmentFailed = ({image, title, desc, btntitle,showBtn}) => {
  return (
    <View style={{gap: 15}}>
      <View style={{alignSelf: 'center'}}>{image}</View>
      <View style={{padding: 5, gap: 30}}>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 25,
            fontWeight: '500',
          }}>
          {title}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 16}}>{desc}</Text>
       {showBtn ?  <View style={{alignSelf: 'center'}}>
          <CustomButton
            title={btntitle}
            borderRadius={30}
            bgColor={'#E72B4A'}
            textColor={'white'}
            padding={5}
            fontSize={18}
            width={250}
          />
        </View>: null}
      </View>
    </View>
  );
};

export default AppointmentFailed;
