/**
 * ============================================================================
 * REUSABLE COMPONENT: Global Loading Indicator
 * ============================================================================
 * 
 * LOADER COMPONENT:
 * This component provides a simple, reusable loading indicator
 * that can be used throughout the entire application.
 * 
 * USAGE:
 * {isLoading ? <CustomLoader /> : <Content />}
 * 
 * FEATURES:
 * - Consistent loading UI across all screens
 * - Non-intrusive loading indicator
 * - Themed color (#E72B4A - brand color)
 * 
 * REUSABILITY: ✅ YES
 * - Used throughout entire application
 * - Single source of truth for loading states
 * - Consistent user experience
 * 
 * SECURITY:
 * - No security implications
 * - Pure UI component
 * 
 * @module CustomLoader
 */

import {View, Text} from 'react-native';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';

/**
 * CustomLoader - Reusable Loading Indicator
 * 
 * Displays a simple spinner during async operations
 * 
 * @returns {JSX.Element} Loading indicator component
 * 
 * @example
 * const [loading, setLoading] = useState(true);
 * return loading ? <CustomLoader /> : <Content />;
 */
const CustomLoader = () => {
  return (
    <View>
      {/* LOADER: Simple spinner indicator */}
      <ActivityIndicator size={180} color="#E72B4A" />
    </View>
  );
};

export default CustomLoader;
