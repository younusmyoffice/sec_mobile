/**
 * ============================================================================
 * DESIGN SYSTEM: Application Color Constants
 * ============================================================================
 * 
 * PURPOSE:
 * Centralized color definitions for consistent theming across the application
 * 
 * USAGE:
 * import { COLORS } from '../constants/colors';
 * 
 * color: COLORS.PRIMARY
 * 
 * @module colors
 */

export const COLORS = {
  // Primary brand colors
  PRIMARY: '#E72B4A',           // Main brand red
  PRIMARY_DARK: '#C71F3A',      // Darker shade for hover/pressed states
  PRIMARY_LIGHT: '#FF5C7A',     // Lighter shade for backgrounds
  
  // Secondary colors
  SECONDARY: '#331003',         // Dark brown text
  SECONDARY_LIGHT: '#484649',   // Gray text
  
  // Status colors
  SUCCESS: '#4CAF50',           // Green for success states
  ERROR: '#F44336',             // Red for error states
  WARNING: '#FF9800',           // Orange for warnings
  INFO: '#2196F3',              // Blue for info messages
  
  // Neutral colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_LIGHT: '#F0F0F0',        // Light gray backgrounds
  GRAY_MEDIUM: '#CCCCCC',       // Medium gray borders
  GRAY_DARK: '#666666',         // Dark gray text
  GRAY_TEXT: '#939094',         // Secondary text color
  
  // Border colors
  BORDER_LIGHT: '#E6E1E5',      // Light borders
  BORDER_DARK: '#000000',       // Dark borders
  
  // Background colors
  BG_WHITE: '#FFFFFF',
  BG_LIGHT: '#F0F0F0',
  
  // Text colors
  TEXT_PRIMARY: '#331003',      // Primary text
  TEXT_SECONDARY: '#484649',    // Secondary text
  TEXT_GRAY: '#939094',         // Gray text
  TEXT_WHITE: '#FFFFFF',        // White text
};

export default COLORS;

