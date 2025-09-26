import {View, Text, TouchableWithoutFeedback} from 'react-native';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../../../../components/customButton/CustomButton';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import Doctors from './Doctors';
import Diagnostic from './Diagnostic';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useAuth} from '../../../../../Store/Authentication';
const SalesActivities = () => {
  const {userId} = useAuth();
  const [activeTab, setactiveTab] = useState('Doctors');
  const [isloading, setIsLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    {id: 1, label: 'All', isSelected: true},
    {id: 2, label: 'booked', isSelected: false},
    {id: 3, label: 'in_progress', isSelected: false},
  ]);

  const doctorheader = [
    'Name and Details',
    'Status',
    'Date & Time',
    'Amount',
    'Plan Name',
  ];
  const diagheader = [
    'Name/Booking ID',
    'Status',
    'Date & Time',
    'Department',
    'Test Name',
    'Price',
  ];
  // const ddata = [
  //   {
  //     id: 1,
  //     image: require('../../../../../assets/cimg.png'),
  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  //   {
  //     id: 2,
  //     image: require('../../../../../assets/cimg.png'),
  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  //   {
  //     id: 3,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime: '16-oct',
  //     package: 'Message',

  //     price: 200.0,
  //   },
  //   {
  //     id: 4,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Cancelled',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  //   {
  //     id: 5,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Cancelled',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  // ];
  const [doctorSales, setDoctorSales] = useState([]);

  const fetchdoctorSales = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `hcf/manageSaleActivity/${userId}`,
      );
      console.log(response.data.response);
      setDoctorSales(response.data.response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const diagdata = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      status: 'Completed',
      datetime: '16-oct',
      dept: 'Cardiology',
      test_name: 'Card-1',
      price: 200.98,
    },
    {
      id: 2,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      status: 'Cancelled',
      datetime: '16-oct',
      dept: 'Cardiology',
      test_name: 'Card-1',
      price: 200.98,
    },
    {
      id: 3,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      status: 'Completed',
      datetime: '16-oct',
      dept: 'Cardiology',
      test_name: 'Card-1',
      price: 200.98,
    },
    {
      id: 4,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      status: 'Cancelled',
      datetime: '16-oct',
      dept: 'Cardiology',
      test_name: 'Card-1',
      price: 200.98,
    },
    {
      id: 5,
      status: 'Completed',
      datetime: '16-oct',
      dept: 'Cardiology',
      test_name: 'Card-1',
      price: 200.98,
    },
  ];
  const toggleCheckbox = id => {
    setCheckboxes(prev =>
      prev.map(checkbox =>
        checkbox.id === id
          ? {...checkbox, isSelected: !checkbox.isSelected}
          : {...checkbox, isSelected: false},
      ),
    );
  };

  const selectedFilters = checkboxes
    .filter(checkbox => checkbox.isSelected)
    .map(checkbox => checkbox.label);

  const filteredData = selectedFilters.includes('All')
    ? doctorSales
    : doctorSales.filter(item => selectedFilters.includes(item.status));
  const filteredDiagnosticData = selectedFilters.includes('All')
    ? diagdata
    : diagdata.filter(item => selectedFilters.includes(item.status));

  console.log(filteredData);
  const renderComponent = () => {
    switch (activeTab) {
      case 'Doctors':
        return <Doctors header={doctorheader} data={filteredData} isloading={isloading}/>;
      case 'Diagnostic':
        return <Diagnostic header={diagheader} data={filteredDiagnosticData} />;
    }
  };
  useEffect(() => {
    fetchdoctorSales();
  }, []);
  return (
    <View style={{gap: 10}}>
      <View style={{flexDirection: 'row'}}>
        <CustomSearch placeholderTextColor={'#AEAAAE'} showmenuIcon={true} />
      </View>
      <View style={{alignSelf: 'center'}}>
        <View
          style={{
            backgroundColor: '#f0f0f0',
            borderRadius: 20,
            gap: 5,
            height: hp(8),
          }}>
          <View style={{alignItems: 'center'}}>
            <TopTabs
              data={[
                {id: 1, title: 'Doctors'},
                {id: 2, title: 'Diagnostic'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
              activeButtonColor="black"
              nonactivecolor="white"
              borderRadius={20}
            />
          </View>
        </View>
      </View>
      {/* <View style={{alignSelf: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor="#E6E1E5"
            selectborderRadius={10}
            selectbackgroundColor="#f0f0f0"
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={'#E6E1E5'}
            placeholder={'Date'}
            selectplaceholdercolor={'#787579'}
          />
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor="#E6E1E5"
            selectborderRadius={10}
            selectbackgroundColor="#f0f0f0"
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={'#E6E1E5'}
            placeholder={'Filter'}
            selectplaceholdercolor={'#787579'}
          />
        </View>
      </View> */}
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {checkboxes.map((item, i) => (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <CheckBox
                boxType="square"
                lineWidth={2}
                tintColors={{true: '#E72B4A', false: '#E72B4A'}}
                value={item.isSelected}
                onValueChange={() => toggleCheckbox(item.id)}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  fontSize: hp(2),
                }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View>{renderComponent()}</View>
    </View>
  );
};

export default SalesActivities;
