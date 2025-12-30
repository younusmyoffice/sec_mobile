/**
 * ============================================================================
 * STATIC DISPLAY CARD
 * ============================================================================
 * 
 * PURPOSE:
 * Static promotional cards displayed horizontally in the Explore section.
 * Displays marketing messages and call-to-action buttons.
 * 
 * FEATURES:
 * - Horizontal scrollable promotional cards
 * - Marketing text and images
 * - "Book Now" call-to-action buttons
 * 
 * SECURITY:
 * - No API calls or user input
 * - Static content only
 * 
 * REUSABLE COMPONENTS:
 * - Header: App header component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * - Responsive width using Dimensions
 * 
 * @module StaticDisplayCard
 */

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../../../../components/customComponents/Header/Header';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const {width} = Dimensions.get('window');

export default function StaticDisplayCard() {
  Logger.debug('StaticDisplayCard rendered', { screenWidth: width });

  /**
   * Handle Book Now button press
   * TODO: Navigate to booking screen when functionality is implemented
   */
  const handleBookNow = () => {
    Logger.debug('Book Now button pressed');
    // TODO: Implement navigation to booking screen
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        {/* Card 1: Health Control */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                Take control of your health with our user-friendly health care
                app.
              </Text>
              <TouchableOpacity 
                style={styles.bookNowButton}
                onPress={handleBookNow}
                activeOpacity={0.7}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/CardDoctor1.png')}
                style={styles.image}
              />
            </View>
          </View>
        </View>

        {/* Card 2: Health Reports */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                All your health related report at one place.
              </Text>
              <TouchableOpacity 
                style={styles.bookNowButton}
                onPress={handleBookNow}
                activeOpacity={0.7}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/CardDoctor2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </View>

        {/* Card 3: Health Reports (duplicate) */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                All your health related report at one place.
              </Text>
              <TouchableOpacity 
                style={styles.bookNowButton}
                onPress={handleBookNow}
                activeOpacity={0.7}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/CardDoctor2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 20,
    height: 180,
    width: width * 0.86, // Card width as 86% of screen width
    marginHorizontal: 10,
    marginVertical: 15,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 7,
    paddingRight: 10,
  },
  cardText: {
    fontSize: hp(2),
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingTop: 20,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-SemiBold',
  },
  bookNowButton: {
    marginTop: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Medium',
  },
  imageContainer: {
    flex: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
