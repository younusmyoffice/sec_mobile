/**
 * ============================================================================
 * SCREEN: Doctor Listing Management
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for doctors to manage their listings (Active and Draft)
 * 
 * SECURITY:
 * - No direct API calls, delegates to child components
 * - Modal management for create/edit operations
 * 
 * FEATURES:
 * - Active listing management
 * - Draft listing management
 * - Create new listing modal
 * - Edit listing modal
 * 
 * @module DoctorListingScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View, Alert, Modal} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import CustomButton from '../../../components/customButton/CustomButton';
import Header from '../../../components/customComponents/Header/Header';
import ActiveListing from './ListingComponents/ActiveListing';
import SavedDraft from './ListingComponents/SavedDraft';
import CreateNewListingScreen from './CreateNewListingScreen';

// Utils & Constants
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();


export default function DoctorListingScreen() {
  const navigation = useNavigation();

  // STATE: Active tab selection
  const [activeTab, setActiveTab] = useState('Active Listing');
  
  // STATE: Modal visibility management
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // STATE: Editing listing data
  const [editingListing, setEditingListing] = useState(null);
  
  // STATE: Refresh key for forcing component remount
  const [refreshKey, setRefreshKey] = useState(0);

  Logger.debug('Doctor Listing Screen initialized');

  /**
   * HANDLER: Open edit modal for a listing
   * 
   * @param {Object} listingData - Listing data to edit
   */
  const handleEditListing = (listingData) => {
    Logger.debug('Opening edit mode for listing', {
      listingId: listingData?.doctor_list_id,
      listingName: listingData?.listing_name,
    });
    setEditingListing(listingData);
    setIsEditModalVisible(true);
  };

  /**
   * HANDLER: Handle listing creation success
   * 
   * Refreshes the listing components after a new listing is created
   */
  const handleListingCreated = () => {
    Logger.info('Listing created successfully - refreshing list');
    setIsCreateModalVisible(false);
    setRefreshKey(prev => prev + 1); // Force component remount
  };

  /**
   * HANDLER: Handle listing update success
   * 
   * Refreshes the listing components after a listing is updated
   */
  const handleListingUpdated = () => {
    Logger.info('Listing updated successfully - refreshing list');
    setIsEditModalVisible(false);
    setEditingListing(null);
    setRefreshKey(prev => prev + 1); // Force component remount
  };

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate listing component for the selected tab
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Active Listing':
        return (
          <ActiveListing
            key={refreshKey}
            onEditListing={handleEditListing}
          />
        );
      case 'Saved in draft':
        return (
          <SavedDraft
            key={refreshKey}
            onEditListing={handleEditListing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          notificationUserIcon={true}
          id={3}
        />
      </View>
      <ScrollView>
        {/* BUTTON: Create New Listing */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Create New"
            bgColor={COLORS.BG_WHITE} // DESIGN: Use color constant
            borderRadius={30}
            borderWidth={1}
            borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
            textColor={COLORS.PRIMARY} // DESIGN: Use color constant
            fontSize={14}
            fontWeight={'bold'}
            width={wp(35)}
            onPress={() => {
              Logger.debug('Create new listing button pressed');
              setIsCreateModalVisible(true);
            }}
          />
        </View>

        {/* TABS: Active Listing and Draft */}
        <View style={styles.tabsContainer}>
          <TopTabs
            bordercolor={COLORS.BG_WHITE} // DESIGN: Use color constant
            data={[
              {title: 'Active Listing'},
              {title: 'Saved in draft'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </View>

        {/* CONTENT: Render active tab component */}
        <View style={styles.contentContainer}>{renderComponent()}</View>
      </ScrollView>

      {/* MODAL: Create New Listing */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCreateModalVisible}
        onRequestClose={() => {
          Logger.debug('Create modal closed');
          setIsCreateModalVisible(false);
        }}>
        <CreateNewListingScreen
          onClose={() => setIsCreateModalVisible(false)}
          onListingCreated={handleListingCreated}
        />
      </Modal>

      {/* MODAL: Edit Listing */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isEditModalVisible}
        onRequestClose={() => {
          Logger.debug('Edit modal closed');
          setIsEditModalVisible(false);
          setEditingListing(null);
        }}>
        <CreateNewListingScreen
          editMode={true}
          existingListing={editingListing}
          onClose={() => {
            setIsEditModalVisible(false);
            setEditingListing(null);
          }}
          onListingUpdated={handleListingUpdated}
        />
      </Modal>
    </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
