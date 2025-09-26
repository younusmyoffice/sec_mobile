import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import DateRangePicker from '../../../../components/callendarPicker/RangeDatePicker';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTransactionTable from '../../../../components/customTable/CustomTransactionTable';
const TransactionDetailsComponent = ({data}) => {
  // console.log(data);
  const header = ['Transaction & ID', 'Date & Time', 'Amount'];
  // const data = [
  //   {
  //     id: 1,
  //     image: require('../../../../assets/Recieve.png'),
  //     name: 'Appointment Payment',
  //     datetime: '16-oct',
  //     trans_id:'10101 1010',
  //     price: 200.98,
  //   },
  //   {
  //     id: 2,
  //     image: require('../../../../assets/Recieve.png'),
  //     name: 'Refund for Appointment',
  //     datetime: '16-oct',
  //     trans_id:'10101 1010',
  //     price: 200.98,
  //   },
  //   {
  //     id: 3,
  //     image: require('../../../../assets/Send.png'),
  //     name: 'Radiology Test ( Cat-1)',
  //     datetime: '16-oct',
  //     trans_id:'10101 1010',
  //     price: 200.98,
  //   },
  // ];

  return (
    <SafeAreaView>
      {/* <DateRangePicker Type={'normal'} />s */}
      {/* <CustomTable /> */}
      <CustomTransactionTable
        header={header}
        textCenter={'center'}
        data={data}
      />
    </SafeAreaView>
  );
};
export default TransactionDetailsComponent;
