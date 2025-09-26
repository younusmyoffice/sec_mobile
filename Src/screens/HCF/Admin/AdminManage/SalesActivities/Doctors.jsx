import {View, Text, Image} from 'react-native';
import React from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';

const Doctors = ({header, data,isloading}) => {
  // const header = [
  //   'Doctor Name/ID',
  //   'Status',
  //   'Date & Time',
  //   'Package',
  //   'Price',
  // ];
  // const data = [
  //   {
  //     id: 1,
  //     image: require('../../../../../assets/cimg.png'),
  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime:'16-oct',
  //     package:'Message',
  //     price:200.00
  //   },
  //   {
  //     id: 2,
  //     image: require('../../../../../assets/cimg.png'),
  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime:'16-oct',
  //     package:'Message',
  //     price:200.00

  //   },
  //   {
  //     id: 3,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime:'16-oct',
  //     package:'Message',

  //     price:200.00

  //   },
  //   {
  //     id: 4,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Cancelled',
  //     datetime:'16-oct',
  //     package:'Message',
  //     price:200.00

  //   },
  //   {
  //     id: 5,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Cancelled',
  //     datetime:'16-oct',
  //     package:'Message',
  //     price:200.00

  //   },
  // ];
  return (
    <View>
      <CustomTable
      
        textCenter={'center'}
        header={header}
        data={data}
        isUserDetails={true}
        flexvalue={2}
        rowDataCenter={true}
        loading={isloading}
      />
    </View>
  );
};

export default Doctors;
