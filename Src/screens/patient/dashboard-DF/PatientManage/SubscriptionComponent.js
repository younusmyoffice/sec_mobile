/**
 * ============================================================================
 * SUBSCRIPTION COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display patient subscription plan details and upgrade functionality.
 * 
 * FEATURES:
 * - Display subscription status (Active)
 * - Expiry date display
 * - Plan details and features
 * - Upgrade button
 * 
 * SECURITY:
 * - No direct API calls (component ready for subscription API integration)
 * 
 * REUSABLE COMPONENTS:
 * - CustomButton: Action button for upgrade
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * NOTE:
 * This is a static component currently. API integration should be added
 * for fetching subscription data and handling upgrade functionality.
 * 
 * @module SubscriptionComponent
 */

import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import CustomButton from '../../../../components/customButton/CustomButton';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const image = require('../../../../assets/images/SubscriptionBg.png');

export default function SubscriptionComponent() {
  Logger.debug('SubscriptionComponent rendered');

  /**
   * Handle upgrade button press
   * TODO: Navigate to subscription/upgrade screen when functionality is implemented
   */
  const handleUpgrade = () => {
    Logger.debug('Upgrade button pressed');
    // TODO: Implement navigation to upgrade/subscription screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ImageBackground
          source={image}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.statusContainer}>
            <View style={styles.statusButtonContainer}>
              <CustomButton
                borderRadius={30}
                borderWidth={1}
                bgColor={COLORS.PRIMARY_LIGHT}
                textColor={COLORS.PRIMARY}
                borderColor={COLORS.PRIMARY}
                title={'Active'}
              />
            </View>
            <Text style={styles.expireDateText}>
              Expire Date : 20-02-2025
            </Text>
          </View>
          
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>
              Basic Plan
            </Text>
            <View style={styles.featuresContainer}>
              <Text style={styles.featureText}>* Feature 1</Text>
              <Text style={styles.featureText}>* Feature 2</Text>
              <Text style={styles.featureText}>* Feature 3</Text>
            </View>
          </View>

          <Image
            source={require('../../../../assets/images/subimage.png')}
            style={styles.planImage}
          />
        </ImageBackground>
        
        <View style={styles.upgradeButtonContainer}>
          <CustomButton
            borderRadius={30}
            borderWidth={1}
            bgColor={COLORS.PRIMARY}
            textColor={COLORS.TEXT_WHITE}
            borderColor={COLORS.PRIMARY}
            title={'Upgrade'}
            onPress={handleUpgrade}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    height: 414,
    width: 309,
    alignItems: 'center',
    marginBottom: 40,
  },
  statusContainer: {
    paddingTop: 20,
    left: -10,
  },
  statusButtonContainer: {
    width: 150,
    marginBottom: 10,
  },
  expireDateText: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  planContainer: {
    right: 70,
    top: 0,
  },
  planTitle: {
    fontSize: 22,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-SemiBold',
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 2,
  },
  planImage: {
    width: 244,
    height: 184,
    resizeMode: 'stretch',
    left: 32,
    top: 13,
  },
  upgradeButtonContainer: {
    bottom: 0,
    marginTop: 20,
  },
});
