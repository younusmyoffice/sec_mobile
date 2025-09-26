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

import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axios from 'axios';
import { baseUrl } from '../../../../../utils/baseUrl';
import { useCommon } from '../../../../../Store/CommonContext';

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
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}sec/hcf/${userId}/diagnosticManageSaleActivity`);
        
        if (response.data && response.data.response) {
          setData(response.data.response);
          setFilteredData(response.data.response);
        } else {
          console.warn("Received empty sales activity data");
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching sales activity data:", error);
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ gap: 10 }}>
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
      <View style={{ alignSelf: 'center' }}>
        
      </View>

      {/* Table */}
      <CustomTable
        header={header}
        isUserDetails={false}
        data={filteredData.map((item) => ({
          id: item.suid,
          name: `${item.first_name} ${item.middle_name ? item.middle_name + ' ' : ''}${item.last_name}`,
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize first letter
          datetime: new Date(item.updated_at).toLocaleString(), // Format date
          package: item.test_name,
          price: `$${item.test_price}`,
        }))}
        flexvalue={1}
        rowDataCenter={true}
        textCenter="center"
      />
    </View>
  );
};

export default DiagnosticSalesActivities;
