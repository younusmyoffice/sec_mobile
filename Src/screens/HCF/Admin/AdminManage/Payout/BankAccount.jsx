import {View, Text} from 'react-native';
import React from 'react';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
const BankAccount = () => {
  const bankAccount = [
    {
      id: 1,
      name: 'accname',
      type: 'text',
      placeholder: 'Name of Account',
    },
    {
      id: 2,
      name: 'accno',
      type: 'number',
      placeholder: 'Account No',
    },
    {
      id: 3,
      name: 'accno',
      type: 'number',
      placeholder: 'Confirm Account No',
    },
    {
      id: 4,
      name: 'ifsc',
      type: 'text',
      placeholder: 'IFSC Code',
    },
    {
      id: 5,
      name: 'swift',
      type: 'text',
      placeholder: 'SWIFT Code',
    },
    {
      id: 6,
      name: 'amount',
      type: 'number',
      placeholder: 'Amount',
    },
  ];
  return (
    <View style={{gap: 10}}>
      <View>
        {bankAccount.map((field, i) => (
          <CustomInput
            key={field.id}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
          />
        ))}
      </View>
      <View style={{alignSelf: 'center'}}>
        <CustomButton
          title="Done "
          bgColor={'#E72B4A'}
          fontfamily={'Poppins-Medium'}
          borderRadius={20}
          textColor={'white'}
          width={wp(50)}
        />
      </View>
    </View>
  );
};

export default BankAccount;
