// SearchDoctorScreen.js
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

const SearchDoctorScreen = ({navigation}) => {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [doctorData, setDoctorData] = useState([]); // Example doctor data

  const categories = [
    'All',
    'Dentist',
    'Neurologist',
    'Orthopedics',
    'Gynecologist',
  ];

  const renderDoctorCard = () => {
    if (doctorData.length === 0) {
      return (
        <View style={styles.noResultContainer}>
          <ScrollView>
            <Image
              source={require('../../../../assets/images/doctorSearchImg.png')} // Replace with your no-result image path
              style={styles.noResultImage}
            />
            <View style={{margin: 20, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Black',
                }}>
                No Doctors Found
              </Text>
            </View>
          </ScrollView>
        </View>
      );
    }
    return doctorData.map((doctor, index) => (
      <View key={index} style={styles.doctorCard}>
        <Text>{doctor.name}</Text>
        {/* Add other doctor info */}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Section with Search Bar and Cross Icon */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View style={styles.searchBarContainer}>
          <Icon name="search" style={{marginLeft: 5}} size={24} color="#999" />
          <TextInput
            style={styles.searchBar}
            placeholder="Search Doctor"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.crossIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown for Location Filter */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownItem}>
          <MaterialIcons
            name="my-location"
            style={{marginLeft: 5}}
            size={24}
            color="#E72B4A"
          />
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#313033'}}>
            Use Current Location
          </Text>
        </TouchableOpacity>
        <Text style={styles.dropdownHeader}>Search Results</Text>
        {/* Render Location Results */}
        {/* Example: */}
        <FlatList
          data={['Location 1', 'Location 2', 'Location 3']}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.dropdownItem}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Doctor Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryItem,
              selectedCategory === category && styles.selectedCategoryItem,
            ]}>
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
      <View style={styles.doctorCardContainer}>{renderDoctorCard()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    height: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    flex: 1,
    maxWidth: '90%',
    height: 50,
  },
  searchBar: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  crossIcon: {
    marginLeft: 10,
    fontSize: 24,
    color: '#313033',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownItem: {
    margin: 10,
    paddingVertical: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dropdownHeader: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  categoryFilter: {
    marginVertical: 10,
  },
  categoryItem: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategoryItem: {
    backgroundColor: '#E72B4A',
  },
  categoryText: {
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  doctorCardContainer: {
    marginTop: 20,
  },
  doctorCard: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  noResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noResultImage: {
    // width: 250,
    // height: 250,
  },
});

export default SearchDoctorScreen;
