import {View, Text} from 'react-native';
import React from 'react';
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTransactionTable from '../../../../../components/customTable/CustomTransactionTable';
import CustomTable from '../../../../../components/customTable/CustomTable';
import {useNavigation} from '@react-navigation/native';
const Audit = () => {
  const navigation = useNavigation();
  const header = ['Name & ID', 'Status', 'Action ID', 'Action', 'Timestamp'];
  const data = [
    {
      id: 1,
      image: require('../../../../../assets/cimg.png'),
      name: 'Jolie',
      status: 'Active',
      action_id: '10101 1010',
      action: 'Profile Edit',
      price: '24 Jan 23',
    },
    {
      id: 2,
      image: require('../../../../../assets/cimg.png'),
      name: 'Jolie',
      status: 'Active',
      action_id: '10101 1010',
      action: 'Profile Edit',
      price: '24 Jan 23',
    },
  ];

  const handleViewAudit = () => {
    navigation.navigate('view-audit');
  };
  const actionIdKeys = data.map(item => Object.keys(item).find(key => key === 'action_id'));
console.log("action id",actionIdKeys)
  return (
    <View style={{gap: 10}}>
      <View style={{flexDirection: 'row'}}>
        <CustomSearch placeholderTextColor={'#AEAAAE'} showmenuIcon={true} />
      </View>
      <View style={{alignSelf: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor="#E6E1E5"
            selectborderRadius={10}
            selectbackgroundColor="#f0f0f0"
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={'#E6E1E5'}
            placeholder={'Date'}
            selectplaceholdercolor={'#787579'}
          />
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor="#E6E1E5"
            selectborderRadius={10}
            selectbackgroundColor="#f0f0f0"
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={'#E6E1E5'}
            placeholder={'Filter'}
            selectplaceholdercolor={'#787579'}
          />
        </View>
      </View>
      <CustomTable
        textCenter={'center'}
        header={header}
        data={data}
        flexvalue={2}
        isUserDetails={true}
        rowTextCenter={true}
        rowDataCenter={true}
        backgroundkey={'action_id'}
        onpress={handleViewAudit}
      />
    </View>
  );
};

export default Audit;
