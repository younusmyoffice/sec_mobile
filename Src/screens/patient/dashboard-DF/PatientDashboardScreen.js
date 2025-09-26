import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Header from '../../../components/customComponents/Header/Header';
import FreeTrailHeader from '../../../components/customComponents/FreetrailHeader/FreeTrailHeader';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import MainExploreComponent from './Explore/MainExploreComponent';
import MyActivity from './MyActivities/MyActivity';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DoctorPage from '../doctorBookAppointmnet/DoctorPage';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import ExampleForm from '../../../components/customInputs/ExampleForm';
import axiosInstance from '../../../utils/axiosInstance';
import {baseUrl} from '../../../utils/baseUrl';
import {useCommon} from '../../../Store/CommonContext';
import {useLoc} from '../../../Store/LocationContext';

const Stack = createNativeStackNavigator();

export default function PatientDashboardScreen() {
  const {userId} = useCommon();
  const {postalCodes} = useLoc();
  const [activeTab, setActiveTab] = useState('Explore');

  const [loading, setLoading] = useState(true);
  const [Featuredloading, setFeaturedLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);
  // const [appointmentData, setAppointmentData] = useState();
  const [cacheData, setCacheData] = useState({
    popularCards: null,
    featuredcard: null,
    nearmeCards: null,
    appointmentData: null,
    Hcf: null,
    lastPostalCodes: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleNavigateDoctor = item => {
    console.log('ids', item);
    navigation.navigate('DoctorBookAppointment', {data: item.toString()});
  };
  const handleNavigateHCF = item => {
    console.log('hcfid under handle navigate', item);
    navigation.navigate('HcfPage', {data: item.toString()});
  };
  const fetchappointment = async () => {
    if (cacheData.appointmentData) return;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `patient/patientActivity/${userId}`,
      );
      // setAppointmentData(response?.data?.response);
      setCacheData(prev => ({
        ...prev,
        appointmentData: response?.data?.response,
      }));
      // console.log("")
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  console.log('appoint', cacheData?.appointmentData);
  const allAppointments = useMemo(() => {
    return showFull
      ? cacheData?.appointmentData
      : cacheData?.appointmentData?.slice(0, 2);
  }, [showFull, cacheData.appointmentData]);

  console.log('appointmentdata', allAppointments);

  const fetchPopular = async postalCodes => {
    console.log('Recalled with postalCodes:', postalCodes);

    // Prevent fetching if data for the same postal codes is already in cache
    if (cacheData.popularCards && cacheData.lastPostalCodes === postalCodes)
      return;

    console.log('Fetching popular doctors...');

    try {
      const response = await axiosInstance.post(
        `${baseUrl}patient/doctor/populardoctors`,
        {
          zipcodes: postalCodes,
          page: 1,
          limit: 5,
        },
      );
      console.log('Fetched popular doctors:', response.data.response);

      // Update cache with new data and store last used postal codes
      setCacheData(prev => ({
        ...prev,
        popularCards: response?.data?.response,
        lastPostalCodes: postalCodes,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async postalCodes => {
    if (cacheData.featuredcard && cacheData.lastPostalCodes === postalCodes)
      return;
    try {
      const response = await axiosInstance.post(
        `${baseUrl}patient/doctor/featureddoctors`,
        {
          zipcodes: postalCodes,
          page: 1,
          limit: 5,
        },
      );
      console.log(response.data.response);
      // setFeaturedCards(response.data.response);
      setCacheData(prev => ({
        ...prev,
        featuredcard: response?.data?.response,
      }));
      setFeaturedLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFeaturedLoading(false);
    }
  };
  const fetchNearYou = async postalCodes => {
    if (cacheData.nearmeCards && cacheData.lastPostalCodes === postalCodes)
      return;
    try {
      const response = await axiosInstance.post(
        `${baseUrl}patient/doctornearme`,
        {
          zipcodes: postalCodes,
          type: 'Excellent',

          page: 1,
          limit: 5,
        },
      );
      console.log(response.data.response);
      // setNearMeCards(response.data.response);
      setCacheData(prev => ({
        ...prev,
        nearmeCards: response?.data?.response,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchHCF = async () => {
    if (cacheData.Hcf) return;
    console.log('caling hcf');
    try {
      const response = await axiosInstance.get(
        `${baseUrl}patient/DashboardHcfdetails?page=1&limit=5`,
      );
      console.log('hcf', response.data.response);
      // setNearMeCards(response.data.response);
      setCacheData(prev => ({
        ...prev,
        Hcf: response?.data?.response,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'Explore') {
      fetchPopular(postalCodes);
      fetchFeatured(postalCodes);
      fetchNearYou(postalCodes);
      fetchHCF();
    } else {
      fetchappointment();
    }
  }, [activeTab, postalCodes]);
  // useEffect(() => {
  //   console.log('Updated cacheData:', cacheData);
  // }, [cacheData]);
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <Header
        logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
        locationIcon={false}
        showLocationMark={true}
        notificationUserIcon={true}
        id={5}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff'}}>
        {/* <FreeTrailHeader /> */}
        <View style={{padding: 10, backgroundColor: '#fff'}}>
          <TopTabs
            bordercolor="#fff"
            borderwidth={1}
            data={[{title: 'Explore'}, {title: 'My Activity'}]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <View style={{marginTop: 10}}>
            {activeTab === 'Explore' ? (
              <MainExploreComponent
                popularCards={cacheData?.popularCards}
                featuredcard={cacheData?.featuredcard}
                nearmeCards={cacheData?.nearmeCards}
                hcf={cacheData?.Hcf}
                loading={loading}
                Featuredloading={Featuredloading}
                handleNavigateDoctor={item => handleNavigateDoctor(item)}
                handleNavigateHCF={item => handleNavigateHCF(item)}
              />
            ) : (
              <MyActivity
                // appointmentData={allAppointments}
                isLoading={isLoading}
                showFull={showFull}
                allAppointments={allAppointments}
                setShowFull={setShowFull}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    //     )}
    //   </Stack.Screen>
    // </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
