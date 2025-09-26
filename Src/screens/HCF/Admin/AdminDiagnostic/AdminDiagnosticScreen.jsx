import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import Lab from './Lab';
// import Staff from './Staff';
// import Blocked from './Blocked';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import Lab from './Lab';
import Staff from './Staff';
import Blocked from './Blocked';
import Header from '../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../utils/axiosInstance';
import {useAuth} from '../../../../Store/Authentication';

const Stack = createNativeStackNavigator();
export default function AdminDiagnosticScreen() {
  const route=useRoute()
  console.log(route.state)
  const {userId} = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Lab');
  const [lab, setLab] = useState([]);
  const [staff, setStaff] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const fetchhcf = async () => {
    try {
      const labData = await axiosInstance.get(`hcf/getHcfLab/${userId}`);
      const staffData = await axiosInstance.get(`hcf/getHcfStaff/${userId}`);
      const blockedData = await axiosInstance.get(
        `hcf/getHcfStaff/${userId}/blocked`,
      );
      console.log(labData.data);
      setLab(labData.data.response);
      setStaff(staffData.data.response);
      setBlocked(blockedData.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'Lab':
        return <Lab data={lab}/>;
      case 'Staff':
        return <Staff data={staff} />;
      case 'Blocked':
        return <Blocked data={blocked} />;
    }
  };
  const handleCreateLab = () => {
    navigation.navigate('create-lab');
  };
  const handleCreateStaff = () => {
    navigation.navigate('create-staff');
  };

  useFocusEffect(
    useCallback(() => {
      fetchhcf();
    }, [])
  );

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
          <Header
            logo={require('../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15}}>
          <View style={{alignSelf: 'flex-end'}}>
            <CustomButton
              title={activeTab === 'Lab' ? 'Create Lab' : 'Add Staff'}
              fontfamily={'Poppins-SemiBold'}
              textColor={'#E72B4A'}
              borderWidth={1}
              borderRadius={20}
              borderColor={'#E72B4A'}
              height={hp(5.5)}
              width={wp(35)}
              fontSize={hp(1.8)}
              onPress={
                activeTab === 'Lab' ? handleCreateLab : handleCreateStaff
              }
            />
          </View>
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Lab'},
                {id: 2, title: 'Staff'},
                {id: 3, title: 'Blocked'},
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              borderRadius={8}
            />
          </View>
          <View style={{marginTop: 10}}>
            {/* <Lab/> */}
            {renderComponent()}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
