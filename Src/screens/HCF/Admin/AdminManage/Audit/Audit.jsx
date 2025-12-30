import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTransactionTable from '../../../../../components/customTable/CustomTransactionTable';
import CustomTable from '../../../../../components/customTable/CustomTable';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useAuth} from '../../../../../Store/Authentication';
const Audit = () => {
  const navigation = useNavigation();
  const {userId} = useAuth();
  const [auditData, setAuditData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const header = ['Name & ID', 'Status', 'Action ID', 'Action', 'Timestamp'];
  
  // Fallback data for when API returns empty results
  const fallbackData = [
    {
      id: 1,
      first_name: 'Sample User',
      middle_name: '',
      last_name: '',
      name: 'Sample User',
      status: 'Active',
      action: 'Profile Edit',
      timestamp: '24 Jan 23',
      time: '24 Jan 23',
      department_name: 'Audit Log',
      appointment_id: 'AUDIT_001',
      test_id: 'AUDIT_001',
      audit_id: 'AUDIT_001',
      user_identifier: 1,
      profile_picture: null,
    },
    {
      id: 2,
      first_name: 'Sample User',
      middle_name: '',
      last_name: '',
      name: 'Sample User',
      status: 'Active',
      action: 'Login',
      timestamp: '24 Jan 23',
      time: '24 Jan 23',
      department_name: 'Audit Log',
      appointment_id: 'AUDIT_002',
      test_id: 'AUDIT_002',
      audit_id: 'AUDIT_002',
      user_identifier: 2,
      profile_picture: null,
    },
  ];

  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true);
      console.log('📋 Fetching audit logs for HCF ID:', userId);
      
      const response = await axiosInstance.get(
        `hcf/HcfAuditlogs/${userId}`,
      );
      
      console.log('✅ Audit logs response:', response.data);
      
      if (response.data?.response) {
        setAuditData(response.data.response);
        console.log('📋 Audit logs data set:', response.data.response.length, 'items');
      } else {
        console.log('⚠️ No audit logs data received');
        setAuditData([]);
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch audit logs:', error);
      setAuditData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAuditLogs();
    }
  }, [userId]);

  // Transform API data to match CustomTable expectations
  const transformAuditData = (data) => {
    return data.map(item => ({
      // Essential fields for CustomTable
      first_name: item.name,
      middle_name: '',
      last_name: '',
      name: item.name,
      status: item.status === 1 ? 'Active' : 'Inactive',
      action: item.action,
      timestamp: item.time,
      time: item.time,
      
      // Fields that CustomTable expects for isUserDetails
      department_name: 'Audit Log',
      appointment_id: item.action_id,
      test_id: item.action_id,
      
      // Keep IDs but with different names to avoid filtering
      audit_id: item.action_id,
      user_identifier: item.user_id,
      
      // Additional fields
      created_at: item.time,
      updated_at: item.time,
      action_type: item.action,
      action_description: item.action,
      
      // Ensure we have profile_picture for isUserDetails
      profile_picture: null, // Audit logs don't have profile pictures
    }));
  };

  // Use API data if available, otherwise fallback data
  const displayData = auditData.length > 0 ? transformAuditData(auditData) : fallbackData;

  const handleViewAudit = () => {
    navigation.navigate('view-audit');
  };
  
  const actionIdKeys = displayData.map(item => Object.keys(item).find(key => key === 'audit_id'));
  
  console.log('🔍 Audit Debug Info:');
  console.log('📋 Raw Audit Data:', auditData);
  console.log('🔄 Transformed Data:', displayData);
  console.log('📋 Action ID Keys:', actionIdKeys);
  console.log('👤 User ID:', userId);
  console.log('⏳ Loading:', isLoading);
  console.log('📊 Data Count:', auditData.length);
  console.log('🎯 Using API Data:', auditData.length > 0);
  console.log('🎯 Sample Transformed Item:', displayData[0]);
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
      <CustomTable
        textCenter={'center'}
        header={header}
        data={displayData}
        flexvalue={2}
        isUserDetails={true}
        rowTextCenter={true}
        rowDataCenter={true}
        backgroundkey={'audit_id'}
        onpress={handleViewAudit}
        loading={isLoading}
      />
    </View>
  );
};

export default Audit;
