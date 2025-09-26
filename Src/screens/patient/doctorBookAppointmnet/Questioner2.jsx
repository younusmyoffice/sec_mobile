import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../../../components/customInputs/CustomInputs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axiosInstance from '../../../utils/axiosInstance';

const Questioner2 = ({
  data,
  patientdetails,
  SetPatientDetails,
  // doctorid,
  // packageContact,
  availableSlots,
  selectpackage,
  fetchPackage,
  recieveListId,
  // recieveamount
}) => {
  // const [selectpackage, setselectpackage] = useState([]);
  // const [availableSlots, setAvailableSlots] = useState();
  // const [choosepackage,setChoosePackage]=useState()

  // console.log("choose",choosepackage)
  console.log('package', patientdetails);

  const handleChange = (name, value) => {
    SetPatientDetails(prevData => ({
      ...prevData,
      [name]: value,
    }));
    fetchPackage();
  };
  // const fetchTimeSlots = async () => {
  //   try {
  //     const response = await axiosInstance.post(`patient/getAppointmentSlots`, {
  //       appointment_date: patientdetails.date,
  //       doctor_id: doctorid,
  //       duration: patientdetails.duration,
  //     });
  //     console.log('slots', response.data.response.availableSlots);
  //     setAvailableSlots(
  //       response.data.response.availableSlots.map((slot, i) => ({
  //         label: slot,
  //         value: slot,
  //       })),
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const fetchPackage = async () => {
  //   const response = await axiosInstance.post(
  //     'patient/createAppointmentPackageSelect',
  //     {
  //       doctor_id: doctorid,
  //       is_active: 1,
  //       duration: patientdetails.duration,
  //     },
  //   );
  //   console.log(response.data.response.plan);
  //   setselectpackage(response.data.response.plan);
  // };

  // console.log('packages', patientdetails);
  const dynamicFields = data.map(field => {
    if (field.name === 'appointment_time') {
      return {...field, options: availableSlots};
    }
    return field;
  });

  const handlePackage = (id, doctorfee_id, amount, name, duration) => {
    SetPatientDetails({
      ...patientdetails,
      doctor_fee_plan_id: doctorfee_id,
    });
    recieveListId(id, amount, name, duration);
    // recieveamount(amount)
  };
  // useEffect(() => {
  //   // fetchTimeSlots();
  //   // fetchPackage();
  // }, []);
  console.log('avialbale ', availableSlots);
  return (
    <ScrollView>
      <SafeAreaView style={{}}>
        <View
          style={{
            // padding: 15,
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 25,
            marginTop: '5%',
          }}>
          <View
            style={{
              gap: 10,
              flexDirection: 'column',
              alignContent: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Poppins-Medium',
                color: 'black',
              }}>
              Select Time Slot
            </Text>
            <View>
              {dynamicFields.map(field => (
                <CustomInput
                  key={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={patientdetails[field.name]}
                  type={field.type}
                  options={field.options}
                  borderWidth={2}
                  borderRadius={10}
                  borderColor={'#E6E1E5'}
                  onChange={handleChange}
                />
              ))}
            </View>
            {/* <View style={{gap: 20}}>
              {selectpackage && selectpackage.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}>
                  <Text
                    style={{
                      color: '#AEAAAE',
                      fontSize: hp(2),
                      fontFamily: 'Poppins-Medium',
                    }}>
                    No package available for the selected slot.
                  </Text>
                </View>
              ) : (
                selectpackage?.map(field => (
                  <TouchableOpacity
                    onPress={() =>
                      handlePackage(
                        field?.doctor_list_id,
                        field?.doctor_fee_plan_id,
                        field?.plan_fee,
                        field.plan_name,
                        field.plan_duration,
                      )
                    }
                    key={field.id}>
                    <View
                      style={{
                        borderWidth: 1,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        borderColor:
                          patientdetails?.doctor_fee_plan_id ===
                          field?.doctor_fee_plan_id
                            ? '#E72B4A'
                            : '#E6E1E5',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 5,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 2,
                          }}>
                          <MaterialCommunityIcons
                            name={
                              field.plan_name === 'call'
                                ? 'phone'
                                : field.plan_name === 'video'
                                ? 'video'
                                : 'message'
                            }
                            size={20}
                            color={'#E72B4A'}
                          />
                          <View>
                            <Text
                              style={{
                                fontSize: hp(1.9),
                                color: 'black',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {field.plan_name}
                            </Text>
                            <Text style={{color: '#AEAAAE', fontSize: hp(1.5)}}>
                              {field.plan_description}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontWeight: '500',
                            }}>
                            {field.plan_fee + '/' + field.plan_duration}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View> */}
            <View style={{gap: 20}}>
              {!patientdetails?.appointment_time ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}>
                  <Text
                    style={{
                      color: '#AEAAAE',
                      fontSize: hp(2),
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Please select a time slot first.
                  </Text>
                </View>
              ) : selectpackage && selectpackage.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}>
                  <Text
                    style={{
                      color: '#AEAAAE',
                      fontSize: hp(2),
                      fontFamily: 'Poppins-Medium',
                    }}>
                    No package available for the selected slot.
                  </Text>
                </View>
              ) : (
                selectpackage?.map(field => (
                  <TouchableOpacity
                    onPress={() =>
                      handlePackage(
                        field?.doctor_list_id,
                        field?.doctor_fee_plan_id,
                        field?.plan_fee,
                        field.plan_name,
                        field.plan_duration,
                      )
                    }
                    key={field.id}>
                    <View
                      style={{
                        borderWidth: 1,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        borderColor:
                          patientdetails?.doctor_fee_plan_id ===
                          field?.doctor_fee_plan_id
                            ? '#E72B4A'
                            : '#E6E1E5',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 5,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 2,
                          }}>
                          <MaterialCommunityIcons
                            name={
                              field.plan_name === 'call'
                                ? 'phone'
                                : field.plan_name === 'video'
                                ? 'video'
                                : 'message'
                            }
                            size={20}
                            color={'#E72B4A'}
                          />
                          <View>
                            <Text
                              style={{
                                fontSize: hp(1.9),
                                color: 'black',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {field.plan_name}
                            </Text>
                            <Text style={{color: '#AEAAAE', fontSize: hp(1.5)}}>
                              {field.plan_description}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              fontWeight: '500',
                            }}>
                            {field.plan_fee + '/' + field.plan_duration}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Questioner2;
