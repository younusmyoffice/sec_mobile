import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {baseUrl} from '../../utils/baseUrl';
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

const DialingCodeDropdown = ({
  label,
  value,
  onChange,
  placeholder = 'Select Country',
  disabled = false,
  fontSize = 16,
  fontFamily = 'Poppins-Medium',
}) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}countries/codes`);
      
      // Transform the API response into dropdown format
      const countriesList = Object.values(response.data.response).map(country => {
        const flag = getFlagEmoji(country.iso2);
        return {
          label: `${flag} ${country.name} (+${country.dialCode})`,
          value: country.dialCode,
          countryName: country.name,
          iso2: country.iso2,
          flag: flag,
        };
      });

      // Sort countries alphabetically by name
      countriesList.sort((a, b) => a.countryName.localeCompare(b.countryName));
      
      setCountries(countriesList);
      setError(null);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Failed to load countries');
      
      // Fallback data with common countries
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

  const handleChange = (item) => {
    onChange('dialing_code', item.value);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.label, {fontSize, fontFamily}]}>{label}</Text>
        <View style={[styles.picker, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#E72B4A" />
          <Text style={[styles.loadingText, {fontSize, fontFamily}]}>Loading countries...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {fontSize, fontFamily}]}>{label}</Text>
      <Dropdown
        style={[
          styles.picker,
          {
            borderWidth: 1,
            borderRadius: 8,
            borderColor: error ? '#FF6B6B' : '#AEAAAE',
            backgroundColor: disabled ? '#F5F5F5' : 'white',
            borderBottomWidth: 1,
            borderBottomColor: error ? '#FF6B6B' : '#AEAAAE',
          },
        ]}
        selectedTextStyle={{
          fontSize: fontSize,
          fontFamily: fontFamily,
          paddingHorizontal: 8,
          color: disabled ? 'gray' : 'black',
        }}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={countries}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        placeholderStyle={{
          fontSize: fontSize,
          paddingHorizontal: 8,
          color: '#AEAAAE',
        }}
        itemTextStyle={{
          fontSize: fontSize,
          color: 'black',
          fontFamily: fontFamily,
        }}
        searchPlaceholder="Search countries..."
        value={value}
        onChange={handleChange}
        disable={disabled}
        renderRightIcon={() => (
          <View style={styles.rightIconContainer}>
            {error && <Text style={styles.errorIcon}>⚠️</Text>}
          </View>
        )}
      />
      {error && (
        <Text style={[styles.errorText, {fontSize: fontSize - 2, fontFamily}]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default DialingCodeDropdown;
