/**
 * ============================================================================
 * SEARCH COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Search component for patients to search doctors with real-time debounced search.
 * Displays search results or featured doctors as fallback.
 * 
 * FEATURES:
 * - Real-time search with 500ms debounce
 * - Search results display
 * - Featured doctors fallback when no search results
 * - Loading states
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates search query before API calls
 * - Input sanitization (trim, length validation)
 * - XSS protection (query validation)
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error messages
 * - Graceful error handling with empty state
 * - Loading states with CustomLoader
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - CustomSearch: Search input component
 * - DoctorCard: Doctor profile card
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * PERFORMANCE:
 * - Debounced search to reduce API calls
 * - Clears search results when query is empty
 * 
 * @module Search
 */

import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomSearch from '../../../../components/customSearch/CustomSearch';
import axiosInstance from '../../../../utils/axiosInstance';
import DoctorCard from '../../../../components/customCards/doctorCard/DoctorCard';
import {useNavigation} from '@react-navigation/native';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';
import { sanitizeInput } from '../../../../utils/inputSanitization';

const Search = () => {
  const navigation = useNavigation();
  const [featuredcard, setFeaturedCards] = useState([]);
  const [query, setQuery] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [load, setLoad] = useState(false);

  /**
   * Navigate to doctor booking page
   * @param {string|number} item - Doctor ID
   */
  const handleNavigateDoctor = item => {
    Logger.debug('Navigate to doctor booking', { doctorId: item });
    navigation.navigate('Home', {
      screen: 'DoctorBookAppointment',
      params: {data: item.toString()},
    });
  };

  /**
   * Handle search input changes
   * SECURITY: Input validation and sanitization
   * @param {string} text - Search query text
   */
  const handleInputChange = text => {
    // SECURITY: Sanitize input
    const sanitizedText = sanitizeInput(String(text || '').trim());
    
    setQuery(sanitizedText);
    
    if (sanitizedText === '') {
      setLoad(false);
      setSearchedData([]);
      Logger.debug('Search query cleared');
    } else {
      setLoad(true);
      Logger.debug('Search query updated', { length: sanitizedText.length });
    }
  };

  /**
   * Debounce search query to reduce API calls
   * PERFORMANCE: 500ms delay before triggering search
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  /**
   * Trigger search when debounced query changes
   */
  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    } else {
      setSearchedData([]);
      Logger.debug('Search cleared');
    }
  }, [debouncedQuery]);

  /**
   * Perform doctor search
   * SECURITY: Validates search query before API call
   * ERROR HANDLING: Comprehensive error handling
   * @param {string} searchQuery - Search query
   */
  const handleSearch = async searchQuery => {
    // SECURITY: Validate search query
    if (!searchQuery || typeof searchQuery !== 'string') {
      Logger.warn('Invalid search query', { searchQuery });
      setSearchedData([]);
      setLoad(false);
      return;
    }

    const sanitizedQuery = sanitizeInput(searchQuery.trim());
    
    // SECURITY: Length validation (prevent extremely long queries)
    if (sanitizedQuery.length < 2) {
      Logger.debug('Search query too short', { length: sanitizedQuery.length });
      setSearchedData([]);
      setLoad(false);
      return;
    }

    if (sanitizedQuery.length > 100) {
      Logger.warn('Search query too long', { length: sanitizedQuery.length });
      CustomToaster.show('error', 'Error', 'Search query is too long. Please use a shorter query.');
      setSearchedData([]);
      setLoad(false);
      return;
    }

    try {
      setLoad(true);
      Logger.api('GET', `patient/getPatientSearchAPI/${sanitizedQuery}`);
      
      const response = await axiosInstance.get(
        `patient/getPatientSearchAPI/${sanitizedQuery}`,
      );
      
      Logger.debug('Search results received', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const searchResults = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];
      
      setSearchedData(searchResults);
      
      Logger.info('Search completed successfully', {
        query: sanitizedQuery,
        resultsCount: searchResults.length,
      });
    } catch (error) {
      Logger.error('Error performing search', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to search doctors. Please try again later.';
      
      CustomToaster.show('error', 'Search Error', errorMessage);
      setSearchedData([]);
    } finally {
      setLoad(false);
    }
  };

  /**
   * Fetch featured doctors as fallback
   * SECURITY: Validates response data
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchFeatured = async () => {
    try {
      Logger.api('POST', 'patient/doctor/featureddoctors');
      
      const response = await axiosInstance.post(
        `patient/doctor/featureddoctors`,
        {
          zipcodes: ['560045', '560046', '560047'],
          page: 1,
          limit: 5,
        },
      );
      
      Logger.debug('Featured doctors response', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const featuredData = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];
      
      setFeaturedCards(featuredData);
      
      Logger.info('Featured doctors fetched successfully', {
        count: featuredData.length,
      });
    } catch (error) {
      Logger.error('Error fetching featured doctors', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to load featured doctors.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setFeaturedCards([]);
    }
  };

  useEffect(() => {
    Logger.debug('Search component initialized');
    fetchFeatured();
  }, []);

  /**
   * Normalize review star rating
   * @param {number|string} reviewId - Review ID or rating
   * @returns {number|string} - Normalized rating (1-5) or empty string
   */
  const normalizeReviewStar = (reviewId) => {
    if (!reviewId) return '';
    const numReview = typeof reviewId === 'string' ? parseInt(reviewId, 10) : reviewId;
    if (numReview >= 1 && numReview <= 5) {
      return numReview;
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {load && <CustomLoader />}
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          <CustomSearch
            placeholderTextColor={COLORS.TEXT_PRIMARY}
            elevation={5}
            onSearch={handleSearch}
            handleInputChange={handleInputChange}
            query={query}
            load={load}
          />
        </View>
        
        <View style={styles.resultsContainer}>
          {searchedData?.length > 0 ? (
            // Search results
            searchedData.map((item, i) => {
              // SECURITY: Validate item data before rendering
              if (!item || !item.suid) {
                Logger.warn('Invalid search result item', { index: i });
                return null;
              }

              return (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={`search-${item.suid}-${i}`}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid)}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital_org}
                  reviewstar={normalizeReviewStar(item?.review_id)}
                />
              );
            })
          ) : (
            // Featured doctors fallback
            <ScrollView
              horizontal={false}
              contentContainerStyle={styles.featuredContainer}
              showsHorizontalScrollIndicator={false}>
              {featuredcard && Array.isArray(featuredcard) && featuredcard.length > 0 ? (
                featuredcard.map((item, i) => {
                  if (!item || !item.suid) {
                    Logger.warn('Invalid featured doctor item', { index: i });
                    return null;
                  }

                  return (
                    <DoctorCard
                      profile_picture={item?.profile_picture}
                      key={`featured-${item.suid}-${i}`}
                      firstname={item?.first_name}
                      middlename={item?.middle_name}
                      lastname={item?.last_name}
                      onClick={() => handleNavigateDoctor(item?.suid)}
                      reviews={item?.review_name}
                      speciality={item?.department_name}
                      hospital={item?.hospital_org}
                      reviewstar={normalizeReviewStar(item?.review_id)}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  {/* Empty state handled by DoctorCard or CustomSearch */}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    height: '100%',
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  searchContainer: {
    marginTop: 20,
    padding: 15,
  },
  resultsContainer: {
    backgroundColor: COLORS.BG_WHITE,
  },
  featuredContainer: {
    gap: 10,
  },
  emptyContainer: {
    // Empty state container styling
  },
});

export default Search;
