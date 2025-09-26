
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileInformation from '../../../screens/Doctor/AdditionalScreens/ProfileScreenComponents/ProfileInformation';
import TopTabs from '../TopTabs/TopTabs';
import CustomButton from '../../customButton/CustomButton';
import ProfessionalDetails from '../../../screens/Doctor/AdditionalScreens/ProfileScreenComponents/ProfessionalDetails';


const Stack = createNativeStackNavigator();

export default function DoctorProfileHeader() {
  const [activeTab, setActiveTab] = useState('ProfileInformation');
  const [ParentFormData,setParentFormData] = useState();


  const handleDataFromChild = (data) => {
    setParentFormData(data); // Update the state with the data from child
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'ProfileInformation':
        return <ProfileInformation propsDataProfileInfo={handleDataFromChild} />;
      case 'ProfessionalDetails':
        return <ProfessionalDetails />;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View>
        {/* <HeaderDoctor /> */}
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
              // onPress={() => setisAllow(!isAllow)}
              // showhide={isAllow}
            />
          </View>
        ) : null}

        <View style={{margin: 10}}>
          <TopTabs
            borderRadius={8}
            bordercolor={'#fff'}
            data={[
              {title: 'ProfileInformation'},
              {title: 'ProfessionalDetails'},
             
            ]}
            borderwidth={1}
            activeTab={activeTab} // Pass the activeTab state
            setActiveTab={setActiveTab} // Pass the setActiveTab function to change tab
          />
        </View>

        <View style={styles.contentContainer}>
          {renderComponent()}
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
