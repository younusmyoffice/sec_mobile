import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../customButton/CustomButton';

const CustomNotificationRoundedList = (data) => {
  const [isAllow, setisAllow] = useState(false);
  const notifications = [
    {
      id: 1,
      title: 'Message',
      time: ' 02-03-2023 | 10:30 AM',
      desc: ' You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    },
    {
      id: 2,
      title: 'Reminder',
      time: ' 02-03-2023 | 10:30 AM',
      desc: ' You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    },
    {
      id: 3,
      title: 'Voice Note',
      time: ' 02-03-2023 | 10:30 AM',
      desc: ' You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    },
    {
      id: 4,
      title: 'Video Call',
      time: ' 02-03-2023 | 10:30 AM',
      desc: ' You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    },
    {
      id: 5,
      title: 'Message',
      time: ' 02-03-2023 | 10:30 AM',
      desc: ' You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    },
    {
      id: 6,
      title: 'Message',
      time: ' 02-03-2023 | 10:30 AM',
      desc: ' You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    },
  ];
  const showFullLess = isAllow ? data?.data : data?.data?.slice(0, 2);
  console.log('issue',data);
  return (
    <View>
      <View style={{gap: 15}}>
        <View
          style={{
            // borderWidth: 1,
            // borderRadius: 8,
            // borderColor: '#E6E1E5',
            // padding: 15,
          }}>
          {showFullLess?.map((item, i) => (
            <View style={{gap: 10}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Medium',
                      fontSize: hp(2.0),
                    }}>
                    {item.type}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: '#787579',
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp(1.5),
                    }}>
                    {item.notification_generated_time || item.added_date || item.time}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: '#787579',
                    fontFamily: 'Poppins-Regular',
                    fontSize: hp(1.5),
                  }}>
                  {item.parameters.notification_detail}
                </Text>
              </View>

              <View
                style={{
                  height: hp(0.2),
                  backgroundColor: '#E6E1E5',
                  //   width: '90%',
                  marginTop: 5,
                  marginBottom: 10,
                }}></View>
            </View>
          ))}
        </View>
        <View style={{alignSelf: 'center'}}>
          <CustomButton
            title="View All"
            borderColor={'#E72B4A'}
            textColor={'#E72B4A'}
            borderWidth={1}
            borderRadius={20}
            width={wp(30)}
            fontfamily={'Poppins-SemiBold'}
            onPress={() => setisAllow(!isAllow)}
            showhide={isAllow}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomNotificationRoundedList;
