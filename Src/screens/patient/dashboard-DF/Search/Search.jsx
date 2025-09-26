import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomSearch from '../../../../components/customSearch/CustomSearch';
import axiosInstance from '../../../../utils/axiosInstance';
import DoctorCard from '../../../../components/customCards/doctorCard/DoctorCard';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import {useNavigation} from '@react-navigation/native';

const Search = () => {
  const navigation = useNavigation();
  const [featuredcard, setFeaturedCards] = useState([]);

  const [query, setQuery] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [load, setLoad] = useState(false);
  const handleNavigateDoctor = item => {
    console.log('ids', item);
    navigation.navigate('Home', {
      screen: 'DoctorBookAppointment',
      params: {data: item.toString()},
    });
  };
  const handleInputChange = text => {
    setQuery(text);
    if (text.trim() === '') {
      setLoad(false);
      setSearchedData([]);
    } else {
      setLoad(true);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    } else {
      setSearchedData([]);
    }
  }, [debouncedQuery]);

  const handleSearch = async searchQuery => {
    try {
      setLoad(true); // Start loading when search begins
      const response = await axiosInstance.get(
        `patient/getPatientSearchAPI/${searchQuery}`,
      );
      console.log('search', response.data.response);
      setSearchedData(
        Array.isArray(response.data.response) ? response.data.response : [],
      );
    } catch (e) {
      console.log(e);
      setSearchedData([]);
    } finally {
      setLoad(false); // Stop loading when search completes
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await axiosInstance.post(
        `patient/doctor/featureddoctors`,
        {
          zipcodes: ['560045', '560046', '560047'],
          page: 1,
          limit: 5,
        },
      );
      console.log(response.data.response);
      setFeaturedCards(response.data.response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: 'white', height: '100%'}}>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={{marginTop: 20, padding: 15}}>
          <CustomSearch
            placeholderTextColor={'black'}
            elevation={5}
            onSearch={handleSearch}
            handleInputChange={handleInputChange}
            query={query}
            load={load}
          />
        </View>
        <View style={{backgroundColor: 'white'}}>
          {searchedData?.length > 0 ? (
            searchedData?.map((item,i) => {
              return (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={i}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid)}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital_org}
                  reviewstar={
                    item?.review_id == 1
                      ? 1
                      : item?.review_id == 2
                      ? 2
                      : item?.review_id == 3
                      ? 3
                      : item?.review_id == 4
                      ? 4
                      : item?.review_id == 5
                      ? 5
                      : ''
                  }
                />
              );
            })
          ) : (
            <>
              {/* <InAppHeader LftHdr="Popular" btnYN={false} /> */}

              <ScrollView
                horizontal={false}
                contentContainerStyle={{gap: 10}}
                showsHorizontalScrollIndicator={false}>
                {featuredcard.map((item, i) => (
                  <DoctorCard
                    profile_picture={item?.profile_picture}
                    key={i}
                    firstname={item?.first_name}
                    middlename={item?.middle_name}
                    lastname={item?.last_name}
                    onClick={() => handleNavigateDoctor(item?.suid)}
                    reviews={item?.review_name}
                    speciality={item?.department_name}
                    hospital={item?.hospital_org}
                    reviewstar={
                      item?.review_id == 1
                        ? 1
                        : item?.review_id == 2
                        ? 2
                        : item?.review_id == 3
                        ? 3
                        : item?.review_id == 4
                        ? 4
                        : item?.review_id == 5
                        ? 5
                        : ''
                    }
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
