import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import styles from './AppointmentCardStyle';
import CustomButton from '../../customButton/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SkeletonLoader from '../../customSkeleton/SkeletonLoader';
const AppointmentCard = ({
  loading,
  btnStatusForJoin,
  btnStatus,
  showBtn,
  btnTitle,
  btnTitle2,
  switches,
  bgcolor,
  textColor = 'white',
  borderColor,
  borderWidth,
  isShowStatus = true,
  menuList,
  onPress,
  profile_picture,
  firstname,
  middlename,
  lastname,
  date,
  time = '01:20:00 AM',
  reportname,
  planname,
}) => {
  // console.log("datadata",appointmentDetailsData)


  const [modal, setmodal] = useState(false);
  const renderButtons = () => {
    switch (showBtn) {
      case 'Appointmnetcards':
        return (
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
            <View style={{flex: 3}}>
              <CustomButton
                title={btnTitle}
                bgColor={bgcolor}
                borderRadius={20}
                textColor={textColor}
                borderColor={borderColor}
                borderWidth={borderWidth}
                fontSize={hp(1.7)}
                onPress={onPress}
                disabled={btnStatusForJoin}
              />
            </View>
            {switches === 'upcomming' ? (
              <>
                <View
                  style={{
                    borderWidth: 1.5,
                    padding: 10,
                    borderRadius: 20,
                    borderColor: '#E6E1E5',
                    position: 'relative',
                  }}>
                  <TouchableOpacity onPress={() => setmodal(!modal)}>
                    <MaterialCommunityIcons
                      name="kebab-horizontal"
                      size={20}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : switches === 'completed' ? (
              <CustomButton
                title={btnTitle2}
                bgColor={'#E72B4A'}
                borderRadius={20}
                textColor={'white'}
              />
            ) : switches === 'request' ? (
              <>
                <View
                  style={{
                    borderWidth: 1.5,
                    padding: 10,
                    borderRadius: 20,
                    borderColor: '#E6E1E5',
                    position: 'relative',
                  }}>
                  <TouchableOpacity onPress={() => setmodal(!modal)}>
                    <MaterialCommunityIcons
                      name="kebab-horizontal"
                      size={20}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        );

      default:
        return null;
    }
  };
  if (loading) {
    return (
      <View
        style={{
          flexDirection: 'column',
          gap: 10,
          backgroundColor: '#F0F0F0',
          padding: 10,
          borderRadius: 10,
          height:hp(20)
        }}>
        <View style={{flexDirection:'row',gap:10}}>
          <SkeletonLoader
            width={85}
            height={90}
            borderRadius={10}
            style={styles.avatar}
          />
          <View style={{flexDirection:'column',gap:10}}>

          <SkeletonLoader
            width={wp(60)}
            height={hp(3)}
            borderRadius={10}
            style={styles.avatar}
          />
          <SkeletonLoader
            width={wp(60)}
            height={hp(3)}
            borderRadius={10}
            style={styles.avatar}
          />
          </View>
        </View>
        <View style={{alignSelf:'center'}}>
          <SkeletonLoader
            width={wp(60)}
            height={hp(5)}
            borderRadius={30}
            // style={{marginVertical:10}}
          />
        </View>
        
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => setmodal(false)}>
      <SafeAreaView style={styles.card}>
        <View style={{gap: 10}}>
          <View style={styles.cardbody}>
            <View>
              <Image
                source={{uri: profile_picture && profile_picture}}
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
                  {firstname + ' ' + middlename + ' ' + lastname}
                </Text>
              </View>
              {isShowStatus ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.cardTextSmall}>{planname} </Text>

                    <TouchableWithoutFeedback >
                      <Text
                        style={{
                          color: '#E72B4A',
                          fontSize: hp(1.2),
                          borderColor: '#E72B4A',
                          borderWidth: 1,

                          // borderRadius: 40,
                          paddingVertical: 2,
                          paddingHorizontal: 5,
                          fontFamily: 'Poppins-SemiBold',
                          borderRadius: 12,
                          textAlignVertical: 'center',
                        }}>
                        {btnStatus}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                </>
              ) : null}

              <View style={{flexDirection: 'row', gap: 5, flexWrap: 'wrap'}}>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  {date} |
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  {time}
                </Text>
              </View>
              <View style={{width: wp(80)}}>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    color: '#787579',
                    fontFamily: 'Poppins-thin',
                  }}>
                  Reports: {reportname}
                </Text>
              </View>
            </View>
          </View>
          {renderButtons()}
          <View style={{height: 1, backgroundColor: '#C9C5CA'}}></View>

          {modal ? (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                alignSelf: 'flex-end',
                marginTop: 100,
              }}>
              <View
                style={{
                  // minHeight: 100,
                  minWidth: 100,
                  borderRadius: 10,
                  backgroundColor: 'white',
                  elevation: 10,
                  padding: 8,
                }}>
                <View style={{gap: 10}}>
                  {menuList?.map((list, i) => (
                    <>
                      <TouchableWithoutFeedback onPress={list.func}>
                        <Text
                          style={{
                            fontSize: hp(2),
                            color: 'black',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {list.menuItem}
                        </Text>
                      </TouchableWithoutFeedback>
                    </>
                  ))}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AppointmentCard;
