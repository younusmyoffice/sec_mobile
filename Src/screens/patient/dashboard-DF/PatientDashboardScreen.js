/**
 * ============================================================================
 * PATIENT DASHBOARD SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main dashboard screen for patients with Explore and My Activity tabs.
 * Handles fetching and caching of doctors, appointments, and reports data.
 * 
 * FEATURES:
 * - Explore tab: Popular, Featured, Categories, Near You doctors, HCF
 * - My Activity tab: Appointments and Reports (Received/Shared)
 * - Data caching for performance
 * - Fallback postal codes for location-based searches
 * - Expandable sections with "View All" functionality
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Authentication check before data fetching
 * - Input validation for postal codes
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Graceful error handling with fallback postal codes
 * - Empty state handling when API calls fail
 * - Loading states with CustomLoader
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - MainExploreComponent: Explore section
 * - MyActivity: My Activity section
 * - TopTabs: Tab navigation
 * - Header: App header
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * PERFORMANCE:
 * - Data caching to prevent unnecessary API calls
 * - Memoized postal codes and appointments
 * - useCallback for API fetch functions
 * 
 * @module PatientDashboardScreen
 */

import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Header from '../../../components/customComponents/Header/Header';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import MainExploreComponent from './Explore/MainExploreComponent';
import MyActivity from './MyActivities/MyActivity';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import {baseUrl} from '../../../utils/baseUrl';
import {useCommon} from '../../../Store/CommonContext';
import {useLoc} from '../../../Store/LocationContext';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../components/customToaster/CustomToaster';
import Logger from '../../../constants/logger';
import { COLORS } from '../../../constants/colors';

