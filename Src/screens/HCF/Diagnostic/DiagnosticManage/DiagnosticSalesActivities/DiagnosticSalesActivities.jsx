// import {View, Text} from 'react-native';
// import React, {useState} from 'react';
// import CheckBox from '@react-native-community/checkbox';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import CustomInput from '../../../../../components/customInputs/CustomInputs';
// import CustomTable from '../../../../../components/customTable/CustomTable';
// const DiagnosticSalesActivities = () => {
//   const [checkboxes, setCheckboxes] = useState([
//     {id: 1, label: 'All', isSelected: true},
//     {id: 2, label: 'Completed', isSelected: false},
//     {id: 3, label: 'Cancelled', isSelected: false},
//   ]);

//   const header = [
//     'Doctor Name/ID',
//     'Status',
//     'Date & Time',
//     'Package',
//     'Price',
//   ];//toggleCheckbox
//   const toggleCheckbox = id => {
//     setCheckboxes(prev =>
//       prev.map(checkbox =>
//         checkbox.id === id
//           ? {...checkbox, isSelected: !checkbox.isSelected}
//           : {...checkbox, isSelected: false},
//       ),
//     );
//   };
//   const data = [
//     {
//       id: 1,
//       name: 'Inam Diagnostic',
//       status: 'Completed',
//       datetime: '16-oct',
//       package: 'Message',
//       price: 200.0,
//     },
//     {
//       id: 2,
//       image: require('../../../../../assets/cimg.png'),
//       name: 'Inam Diagnostic',
//       status: 'Completed',
//       datetime: '16-oct',
//       package: 'Message',
//       price: 200.0,
//     },
//     {
//       id: 3,
//       image: require('../../../../../assets/cimg.png'),

//       name: 'Inam Diagnostic',
//       status: 'Completed',
//       datetime: '16-oct',
//       package: 'Message',

//       price: 200.0,
//     },
//     {
//       id: 4,
//       image: require('../../../../../assets/cimg.png'),

//       name: 'Inam Diagnostic',
//       status: 'Cancelled',
//       datetime: '16-oct',
//       package: 'Message',
//       price: 200.0,
//     },
//     {
//       id: 5,
//       image: require('../../../../../assets/cimg.png'),

//       name: 'Inam Diagnostic',
//       status: 'Cancelled',
//       datetime: '16-oct',
//       package: 'Message',
//       price: 200.0,
//     },
//   ];
//   return (
//     <View style={{gap: 10}}>
//       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//         {checkboxes.map((item, i) => (
//           <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
//             <CheckBox
//               boxType="square"
//               lineWidth={2}
//               tintColors={{true: '#E72B4A', false: '#E72B4A'}}
//               value={item.isSelected}
//               onValueChange={() => toggleCheckbox(item.id)}
//             />
//             <Text
//               style={{
//                 color: 'black',
//                 fontFamily: 'Poppins-Regular',
//                 fontSize: hp(2),
//               }}>
//               {item.label}
//             </Text>
//           </View>
//         ))}
//       </View>

//       <View style={{alignSelf: 'center'}}>
//         <View style={{flexDirection: 'row',gap:10}}>
//           <CustomInput
//             type={'select'}
//             selectborderBottomWidth={0.5}
//             selectborderBottomColor="#E6E1E5"
//             selectborderRadius={10}
//             selectbackgroundColor="#f0f0f0"
//             selectwidth={wp(30)}
//             selectborderWidth={0.5}
//             selectborderColor={'#E6E1E5'}
//             placeholder={'Date'}
//             selectplaceholdercolor={'#787579'}
//           />
//           <CustomInput
//             type={'select'}
//             selectborderBottomWidth={0.5}
//             selectborderBottomColor="#E6E1E5"
//             selectborderRadius={10}
//             selectbackgroundColor="#f0f0f0"
//             selectwidth={wp(30)}
//             selectborderWidth={0.5}
//             selectborderColor={'#E6E1E5'}
//             placeholder={'Filter'}
//             selectplaceholdercolor={'#787579'}
//           />
//         </View>
//       </View>

//       <CustomTable header={header} isUserDetails={true} data={data} flexvalue={2} rowDataCenter={true} textCenter={'center'}/>
//     </View>
//   );
// };

// export default DiagnosticSalesActivities;

