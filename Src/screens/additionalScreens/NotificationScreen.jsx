import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DATA} from '../../../utils/data';
import CustomNotificationRoundedList from '../../components/customNotificationRounded/CustomNotificationRoundedList';
export default function NotificationScreen() {
  
  return (
    <ScrollView>
      <SafeAreaView style={{padding:15}}>
        <View
          style={{
            padding: 20,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#E6E1E5',
            // padding: 15,
          }}>
          <CustomNotificationRoundedList />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
