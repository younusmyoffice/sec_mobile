import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import CustomButton from '../../../../components/customButton/CustomButton';

const image = require('../../../../assets/images/SubscriptionBg.png');
export default function SubscriptionComponent() {
  return (
    <SafeAreaView style={{alignItems: 'center'}}>
      <View>
        <ImageBackground
          source={image}
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            height: 414,
            width: 309,
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <View style={{paddingTop: 20, left: -10}}>
            <View style={{width: 150, marginBottom: 10}}>
              <CustomButton
                borderRadius={30}
                borderWidth={1}
                bgColor={'#FDEAED'}
                textColor={'#E72B4A'}
                borderColor={'#E72B4A'}
                title={'Active'}
              />
            </View>
            <Text
              style={{
                color: '#E72B4A',
                fontFamily: 'Poppins-Bold',
                fontSize: 18,
              }}>
              Expire Date : 20-02-2025
            </Text>
          </View>
          <View style={{right: 70, top: 0}}>
            <Text
              style={{
                fontSize: 22,
                color: '#313033',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Basic Plan
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#313033',
                }}>
                * Feature 1
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#313033',
                }}>
                * Feature 2
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#313033',
                }}>
                * Feature 3
              </Text>
            </View>
          </View>

          <Image
            source={require('../../../../assets/images/subimage.png')}
            style={{
              width: 244,
              height: 184,
              resizeMode: 'stretch',
              left: 32,
              top: 13,
            }}
          />
        </ImageBackground>
        <View style={{bottom: 0}}>
          <CustomButton
            borderRadius={30}
            borderWidth={1}
            bgColor={'#E72B4A'}
            textColor={'#FFF'}
            borderColor={'#E72B4A'}
            title={'Upgrade'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
