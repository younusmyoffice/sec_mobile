import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../components/customComponents/InAppHeadre/InAppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
const PatientDetailsViewDoc = () => {
    // const dropdown=[
    //     {
    //         id:1,
    //         name:'dropdown',
    //         type:'select',
    //         placeholder:'Select Op'
    //     }
    // ]
    const navigation = useNavigation();

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
    <Header
        logo={require('../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
      />
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{padding: 15}}>
          <View>
            <InAppCrossBackHeader
              showClose={false}
              closeIconSize={25}
              backIconSize={25}
              onBackPress={()=> navigation.goBack('')}
            />
          </View>
          <View>
            <InAppHeader LftHdr={'Patient Details'} />
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{
                    color: '#939094',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  Patient Name
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'center',
                    fontSize: hp(1.8),
                  }}>
                  Johny Sins
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#939094',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  Gender
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                    fontSize: hp(1.8),
                  }}>
                  Male
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#939094',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  Age
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                    fontSize: hp(1.8),
                  }}>
                  55
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 30, gap: 15}}>
            <Text
              style={{
                fontSize: hp(2),
                color: '#313033',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Attached Files
            </Text>

            <View>
              <View>
                <Text
                  style={{
                    color: '#939094',
                    fontFamily: 'Poppins-Regular',
                    // textAlign: 'center',
                  }}>
                  File Name
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      // textAlign: 'center',
                    }}>
                    Report_details.pdf
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 8,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{color: '#E72B4A', fontFamily: 'Poppins-Regular'}}>
                      View
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 2,
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name="download"
                        color={'#E72B4A'}
                      />
                      <Text
                        style={{
                          color: '#E72B4A',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Download
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{marginTop: 30, gap: 15}}>
            <Text
              style={{
                fontSize: hp(2),
                color: '#313033',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Questioner
            </Text>
            <View>
              <Text
                style={{
                  color: '#939094',
                  fontFamily: 'Poppins-Regular',
                }}>
                Question 1
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  // textAlign: 'center',
                  fontSize: hp(1.8),
                }}>
                One Liner Answer
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#939094',
                  fontFamily: 'Poppins-Regular',
                }}>
                Question 1
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  // textAlign: 'center',
                  fontSize: hp(1.8),
                }}>
                One Liner Answer
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#939094',
                  fontFamily: 'Poppins-Regular',
                }}>
                Question 1
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  // textAlign: 'center',
                  fontSize: hp(1.8),
                }}>
                One Liner Answer
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default PatientDetailsViewDoc;
