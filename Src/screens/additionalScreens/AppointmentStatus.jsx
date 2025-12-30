/**
 * ============================================================================
 * SCREEN: Appointment Status
 * ============================================================================
 * 
 * PURPOSE:
 * Displays appointment booking status (success or failure)
 * 
 * SECURITY:
 * - No API calls, purely presentational
 * - Status should be passed via route params
 * 
 * TODO:
 * - Accept status from route params instead of hardcoded state
 * - Add proper navigation after status display
 * 
 * @module AppointmentStatus
 */

import {View, Text, ScrollView, SafeAreaView, Image} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

// Components
import AppointmnetSent from '../../components/customAppointmnetRequestComponent/AppointmnetSent';
import Header from '../../components/customComponents/Header/Header';
import AppointmentFailed from '../../components/customAppointmnetRequestComponent/AppointmentFailed';

// Utils & Constants
import Logger from '../../constants/logger'; // UTILITY: Structured logging

const AppointmentStatus = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // STATE: Appointment booking status
  // Get status from route params, default to 'sent'
  const [status, setstatus] = useState(route?.params?.status || 'sent');

  // Update status if route params change
  React.useEffect(() => {
    if (route?.params?.status) {
      Logger.debug('Appointment status received', { status: route.params.status });
      setstatus(route.params.status);
    }
  }, [route?.params?.status]);

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <View
            style={{
              marginTop: 150,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {status === 'sent' ? (
              <View>
                <AppointmnetSent />
              </View>
            ) : (
              <View>
                <AppointmentFailed
                  image={
                    <Image
                      source={require('../../../assets/requestfailed.png')}
                    />
                  }
                  title={'Appointment request Failed'}
                  desc={
                    ' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequiinventore sunt earum quae quidem voluptatem quisquam rerum id voluptatum maxime.'
                  }
                  btntitle={'"Booking Failed"'}
                />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AppointmentStatus;
