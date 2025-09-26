import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomSearch from '../../../../components/customSearch/CustomSearch';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SalesActivities from './SalesActivities/SalesActivities';
import Overview from './Overview/Overview';
import Bookings from './Bookings/Bookings';
import Payout from './Payout/Payout';
import Audit from './Audit/Audit';
import Header from '../../../../components/customComponents/Header/Header';
const Stack = createNativeStackNavigator();
export default function AdminManageScreen() {
  const [activeTab, setactiveTab] = useState('Sale Activities');
  const renderComponent = () => {
    switch (activeTab) {
      case 'Sale Activities':
        return <SalesActivities />;
      case 'Overview':
        return <Overview/>
      case 'Bookings':
        return <Bookings/>
      case 'Payout':
        return <Payout/>
      case 'Audit':
        return <Audit/>
    }
  };
  return (
    <ScrollView style={{backgroundColor: '#fff'}} nestedScrollEnabled={true}>
      <SafeAreaView>
        <View>
        <Header logo={require('../../../../assets/hcfadmin.png')} notificationUserIcon={true} width={wp(41)} height={hp(4)} resize={'contain'}/>

        </View>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Sale Activities'},
                {id: 2, title: 'Overview'},
                {id: 3, title: 'Bookings'},
                {id: 4, title: 'Payout'},
                {id: 5, title: 'Audit'},
                // {id:5,title:'Sale Activities'},
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
