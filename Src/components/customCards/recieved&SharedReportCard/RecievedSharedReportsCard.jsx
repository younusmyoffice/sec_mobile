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

const RecievedSharedReportsCard = ({data}) => {
  console.log(data)
  return (
<>
<SafeAreaView style={{backgroundColor:'white'}}>


{data?.map((item,i)=>(
  <>

  <View style={styles.card}>
  <View style={styles.cardbody}>
    <View>
      <Image
        source={require('../../../assets/cimg.png')}
        style={{
          borderRadius: 20,
          elevation: 10,
          height: hp(10),
          width: wp(20),
        }}
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
            {item.hcf_diag_name}
        </Text>
      </View>

      <View style={{flexDirection: 'row', gap: 5, flexWrap: 'wrap'}}>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  {item.book_date} |
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  {item.book_time}
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
))}
</SafeAreaView>
</>
    
  );
};

export default RecievedSharedReportsCard;
