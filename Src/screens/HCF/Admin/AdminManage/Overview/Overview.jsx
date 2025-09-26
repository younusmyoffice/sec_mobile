import {View, Text, ScrollView} from 'react-native';
import React, { useState } from 'react';
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import Doctors from '../SalesActivities/Doctors';
import Diagnostic from '../SalesActivities/Diagnostic';
const Overview = () => {
  const [activeTab, setactiveTab] = useState('Doctors');
  const doctorheader = [
    'Doctor Name/ID',
    'Status',
    'Date & Time',
    'Package',
    'Price',
  ];
  const diagheader = [
    'Name/Booking ID',
    'Status',
    'Date & Time',
    'Department',
    'Test Name',
    'Price',
  ];
  const ddata = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      status: 'Completed',
      datetime: '16-oct',
      package: 'Message',
      price: 200.0,
    },
    {
      id: 2,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      status: 'Completed',
      datetime: '16-oct',
      package: 'Message',
      price: 200.0,
    },
    {
      id: 3,
      image: require('../../../../../assets/cimg.png'),

      name: 'Inam Diagnostic',
      status: 'Completed',
      datetime: '16-oct',
      package: 'Message',

      price: 200.0,
    },
    {
      id: 4,
      image: require('../../../../../assets/cimg.png'),

      name: 'Inam Diagnostic',
      status: 'Cancelled',
      datetime: '16-oct',
      package: 'Message',
      price: 200.0,
    },
    {
      id: 5,
      image: require('../../../../../assets/cimg.png'),

      name: 'Inam Diagnostic',
      status: 'Cancelled',
      datetime: '16-oct',
      package: 'Message',
      price: 200.0,
    },
  ];

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
  const overview = [
    {
      id: 1,
      title: 'Consultation Revenue',
      price: 200,
      item: 10,
    },
    {
      id: 2,
      title: 'Diagnostic Revenue',
      price: 120,
      item: 10,
    },
    {
      id: 3,
      title: 'Total Earning',
      price: 120,
      item: 10,
    },
  ];
  const renderComponent = () => {
    switch (activeTab) {
      case 'Doctors':
        return <Doctors header={doctorheader} data={ddata} />;
      case 'Diagnostic':
        return <Diagnostic header={diagheader} data={diagdata} />;
    }
  };
  return (
    <View style={{gap:10}}>
      <View
        style={{
          borderWidth: 1.5,
          borderColor: '#E6E1E5',
          borderRadius: 16,
          padding: 15,
          margin: 10,
        }}>
        {overview.map((item, i) => (
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: '#E72B4A',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 40,
              }}>
              ${item.price}
            </Text>
            <Text
              style={{
                color: '#AEAAAE',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                top: -10,
              }}>
              {item.title}
            </Text>
            <View
              style={{
                backgroundColor: '#EFEFEF',
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 20,
                top: -10,
              }}>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                }}>
                {item.item} item
              </Text>
            </View>
          </View>
        ))}

    
      </View>
      <View>
        <Text style={{fontFamily:'Poppins-Medium',color:'#313033',textAlign:'center',fontSize:hp(2)}}>Monthly Earning</Text>
      </View>
      <View>
        <CustomSearch placeholderTextColor={'#AEAAAE'}/>
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
      <View style={{alignSelf: 'center'}}>
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
      </View>
      <View>{renderComponent()}</View>
    </View>
  );
};

export default Overview;