export default function PatientDashboardScreen() {
  const {userId} = useCommon();
  const {postalCodes} = useLoc();
  
  /**
   * Check if user is authenticated
   * SECURITY: Validates userId before making API calls
   */
  const isAuthenticated = useMemo(() => {
    const authenticated = userId && userId !== 'token' && userId !== null && userId !== undefined;
    Logger.debug('Authentication check', { userId, authenticated });
    return authenticated;
  }, [userId]);
  
  /**
   * Memoize postal codes to prevent unnecessary re-renders
   * SECURITY: Validates and provides fallback postal codes
   */
  const validPostalCodes = useMemo(() => {
    Logger.debug('Postal codes processing', {
      fromContext: postalCodes,
      isArray: Array.isArray(postalCodes),
      length: postalCodes?.length || 0,
    });
    
    const result = Array.isArray(postalCodes) && postalCodes.length > 0 
      ? postalCodes 
      : ['560045', '560046', '560047', '560043']; // Bangalore fallback
    
    Logger.debug('Using postal codes', { postalCodes: result });
    return result;
  }, [postalCodes]);
  
  const [activeTab, setActiveTab] = useState('Explore');
  const [loading, setLoading] = useState(true);
  const [Featuredloading, setFeaturedLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);
  
  /**
   * Cache data state to prevent unnecessary API calls
   */
  const [cacheData, setCacheData] = useState({
    popularCards: null,
    featuredcard: null,
    nearmeCards: null,
    appointmentData: null,
    Hcf: null,
    lastPostalCodes: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  /**
   * Navigate to doctor booking page
   * @param {string|number} item - Doctor ID
   */
  const handleNavigateDoctor = item => {
    Logger.debug('Navigate to doctor booking', { doctorId: item });
    navigation.navigate('DoctorBookAppointment', {data: item.toString()});
  };

  /**
   * Navigate to HCF page
   * @param {string|number} item - HCF ID
   */
  const handleNavigateHCF = item => {
    Logger.debug('Navigate to HCF page', { hcfId: item });
    navigation.navigate('HcfPage', {data: item.toString()});
  };

  /**
   * Fetch patient appointments
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling with CustomToaster
   */
  const fetchappointment = useCallback(async () => {
    // SECURITY: Validate authentication
    if (!isAuthenticated) {
      Logger.warn('User not authenticated, skipping appointment fetch');
      return;
    }

    // SECURITY: Validate userId
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for appointments', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    // Use cache if available
    if (cacheData.appointmentData) {
      Logger.debug('Using cached appointment data');
      return;
    }

    setIsLoading(true);
    try {
      Logger.api('GET', `patient/patientActivity/${userId}`);
      
      const response = await axiosInstance.get(`patient/patientActivity/${userId}`);
      
      Logger.debug('Appointments response', {
        count: response?.data?.response?.length || 0,
      });

      setCacheData(prev => ({
        ...prev,
        appointmentData: response?.data?.response || [],
      }));
      
      Logger.info('Appointments fetched successfully', {
        count: response?.data?.response?.length || 0,
      });
    } catch (error) {
      Logger.error('Error fetching appointments', error);
      
      const errorMessage = error?.response?.data?.message || 
        'Failed to fetch appointments. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setCacheData(prev => ({
        ...prev,
        appointmentData: [],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, userId, cacheData.appointmentData]);

  /**
   * Memoized appointments list based on showFull toggle
   */
  const allAppointments = useMemo(() => {
    const data = cacheData?.appointmentData;
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return showFull ? data : data.slice(0, 2);
  }, [showFull, cacheData.appointmentData]);

  /**
   * Fetch popular doctors
   * SECURITY: Validates authentication before API calls
   * ERROR HANDLING: Multiple fallback postal codes, graceful error handling
   */
  const fetchPopular = useCallback(async (postalCodes) => {
    Logger.debug('fetchPopular called', { postalCodes });

    // SECURITY: Validate authentication
    if (!isAuthenticated) {
      Logger.warn('User not authenticated, skipping popular doctors fetch');
      setLoading(false);
      return;
    }

    // Use cache if available for same postal codes
    if (cacheData.popularCards && cacheData.lastPostalCodes === postalCodes) {
      Logger.debug('Using cached popular doctors data');
      setLoading(false);
      return;
    }

    Logger.info('Fetching popular doctors', { postalCodes });

    // PERFORMANCE: Try multiple postal code sets if the first one fails
    const postalCodeSets = [
      postalCodes, // Original postal codes
      ['560045', '560046', '560047', '560043'], // Bangalore fallback
      ['110001', '110002', '110003'], // Delhi fallback
      ['400001', '400002', '400003'], // Mumbai fallback
    ];

    for (let i = 0; i < postalCodeSets.length; i++) {
      const currentPostalCodes = postalCodeSets[i];
      Logger.debug(`Trying popular doctors with postal codes set ${i + 1}`, {
        postalCodes: currentPostalCodes,
      });

      try {
        Logger.api('POST', 'patient/doctor/populardoctors', {
          zipcodes: currentPostalCodes,
          type: 'Excellent',
        });
        
        const response = await axiosInstance.post(
          `${baseUrl}patient/doctor/populardoctors`,
          {
            zipcodes: currentPostalCodes,
            type: 'Excellent',
            page: 1,
            limit: 50,
          },
        );
        
        Logger.debug('Popular doctors fetched', {
          count: response?.data?.response?.length || 0,
        });

        // Update cache with new data and store last used postal codes
        setCacheData(prev => ({
          ...prev,
          popularCards: response?.data?.response || [],
          lastPostalCodes: currentPostalCodes,
        }));
        
        Logger.info('Popular doctors fetched successfully');
        break; // Exit loop on success
        
      } catch (error) {
        Logger.error(`Error fetching popular doctors with postal codes ${i + 1}`, error);

        // If this is the last attempt, set empty data and stop loading
        if (i === postalCodeSets.length - 1) {
          Logger.warn('All postal code sets failed, setting empty popular doctors');
          setCacheData(prev => ({
            ...prev,
            popularCards: [],
            lastPostalCodes: currentPostalCodes,
          }));
          setLoading(false);
        }
      }
    }
    
    // Ensure loading is set to false even if loop completes without break
    setLoading(false);
  }, [cacheData.popularCards, cacheData.lastPostalCodes, isAuthenticated]);

  /**
   * Fetch featured doctors
   * SECURITY: Validates authentication before API calls
   * ERROR HANDLING: Multiple fallback postal codes, graceful error handling
   */
  const fetchFeatured = useCallback(async (postalCodes) => {
    Logger.debug('fetchFeatured called', { postalCodes });
    
    // SECURITY: Validate authentication
    if (!isAuthenticated) {
      Logger.warn('User not authenticated, skipping featured doctors fetch');
      setFeaturedLoading(false);
      return;
    }
    
    // Use cache if available for same postal codes
    if (cacheData.featuredcard && cacheData.lastPostalCodes === postalCodes) {
      Logger.debug('Using cached featured doctors data');
      setFeaturedLoading(false);
      return;
    }

    Logger.info('Fetching featured doctors', { postalCodes });

    // PERFORMANCE: Try multiple postal code sets if the first one fails
    const postalCodeSets = [
      postalCodes, // Original postal codes
      ['560045', '560046', '560047', '560043'], // Bangalore fallback
      ['110001', '110002', '110003'], // Delhi fallback
      ['400001', '400002', '400003'], // Mumbai fallback
    ];

    for (let i = 0; i < postalCodeSets.length; i++) {
      const currentPostalCodes = postalCodeSets[i];
      Logger.debug(`Trying featured doctors with postal codes set ${i + 1}`, {
        postalCodes: currentPostalCodes,
      });

      try {
        Logger.api('POST', 'patient/doctor/featureddoctors', {
          zipcodes: currentPostalCodes,
        });
        
        const response = await axiosInstance.post(
          `${baseUrl}patient/doctor/featureddoctors`,
          {
            zipcodes: currentPostalCodes,
            page: 1,
            limit: 50,
          },
        );
        
        Logger.debug('Featured doctors fetched', {
          count: response?.data?.response?.length || 0,
        });
        
        setCacheData(prev => ({
          ...prev,
          featuredcard: response?.data?.response || [],
        }));
        
        Logger.info('Featured doctors fetched successfully');
        break; // Exit loop on success
        
      } catch (error) {
        Logger.error(`Error fetching featured doctors with postal codes ${i + 1}`, error);

        // If this is the last attempt, set empty data and stop loading
        if (i === postalCodeSets.length - 1) {
          Logger.warn('All postal code sets failed, setting empty featured doctors');
          setCacheData(prev => ({
            ...prev,
            featuredcard: [],
          }));
          setFeaturedLoading(false);
        }
      }
    }
    
    // Ensure loading is set to false even if loop completes without break
    setFeaturedLoading(false);
  }, [cacheData.featuredcard, cacheData.lastPostalCodes, isAuthenticated]);

  /**
   * Fetch doctors near you
   * SECURITY: Validates authentication before API calls
   * ERROR HANDLING: Multiple fallback postal codes, graceful error handling
   */
  const fetchNearYou = useCallback(async (postalCodes) => {
    Logger.debug('fetchNearYou called', { postalCodes });
    
    // SECURITY: Validate authentication
    if (!isAuthenticated) {
      Logger.warn('User not authenticated, skipping near you doctors fetch');
      setLoading(false);
      return;
    }
    
    // Use cache if available for same postal codes
    if (cacheData.nearmeCards && cacheData.lastPostalCodes === postalCodes) {
      Logger.debug('Using cached near you doctors data');
      setLoading(false);
      return;
    }

    Logger.info('Fetching doctors near you', { postalCodes });

    // PERFORMANCE: Try multiple postal code sets if the first one fails
    const postalCodeSets = [
      postalCodes, // Original postal codes
      ['560045', '560046', '560047', '560043'], // Bangalore fallback
      ['110001', '110002', '110003'], // Delhi fallback
      ['400001', '400002', '400003'], // Mumbai fallback
    ];

    for (let i = 0; i < postalCodeSets.length; i++) {
      const currentPostalCodes = postalCodeSets[i];
      Logger.debug(`Trying near you doctors with postal codes set ${i + 1}`, {
        postalCodes: currentPostalCodes,
      });

      try {
        Logger.api('POST', 'patient/doctornearme', {
          zipcodes: currentPostalCodes,
          type: 'Good',
        });
        
        const response = await axiosInstance.post(
          `${baseUrl}patient/doctornearme`,
          {
            zipcodes: currentPostalCodes,
            type: 'Good',
            page: 1,
            limit: 50,
          },
        );
        
        Logger.debug('Doctors near you fetched', {
          count: response?.data?.response?.length || 0,
        });
        
        setCacheData(prev => ({
          ...prev,
          nearmeCards: response?.data?.response || [],
        }));
        
        Logger.info('Near you doctors fetched successfully');
        break; // Exit loop on success
        
      } catch (error) {
        Logger.error(`Error fetching near you doctors with postal codes ${i + 1}`, error);

        // If this is the last attempt, set empty data and stop loading
        if (i === postalCodeSets.length - 1) {
          Logger.warn('All postal code sets failed, setting empty near you doctors');
          setCacheData(prev => ({
            ...prev,
            nearmeCards: [],
          }));
          setLoading(false);
        }
      }
    }
    
    // Ensure loading is set to false even if loop completes without break
    setLoading(false);
  }, [cacheData.nearmeCards, cacheData.lastPostalCodes, isAuthenticated]);

  /**
   * Fetch Healthcare Facilities
   * SECURITY: Validates authentication before API calls
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchHCF = useCallback(async () => {
    // SECURITY: Validate authentication
    if (!isAuthenticated) {
      Logger.warn('User not authenticated, skipping HCF fetch');
      return;
    }
    
    // Use cache if available
    if (cacheData.Hcf) {
      Logger.debug('Using cached HCF data');
      return;
    }

    Logger.info('Fetching HCF details');
    
    try {
      Logger.api('GET', 'patient/DashboardHcfdetails');
      
      const response = await axiosInstance.get(
        `${baseUrl}patient/DashboardHcfdetails?page=1&limit=50`,
      );
      
      Logger.debug('HCF details fetched', {
        count: response?.data?.response?.length || 0,
      });
      
      setCacheData(prev => ({
        ...prev,
        Hcf: response?.data?.response || [],
      }));
      
      Logger.info('HCF details fetched successfully');
    } catch (error) {
      Logger.error('Error fetching HCF details', error);
      
      const errorMessage = error?.response?.data?.message || 
        'Failed to fetch healthcare facilities. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setCacheData(prev => ({
        ...prev,
        Hcf: [],
      }));
    }
  }, [cacheData.Hcf, isAuthenticated]);

  /**
   * Main useEffect to trigger data fetching based on active tab
   * SECURITY: Only makes API calls if user is authenticated
   */
  useEffect(() => {
    Logger.debug('PatientDashboardScreen useEffect triggered', {
      isAuthenticated,
      activeTab,
      postalCodes: validPostalCodes,
    });
    
    // SECURITY: Only make API calls if user is authenticated
    if (!isAuthenticated) {
      Logger.warn('User not authenticated, skipping API calls');
      return;
    }

    if (activeTab === 'Explore') {
      Logger.info('Fetching Explore data');
      fetchPopular(validPostalCodes);
      fetchFeatured(validPostalCodes);
      fetchNearYou(validPostalCodes);
      fetchHCF();
    } else {
      Logger.info('Fetching appointment data');
      fetchappointment();
    }
  }, [activeTab, validPostalCodes, isAuthenticated]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
        locationIcon={false}
        showLocationMark={true}
        notificationUserIcon={true}
        id={5}
      />
      
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {(loading || Featuredloading || isLoading) && <CustomLoader />}
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.content}>
          <TopTabs
            bordercolor={COLORS.BG_WHITE}
            borderwidth={1}
            data={[{title: 'Explore'}, {title: 'My Activity'}]}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              Logger.debug('Tab changed', { from: activeTab, to: tab });
              setActiveTab(tab);
            }}
          />
          
          <View style={styles.tabContent}>
            {activeTab === 'Explore' ? (
              <MainExploreComponent
                popularCards={cacheData?.popularCards}
                featuredcard={cacheData?.featuredcard}
                nearmeCards={cacheData?.nearmeCards}
                hcf={cacheData?.Hcf}
                loading={loading}
                Featuredloading={Featuredloading}
                handleNavigateDoctor={item => handleNavigateDoctor(item)}
                handleNavigateHCF={item => handleNavigateHCF(item)}
              />
            ) : (
              <MyActivity
                isLoading={isLoading}
                showFull={showFull}
                allAppointments={allAppointments}
                setShowFull={setShowFull}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    padding: 10,
    backgroundColor: COLORS.BG_WHITE,
  },
  tabContent: {
    marginTop: 10,
  },
});
