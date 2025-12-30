import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import InAppHeader from '../customComponents/InAppHeadre/InAppHeader';
import UserAvatar from 'react-native-user-avatar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../customCards/doctorCard/DoctorCardStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getProfileImageSource, handleImageError, handleImageLoad} from '../../utils/imageUtils';

const CustomReviewCard = ({reviwes}) => {
  console.log(reviwes)
  const [showFull, setShowFull] = useState(false);
  const displayReviews = showFull ? reviwes : reviwes?.slice(0, 2);
  return (
    <View>
      <View>
        <View style={{paddingHorizontal: 15}}>
          <InAppHeader
            LftHdr={'Reviews'}
            textbtn={true}
            textBtnText={'View All'}
            showReviewHideReview={showFull}
            showLess={'Show Less'}
            onClick={() => setShowFull(!showFull)}
          />
        </View>
        {displayReviews?.map((rev, i) => (
          <View>
            <View style={{padding: hp(1.5), gap: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                  <Image
                    source={getProfileImageSource(rev?.profile_picture)}
                    onLoad={handleImageLoad}
                    onError={(error) => handleImageError(error)}
                    style={{width:wp(10),height:hp(5), resizeMode: 'cover',borderRadius:50}}
                    defaultSource={require('../../assets/images/CardDoctor1.png')}
                  />
                  <Text
                    style={{
                      fontSize: hp(2),
                      color: '#313033',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {rev.first_name + ' ' + rev.last_name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: hp(0.5),
                    borderWidth: 2,
                    paddingLeft: 15,
                    borderColor: '#E72B4A',
                    borderRadius: 16,
                    paddingRight: 15,
                  }}>
                  <MaterialCommunityIcons
                    name="star"
                    size={hp(1.5)}
                    color="#E72B4A"
                  />
                  <Text style={{color: '#E72B4A', fontSize: hp(1.9)}}>
                    {rev.review_type}
                  </Text>
                </View>
              </View>
              <View style={{paddingHorizontal: hp(1)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'justify',
                    color: '#939094',
                  }}>
                  {rev.description}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#E6E1E5',
                width: '90%',
                // marginTop: 1,
                marginBottom: 10,
                alignSelf: 'center',
              }}></View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CustomReviewCard;
