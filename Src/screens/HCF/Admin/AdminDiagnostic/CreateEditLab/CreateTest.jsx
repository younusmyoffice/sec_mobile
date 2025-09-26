import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import Header from '../../../../../components/customComponents/Header/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from '../../../../../Store/Authentication';
import axiosInstance from '../../../../../utils/axiosInstance';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
const CreateTest = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {exam_id, status, item} = route.params;
  const {userId} = useAuth();
  const [createtest, setCreateTest] = useState({
    lab_exam_id: exam_id.toString(),
    hcf_id: userId.toString(),
    sub_exam_name: item?.sub_exam_name || '',
    test_subexam_price: item?.test_subexam_price.toString() || '',
    test_description: item?.test_description || '',
  });
  console.log('price', item?.test_subexam_price);
  console.log(createtest.test_subexam_price);
  console.log('subexamid', item?.sub_exam_id);

  console.log('item', item);
  const createTest = [
    {
      id: 1,
      name: 'sub_exam_name',
      placeholder: 'Test Name',
      type: 'text',
    },

    {
      id: 2,
      name: 'test_subexam_price',
      placeholder: 'Price',
      type: 'number',
    },
  ];

  const handleChange = (name, value) => {
    setCreateTest(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateTest = async () => {
    const edit = {sub_exam_id: item?.sub_exam_id.toString(), ...createtest};
    console.log(edit);
    try {
      const response = await axiosInstance.post(
        'hcf/addTests',
        status === 'edit' ? edit : createtest,
      );
      console.log(response.data);
      if (status === 'edit') {
        CustomToaster.show('success', 'Test Updated Successfully');
      } else {
        CustomToaster.show('success', 'Test Created Successfully');
      }
      navigation.goBack();
    } catch (error) {
      CustomToaster.show('error', 'Something went wrong');
    }
  };

  console.log(createtest);
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
          <Header
            logo={require('../../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15}}>
          <View>
            <InAppCrossBackHeader
              showClose={false}
              closeIconSize={25}
              backIconSize={25}
              onBackPress={() => navigation.goBack()}
            />
          </View>
          <View style={{gap: 10}}>
            <View>
              <InAppHeader
                LftHdr={status === 'edit' ? 'Edit Test' : 'Add Test'}
                textcolor="#E72B4A"
                fontsize={hp(1.8)}
                fontfamily={'Poppins-SemiBold'}
                subtitle={
                  status === 'edit' ? 'Update Test' : 'Create a Test here'
                }
              />
            </View>
            <View>
              {createTest.map((item, i) => (
                <CustomInput
                  key={item.name}
                  name={item.name}
                  type={item.type}
                  placeholder={item.placeholder}
                  value={createtest[item.name] || ''}
                  onChange={handleChange}
                />
              ))}
            </View>
            <View style={{gap: 10}}>
              <Text
                style={{
                  color: '#787579',
                  paddingHorizontal: 15,
                  fontFamily: 'Poppins-Regular',
                }}>
                Description
              </Text>
              <View>
                <CustomInput
                  type={'textarea'}
                  placeholder={'Description'}
                  name={'test_description'}
                  value={createtest['test_description'] || ''}
                  onChange={handleChange}
                />
              </View>
            </View>
            <View style={{alignSelf: 'center', gap: 10}}>
              <CustomButton
                title={status === 'edit' ? 'Update' : 'Create'}
                bgColor={'#E72B4A'}
                fontfamily={'Poppins-SemiBold'}
                textColor={'white'}
                fontSize={hp(2)}
                borderRadius={20}
                width={wp(60)}
                onPress={handleCreateTest}
              />

              {status === 'edit' ? (
                <CustomButton
                  title="Delete Test"
                  // bgColor={'#E72B4A'}
                  fontfamily={'Poppins-SemiBold'}
                  textColor={'#E72B4A'}
                  fontSize={hp(2)}
                  borderRadius={20}
                  width={wp(60)}
                />
              ) : null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateTest;
