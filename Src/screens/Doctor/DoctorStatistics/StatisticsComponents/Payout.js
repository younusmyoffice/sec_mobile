import {View, Text} from 'react-native';
import React from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomTable from '../../../../components/customTable/CustomTable';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import { useCommon } from '../../../../Store/CommonContext';
const Payout = () => {
  const navigation=useNavigation();
  const handleRequestCash=()=>{
    navigation.navigate('ReuestCashDoctor')
  }
    const header=['Date','Account No','Amount','Status']
 const data=[
    {
        id:1,
        datetime:'16-oct',
        acc_no:'220020020202',
        amount:200.00,
        status:'in-progress'
    }
 ]
 const{userId}=useCommon();

    return (
    <View style={{gap:20}}>
      <View>
        <InAppHeader LftHdr={'Cash Out'} />
      </View>
      <View style={{gap: 15}}>
        <View
          style={{
            backgroundColor: '#E72B4A',
            borderRadius: 6,
            padding: 12,
            gap: 10,
          }}>
          <Text
            style={{
              lineHeight: 25,
              fontFamily: 'Poppins-Regular',
              textAlign: 'justify',
              color: 'white',
            }}>
            Earning Balance Sales Overview $120 ShareEcare Affiliation Program
            $0Amount you earned from Sales, Custom order and Affiliation
            Balance. You can cashout this balance.
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: hp(3),
              color: 'white',
              textAlign: 'center',
            }}>
            $120
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 6,
            padding: 12,
            gap: 10,
            borderColor: '#E6E1E5',
            borderWidth: 0.6,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: hp(2.2),
              color: 'black',
              textAlign: 'center',
            }}>
            Request Cash Out
          </Text>

          <Text
            style={{
              lineHeight: 25,
              fontFamily: 'Poppins-Regular',
              textAlign: 'justify',
              color: '#AEAAAE',
            }}>
            Earning Balance Sales Overview $120 ShareEcare Affiliation Program
            $0Amount you earned from Sales, Custom order and Affiliation
            Balance. You can cashout this balance.
          </Text>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Reuest"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-SemiBold'}
              textColor={'white'}
              fontSize={hp(1.5)}
              borderRadius={20}
              width={wp(50)}
              onPress={handleRequestCash}
            />
          </View>
        </View>
      </View>
      <View>
        <CustomTable header={header} data={data} isUserDetails={false} flexvalue={1} rowDataCenter={false}/>
      </View>
    </View>
  );
};

export default Payout;
