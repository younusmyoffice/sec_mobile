/**
 * ============================================================================
 * AUTHENTICATION STYLES
 * ============================================================================
 * 
 * PURPOSE:
 * Centralized styling for authentication screens (Login, Register, etc.).
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module AuthenticationStyle
 */

import {StyleSheet} from 'react-native';
import { COLORS } from '../constants/colors';

const authenticationStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 55,
    height: 'auto',
    gap: 15,
    justifyContent: 'center',
  },
  signUp: {
    fontSize: 25,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  logo: {
    height: 40,
    width: 200,
    resizeMode: 'contain',
  },
  inputs: {
    padding: 15,
    gap: 10,
  },
  forgot: {
    fontSize: 19,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
  pinCodeContainer: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    width: 50,
    borderColor: COLORS.TEXT_PRIMARY,
  },
  pinCodeText: {
    color: COLORS.PRIMARY,
  },
  focusedPinCodeContainerStyle: {
    borderColor: COLORS.PRIMARY,
  },
  focusStick: {
    backgroundColor: COLORS.PRIMARY,
  },
});

export default authenticationStyle;
