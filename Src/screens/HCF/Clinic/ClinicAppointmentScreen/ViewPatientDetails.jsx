import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import InAppCrossBackHeader from '../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomRadioButton from '../../../../components/customRadioGroup/CustomRadioGroup';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import Header from '../../../../components/customComponents/Header/Header';
const ViewPatientDetails = () => {
    // const dropdown=[
    //     {
    //         id:1,
    //         name:'dropdown',
    //         type:'select',
    //         placeholder:'Select Op'
    //     }
    // ]
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
    <Header
        logo={require('../../../../assets/Clinic1.jpeg')}
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
              showClose={true}
              closeIconSize={25}
              backIconSize={25}
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
            {/* <View>
              <Text
                style={{
                  color: '#939094',
                  fontFamily: 'Poppins-Regular',
                }}>
                Question 2
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                {[
                  {id: 1, label: 'Yes'},
                  {id: 2, label: 'No'},
                ].map((radio, i) => (
                  <CustomRadioButton key={i} label={radio.label} />
                ))}
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: '#939094',
                  fontFamily: 'Poppins-Regular',
                }}>
                Question 3
              </Text>
              <View style={{}}>
                {[
                  {id: 1, label: 'option 1'},
                  {id: 2, label: 'option 1'},
                  {id: 3, label: 'option 1'},
                  {id: 4, label: 'option 1'},
                ].map((radio, i) => (
                  <CustomRadioButton key={i} label={radio.label} />
                ))}
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: '#939094',
                  fontFamily: 'Poppins-Regular',
                }}>
                Question 4
              </Text>
              <View style={{}}>
                {dropdown.map((dd, i) => (
                 <CustomInput/>
                ))}
              </View>
            </View> */}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ViewPatientDetails;
