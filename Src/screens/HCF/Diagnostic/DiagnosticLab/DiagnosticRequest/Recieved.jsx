import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';

const Recieved = () => {
  const [recieved, setRecieved] = useState([]);
  const[load,setLoad]=useState()
    const {userId} = useCommon();

  const handleRecieved = async () => {
    setLoad(true)
    try {
      const response = await axiosInstance.get(`hcf/testRequests/${userId}`);
      console.log("consloe data recieved",response.data.response);
      setRecieved(response.data.response);
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
    'Action',
  ];

  const ddata = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      first_name: 'Inam ',
      middle_name: 'inam',
      last_name: 'inam',
      datetime: '16-10-2001',
      status: 'Accept',
      price: 200.0,
      testname: 'Rad-1',
    },
  ];

  useEffect(() => {
    handleRecieved();
  }, []);

  const handleAccept = async (id )=> {
    try {
      const response = await axiosInstance.post('hcf/testRequestsAccept', {
        test_id: id.toString(),
        staff_id: '17',
      });
console.log("accept response",response.data.response.body)
      console.log(`Accept clicked for ID: ${id}`);
      CustomToaster.show('success', 'Accepted', response.data.response.body, {
        duration: 2000,
      });
      handleRecieved();
      // alert(`Test Request with ID ${id} has been accepted.`);
    } catch (e) {
      console.log(e);
    }
  };
  const handleReject = async (id) => {
    console.log("under the water",id)
    try {
      const response = await axiosInstance.post('hcf/testRequestReject', {
        test_id: id.toString(),
        staff_id: '17',
      });
console.log("reject response",response.data)
      console.log(`reject clicked for ID: ${id}`);
      console.log(`Accept clicked for ID: ${id}`);
      CustomToaster.show('success', 'Rejected', response.data.response.body, {
        duration: 2000,
      });
      handleRecieved();

    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View>
      <CustomTable
        header={header}
        id={'test_id'}
        isUserDetails={true}
        flexvalue={2}
        rowDataCenter={true}
        textCenter={'center'}
        data={recieved}
        roundedBtn={'action'}
        enableMenu={true}
        acceptPress={handleAccept}
        rejectPress={handleReject}
        loading={load}
      />
    </View>
  );
};

export default Recieved;
