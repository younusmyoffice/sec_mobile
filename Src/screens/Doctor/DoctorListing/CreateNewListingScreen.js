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
import TermsCondition from './ListingComponents/TermsCondition';
import AddQuestioner from './ListingComponents/AddQuestioner';
import AddPlan from './ListingComponents/AddPlan';

import ListingDetails from './ListingComponents/ListingDetails';
import Header from '../../../components/customComponents/Header/Header';
const Stack = createNativeStackNavigator();


export default function CreateNewListingScreen() {
  const [activeTab, setActiveTab] = useState('Listing Details');
  const [listingId, setListingId] = useState(null);

  const handleListingIdChange = (newListingId) => {
    setListingId(newListingId);
  };
const navigation = useNavigation();
  const renderComponent = () => {
    switch (activeTab) {
    case 'Listing Details':
        return <ListingDetails listingId={listingId} onListingIdChange={handleListingIdChange} setActiveTab={setActiveTab} />;
      case 'Add Plan':
        return <AddPlan listingId={listingId} setActiveTab={setActiveTab} />;
        case 'Add Questioner':
        return <AddQuestioner listingId={listingId} setActiveTab={setActiveTab} />;
        case 'Terms & Condition':
        return <TermsCondition listingId={listingId}  />;
      
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
            bordercolor={'#fff'}
            data={[
              {title: 'Listing Details'},
              {title: 'Add Plan'},
              {title: 'Add Questioner'},
              {title: 'Terms & Condition'},
              
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
