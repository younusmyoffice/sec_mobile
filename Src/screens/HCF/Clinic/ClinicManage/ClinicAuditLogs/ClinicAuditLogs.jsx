import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';
import { baseUrl } from '../../../../../utils/baseUrl';

const ClinicAuditLogs = () => {
  const header = ['Name ', 'Action', 'TimeStamp', 'Status'];

 

  const [cardData, setCardData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const{userId}=useCommon();
  const clinicAuditlogs = async () => {
    // Reset error state before the request
     try {
       console.log('Fetching appointment requests...');
       const response = await axiosInstance.get(
         `${baseUrl}hcf/clinicAuditlogs/${userId}`
       );
 
       console.log('Appointment Upre', response.data.response);
 
       if (response.data && response.data.response) {
        setCardData(response.data.response); // Set the fetched appointment requests data
       } else {
       }
     } catch (err) {
       console.error('Error fetching upcomming appointment requests:', err);
     } finally {
 
     }
   };

   useEffect(() => {
 
    clinicAuditlogs();
  }, []);
  return (
    <View>
      <CustomTable
        data={cardData}
        header={header}
        isUserDetails={false}
        flexvalue={1}
        rowDataCenter={true}
        textCenter={'center'}
        backgroundkey={'action'}
        statusNumber={true}
      />
    </View>
  );
};

export default ClinicAuditLogs;
