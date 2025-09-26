import { View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { baseUrl } from '../../../../../utils/baseUrl';
import { useCommon } from '../../../../../Store/CommonContext';
import axios from 'axios';

const DiagnosticAuditLogs = () => {
  const header = ['Name & ID', 'Action', 'TimeStamp', 'Status'];
  const [ddata, setDdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useCommon();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        console.log("Fetching audit logs...");

        const response = await axios.get(`${baseUrl}hcf/DiagAuditlogs/${userId}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.response) {
          console.log("Audit logs fetched successfully:", response.data.response);
          setDdata(response.data.response); // Extracting data inside 'response'
        } else {
          console.warn("Received empty audit logs response");
          setDdata([]);
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        setDdata([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAuditLogs();
    }
  }, [userId]); // Fetch data when userId changes

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <CustomTable
        data={ddata.map((item) => ({
          id: item.user_id,
          name: item.name,
          action: item.action,
          timestamp: item.time,  // Keeping API response field name
          status: item.status === 1 ? 'Completed' : 'Pending', // Formatting status
        }))}
        header={header}
        isUserDetails={false}
        flexvalue={1}
        rowDataCenter={true}
        textCenter="center"
        backgroundkey="accesslevel"
      />
    </View>
  );
};

export default DiagnosticAuditLogs;

