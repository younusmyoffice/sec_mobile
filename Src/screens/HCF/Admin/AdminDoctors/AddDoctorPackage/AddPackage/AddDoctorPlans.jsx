import {View, Text, ScrollView, SafeAreaView, Button} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import React, {useState} from 'react';
import AdminHeader from '../../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../../components/customButton/CustomButton';
import Header from '../../../../../../components/customComponents/Header/Header';
import TimeRangePicker from '../../../../../../components/callendarPicker/TimeRangePicker';
import {useAuth} from '../../../../../../Store/Authentication';
import axiosInstance from '../../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../../Store/CommonContext';
import CustomToaster from '../../../../../../components/customToaster/CustomToaster';
import { useNavigation } from '@react-navigation/native';
const AddDoctorPlans = () => {
  const navigation=useNavigation()
  const {userId} = useAuth();
  const{doctor_id}=useCommon()
  console.log("hcf did",doctor_id)
  const [doctorPlanDetails, setDoctorPlanDetails] = useState({
    price: '',
    duration: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [formData, setFormData] = useState({
    hcf_id: userId.toString(),
    doctor_id: doctor_id.toString(),
    listing_name: '',
    working_days_start: '',
    working_days_end: '',
    working_time_start: '',
  });
  // const {userId} = useCommon();

  const [endTime, setEndTime] = useState(null);
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
            {value: '15 minutes', label: '15 minutes'},
            {value: '30 minutes', label: '30 minutes'},
            {value: '45 minutes', label: '45 minutes'},
            {value: '60 minutes', label: '60 minutes'},
          ],
          placeholder: 'Duration',
          value: '',
        },
      ],
    },
    {
      id: 2,
      selected: false,
      Clabel: 'Call',
      plan_description: 'Plan for call',
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
            {value: '15 minutes', label: '15 minutes'},
            {value: '30 minutes', label: '30 minutes'},
            {value: '45 minutes', label: '45 minutes'},
            {value: '60 minutes', label: '60 minutes'},
          ],
          placeholder: 'Duration',
          value: '',
        },
      ],
    },
    {
      id: 3,
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
            {value: '15 minutes', label: '15 minutes'},
            {value: '30 minutes', label: '30 minutes'},
            {value: '45 minutes', label: '45 minutes'},
            {value: '60 minutes', label: '60 minutes'},
          ],
          placeholder: 'Duration',
          value: '',
        },
      ],
    },
  ]);
  const handleCheckboxChange = id => {
    const updatedFields = doctorPlanFields.map(field => {
      if (field.id === id) {
        field.selected = !field.selected;
      }
      return field;
    });
    setDoctorPlanFields(updatedFields);
  };

  const handleInputChange = (planId, inputId, value) => {
    const updatedFields = doctorPlanFields.map(field => {
      if (field.id === planId) {
        const updatedInputs = field.Inputs.map(input => {
          if (input.id === inputId) {
            input.value = value;
          }
          return input;
        });
        field.Inputs = updatedInputs;
      }
      return field;
    });
    setDoctorPlanFields(updatedFields);
  };

  const handleDayPress = (day, name) => {
    if (!startDate || (endDate && day.dateString <= startDate)) {
      resetDates();
      setStartDate(day.dateString);
      setFormData({
        ...formData,
        working_days_start: day.dateString,
      });
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          selected: true,
          color: '#E72B4A',
          textColor: 'white',
        },
      });
    } else {
      setEndDate(day.dateString);
      setFormData({
        ...formData,
        working_days_end: day.dateString,
      });
      setMarkedDates(prev => ({
        ...prev,
        ...calculateMarkedDates(startDate, day.dateString),
        [day.dateString]: {
          endingDay: true,
          selected: true,
          color: '#E72B4A',
          textColor: 'white',
        },
      }));
    }
  };

  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {selected: true, color: '#E72B4A', textColor: 'white'};
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };

  const resetDates = () => {
    setStartDate('');
    setEndDate('');
    setMarkedDates({});
  };
  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const preparePayload = () => {
    const selectedPlans = doctorPlanFields
      .filter(field => field.selected)
      .map(field => ({
        plan_fee: field.Inputs.find(input => input.name === 'price').value,
        plan_name: field.Clabel.toLowerCase(),
        plan_duration: field.Inputs.find(input => input.name === 'duration')
          .value,
        start_date: '2024-07-26',
        end_date: '2026-07-27',
        is_trial: 1,
        no_of_reviews: 1,
        plan_description: field.plan_description,
      }));
    console.log('firstPlan uhhhuuu', 1);
    return {
      ...formData,
      plan: selectedPlans,
    };
  };

  const payload = preparePayload();
  console.log('payload', payload);
  // console.log("payload for Add plan",userId)

  const data = {
    hcf_id: '11',
    doctor_id: '112',
    listing_name: 'list2223',
    working_days_start: '2024-07-26',
    working_days_end: '2026-07-26',
    working_time_start: '09:00:00',

    // "doctor_list_id": "56",
    plan: [
      {
        plan_fee: 44,
        plan_name: 'message',
        plan_duration: '30 minutes',
        start_date: '2024-07-26',
        end_date: '2026-07-27',
        is_trial: 1,
        no_of_reviews: 1,
        plan_description: 'message plan for chatting',
      },
      {
        plan_fee: 55,
        plan_name: 'call',
        plan_duration: '60 minutes',
        start_date: '2024-07-26',
        end_date: '2026-07-27',
        is_trial: 1,
        no_of_reviews: 1,
        plan_description: 'message plan for call',
      },
      {
        plan_fee: 89,
        plan_name: 'video',
        plan_duration: '15 minutes',
        // "start_date": "2024-07-26",
        // "end_date": "2026-07-27",
        is_trial: 1,
        no_of_reviews: 1,
        plan_description: 'message plan for video',
      },
    ],
  };

  const handleAddPlan = async () => {
    console.log("payload in function",payload)
    try {
      const response = await axiosInstance.post(
        `https://api.shareecare.com/sec/hcf/addDoctorWorkingDetailsAndPlan`,
        payload,
      );
      console.log(response.data);
      CustomToaster.show('success',"Plan Created Successfully")
    } catch (error) {
      console.log(error);
    }
  };
  console.log(formData);
  console.log(startTime);
  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View>
          <Header
            logo={require('../../../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <InAppCrossBackHeader
              showClose={false}
              backIconSize={25}
              closeIconSize={25}
              onBackPress={()=>navigation.goBack()}
            />
          </View>
          <View>
            <InAppHeader
              LftHdr={'Add Listing Details'}
              textcolor="#E72B4A"
              fontsize={hp(2)}
              fontfamily={'Poppins-SemiBold'}
            />
          </View>
          <View>
            <CustomInput
              type={'text'}
              placeholder={'Listing Name'}
              // value={formData.listingName}
              onChange={handleChange}
              name="listing_name"
            />
            <View>
              <InAppHeader LftHdr={'Working Days'} />

              <CustomInput
                type={'date'}
                name={'date'}
                format={'doubleline'}
                calculateMarkedDates={calculateMarkedDates}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                resetDates={resetDates}
                markedDates={markedDates}
                handleDayPress={handleDayPress}
              />
            </View>

            <View style={{gap: 15}}>
              <InAppHeader LftHdr={'Working Time'} />

              <TimeRangePicker
                Type={'singleline'}
                startTime={startTime}
                onStartTimeChange={time => {
                  setStartTime(time);
                  setFormData(prev => ({
                    ...prev,
                    working_time_start: time,
                  }));
                }}
              />
            </View>
          </View>
          <View>
            <View>
              <InAppHeader
                LftHdr={'Add Plans'}
                textcolor="#E72B4A"
                fontsize={hp(2)}
                fontfamily={'Poppins-SemiBold'}
              />
            </View>
          </View>

          <View>
            {doctorPlanFields.map(item => (
              <View key={item.id}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <CheckBox
                    boxType="square"
                    lineWidth={2}
                    tintColors={{true: '#E72B4A', false: '#E72B4A'}}
                    value={item.selected}
                    onValueChange={() => handleCheckboxChange(item.id)}
                  />
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp(2),
                    }}>
                    {item.Clabel}
                  </Text>
                </View>
                {item.Inputs.map(input => (
                  <CustomInput
                    key={input.id}
                    name={input.name}
                    placeholder={input.placeholder}
                    type={input.type}
                    options={input.options}
                    value={input.value}
                    onChange={(name, value) =>
                      handleInputChange(item.id, input.id, value)
                    }
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Save"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-SemiBold'}
              textColor={'white'}
              fontSize={hp(2)}
              borderRadius={20}
              width={wp(60)}
              onPress={() => {
                handleAddPlan();
                console.log(payload);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddDoctorPlans;
