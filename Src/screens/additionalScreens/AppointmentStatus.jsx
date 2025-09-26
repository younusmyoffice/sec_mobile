import {View, Text, ScrollView, SafeAreaView, Image} from 'react-native';
import React, {useState} from 'react';

import AppointmnetSent from '../../components/customAppointmnetRequestComponent/AppointmnetSent';
import Header from '../../components/customComponents/Header/Header';
import AppointmentFailed from '../../components/customAppointmnetRequestComponent/AppointmentFailed';


const AppointmentStatus = () => {
  const [status, setstatus] = useState('sent');
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
