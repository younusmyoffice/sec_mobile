import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import AppointmentCard from './CustomAppointmentCard';
import AppointmentFailed from '../../customAppointmnetRequestComponent/AppointmentFailed';
import {Image} from 'react-native';

const Completed = ({data, loader}) => {
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
          {data?.map((item, i) => (
            <AppointmentCard
              btnTitle={'Leave a review'}
              bgcolor={'transparent'}
              btnTitle2={'Book again'}
              showBtn={'Appointmnetcards'}
              planname={item.plan_name}
              btnStatus={item.status}
              switches={'completed'}
              textColor={'#E72B4A'}
              borderColor={'#E72B4A'}
              borderWidth={1}
              firstname={item.patientBookedName}
              middlename={" "}
              lastname={" "}
              profile_picture={item?.profile_picture}
            />
          ))}
        </View>
      ) : (
        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'red'}}>
          <View>
            <AppointmentFailed
              image={
                <Image source={require('../../../assets/NoAppointment.png')} />
              }
              title={'You don’t have any appointment'}
              desc={'Book an appointment'}
              btntitle={'Find Doctor'}
            />
          </View>
        // </View>
      )}
    </SafeAreaView>
  );
};

export default Completed;
{
  /* <AppointmentCard
btnTitle={'Leave a review'}
bgcolor={'transparent'}
btnTitle2={'Book again'}
showBtn={'Appointmnetcards'}
planname={item.plan_name}
btnStatus={item.status}
switches={'completed'}
textColor={'#E72B4A'}
borderColor={'#E72B4A'}
borderWidth={1}
firstname={item.first_name}
middlename={item.middle_name}
lastname={item.last_name}

/> */
}
