import {View, Text} from 'react-native';
import React from 'react';
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTransactionTable from '../../../../../components/customTable/CustomTransactionTable';
const Bookings = () => {
  const header = ['Transaction & ID', 'Date & Time', 'Amount'];
  const data = [
    {
      id: 1,
      image: require('../../../../../assets/Recieve.png'),
      name: 'Appointment Payment',
      datetime: '16-oct',
      trans_id:'10101 1010',
      price: 200.98,
    },
    {
      id: 2,
      image: require('../../../../../assets/Recieve.png'),
      name: 'Refund for Appointment',
      datetime: '16-oct',
      trans_id:'10101 1010',
      price: 200.98,
    },
    {
      id: 3,
      image: require('../../../../../assets/Send.png'),
      name: 'Radiology Test ( Cat-1)',
      datetime: '16-oct',
      trans_id:'10101 1010',
      price: 200.98,
    },
  ];
  return (
    <View style={{gap: 10}}>
      <View style={{flexDirection: 'row'}}>
        <CustomSearch placeholderTextColor={'#AEAAAE'} showmenuIcon={true} />
      </View>
      <View style={{alignSelf: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor="#E6E1E5"
            selectborderRadius={10}
            selectbackgroundColor="#f0f0f0"
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={'#E6E1E5'}
            placeholder={'Date'}
            selectplaceholdercolor={'#787579'}
          />
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor="#E6E1E5"
            selectborderRadius={10}
            selectbackgroundColor="#f0f0f0"
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={'#E6E1E5'}
            placeholder={'Filter'}
            selectplaceholdercolor={'#787579'}
          />
        </View>
      </View>

     <CustomTransactionTable header={header} textCenter={'center'} data={data}/>
    </View>
  );
};

export default Bookings;
