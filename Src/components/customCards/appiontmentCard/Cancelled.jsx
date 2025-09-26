import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AppointmentCard from './CustomAppointmentCard';
import AppointmentFailed from '../../customAppointmnetRequestComponent/AppointmentFailed';

const Cancelled = ({ data, loader }) => {
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  // Simulate a loading period if data is provided via props or from an API call
  useEffect(() => {
    if (data) {
      setIsLoading(false); // Set loading to false once data is available
    }
  }, [data]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,padding:10}}>
      {/* Show loader if loading state is true */}
      {loader ? (
      <View style={{gap: 10}}>
        {Array.from({length: 5}).map((_, index) => (
          <AppointmentCard key={index} loading={true} />
        ))}
      </View>
    ) : data?.length > 0 ? (
      <View style={{flex:1,gap: 10,padding:10,margin:15,left:15}}>
        {data.map((item, i) => (
              <AppointmentCard
                key={i} 
                planname={item.plan_name}
                btnStatus={item.status}
                switches={'Cancelled'}
                textColor={'#E72B4A'}
                borderColor={'#E72B4A'}
                borderWidth={1}
                firstname={item.first_name}
                middlename={item.middle_name}
                lastname={item.last_name}
                profile_picture={item?.profile_picture}
              />
            ))}
      </View>
    ) : (
      <View>
        <AppointmentFailed
          image={
            <Image source={require('../../../assets/NoAppointment.png')} />
          }
          title={'There are no Cancelled appointments.'}
          desc={''}
          showBtn = {false}
        />
      </View>
    )}
    </View>
  );
};

export default Cancelled;