/**
 * ============================================================================
 * DIAGNOSTIC SALES ACTIVITIES
 * ============================================================================
 *
 * PURPOSE:
 * Display diagnostic sales activities in a table with robust error handling.
 *
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls.
 * - Validates userId before API calls.
 *
 * ERROR HANDLING:
 * - User feedback via CustomToaster.
 * - Graceful empty-state handling.
 */
import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import CustomLoader from '../../../../../components/customComponents/customLoader/CustomLoader';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const DiagnosticSalesActivities = () => {
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: 'All', isSelected: true },
    { id: 2, label: 'Completed', isSelected: false },
    { id: 3, label: 'Cancelled', isSelected: false },
  ]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useCommon();

  const header = ['Doctor Name/ID', 'Status', 'Date & Time', 'Package', 'Price'];

  // Function to toggle checkboxes and apply filter
  const toggleCheckbox = (id) => {
    setCheckboxes((prev) =>
      prev.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, isSelected: !checkbox.isSelected }
          : { ...checkbox, isSelected: false }
      )
    );
  };

  useEffect(() => {
    const fetchSalesActivities = async () => {
      // SECURITY: Validate userId before API call
      if (!userId || userId === 'null' || userId === 'undefined') {
        Logger.error('Invalid userId for sales activities', { userId });
        CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
        setData([]);
        setFilteredData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        Logger.api('GET', `hcf/${userId}/diagnosticManageSaleActivity`);
        const response = await axiosInstance.get(`hcf/${userId}/diagnosticManageSaleActivity`);

        const body = response?.data?.response;
        if (Array.isArray(body)) {
          setData(body);
          setFilteredData(body);
          Logger.info('Sales activities fetched', { count: body.length });
        } else if (Array.isArray(response?.data)) {
          setData(response.data);
          setFilteredData(response.data);
          Logger.info('Sales activities fetched (array root)', { count: response.data.length });
        } else {
          Logger.warn('Sales activities: empty or unexpected response');
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        Logger.error('Sales activities fetch failed', error);
        const errorMessage = error?.response?.data?.message || 'Failed to fetch sales activities.';
        CustomToaster.show('error', 'Error', errorMessage);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSalesActivities();
    }
  }, [userId]);

  // Effect to filter data based on selected checkbox
  useEffect(() => {
    const selectedFilter = checkboxes.find((item) => item.isSelected);

    if (selectedFilter?.label === "All") {
      setFilteredData(data);
    } else if (selectedFilter?.label === "Completed") {
      setFilteredData(data.filter((item) => item.status.toLowerCase() === "completed"));
    } else if (selectedFilter?.label === "Cancelled") {
      setFilteredData(data.filter((item) => item.status.toLowerCase() === "cancelled"));
    }
  }, [checkboxes, data]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <CustomLoader />
        <Text style={styles.loaderText}>Loading sales activities...</Text>
      </View>
    );
  }

  if (!loading && filteredData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No sales activities data available</Text>
        <Text style={styles.emptySubtext}>
          Data: {data.length} items, Filtered: {filteredData.length} items
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Checkbox Filters */}
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {checkboxes.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <CheckBox
              boxType="square"
              lineWidth={2}
              tintColors={{ true: '#E72B4A', false: '#E72B4A' }}
              value={item.isSelected}
              onValueChange={() => toggleCheckbox(item.id)}
            />
            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: hp(2) }}>
              {item.label}
            </Text>
          </View>
        ))}
      </View> */}

      {/* Filters */}
      <View style={styles.filtersContainer}>
        
      </View>

      {/* Table */}
      <CustomTable
        header={header}
        isUserDetails={false}
        data={(() => {
          const mappedData = filteredData.map((item) => ({
            id: item.suid || item.id,
            name: `${item.first_name || ''} ${item.middle_name ? item.middle_name + ' ' : ''}${item.last_name || ''}`.trim(),
            status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown',
            datetime: item.updated_at ? new Date(item.updated_at).toLocaleString() : 'N/A',
            package: item.test_name || item.package || 'N/A',
            price: item.test_price ? `$${item.test_price}` : 'N/A',
          }));
          Logger.debug('Mapped sales activities', { count: mappedData.length });
          return mappedData;
        })()}
        flexvalue={1}
        rowDataCenter={true}
        textCenter="center"
      />
    </View>
  );
};

export default DiagnosticSalesActivities;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  filtersContainer: {
    alignSelf: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.TEXT_GRAY,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.TEXT_GRAY,
    marginTop: 10,
  },
});
