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
import DiagnosticRequest from './DiagnosticRequest/DiagnosticRequest';
import DiagnosticExamination from './DiagnosticExamination/DiagnosticExamination';
import DiagnosticReport from './DiagnosticReport/DiagnosticReport';
import DiagnosticChat from './DiagnosticChat/DiagnosticChat';
import Header from '../../../../components/customComponents/Header/Header';

const Stack = createNativeStackNavigator();
export default function DiagnosticLabScreen() {
  const [activeTab, setactiveTab] = useState('Request');
  const renderComponent = () => {
    switch (activeTab) {
      case 'Request':
        return <DiagnosticRequest />;
      case 'Examination':
        return <DiagnosticExamination />;
      case 'Report':
        return <DiagnosticReport />;
      case 'Chat':
        return <DiagnosticChat />;
    }
  };
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
        <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
        id={4}
      />
        </View>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Request'},
                {id: 2, title: 'Examination'},
                {id: 3, title: 'Report'},
                {id: 4, title: 'Chat'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
            />
          </View>
          <View>
            {activeTab === 'Chat' ? (
              <></>
            ) : (
              <CustomSearch
                placeholderTextColor={'#AEAAAE'}
                showmenuIcon={true}
              />
            )}
          </View>

          <View>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
