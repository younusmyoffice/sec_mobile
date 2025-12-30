/**
 * VideoSDK Wrapper to Prevent iOS Crashes
 * 
 * This wrapper intercepts device enumeration calls on iOS to prevent native crashes.
 * The native WebRTC module crashes when trying to enumerate devices with nil values.
 */

import { Platform } from 'react-native';
import { mediaDevices, getAudioDeviceList as originalGetAudioDeviceList } from '@videosdk.live/react-native-sdk';

/**
 * Wrapped getAudioDeviceList that prevents crashes on iOS
 * 
 * On iOS: Returns empty array immediately without calling native module
 * On Android: Calls the original function normally
 */
export const getAudioDeviceList = async () => {
  // CRITICAL: Completely block device enumeration on iOS to prevent native crash
  if (Platform.OS === 'ios') {
    console.warn('⚠️ [VIDEO SDK WRAPPER] Device enumeration blocked on iOS to prevent native crash');
    return [];
  }
  
  // On Android, call the original function
  try {
    return await originalGetAudioDeviceList();
  } catch (error) {
    console.error('❌ [VIDEO SDK WRAPPER] Error enumerating devices:', error);
    return [];
  }
};

/**
 * Wrapped mediaDevices.getAudioDeviceList for compatibility
 */
export const wrappedMediaDevices = {
  ...mediaDevices,
  getAudioDeviceList: async () => {
    if (Platform.OS === 'ios') {
      console.warn('⚠️ [VIDEO SDK WRAPPER] mediaDevices.getAudioDeviceList blocked on iOS');
      return [];
    }
    try {
      return await mediaDevices.getAudioDeviceList();
    } catch (error) {
      console.error('❌ [VIDEO SDK WRAPPER] Error:', error);
      return [];
    }
  }
};

export default {
  getAudioDeviceList,
  wrappedMediaDevices,
};


