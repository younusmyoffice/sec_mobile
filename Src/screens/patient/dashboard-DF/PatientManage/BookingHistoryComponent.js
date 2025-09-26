import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import DateRangePicker from '../../../../components/callendarPicker/RangeDatePicker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTable from '../../../../components/customTable/CustomTable';
export default function BookingHistoryComponent({
  data,
  handleScrollEnd,
  isLoading,
  length,
}) {
  // console.log(data)
  const cardData = [
    {
      name: 'John',
      status: 'Complete',
      datetime: '01-02-2023 19:00',
      package: '30min | message pack',
      amount: '$12',
    },
  ];

  const header = [
    'Name & Details',
    'Date',
    'Time',
    'Amount',
    'Package',
    'Duration',
    'Department',
    'Status',
  ];

  return (
    <View style={{backgroundColor: '#fff'}}>
      {/* <DateRangePicker Type={'normal'} /> */}
      <View>
        <CustomTable
          header={header}
          isUserDetails={true}
          data={data}
          flexvalue={2}
          rowDataCenter={true}
          textCenter={'center'}
          roundedBtn={'status'}
          amount={'amount'}
          loadmore={handleScrollEnd}
          loading={isLoading}
          length={length}
        />
      </View>
    </View>
  );
}
