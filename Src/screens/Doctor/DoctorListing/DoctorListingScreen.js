import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import ActiveListing from './ListingComponents/ActiveListing';
import SavedDraft from './ListingComponents/SavedDraft';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/customComponents/Header/Header';
const Stack = createNativeStackNavigator();


export default function DoctorListingScreen() {
  const [activeTab, setActiveTab] = useState('Active Listing');
const navigation = useNavigation();
  const renderComponent = () => {
    switch (activeTab) {
      case 'Active Listing':
        return <ActiveListing />;
      case 'Saved in draft':
        return <SavedDraft />;
      
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
        <View style={{paddingVertical:10,paddingHorizontal:20,alignItems:'flex-end'}}>

        <CustomButton
                title="Create New"
                bgColor={'#fff'}
                borderRadius={30}
            borderWidth={1}
            borderColor={'#E72B4A'}
                textColor={'#E72B4A'}
                fontSize={14}
                fontWeight={'bold'}
                width={wp(35)}
                onPress={()=>{navigation.navigate('DoctorListing')}}
              />
        </View>
        <View style={{margin: 10}}>
          <TopTabs
            bordercolor={'#fff'}
            data={[
              {title: 'Active Listing'},
              {title: 'Saved in draft'},
              
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
