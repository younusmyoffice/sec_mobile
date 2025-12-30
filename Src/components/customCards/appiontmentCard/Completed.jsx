import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import AppointmentCard from './CustomAppointmentCard';
import AppointmentFailed from '../../customAppointmnetRequestComponent/AppointmentFailed';
import {Image} from 'react-native';

const Completed = ({data, loader}) => {
  console.log('📋 Completed Component Debug:');
  console.log('📋 Data received:', data);
  console.log('📋 Data length:', data?.length || 0);
  console.log('📋 Loader state:', loader);
  console.log('📋 Data type:', typeof data);
  console.log('📋 Is array:', Array.isArray(data));
  
  if (data && data.length > 0) {
    console.log('📋 First completed appointment:', data[0]);
    console.log('📋 First appointment keys:', Object.keys(data[0]));
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      {loader ? (
        <View style={{gap: 10}}>
          {Array.from({length: 5}).map((_, index) => (
            <AppointmentCard key={index} loading={true} />
          ))}
        </View>
      ) : data?.length > 0 ? (
        <View style={{gap: 10}}>
          {data?.map((item, i) => {
            console.log(`📋 Completed Appointment ${i}:`, item);
            console.log(`📋 Item keys:`, Object.keys(item));
            console.log(`📋 Doctor name:`, item.patientBookedName || item.first_name);
            console.log(`📋 Date:`, item.appointment_date || item.date);
            console.log(`📋 Time:`, item.appointment_time || item.time);
            console.log(`📋 Profile picture:`, item?.profile_picture ? 'Present' : 'Missing');
            
            return (
              <AppointmentCard
                key={i}
                btnTitle={'Leave a review'}
                bgcolor={'transparent'}
                btnTitle2={'Book again'}
                showBtn={'Appointmnetcards'}
                planname={item.plan_name || 'General Consultation'}
                btnStatus={item.status || 'Completed'}
                switches={'completed'}
                textColor={'#E72B4A'}
                borderColor={'#E72B4A'}
                borderWidth={1}
                firstname={item.patientBookedName || item.first_name || item.doctor_name || 'Patient'}
                middlename={item.middle_name || ''}
                lastname={item.last_name || ''}
                date={item.appointment_date ? item.appointment_date.split('T')[0] : (item.date || 'N/A')}
                time={item.appointment_time || item.time || 'N/A'}
                reportname={item.attachments || item.report_name || item.reportname || 'No reports'}
                profile_picture={item?.profile_picture}
              />
            );
          })}
        </View>
      ) : (
        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'red'}}>
          <View>
            <AppointmentFailed
              image={
                <Image source={require('../../../assets/images/CardDoctor1.png')} />
              }
              title={'You do not have any completed appointments'}
              desc={'Your completed appointments will appear here'}
              btntitle={'Find Doctor'}
            />
          </View>
        // </View>
      )}
    </SafeAreaView>
  );
};

export default Completed;
