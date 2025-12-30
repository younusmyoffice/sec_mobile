import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import Header from '../../../../../components/customComponents/Header/Header';
import TimeRangePicker from '../../../../../components/callendarPicker/TimeRangePicker';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useAuth} from '../../../../../Store/Authentication';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import {useNavigation, useRoute} from '@react-navigation/native';
const CreateLab = () => {
  const route = useRoute();
  const {item, status} = route.params || {};
  const navigation = useNavigation();
  const {userId} = useAuth();
  const [dept, setDept] = useState([]);
  const [startDate, setStartDate] = useState(item?.lab_working_days_from || '');
  const [endDate, setEndDate] = useState(item?.lab_working_days_to || '');
  const [startTime, setStartTime] = useState(
    item?.lab_working_time_from || null,
  );
  const [endTime, setEndTime] = useState(item?.lab_working_time_to || null);
  const [markedDates, setMarkedDates] = useState({});
  const [addLab, setAddLab] = useState({
    lab_dept_id: item?.lab_department_id?.toString() || '',
    hcf_id: userId ? userId.toString() : '',
    lab_working_days_from: item?.lab_working_days_from || '',
    lab_working_days_to: item?.lab_working_days_to || '',
    lab_description: item?.lab_description || '',
    lab_working_time_from: item?.lab_working_time_from || '',
    lab_working_time_to: item?.lab_working_time_to || '',
  });
  const fetchDept = async () => {
    try {
      const response = await axiosInstance.get(`labDepartments`);
      console.log(response.data.response);
      setDept(
        response.data.response?.map((item, i) => ({
          label: item?.lab_department_name,
          value: item?.lab_department_id?.toString(),
        })),
      );
    } catch (error) {}
  };
  const createLab = [
    {
      id: 1,
      name: 'lab_dept_id',
      type: 'select',
      placeholder: 'Department',
    },
    {
      id: 2,
      name: 'from',
      type: 'date',
      placeholder: 'From',
      label: 'From',
      logo: true,
      icon: 'calendar',
    },
    {
      id: 3,
      name: 'to',
      type: 'date',
      placeholder: 'To',
      label: 'To',
      logo: true,
      icon: 'calendar',
    },
    {
      id: 4,
      name: 'from',
      type: 'date',
      placeholder: 'From',
      label: 'From',
      logo: true,
      icon: 'calendar',
    },
    {
      id: 5,
      name: 'to',
      type: 'date',
      placeholder: 'To',
      label: 'To',
      logo: true,
      icon: 'calendar',
    },
    {
      id: 6,
      name: 'lab_description',
      type: 'textarea',
      placeholder: 'Description',
      label: 'Description',
    },
  ];

  const department = createLab.slice(0, 1);
  const workingDays = createLab.slice(1, 3);
  const workingTime = createLab.slice(3, 6);

  const dynamicFields = department.map(field => {
    if (field.name === 'lab_dept_id') {
      return {...field, options: dept};
    }
    return field;
  });

  const handleDayPress = (day, name) => {
    if (!startDate || (endDate && day.dateString <= startDate)) {
      resetDates();
      setStartDate(day.dateString);
      setAddLab({
        ...addLab,
        lab_working_days_from: day.dateString,
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
      setAddLab({
        ...addLab,
        lab_working_days_to: day.dateString,
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
    setAddLab(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddLab = async () => {
    // Validate required fields
    if (!addLab.lab_dept_id || !addLab.lab_working_days_from || !addLab.lab_working_days_to || !addLab.lab_working_time_from || !addLab.lab_working_time_to) {
      CustomToaster.show('error', 'Missing Fields', 'Please fill in all required fields');
      return;
    }

    const add = addLab;
    const edit = {
      exam_id: item?.exam_id?.toString(),
      exam_name: item?.exam_name,
      ...addLab,
    };
    
    console.log('🔬 Lab Creation Debug:');
    console.log('📋 Status:', status);
    console.log('📦 Payload:', status === 'edit' ? edit : add);
    
    try {
      const response = await axiosInstance.post(
        `hcf/addLabs`,
        status === 'edit' ? edit : add,
      );
      console.log('✅ Lab creation response:', response.data);
      
      CustomToaster.show(
        'success',
        status === 'edit' ? 'Lab Edited Successfully' : 'Lab Added Successfully',
      );
      navigation.goBack();
    } catch (error) {
      console.error('❌ Lab creation failed:', error);
      
      let errorMessage = 'Failed to create lab. Please try again.';
      
      if (error.response?.data?.response?.body) {
        errorMessage = error.response.data.response.body;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      CustomToaster.show('error', 'Lab Creation Failed', errorMessage);
    }
  };
  useEffect(() => {
    fetchDept();
  }, []);

  console.log(addLab);
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View>
          <Header
            logo={require('../../../../../assets/hcfadmin.png')}
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
              onBackPress={() => navigation.goBack()}
            />
          </View>
          <View>
            <InAppHeader
              LftHdr={'Add Lab'}
              textcolor="#E72B4A"
              fontsize={hp(1.8)}
              fontfamily={'Poppins-SemiBold'}
              subtitle={'Create a Lab here'}
            />
          </View>
          <View>
            {dynamicFields.map((item, i) => (
              <CustomInput
                name={item.name}
                placeholder={item.placeholder}
                options={item.options}
                type={item.type}
                value={addLab[item.name]}
                onChange={handleChange}
              />
            ))}
          </View>
          <View>
            <InAppHeader
              LftHdr={'Working Days'}
              textcolor="#E72B4A"
              fontsize={hp(2)}
              fontfamily={'Poppins-SemiBold'}
            />
            <View>
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
          </View>
          <View>
            <InAppHeader
              LftHdr={'Working Time'}
              textcolor="#E72B4A"
              fontsize={hp(2)}
              fontfamily={'Poppins-SemiBold'}
            />
            <View>
              <TimeRangePicker
                Type={'d'}
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={time => {
                  setStartTime(time);
                  setAddLab(prev => ({
                    ...prev,
                    lab_working_time_from: time,
                  }));
                }}
                onEndTimeChange={time => {
                  setEndTime(time);
                  setAddLab(prev => ({
                    ...prev,
                    lab_working_time_to: time,
                  }));
                }}
              />
            </View>
            <View style={{gap: 0}}>
              {workingTime.map((item, i) => (
                <>
                  {item.type === 'textarea' && (
                    <Text
                      style={{
                        color: '#787579',
                        paddingHorizontal: 15,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {item.label}
                    </Text>
                  )}

                  <CustomInput
                    name={item.name}
                    placeholder={item.placeholder}
                    options={item.options}
                    type={item.type}
                    logo={item.logo}
                    icon={item.icon}
                    onChange={handleChange}
                    value={addLab[item.name]}
                  />
                </>
              ))}
            </View>
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title={status === 'edit' ? 'Edit' : 'Create'}
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-SemiBold'}
              textColor={'white'}
              fontSize={hp(2)}
              borderRadius={20}
              width={wp(60)}
              onPress={handleAddLab}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateLab;
