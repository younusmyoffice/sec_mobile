import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomNotificationList from '../../components/customNotificationList/CustomNotificationList';
import {DATA} from '../../utils/data';

export default function NotificationScreen() {
  return (
    <View>
      <CustomNotificationList Data={DATA} />
    </View>
  );
}

const styles = StyleSheet.create({});
