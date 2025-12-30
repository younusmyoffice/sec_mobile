import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import styles from './RecievedSharedReportsCardStyle';
import CustomButton from '../../customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getProfileImageSource, handleImageError, handleImageLoad } from '../../../utils/imageUtils';

const RecievedSharedReportsCard = ({data}) => {
  console.log('📋 RecievedSharedReportsCard Data:', data);
  console.log('📋 Data length:', data?.length || 0);
  console.log('📋 Data type:', typeof data);
  console.log('📋 Is array:', Array.isArray(data));
  
  if (data && data.length > 0) {
    console.log('📋 First item fields:', Object.keys(data[0]));
    console.log('📋 First item sample:', data[0]);
    console.log('📋 Doctor name:', data[0].doctor_name);
    console.log('📋 Last name:', data[0].last_name);
    console.log('📋 Report name:', data[0].report_name);
  } else {
    console.log('📋 No data or empty array');
  }
  return (
<>
<SafeAreaView style={{backgroundColor:'white'}}>

{!data || data.length === 0 ? (
  <View style={{padding: 20, alignItems: 'center'}}>
    <Text style={{fontSize: hp(2), color: '#787579', fontFamily: 'Poppins-Medium'}}>
      No reports available
    </Text>
  </View>
) : (
  data?.map((item,i)=>(
  <>

  <View style={styles.card}>
  <View style={styles.cardbody}>
    <View>
      <Image
        source={getProfileImageSource(item?.profile_picture)}
        onLoad={handleImageLoad}
        onError={(error) => handleImageError(error)}
        style={{
          borderRadius: 20,
          elevation: 10,
          height: hp(10),
          width: wp(20),
        }}
        defaultSource={require('../../../assets/images/CardDoctor1.png')}
      />
    </View>

    <View style={styles.textContainer}>
      <View>
        <Text
          style={{
            fontSize: hp(2),
            color: '#1C1B1F',
            fontWeight: '400',
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.hcf_diag_name || 
           (item.doctor_name && item.last_name ? `${item.doctor_name} ${item.last_name}` : item.doctor_name) || 
           'Unknown'}
        </Text>
      </View>

      <View style={{flexDirection: 'row', gap: 5, flexWrap: 'wrap'}}>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  {item.book_date || item.date} |
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  {item.book_time || item.time}
                </Text>
              </View>
              <View style={{width: wp(80)}}>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  Reports: {item.report_name}
                </Text>
              </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          // alignItems: 'flex-end',
          alignContent: 'flex-end',
          margin: 5,
          left: 15,
          top: 5,
        }}>
        <CustomButton
          bgColor="white"
          textColor="#E72B4A"
          borderColor="#E72B4A"
          borderWidth={1}
          borderRadius={60}
          title={'Share'}
          padding={0}
          fontSize={hp(1.2)}
          fontfamily={'Poppins-Medium'}
          pv={5}
        />

        <CustomButton
          bgColor="white"
          textColor="#E72B4A"
          borderColor="#E72B4A"
          borderWidth={1}
          borderRadius={60}
          title={'Download'}
          padding={0}
          fontSize={hp(1.2)}
          fontfamily={'Poppins-Medium'}
          pv={5}
        />
      </View>
    </View>
  </View>
</View>
</>
))
)}
</SafeAreaView>
</>
    
  );
};

export default RecievedSharedReportsCard;
