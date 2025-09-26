import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';
import InAppHeader from '../../../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddPackage = () => {
  const navigation = useNavigation();
  const handleAddPlans = () => {
    navigation.navigate('add-plans');
  };
  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{gap: 10}}>
          <View>
            <InAppHeader
              Navig={handleAddPlans}
              LftHdr={'Add Plan'}
              btnYN={true}
              btnTitle={'Add'}
              bgcolor="white"
              textcolor="#E72B4A"
              fontsize={hp(2)}
              fontfamily={'Poppins-SemiBold'}
              lefticon={true}
              iconname={'plus'}
              row={'row'}
              gap={10}
            />
          </View>
          <View style={{padding: 15}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{gap: 5}}>
                <Text
                  style={{
                    color: 'black',
                    fontfamily: 'Poppins-Regular',
                    fontSize: hp(2.5),
                  }}>
                  Message Plan
                </Text>
                <Text
                  style={{
                    color: '#787579',
                    fontfamily: 'Poppins-Regular',
                    fontSize: hp(1.7),
                  }}>
                  $12 | 30min & 60
                </Text>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <MaterialCommunityIcons
                  name="pencil"
                  color="#E72B4A"
                  size={hp(2.5)}
                />
                <MaterialCommunityIcons
                  name="delete"
                  color="#E72B4A"
                  size={hp(2.5)}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#E6E1E5',

              marginBottom: 25,
            }}></View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPackage;
