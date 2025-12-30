import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {baseUrl} from '../../utils/baseUrl';
import {validateField} from './FormValidation';
import styles from './CustomInputsStyle';

// Function to get flag emoji from ISO2 country code
const getFlagEmoji = (iso2) => {
  if (!iso2 || iso2.length !== 2) return '🏳️';
  
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  
  return String.fromCodePoint(...codePoints);
};

const CombinedMobileInput = ({
  label = 'Mobile Number',
  dialingCodeValue,
  mobileValue,
  onDialingCodeChange,
  onMobileChange,
  onValidationChange,
  fontSize = 16,
  fontFamily = 'Poppins-Medium',
  disabled = false,
}) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialingCodeError, setDialingCodeError] = useState('');
  const [mobileError, setMobileError] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      // console.log('🌍 Fetching countries from:', `${baseUrl}countries/codes`);
      const response = await axios.get(`${baseUrl}countries/codes`);
      // console.log('📡 API Response received:', response.data);
      
      // Transform the API response into dropdown format
      const countriesList = Object.values(response.data.response).map(country => {
        const flag = getFlagEmoji(country.iso2);
        return {
          label: `${flag}  +${country.dialCode} ${country.name}`,
          value: country.dialCode,
          countryName: country.name,
          iso2: country.iso2,
          flag: flag,
        };
      });
      
      // console.log("Total countries loaded:", countriesList.length);
      // Sort countries alphabetically by name
      countriesList.sort((a, b) => a.countryName.localeCompare(b.countryName));
      
      setCountries(countriesList);
      setError(null);
      // console.log('✅ Countries set successfully. Count:', countriesList.length);
      // console.log('📋 First 5 countries:', countriesList.slice(0, 5));
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Failed to load countries');
      
      // Fallback data with common countries names
      const fallbackCountries = [
        {label: `${getFlagEmoji('in')} India (+91)`, value: '91', countryName: 'India', iso2: 'in', flag: getFlagEmoji('in')},
        {label: `${getFlagEmoji('us')} United States (+1)`, value: '1', countryName: 'United States', iso2: 'us', flag: getFlagEmoji('us')},
        {label: `${getFlagEmoji('gb')} United Kingdom (+44)`, value: '44', countryName: 'United Kingdom', iso2: 'gb', flag: getFlagEmoji('gb')},
        {label: `${getFlagEmoji('ca')} Canada (+1)`, value: '1', countryName: 'Canada', iso2: 'ca', flag: getFlagEmoji('ca')},
        {label: `${getFlagEmoji('au')} Australia (+61)`, value: '61', countryName: 'Australia', iso2: 'au', flag: getFlagEmoji('au')},
        {label: `${getFlagEmoji('de')} Germany (+49)`, value: '49', countryName: 'Germany', iso2: 'de', flag: getFlagEmoji('de')},
        {label: `${getFlagEmoji('fr')} France (+33)`, value: '33', countryName: 'France', iso2: 'fr', flag: getFlagEmoji('fr')},
        {label: `${getFlagEmoji('jp')} Japan (+81)`, value: '81', countryName: 'Japan', iso2: 'jp', flag: getFlagEmoji('jp')},
        {label: `${getFlagEmoji('cn')} China (+86)`, value: '86', countryName: 'China', iso2: 'cn', flag: getFlagEmoji('cn')},
        {label: `${getFlagEmoji('br')} Brazil (+55)`, value: '55', countryName: 'Brazil', iso2: 'br', flag: getFlagEmoji('br')},
      ];
      setCountries(fallbackCountries);
    } finally {
      setLoading(false);
    }
  };

  const handleDialingCodeChange = (item) => {
    onDialingCodeChange('dialing_code', item.value);
    const error = validateField('dialing_code', item.value);
    setDialingCodeError(error);
    onValidationChange && onValidationChange('dialing_code', error);
  };

  const handleMobileChange = (text) => {
    // Only allow numbers and limit to 10 digits
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 10);
    onMobileChange('mobile', formattedText);
    const error = validateField('mobile', formattedText);
    setMobileError(error);
    onValidationChange && onValidationChange('mobile', error);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.label, {fontSize, fontFamily}]}>{label}</Text>
        <View style={[styles.combinedInputContainer, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#E72B4A" />
          <Text style={[styles.loadingText, {fontSize, fontFamily}]}>Loading countries...</Text>
        </View>
      </View>
    );
  }

  // console.log('🎯 Rendering CombinedMobileInput. Countries count:', countries.length);
  // console.log('🎯 Loading state:', loading);
  // console.log('🎯 Error state:', error);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {fontSize, fontFamily}]}>{label}</Text>
      
      <View style={styles.combinedInputContainer}>
        {/* Dialing Code Dropdown */}
        <View style={styles.dialingCodeContainer}>
          <Dropdown
            style={[
              styles.dialingCodeDropdown,
              {
                borderColor: dialingCodeError ? '#FF6B6B' : '#AEAAAE',
                backgroundColor: disabled ? '#F5F5F5' : 'white',
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 8,
              },
            ]}
            selectedTextStyle={{
              fontSize: fontSize,
              fontFamily: fontFamily,
              paddingHorizontal: 8,
              color: disabled ? 'gray' : 'black',
            }}
            inputSearchStyle={{
              height: 40,
              fontSize: 16,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#E72B4A',
            }}
            iconStyle={{
              width: 20,
              height: 20,
              marginRight: 5,
            }}
            data={countries}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Country"
            placeholderStyle={{
              fontSize: fontSize,
              paddingHorizontal: 8,
              color: '#AEAAAE',
            }}
            itemTextStyle={{
              fontSize: 14,
              color: 'black',
              fontFamily: fontFamily,
              paddingVertical: 5,
            }}
            searchPlaceholder="Search countries..."
            value={dialingCodeValue}
            onChange={handleDialingCodeChange}
            disable={disabled}
            search
            searchField="countryName"
            renderRightIcon={() => (
              <View style={styles.rightIconContainer}>
                {error && <Text style={styles.errorIcon}>⚠️</Text>}
              </View>
            )}
          />
        </View>

        {/* Mobile Number Input */}
        <View style={styles.mobileInputContainer}>
          <TextInput
            value={mobileValue}
            onChangeText={handleMobileChange}
            placeholder="Mobile Number"
            placeholderTextColor={'#AEAAAE'}
            style={[
              styles.mobileInput,
              {
                fontSize: fontSize,
                color: disabled ? 'gray' : 'black',
                fontFamily: fontFamily,
                borderColor: mobileError ? '#FF6B6B' : '#AEAAAE',
              },
            ]}
            keyboardType="numeric"
            maxLength={10}
            editable={!disabled}
          />
        </View>
      </View>

      {/* Error Messages */}
      {(dialingCodeError || mobileError) && (
        <View style={styles.errorContainer}>
          {dialingCodeError && (
            <Text style={[styles.errorText, {fontSize: fontSize - 2, fontFamily}]}>
              {dialingCodeError}
            </Text>
          )}
          {mobileError && (
            <Text style={[styles.errorText, {fontSize: fontSize - 2, fontFamily}]}>
              {mobileError}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default CombinedMobileInput;
