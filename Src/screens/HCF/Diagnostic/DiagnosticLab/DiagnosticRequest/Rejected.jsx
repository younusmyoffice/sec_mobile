import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';

const Rejected = () => {
  const [rejected, setRejected] = useState([]);
  const[load,setLoad]=useState()
    const {userId} = useCommon();

  const handleRejected = async () => {
    setLoad(true)

    try {
      const response = await axiosInstance.get(`hcf/testRejected/${userId}`);
      console.log("rejected data",response.data);
      setRejected(response.data.response);
      console.log("first fdsafdsa",response.data.response);
    } catch (e) {
      console.log(e);
    }finally{
      setLoad(false)

    }
  };
  const header = [
    'Name/Booking ID',
    'Date ',
    'Time ',
    'Status',
    'Test Name',
    'Price',
    // 'Action',
  ];

  const ddata = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      name: 'Waseem Diagnostic',
      datetime: '16-oct',
      Schedule: '19:00-20:00',
      testname: 'Rad-1',
      price: 200.0,
      action:'Accept'
    },

  ];

  useEffect(() => {
    handleRejected();
  }, []);
  return (
    <View>
      <CustomTable
       header={header}
       id={'test_id'}
       isUserDetails={true}
       flexvalue={2}
       rowDataCenter={true}
       textCenter={'center'}
       data={rejected}
       enableMenu={false}
       loading={load}

      />
    </View>
  );
};

export default Rejected;
