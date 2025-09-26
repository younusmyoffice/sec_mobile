import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import DiagnosticSalesActivities from './DiagnosticSalesActivities/DiagnosticSalesActivities';
import DiagnosticAuditLogs from './DiagnosticAuditLogs/DiagnosticAuditLogs';
import Header from '../../../../components/customComponents/Header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const Stack = createNativeStackNavigator();
export default function DiagnosticManageScreen() {
  const [activeTab, setactiveTab] = useState('Sale Activities');
  const renderComponent = () => {
    switch (activeTab) {
      case 'Sale Activities':
        return <DiagnosticSalesActivities/>
      case 'Audit':
        return <DiagnosticAuditLogs/>
    
    }
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
           <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
        id={4}
      />
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Sale Activities'},
                {id: 2, title: 'Audit'},
                
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
            />
          </View>
          <View style={{marginTop:'5%'}}>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
