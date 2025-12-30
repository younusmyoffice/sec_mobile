/**
 * ============================================================================
 * SCREEN: Create/Edit New Listing
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for creating new doctor listings or editing existing ones
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Input validation should be handled by child components
 * 
 * FEATURES:
 * - Create new listing workflow
 * - Edit existing listing workflow
 * - Multi-step form (Listing Details, Plans, Questions, Terms)
 * 
 * @module CreateNewListingScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import TermsCondition from './ListingComponents/TermsCondition';
import AddQuestioner from './ListingComponents/AddQuestioner';
import AddPlan from './ListingComponents/AddPlan';
import ListingDetails from './ListingComponents/ListingDetails';
import Header from '../../../components/customComponents/Header/Header';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useCommon} from '../../../Store/CommonContext';
import CustomToaster from '../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();


export default function CreateNewListingScreen({
  onClose,
  onListingCreated,
  editMode = false,
  existingListing = null,
  onListingUpdated,
}) {
  const navigation = useNavigation();
  const {userId} = useCommon();

  // STATE: Active tab selection
  const [activeTab, setActiveTab] = useState('Listing Details');

  // STATE: Listing ID (set after listing details are created)
  const [listingId, setListingId] = useState(
    editMode && existingListing ? existingListing.doctor_list_id : null,
  );

  // STATE: Existing listing data (for edit mode)
  const [existingData, setExistingData] = useState({
    plans: [],
    questions: [],
    terms: null,
    listingDetails: null,
  });

  // STATE: Loading state for data fetching
  const [loading, setLoading] = useState(false);

  Logger.debug('CreateNewListingScreen initialized', {
    editMode,
    listingId,
    hasExistingListing: !!existingListing,
  });

  /**
   * HANDLER: Update listing ID when created in Listing Details
   * 
   * @param {string|number} newListingId - New listing ID
   */
  const handleListingIdChange = newListingId => {
    Logger.info('Listing ID updated', { oldId: listingId, newId: newListingId });
    setListingId(newListingId);
  };

  /**
   * HANDLER: Close modal/screen
   */
  const handleClose = () => {
    Logger.debug('Closing CreateNewListingScreen', { editMode });
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  /**
   * EFFECT: Fetch existing data when in edit mode
   */
  useEffect(() => {
    if (editMode && existingListing && listingId) {
      Logger.debug('Edit mode detected - fetching existing data', {
        listingId,
        hasExistingListing: !!existingListing,
      });
      fetchExistingData();
    }
  }, [editMode, existingListing, listingId]);

  /**
   * API: Fetch existing listing data for edit mode
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchExistingData = async () => {
    // VALIDATION: Check required parameters
    if (!userId || !listingId) {
      Logger.warn('Cannot fetch existing data - missing userId or listingId', {
        hasUserId: !!userId,
        hasListingId: !!listingId,
      });
      return;
    }

    setLoading(true);

    try {
      Logger.api('POST', 'createUpdatedoctorlisting/planAll', {
        doctor_list_id: listingId,
        doctor_id: userId,
      });

      // PERFORMANCE: Fetch all data concurrently
      const [plansResponse, questionsResponse] = await Promise.all([
        // Fetch plans
        axiosInstance.post('createUpdatedoctorlisting/planAll', {
          doctor_list_id: listingId,
          doctor_id: userId,
        }),
        // Fetch questions
        axiosInstance.get(`getdoctorlisting/questionAll/${listingId}/${userId}`),
      ]);

      Logger.info('Plans and questions fetched successfully', {
        plansCount: plansResponse?.data?.response?.allPlan?.length || 0,
        questionsCount: questionsResponse?.data?.response?.length || 0,
      });

      // Fetch terms and listing details
      let termsData = null;
      let listingDetailsData = null;

      try {
        Logger.api('GET', `doctor/DocListingPlanByDoctorListingId/${listingId}`);

        const listingDetailsResponse = await axiosInstance.get(
          `doctor/DocListingPlanByDoctorListingId/${listingId}`,
        );

        // ERROR HANDLING: Extract listing details from response
        if (
          listingDetailsResponse.data?.response?.DocListingPlan &&
          Array.isArray(listingDetailsResponse.data.response.DocListingPlan)
        ) {
          const listingPlan = listingDetailsResponse.data.response.DocListingPlan[0];

          if (listingPlan) {
            listingDetailsData = {
              listing_name: listingPlan.listing_name,
              working_days_start: listingPlan.working_days_start,
              working_days_end: listingPlan.working_days_end,
              working_time_start: listingPlan.working_time_start,
              working_time_end: listingPlan.working_time_end,
              about: listingPlan.about,
              terms: listingPlan.terms || listingPlan.description,
            };

            termsData = listingPlan.terms;
          }
        }

        // FALLBACK: Try to get terms from existing listing data
        if (!termsData && existingListing) {
          Logger.debug('Using fallback terms from existing listing');
          termsData =
            existingListing.terms ||
            existingListing.description ||
            existingListing.terms_description;
        }
      } catch (termsError) {
        // ERROR HANDLING: Handle terms fetch error gracefully
        Logger.warn('Could not fetch terms data', {
          message: termsError?.message,
          status: termsError?.response?.status,
        });

        // FALLBACK: Use existing listing data
        if (existingListing) {
          termsData =
            existingListing.terms ||
            existingListing.description ||
            existingListing.terms_description;
        }
      }

      // Update state with fetched data
      setExistingData({
        plans: plansResponse.data?.response?.allPlan || [],
        questions: questionsResponse.data?.response || [],
        terms: termsData,
        listingDetails: listingDetailsData,
      });

      Logger.info('Existing data fetched and set', {
        plansCount: plansResponse.data?.response?.allPlan?.length || 0,
        questionsCount: questionsResponse.data?.response?.length || 0,
        hasTerms: !!termsData,
        hasListingDetails: !!listingDetailsData,
      });
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to fetch existing listing data.';

      Logger.error('Error fetching existing data', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);

      // Set empty data on error
      setExistingData({
        plans: [],
        questions: [],
        terms: null,
        listingDetails: null,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate form component for the selected step
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Listing Details':
        return (
          <ListingDetails
            listingId={listingId}
            onListingIdChange={handleListingIdChange}
            setActiveTab={setActiveTab}
            editMode={editMode}
            existingListing={existingListing}
            existingListingDetails={existingData.listingDetails}
            onListingUpdated={onListingUpdated}
          />
        );
      case 'Add Plan':
        return (
          <AddPlan
            listingId={listingId}
            setActiveTab={setActiveTab}
            editMode={editMode}
            existingListing={existingListing}
            existingPlans={existingData.plans}
          />
        );
      case 'Add Questioner':
        return (
          <AddQuestioner
            listingId={listingId}
            setActiveTab={setActiveTab}
            editMode={editMode}
            existingListing={existingListing}
            existingQuestions={existingData.questions}
          />
        );
      case 'Terms & Condition':
        return (
          <TermsCondition
            listingId={listingId}
            onListingCreated={editMode ? onListingUpdated : onListingCreated}
            editMode={editMode}
            existingListing={existingListing}
            existingTerms={existingData.terms || existingData.listingDetails?.terms}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: Title and close button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {editMode ? 'Edit Listing' : 'Create New Listing'}
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={COLORS.TEXT_PRIMARY} // DESIGN: Use color constant
          />
        </TouchableOpacity>
      </View>

      {/* LOADER: Show while fetching existing data */}
      {loading && <CustomLoader />}

      <ScrollView>
        {/* TABS: Multi-step form navigation */}
        <View style={styles.tabsContainer}>
          <TopTabs
            bordercolor={COLORS.BG_WHITE} // DESIGN: Use color constant
            data={[
              {title: 'Listing Details'},
              {title: 'Add Plan'},
              {title: 'Add Questioner'},
              {title: 'Terms & Condition'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </View>

        {/* CONTENT: Render active tab component */}
        <View style={styles.contentContainer}>{renderComponent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
  },
  closeButton: {
    padding: 5,
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
