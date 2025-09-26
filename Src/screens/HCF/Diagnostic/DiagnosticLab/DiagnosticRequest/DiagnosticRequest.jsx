import {View, Text} from 'react-native';
import React, {useState} from 'react';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import Recieved from './Recieved';
import Rejected from './Rejected';
const DiagnosticRequest = () => {
  const [activeTab, setactiveTab] = useState('Recevied');
  const renderComponent = () => {
    switch (activeTab) {
      case 'Recevied':
        return <Recieved/>
      case 'Rejected':
        return <Rejected/>
    }
  };
  return (
    <View style={{gap: 10}}>
      <View style={{alignSelf: 'center'}}>
        <View
          style={{
            backgroundColor: '#f0f0f0',
            borderRadius: 20,
            gap: 5,
            height: hp(8),
          }}>
          <View style={{alignItems: 'center'}}>
            <TopTabs
              data={[
                {id: 1, title: 'Recevied'},
                {id: 2, title: 'Rejected'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
              activeButtonColor="black"
              nonactivecolor="white"
              borderRadius={20}
            />
          </View>
        </View>
      </View>
      <View style={{alignSelf: 'center'}}>
        {/* <View style={{flexDirection: 'row'}}>
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
        </View> */}
      </View>
      <View>{renderComponent()}</View>
    </View>
  );
};

export default DiagnosticRequest;
