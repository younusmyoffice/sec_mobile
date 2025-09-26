import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import ClinicSalesActivities from './ClinicSalesActivities/ClinicSalesActivities';
import ClinicAuditLogs from './ClinicAuditLogs/ClinicAuditLogs';
import Header from '../../../../components/customComponents/Header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useCommon } from '../../../../Store/CommonContext';
import CustomTable from '../../../../components/customTable/CustomTable';
const Stack = createNativeStackNavigator();
export default function ClinicManageScreen() {
  const [activeTab, setactiveTab] = useState('Sale Activities');
  
  const renderComponent = () => {
    switch (activeTab) {
      case 'Sale Activities':
        return <ClinicSalesActivities/>
      case 'Audit':
        return <ClinicAuditLogs/>
    
    }
  };
  return (
    // <SafeAreaView style={{backgroundColor: 'white',flex:1}}>
      //    <Header
      //   logo={require('../../../../assets/Clinic1.jpeg')}
      //   notificationUserIcon={true}
      //   width={wp(41)}
      //   height={hp(4)}
      //   resize={'contain'}
      //   onlybell={true}
      // />
    //   <SafeAreaView style={{backgroundColor: 'white'}}>
    //     <View style={{padding: 15, gap: 10}}>
    //       <View>
    //         <TopTabs
    //           data={[
    //             {id: 1, title: 'Sale Activities'},
    //             {id: 2, title: 'Audit'},
                
    //           ]}
    //           activeTab={activeTab}
    //           setActiveTab={setactiveTab}
    //         />
    //       </View>
    //       <View style={{marginTop:'5%',backgroundColor:'red'}}>
    //       <CustomTable
      
    //   header={header}
    //   backgroundkey={'status'}
    //   isUserDetails={true}
    //   data={cardData}
    //   flexvalue={2}
    //   rowDataCenter={true}
    //   textCenter={'center'}
    // />

    //       </View>
    //     </View>
    //   </SafeAreaView>
    // </SafeAreaView>
    <ScrollView style={{backgroundColor: '#fff'}} nestedScrollEnabled={true}>
      <SafeAreaView>
        <View>
        <Header
        logo={require('../../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
      />
        </View>
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
          <View>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
