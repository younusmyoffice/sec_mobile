import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import BookingHistory from './StatisticsComponents/BookingHistory';
import Transaction from './StatisticsComponents/Transaction';
import Overview from './StatisticsComponents/Overview';
import Payout from './StatisticsComponents/Payout';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import Header from '../../../components/customComponents/Header/Header';

const Stack = createNativeStackNavigator();

export default function DoctorStatisticsScreen() {
  const [activeTab, setActiveTab] = useState('Booking History');

  const renderComponent = () => {
    switch (activeTab) {
      case 'Booking History':
        return <BookingHistory />;
      case 'Transaction Details':
        return <Transaction />;
      case 'Overview':
        return <Overview />;
      case 'Payout':
        return <Payout />;
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
        <View style={{margin: 10}}>
          <TopTabs
            borderRadius={8}
            bordercolor={'#fff'}
            data={[
              {title: 'Booking History'},
              {title: 'Transaction Details'},
              {title: 'Overview'},
              {title: 'Payout'},
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
