import { View, Text, ScrollView, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import React, { useState, useEffect } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import { useCommon } from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';

const AddPlan = ({ setActiveTab, listingId }) => {
  const navigation = useNavigation();
  const { userId } = useCommon();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [doctorPlanFields, setDoctorPlanFields] = useState([
    {
      id: 1,
      selected: false,
      Clabel: 'Message',
      plan_description: 'Plan for chatting',
      Inputs: [
        {
          id: 1,
          label: 'Price',
          name: 'price',
          type: 'text',
          placeholder: 'Price',
          value: '',
        },
        {
          id: 2,
          label: 'Duration',
          name: 'duration',
          type: 'select',
          options: [
            { value: '15 minutes', label: '15 minutes' },
            { value: '30 minutes', label: '30 minutes' },
            { value: '45 minutes', label: '45 minutes' },
            { value: '60 minutes', label: '60 minutes' },
          ],
          placeholder: 'Duration',
          value: '',
        },
      ],
    },
    {
      id: 2,
      selected: false,
      Clabel: 'Video',
      plan_description: 'Plan for video',
      Inputs: [
        {
          id: 1,
          label: 'Price',
          name: 'price',
          type: 'text',
          placeholder: 'Price',
          value: '',
        },
        {
          id: 2,
          label: 'Duration',
          name: 'duration',
          type: 'select',
          options: [
            { value: '15 minutes', label: '15 minutes' },
            { value: '30 minutes', label: '30 minutes' },
            { value: '45 minutes', label: '45 minutes' },
            { value: '60 minutes', label: '60 minutes' },
          ],
          placeholder: 'Duration',
          value: '',
        },
      ],
    },
  ]);

  // Fetch plans from API
  useEffect(() => {
    fetchPlans();
  }, [userId, listingId]);

  const fetchPlans = async () => {
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      console.log('⚠️ User not authenticated, skipping plans fetch');
      setError('Please login to view plans');
      return;
    }

    if (!listingId) {
      console.log('⚠️ No listingId provided, skipping plans fetch');
      setError('No listing selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = { doctor_id: userId, doctor_list_id: listingId };
      const response = await axiosInstance.post('createUpdatedoctorlisting/planAll', payload);
      const { response: responseData } = response.data;
      if (responseData.StatusCode === 200) {
        setPlans(responseData.allPlan || []);
      } else {
        throw new Error(responseData.body || 'Failed to fetch plans');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.response?.body || err.message || 'Failed to fetch plans';
      if (errorMessage === 'NO DATA FOUND FOR THE REQUESTED DOCTOR LISTING PLANS') {
        setPlans([]); // Clear plans and let empty state handle UI
      } else {
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal open
  const handleAddPlans = () => {
    setIsModalVisible(true);
  };

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setDoctorPlanFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, selected: !field.selected } : field
      )
    );
  };

  // Handle input change
  const handleInputChange = (planId, inputId, value) => {
    setDoctorPlanFields((prev) =>
      prev.map((field) =>
        field.id === planId
          ? {
              ...field,
              Inputs: field.Inputs.map((input) =>
                input.id === inputId ? { ...input, value } : input
              ),
            }
          : field
      )
    );
  };

  // Prepare payload for planCreate
  const preparePayload = () => {
    if (!listingId || !userId) {
      throw new Error('Missing required fields: listingId or userId');
    }
    const selectedPlans = doctorPlanFields
      .filter((field) => field.selected)
      .map((field) => ({
        doctor_list_id: listingId,
        doctor_id: userId,
        plan_fee: field.Inputs.find((input) => input.name === 'price').value,
        plan_name: field.Clabel.toLowerCase(),
        plan_duration: field.Inputs.find((input) => input.name === 'duration').value,
        is_trial: 1,
        plan_description: field.plan_description,
      }));
    return { plan: selectedPlans };
  };

  // API call to save plans
  const doctorPlansAdd = async () => {
    const selectedPlans = doctorPlanFields.filter((field) => field.selected);
    if (!selectedPlans.length) {
      Alert.alert('Error', 'Please select at least one plan');
      return;
    }

    for (const plan of selectedPlans) {
      const price = plan.Inputs.find((input) => input.name === 'price').value;
      const duration = plan.Inputs.find((input) => input.name === 'duration').value;
      if (!price || isNaN(price) || Number(price) <= 0) {
        Alert.alert('Error', `Invalid price for ${plan.Clabel} plan`);
        return;
      }
      if (!duration) {
        Alert.alert('Error', `Please select a duration for ${plan.Clabel} plan`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = preparePayload();
      await axiosInstance.post('createUpdatedoctorlisting/planCreate', payload);
      Alert.alert('Success', 'Plans saved successfully');
      setIsModalVisible(false);
      // Reset form
      setDoctorPlanFields((prev) =>
        prev.map((field) => ({
          ...field,
          selected: false,
          Inputs: field.Inputs.map((input) => ({ ...input, value: '' })),
        }))
      );
      // Refetch plans
      fetchPlans();
    } catch (err) {
      Alert.alert('Error', 'Failed to save plans. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ backgroundColor: '#fff' }}>
        <View style={{ gap: 10 }}>
          <View>
            <InAppHeader
              Navig={handleAddPlans}
              LftHdr={'Add Plan'}
              btnYN={true}
              btnTitle={'Add'}
              bgcolor="white"
              textcolor="#E72B4A"
              fontsize={hp(2)}
              fontfamily={'Poppins-SemiBold'}
              lefticon={true}
              iconname={'plus'}
              row={'row'}
              gap={10}
            />
          </View>
          
          <View style={{ padding: 15 }}>
            {isLoading ? (
              <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: hp(2) }}>
                Loading plans...
              </Text>
            ) : error ? (
              <Text style={{ color: 'red', fontFamily: 'Poppins-Regular', fontSize: hp(2) }}>
                {error}
              </Text>
            ) : plans.length === 0 ? (
              <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: hp(2) }}>
                No plans found
              </Text>
            ) : (
              plans.map((plan) => (
                <View key={plan.doctor_fee_plan_id} style={{ marginBottom: 25 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ gap: 5 }}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Poppins-Regular',
                          fontSize: hp(2.5),
                        }}
                      >
                        {plan.plan_name.charAt(0).toUpperCase() + plan.plan_name.slice(1)} Plan
                      </Text>
                      <Text
                        style={{
                          color: '#787579',
                          fontFamily: 'Poppins-Regular',
                          fontSize: hp(1.7),
                        }}
                      >
                        ${plan.plan_fee} | {plan.plan_duration}
                      </Text>
                    </View>
                    
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#E6E1E5',
                      marginTop: 10,
                    }}
                  />
                </View>
              ))
            )}
          </View>
        </View>
        <View style={{ gap: 10, alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 }}>
          <CustomButton
            title="Next"
            bgColor={'#E72B4A'}
            fontfamily={'Poppins-SemiBold'}
            textColor={'white'}
            fontSize={hp(2)}
            borderRadius={20}
            width={wp(55)}
            onPress={() => setActiveTab('Add Questioner')}
          />
        </View>

        {/* Modal for adding plans */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, margin: 20 }}>
              <InAppHeader
                LftHdr={'Add Plans'}
                textcolor="#E72B4A"
                fontsize={hp(2)}
                fontfamily={'Poppins-SemiBold'}
              />
              <ScrollView style={{ maxHeight: hp(60) }}>
                {doctorPlanFields.map((item) => (
                  <View key={item.id} style={{ marginVertical: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <CheckBox
                        boxType="square"
                        lineWidth={2}
                        tintColors={{ true: '#E72B4A', false: '#E72B4A' }}
                        value={item.selected}
                        onValueChange={() => handleCheckboxChange(item.id)}
                      />
                      <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: hp(1.7) }}>
                        {item.Clabel}
                      </Text>
                    </View>
                    {item.Inputs.map((input) => (
                      <CustomInput
                        key={input.id}
                        name={input.name}
                        placeholder={input.placeholder}
                        type={input.type}
                        options={input.options}
                        value={input.value}
                        onChange={(name, value) => handleInputChange(item.id, input.id, value)}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <CustomButton
                  title="Close"
                  bgColor={'#787579'}
                  fontfamily={'Poppins-SemiBold'}
                  textColor={'white'}
                  fontSize={hp(2)}
                  borderRadius={20}
                  width={wp(35)}
                  onPress={() => setIsModalVisible(false)}
                />
                <CustomButton
                  title="Save"
                  bgColor={'#E72B4A'}
                  fontfamily={'Poppins-SemiBold'}
                  textColor={'white'}
                  fontSize={hp(2)}
                  borderRadius={20}
                  width={wp(35)}
                  onPress={doctorPlansAdd}
                  disabled={isSaving}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPlan;