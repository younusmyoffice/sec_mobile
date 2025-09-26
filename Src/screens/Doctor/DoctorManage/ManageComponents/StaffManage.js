import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomTable from '../../../../components/customTable/CustomTable';

export default function StaffManage() {
  const header = ['Name & ID', 'Access Level', 'Action'];

  const data = [
    {
      id: 1,
      image: require('../../../../assets/cimg.png'),
      name: 'Ayesha',
      
      acc_no: '220020020202',
      
      status: 'in-progress',
      bookingid: '1453123412|543252',
    },
  ];
  return (
    <View>
      
      <CustomTable
        textCenter={'center'}
        header={header}
        data={data}
        flexvalue={2}
        isUserDetails={true}
        rowTextCenter={true}
        rowDataCenter={true}
        backgroundkey={'acc_no'}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
