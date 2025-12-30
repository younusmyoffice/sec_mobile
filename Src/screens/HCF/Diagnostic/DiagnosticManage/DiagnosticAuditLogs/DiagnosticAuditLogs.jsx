/**
 * ============================================================================
 * DIAGNOSTIC AUDIT LOGS
 * ============================================================================
 *
 * PURPOSE:
 * Display audit logs for diagnostic actions.
 *
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls.
 * - Validates userId before API calls.
 *
 * ERROR HANDLING:
 * - User feedback via CustomToaster.
 */
import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';
import CustomLoader from '../../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';

const DiagnosticAuditLogs = () => {
  const header = ['Name & ID', 'Action', 'TimeStamp', 'Status'];
  const [ddata, setDdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useCommon();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      // SECURITY: Validate userId before API call
      if (!userId || userId === 'null' || userId === 'undefined') {
        Logger.error('Invalid userId for audit logs', { userId });
        CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
        setDdata([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        Logger.api('GET', `hcf/HcfAuditlogs/${userId}`);
        const response = await axiosInstance.get(`hcf/HcfAuditlogs/${userId}`);

        const body = response?.data?.response;
        if (Array.isArray(body)) {
          setDdata(body);
          Logger.info('Audit logs fetched', { count: body.length });
        } else {
          Logger.warn('Empty or unexpected audit logs response');
          setDdata([]);
        }
      } catch (error) {
        Logger.error('Audit logs fetch failed', error);
        const errorMessage = error?.response?.data?.message || 'Failed to fetch audit logs.';
        CustomToaster.show('error', 'Error', errorMessage);
        setDdata([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAuditLogs();
    }
  }, [userId]);

  if (loading) {
    return <CustomLoader />;
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

