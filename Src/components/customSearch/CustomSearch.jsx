import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './CustomSearchStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const CustomSearch = ({
  placeholder = 'Search here',
  onSearch,
  visible,
  placeholderTextColor,
  showIcon,
  showmenuIcon,
  elevation,
  handleInputChange,
  query,
  load,
}) => {
  // const [query, setQuery] = useState('');

  // const handleInputChange = text => {
  //   setQuery(text);
  // };

  //   const clearSearch = () => {
  //     setQuery('');
  //   };

  return (
    <SafeAreaView style={styles.mainBox}>
      <View style={[styles.searchContainer, {elevation: elevation}]}>
        <MaterialCommunityIcons
          name="search"
          size={20}
          color={placeholderTextColor}
        />
        <TextInput
          value={query}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={{
            flex: 1,
            paddingLeft: 10,
            // fontSize: 16,
            color: '#333',
            fontFamily: 'Poppins-SemiBold',
          }}
          returnKeyType="search"
          onSubmitEditing={() => onSearch(query)}
        />
        {load && <ActivityIndicator size={20} color={'#E72B4A'} />}
      </View>
      <View>
        {/* onPress={clearSearch} */}
        {showIcon ? (
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="search"
              size={20}
              color={placeholderTextColor}
            />
          </TouchableOpacity>
        ) : null}
        {showmenuIcon ? (
          <View
            style={{
              borderWidth: 1.5,
              padding: 10,
              borderRadius: 50,
              borderColor: '#E6E1E5',
              // position: 'relative',
              height: hp(4.5),
              width: wp(10),
            }}>
            <TouchableOpacity style={{alignSelf: 'center'}}>
              <MaterialCommunityIcons
                name="kebab-horizontal"
                size={15}
                color="#AEAAAE"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CustomSearch;
