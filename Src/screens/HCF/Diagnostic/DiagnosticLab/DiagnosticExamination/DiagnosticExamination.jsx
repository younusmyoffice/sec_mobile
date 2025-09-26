import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';
const DiagnosticExamination = () => {

  const [examined, setExamined] = useState([]);
  const [load, setLoad] = useState()
    const {userId} = useCommon();

  const header = [
    'Name/Booking ID',
    'Test Name',
    'Date & Time',
    'Status',
    'Amount'
  ];
  const handleRecieved = async () => {
    setLoad(true)
    try {
      const response = await axiosInstance.get(`hcf/testExamined/${userId}`);
      console.log("examined data===", response.data.response);
      setExamined(response.data.response);
    } catch (e) {
      console.log(e);
    } finally {
      setLoad(false)

    }
  };
  useEffect(() => {
    handleRecieved();
  }, []);

  const ddata = [
    {
      id: 1,
      profile_picture: require('../../../../../assets/cimg.png'),
      first_name: 'Waseem',
      middle_name: 'Ali',
      last_name: 'Khan',
      appointment_id: '12345',
      datetime: '16-oct',
      Schedule: '19:00-20:00',
      testname: 'Rad-1',
      amount: 'Done',
    },
  ];
  return (
    <View>
      <View style={{ alignSelf: 'center' }}>
        {/* <View style={{ flexDirection: 'row' }}>
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
        </View> */}
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Medium',
            fontSize: hp(2),
            paddingHorizontal: 10,
          }}>
          Examination List
        </Text>
        <View>
          <CustomTable
            header={header}
            data={examined}
            isUserDetails={true}
            rowDataCenter={true}
            flexvalue={1}
            textCenter={'center'}
            roundedBtn={'action'}

          />
        </View>
      </View>
    </View>
  );
};

export default DiagnosticExamination;
