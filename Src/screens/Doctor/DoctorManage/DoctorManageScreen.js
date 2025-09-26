import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import AuditLogs from './ManageComponents/AuditLogs';
import StaffManage from './ManageComponents/StaffManage';
import CustomButton from '../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import Header from '../../../components/customComponents/Header/Header';

const Stack = createNativeStackNavigator();

export default function DoctorManageScreen() {
  const [activeTab, setActiveTab] = useState('Audit Logs');

  const navigation = useNavigation();
  const renderComponent = () => {
    switch (activeTab) {
      
      case 'Audit Logs':
        return <AuditLogs />;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View>
      <Header  logo={require('../../../assets/images/ShareecareHeaderLogo.png')} notificationUserIcon={true} id={3}/>

      </View>
      <ScrollView>
        {activeTab === 'Staff' ? (
          <View
            style={{
              alignItems: 'flex-end',
              marginTop: 10,
              paddingHorizontal: 15,
            }}>
            <CustomButton
              title="Create Staff"
              borderColor="#E72B4A"
              textColor="#E72B4A"
              borderWidth={1}
              borderRadius={30}
              width={wp(35)}
              fontfamily="Poppins-SemiBold"
              onPress={() => {navigation.navigate('CreateStaffDoctor')}}
              // showhide={isAllow}
            />
          </View>
        ) : null}

        <View style={{margin: 10}}>
          <TopTabs
            borderRadius={8}
            bordercolor={'#fff'}
            data={[
              {title: 'Audit Logs'},
              
            ]}
            borderwidth={1}
            activeTab={activeTab} // Pass the activeTab state
            setActiveTab={setActiveTab} // Pass the setActiveTab function to change tab
          />
        </View>

        <View style={styles.contentContainer}>
          {renderComponent()}
          {/* Dynamically render component based on activeTab */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
