import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTransactionTable from '../../../../../components/customTable/CustomTransactionTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useAuth} from '../../../../../Store/Authentication';

const Bookings = () => {
  const {userId} = useAuth();
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactionData = async () => {
    try {
      setIsLoading(true);
      console.log('📊 Fetching HCF transaction data for HCF ID:', userId);
      
      const response = await axiosInstance.get(
        `hcf/getHcfAdminTransaction/${userId}`
      );
      
      console.log('✅ Transaction data response:', response.data);
      
      if (response.data?.response) {
        setTransactionData(response.data.response);
      } else {
        console.log('⚠️ No transaction data received');
        setTransactionData([]);
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch transaction data:', error);
      setTransactionData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactionData();
    }
  }, [userId]);

  const header = ['Transaction & ID', 'Date & Time', 'Amount'];
  
  // Fallback hardcoded data if no API data
  const fallbackData = [
    {
      id: 1,
      image: require('../../../../../assets/Recieve.png'),
      name: 'Appointment Payment',
      datetime: '16-oct',
      trans_id:'10101 1010',
      price: 200.98,
    },
    {
      id: 2,
      image: require('../../../../../assets/Recieve.png'),
      name: 'Refund for Appointment',
      datetime: '16-oct',
      trans_id:'10101 1010',
      price: 200.98,
    },
    {
      id: 3,
      image: require('../../../../../assets/Send.png'),
      name: 'Radiology Test ( Cat-1)',
      datetime: '16-oct',
      trans_id:'10101 1010',
      price: 200.98,
    },
  ];

  const displayData = transactionData.length > 0 ? transactionData : fallbackData;
  return (
    <View style={{gap: 10}}>
      <View style={{flexDirection: 'row'}}>
        <CustomSearch placeholderTextColor={'#AEAAAE'} showmenuIcon={true} />
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

     <CustomTransactionTable header={header} textCenter={'center'} data={displayData}/>
    </View>
  );
};

export default Bookings;
