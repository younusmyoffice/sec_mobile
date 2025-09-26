import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../utils/axiosInstance';
import { useCommon } from '../../../../Store/CommonContext';

export default function AuditLogs() {
  const header = ['Name ', 'Action','Action Id', 'TimeStamp', 'Status'];

 

  const [cardData, setCardData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const{userId}=useCommon();
  const clinicAuditlogs = async () => {
    // Reset error state before the request
     try {
       console.log('Fetching appointment requests...');
       const d_id=userId;
       const response = await axiosInstance.get(
         `doctor/DoctorAuditlogs?doctor_id=${d_id}`
       );
 
       console.log('Appointment Upre1', response.data.response);
 
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

const styles = StyleSheet.create({});
