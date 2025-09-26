import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';

const ShareList = () => {
    const navigation=useNavigation();
    const [sharedlist, setSharedlist] = useState([]);
      const [load, setLoad] = useState()
        const {userId} = useCommon();

    const header = [
      'Name/Booking ID',
      'Test Name',
      'Date & Time',
      'Status',
      'Amount',
      'Action'
    ];
    const handleRecieved = async () => {
      setLoad(true)
      try {
        const response = await axiosInstance.get(`hcf/reportShareList/${userId}`);
        console.log("examined data===", response.data.response);
        setSharedlist(response.data.response);
      } catch (e) {
        console.log(e);
      } finally {
        setLoad(false)
  
      }
    };
    useEffect(() => {
      handleRecieved();
    }, []);
  
const handleSendReport=(a,b)=>{
  console.log(a,b)
navigation.navigate('send-report')
}
  const ddata = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      name: 'Inam Diagnostic',
      examination_date: '19:00-20:00',
      testname: 'Rad-1',
      details:'Share',
      // func:handleSendReport
    },

  ];
  return (
    <View>
      <CustomTable
        header={header}
        isUserDetails={true}
        flexvalue={1}
        rowDataCenter={true}
        textCenter={'center'}
        data={sharedlist}
        roundedBtn={'Action'}
        functionKey={"Action"}
        onpress={()=>handleSendReport(a,b)}
      />
    </View>
  );
};

export default ShareList;
