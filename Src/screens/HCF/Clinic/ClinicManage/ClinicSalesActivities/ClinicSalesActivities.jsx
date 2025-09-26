// import { View, Text } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import CheckBox from '@react-native-community/checkbox';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import CustomInput from '../../../../../components/customInputs/CustomInputs';
// import CustomTable from '../../../../../components/customTable/CustomTable';
// import { useCommon } from '../../../../../Store/CommonContext';
// import axiosInstance from '../../../../../utils/axiosInstance';
// import { baseUrl } from '../../../../../utils/baseUrl';

// const ClinicSalesActivities = () => {
//   const [checkboxes, setCheckboxes] = useState([
//     { id: 1, label: 'All', isSelected: true },
//     { id: 2, label: 'Completed', isSelected: false },
//     { id: 3, label: 'canceled', isSelected: false },
//   ]);
//   const [cardData, setCardData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null); // Error state
//   const { userId } = useCommon();

//   // Toggle checkboxes
//   const toggleCheckbox = (id) => {
//     setCheckboxes((prev) =>
//       prev.map((checkbox) =>
//         checkbox.id === id
//           ? { ...checkbox, isSelected: true }  // Set selected checkbox to true
//           : { ...checkbox, isSelected: false } // Deselect all other checkboxes
//       )
//     );
//   };


//   // Filter the data based on selected checkboxes
//   const filterData = (data) => {
//     const selectedStatuses = checkboxes
//       .filter((checkbox) => checkbox.isSelected)
//       .map((checkbox) => checkbox.label.toLowerCase());

//     if (selectedStatuses.includes('all')) {
//       return data; // If 'All' is selected, return all data
//     }

//     return data.filter((item) =>
//       selectedStatuses.includes(item.status.toLowerCase())
//     );
//   };

//   // Fetch data from API
//   const doctorUpcommingAppointment = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(
//         `${baseUrl}hcf/${userId}/clinicSaleActivity`
//       );

//       if (response.data && response.data.response) {
//         const filteredData = filterData(response.data.response); // Filter data based on checkboxes
//         setCardData(filteredData); // Set the filtered data
//       }
//     } catch (err) {
//       console.error('Error fetching appointment requests:', err);
//       setError('Failed to load data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effect to load data initially and when checkboxes change
//   useEffect(() => {
//     doctorUpcommingAppointment();
//   }, [checkboxes]); // Re-run when checkboxes change
// const header = [
//   'Name & Details',
//   'Date',
//       'Time',
//       'Amount',
//       'Package',
//       'Duration',
//   'Department',
//   'Status',
// ];
//   return (
//     <View style={{ gap: 10 }}>
//       {/* Checkbox Filter */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         {checkboxes.map((item) => (
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} key={item.id}>
//             <CheckBox
//               boxType="square"
//               lineWidth={2}
//               tintColors={{ true: '#E72B4A', false: '#E72B4A' }}
//               value={item.isSelected}
//               onValueChange={() => toggleCheckbox(item.id)}
//             />
//             <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: hp(2) }}>
//               {item.label}
//             </Text>
//           </View>
//         ))}
//       </View>

//       {/* Input Filters */}
//       {/* <View style={{ alignSelf: 'center' }}>
//         <View style={{ flexDirection: 'row', gap: 10 }}>
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
//       </View> */}

//       {/* Render Custom Table */}
//       <View>
//         <CustomTable
//         header={header}
//         backgroundkey={'status'}
//         isUserDetails={true}
//         data={cardData}
//         flexvalue={2}
//         rowDataCenter={true}
//         textCenter={'center'}
//       />
//       </View>
//     </View>
//   );
// };

// export default ClinicSalesActivities;

import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTable from '../../../../../components/customTable/CustomTable'
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';

export default function ClinicSalesActivities() {
  const { userId } = useCommon();
  const [cardData, setCardData] = useState([]);
  const [load, setLoad] = useState(false);
  const header = [
    'Name & Details',
    'Status',
    'Amount',
    'Plan name',
  ];
  const handleRecieved = async () => {
    setLoad(true)
    try {
      const response = await axiosInstance.get(`hcf/${userId}/clinicSaleActivity`);
      console.log("reportShared data==dfd=", response.data.response);
      setCardData(response.data.response);
    } catch (e) {
      console.log(e);
    } finally {
      setLoad(false)
  
    }
  };
  useEffect(() => {
    handleRecieved();
  }, []);
  return (
    <View style={{flex:1,backgroundColor:'red',height:'100%',width:'100%'}}>
      
      
      <CustomTable
        header={header}
        backgroundkey={'status'}
        isUserDetails={true}
        data={cardData}
        flexvalue={2}
        rowDataCenter={true}
        textCenter={'center'}
        loading={load}
      />
      {/* <CustomTable
        textCenter={'center'}
        header={header}
        data={data}
        flexvalue={2}
        isUserDetails={true}
        rowTextCenter={true}
        rowDataCenter={true}
        backgroundkey={'action_id'}
        onpress={handleViewAudit}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({})