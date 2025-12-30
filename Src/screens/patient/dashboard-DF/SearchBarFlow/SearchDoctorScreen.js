/**
 * ============================================================================
 * SEARCH DOCTOR SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for patients to search doctors with location and category filters.
 * 
 * FEATURES:
 * - Search bar with real-time input
 * - Location filter (current location and search results)
 * - Category filter (All, Dentist, Neurologist, etc.)
 * - Doctor cards display
 * - Empty state handling
 * 
 * SECURITY:
 * - No direct API calls (component ready for API integration)
 * - Input validation for search query
 * - Safe array operations
 * 
 * ERROR HANDLING:
 * - Empty state display when no doctors found
 * - Safe data handling
 * 
 * REUSABLE COMPONENTS:
 * - Custom components for search can be integrated
 * - Empty state image component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * NOTE:
 * This is a static component currently. API integration should be added
 * for fetching doctor data based on search query, location, and category.
 * 
 * @module SearchDoctorScreen
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const SearchDoctorScreen = ({navigation}) => {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [doctorData, setDoctorData] = useState([]); // TODO: Replace with API data

  /**
   * Doctor categories for filtering
   */
  const categories = [
    'All',
    'Dentist',
    'Neurologist',
    'Orthopedics',
    'Gynecologist',
  ];

  /**
   * Handle location input changes
   * SECURITY: Input validation
   * @param {string} text - Location search text
   */
  const handleLocationChange = (text) => {
    // SECURITY: Basic input sanitization
    const sanitizedText = String(text || '').trim();
    setLocation(sanitizedText);
    Logger.debug('Location search updated', { length: sanitizedText.length });
    
    // TODO: Trigger location search API call here
  };

  /**
   * Handle category selection
   * @param {string} category - Selected category
   */
  const handleCategorySelect = (category) => {
    Logger.debug('Category selected', { from: selectedCategory, to: category });
    setSelectedCategory(category);
    
    // TODO: Filter doctor data by category or trigger API call
  };

  /**
   * Handle current location selection
   */
  const handleUseCurrentLocation = () => {
    Logger.debug('Use current location pressed');
    // TODO: Get current location and update search
  };

  /**
   * Render doctor cards or empty state
   * @returns {JSX.Element} Doctor cards or empty state
   */
  const renderDoctorCard = () => {
    if (!doctorData || doctorData.length === 0) {
      return (
        <View style={styles.noResultContainer}>
          <ScrollView>
            <Image
              source={require('../../../../assets/images/doctorSearchImg.png')}
              style={styles.noResultImage}
            />
            <View style={styles.noResultTextContainer}>
              <Text style={styles.noResultText}>
                No Doctors Found
              </Text>
            </View>
          </ScrollView>
        </View>
      );
    }
    
    return doctorData.map((doctor, index) => (
      <View key={`doctor-${doctor.id || index}`} style={styles.doctorCard}>
        <Text>{doctor.name}</Text>
        {/* TODO: Add other doctor info - profile picture, specialty, hospital, etc. */}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Section with Search Bar and Close Icon */}
      <View style={styles.searchHeaderContainer}>
        <View style={styles.searchBarContainer}>
          <Icon
            name="search"
            style={styles.searchIcon}
            size={24}
            color={COLORS.TEXT_GRAY}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search Doctor"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={location}
            onChangeText={handleLocationChange}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            Logger.debug('Close button pressed');
            navigation.goBack();
          }}
          activeOpacity={0.7}>
          <Text style={styles.crossIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Location Filter Section */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.7}>
          <MaterialIcons
            name="my-location"
            style={styles.locationIcon}
            size={24}
            color={COLORS.PRIMARY}
          />
          <Text style={styles.locationText}>
            Use Current Location
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.dropdownHeader}>Search Results</Text>
        
        {/* TODO: Replace with actual location search results from API */}
        <FlatList
          data={['Location 1', 'Location 2', 'Location 3']}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                Logger.debug('Location selected', { location: item });
                setLocation(item);
                // TODO: Trigger doctor search with selected location
              }}
              activeOpacity={0.7}>
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `location-${index}`}
        />
      </View>

      {/* Doctor Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={`category-${category}-${index}`}
            onPress={() => handleCategorySelect(category)}
            style={[
              styles.categoryItem,
              selectedCategory === category && styles.selectedCategoryItem,
            ]}
            activeOpacity={0.7}>
            <Text
              style={
                selectedCategory === category
                  ? styles.selectedCategoryText
                  : styles.categoryText
              }>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctor Cards Section */}
      <View style={styles.doctorCardContainer}>
        {renderDoctorCard()}
      </View>
    </ScrollView>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_WHITE,
    padding: 10,
    height: '100%',
  },
  searchHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 1,
    maxWidth: '90%',
    height: 50,
  },
  searchIcon: {
    marginLeft: 5,
  },
  searchBar: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Regular',
  },
  crossIcon: {
    marginLeft: 10,
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownItem: {
    margin: 10,
    paddingVertical: 20,
    borderBottomColor: COLORS.BORDER_LIGHT,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationIcon: {
    marginLeft: 5,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Medium',
  },
  dropdownHeader: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-SemiBold',
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Regular',
  },
  categoryFilter: {
    marginVertical: 10,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 20,
    marginHorizontal: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.PRIMARY,
  },
  categoryText: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Medium',
  },
  selectedCategoryText: {
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Poppins-SemiBold',
  },
  doctorCardContainer: {
    marginTop: 20,
  },
  doctorCard: {
    padding: 20,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 10,
    marginBottom: 10,
  },
  noResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noResultImage: {
    // Image styling
  },
  noResultTextContainer: {
    margin: 20,
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Black',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default SearchDoctorScreen;
