import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomNotificationRoundedList from '../../../components/customNotificationRounded/CustomNotificationRoundedList';
import axiosInstance from '../../../utils/axiosInstance';
import { useCommon } from '../../../Store/CommonContext';

export default function NotificationDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useCommon();

  const fetchNotifications = async () => {
    console.log("fdsafdsafdsa")
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(`/DoctorNotification/${userId}`);
      const durations = response?.data?.response?.durations;

      if (!durations || !Array.isArray(durations)) {
        throw new Error('Invalid data received from server');
      }

      setNotifications(durations);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading Notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return <CustomNotificationRoundedList data={notifications} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
