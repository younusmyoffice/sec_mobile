import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import InAppHeader from '../customComponents/InAppHeadre/InAppHeader';
import UserAvatar from 'react-native-user-avatar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomEduLicAwardCard = ({...props}) => {
  const navigation = useNavigation();
  return (
    <View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
          }}>
          {/* <InAppHeader LftHdr={props.Header} textbtn={false} /> */}
          {props.righticon ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(props.navig);
              }}>
              <MaterialCommunityIcons name="plus" color={'#E72B4A'} size={28} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{padding: hp(1), gap: hp(1)}}>
          {/* {props.data?.map(item => ( */}
          <View
            style={{
              // gap: 10,
              borderWidth: 1,
              borderColor: '#E6E1E5',
              borderRadius: 10,
              padding: hp(1),
            }}>
            <View style={{flexDirection: 'row', padding: hp(0.5)}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 15,
                }}>
                <UserAvatar
                  name={
                    props.collegeicon ||
                    props.certificateIcon ||
                    props.awardIcon ||
                    props.experienceIcon
                  }
                  size={hp(6)}
                />
                <View style={{gap: 2}}>
                  {props.type === 'education' && (
                    <>
                      <Text
                        style={{
                          fontSize: hp(2),
                          color: '#313033',
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {props.collegename}
                      </Text>
                      <Text
                        style={{
                          fontSize: hp(1.5),
                          color: '#939094',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        {props.collegeDegree}
                      </Text>
                      <Text
                        style={{
                          fontSize: hp(1.5),
                          color: '#939094',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        {props.year}
                      </Text>
                    </>
                  )}
                  {props.type === 'licenses' && (
                    <View style={{gap: 5}}>
                      <Text
                        style={{
                          fontSize: hp(2),
                          color: '#313033',
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {props.certificateName}
                      </Text>
                      <Text
                        style={{
                          fontSize: hp(1.6),
                          color: '#939094',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Issuing Authority: {props.authority}
                      </Text>

                      <Text
                        style={{
                          fontSize: hp(1.5),
                          color: '#939094',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Issue Date: {props.issueDate}
                      </Text>
                      <Text
                        style={{
                          fontSize: hp(1.5),
                          color: '#939094',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Lic No.: {props.certificateId}
                      </Text>
                    </View>
                  )}
                  {props.type === 'awards' && (
                    <View>
                      <View>
                        <Text
                          style={{
                            fontSize: hp(2),
                            color: '#313033',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {props.awardTitle}
                        </Text>
                        <Text
                          style={{
                            fontSize: hp(1.6),
                            color: '#939094',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Issuing Authority: {props.awardIssued}
                        </Text>

                        <Text
                          style={{
                            fontSize: hp(1.5),
                            color: '#939094',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Issue Date: {props.issueDate}
                        </Text>
                        <View style={{width: '87%'}}>
                          <Text
                            style={{
                              fontSize: hp(1.5),
                              color: '#939094',
                              fontFamily: 'Poppins-Regular',
                              textAlign: 'justify',
                            }}>
                            {/* { props.desc} */}
                            {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium cumque, fuga fugiat beatae quos ratione repellendus! Saepe non assumenda necessitatibus id ipsum dolores aperiam ex corporis culpa laudantium! Omnis ab eius animi rerum natus, et aliquid doloribus odit ut doloremque dignissimos sed veniam expedita? Pariatur deleniti veritatis eius dicta magni. */}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {props.type == 'experience' && (
                    <>
                      <View>
                        <View>
                          <Text
                            style={{
                              fontSize: hp(2),
                              color: '#313033',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            {props.job}
                          </Text>
                          <Text
                            style={{
                              fontSize: hp(1.6),
                              color: '#939094',
                              fontFamily: 'Poppins-Regular',
                            }}>
                            Organization: {props.organization}
                          </Text>

                          <Text
                            style={{
                              fontSize: hp(1.5),
                              color: '#939094',
                              fontFamily: 'Poppins-Regular',
                            }}>
                            From Date: {props.fromdate}
                          </Text>
                          <Text
                            style={{
                              fontSize: hp(1.5),
                              color: '#939094',
                              fontFamily: 'Poppins-Regular',
                            }}>
                            To Date: {props.todate}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
            {(props.type == 'awards' || props.type == 'licenses') && (
              <>
                <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
                  Description
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.6),
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'justify',
                    color: '#AEAAAE',
                  }}>
                  {props.description}
                </Text>
              </>
            )}
          </View>
          {/* ))} */}
        </View>
      </View>
    </View>
  );
};

export default CustomEduLicAwardCard;
