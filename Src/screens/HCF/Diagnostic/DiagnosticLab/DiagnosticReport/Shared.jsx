import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';

const Shared = () => {

  const [shared, setShared] = useState([]);
  const [load, setLoad] = useState(false);
  const {userId} = useCommon();
const header = [
  'Name/Booking ID',
 
  'Date & Time',
  'Test Name',
  'File Name',
  'Details',
  // 'Action'
];
const handleRecieved = async () => {
  setLoad(true);
  try {
    const response = await axiosInstance.get(`hcf/reportShared/${userId}`);
    console.log("reportShared data===", response.data?.response);
    const body = response?.data?.response;
    // Normalize: API may return string like "Tests Not Found"; use []
    const normalized = Array.isArray(body) ? body : [];
    setShared(normalized);
  } catch (e) {
    console.log(e);
    setShared([]);
  } finally {
    setLoad(false);
  }
};
useEffect(() => {
  handleRecieved();
}, []);
  const ddata = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      datetime: '16-oct',
      Schedule: '19:00-20:00',
      testname: 'Rad-1',
      price: 200.0,
      action:'Accept'
    },

  ];
  return (
    <View>
      <CustomTable
        header={header}
        isUserDetails={true}
        flexvalue={2}
        rowDataCenter={true}
        textCenter={'center'}
        data={shared}
        loading={load}
        // roundedBtn={'action'}
      />
    </View>
  );
};

export default Shared;
