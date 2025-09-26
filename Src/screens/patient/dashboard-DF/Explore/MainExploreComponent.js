import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StaticDisplayCard from './StaticDisplayCard';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import DoctorCard from '../../../../components/customCards/doctorCard/DoctorCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../../../utils/axiosInstance';
import {baseUrl} from '../../../../utils/baseUrl';
import SkeletonLoader from '../../../../components/customSkeleton/SkeletonLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useCommon} from '../../../../Store/CommonContext';
export default function MainExploreComponent({
  popularCards,
  featuredcard,
  nearmeCards,
  loading,
  Featuredloading,
  handleNavigateDoctor,
  handleNavigateHCF,
  hcf,
}) {
  const navigation = useNavigation();
  const {
    dept,
    setDept,
    activeTab,
    setActiveTab,
    doctorDepartmentsCache,
    setDoctorDepartmentsCache,
    categoriesDoctor,
    setCategoriesDoctor,
    fetchDoctorDepartments,
  } = useCommon();
console.log("hcfdataaa",hcf)
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={{gap: 10}}>
        <StaticDisplayCard />

        <View style={{marginBottom: 0}}>
          <InAppHeader LftHdr="Popular" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}>
            {loading ? (
              Array.from({length: 3}).map((_, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'column',
                    gap: 10,
                    backgroundColor: '#F0F0F0',
                    padding: 10,
                    borderRadius: 10,
                    height: hp(18),
                    width: wp(95),
                  }}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <SkeletonLoader width={85} height={90} borderRadius={10} />
                    <View style={{flexDirection: 'column', gap: 10}}>
                      <SkeletonLoader
                        width={150}
                        height={20}
                        borderRadius={10}
                      />
                      <SkeletonLoader
                        width={150}
                        height={20}
                        borderRadius={10}
                      />
                    </View>
                  </View>
                </View>
              ))
            ) : popularCards?.length > 0 ? (
              popularCards?.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={i}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid,"doctor")}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital_org}
                  reviewstar={
                    item?.average_review == 1
                      ? 1
                      : item?.average_review == 2
                      ? 2
                      : item?.average_review == 3
                      ? 3
                      : item?.average_review == 4
                      ? 4
                      : item?.average_review == 5
                      ? 5
                      : ''
                  }
                />
              ))
            ) : (
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={require('../../../../assets/NoAppointment.png')}
                  style={{
                    height: hp(10),
                    width: wp(40),
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              </View>
            )}
          </ScrollView>
        </View>

        <View style={{marginBottom: 0}}>
          <InAppHeader LftHdr="Featured" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}>
            {Featuredloading ? (
              Array.from({length: 3}).map((_, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'column',
                    gap: 10,
                    backgroundColor: '#F0F0F0',
                    padding: 10,
                    borderRadius: 10,
                    height: hp(18),
                    width: wp(95),
                  }}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <SkeletonLoader width={85} height={90} borderRadius={10} />
                    <View style={{flexDirection: 'column', gap: 10}}>
                      <SkeletonLoader
                        width={150}
                        height={20}
                        borderRadius={10}
                      />
                      <SkeletonLoader
                        width={150}
                        height={20}
                        borderRadius={10}
                      />
                    </View>
                  </View>
                </View>
              ))
            ) : featuredcard?.length > 0 ? (
              featuredcard?.map((item, i) => (
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
                    item?.average_review == 1
                      ? 1
                      : item?.average_review == 2
                      ? 2
                      : item?.average_review == 3
                      ? 3
                      : item?.average_review == 4
                      ? 4
                      : item?.average_review == 5
                      ? 5
                      : ''
                  }
                />
              ))
            ) : (
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={require('../../../../assets/NoAppointment.png')}
                  style={{
                    height: hp(10),
                    width: wp(40),
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              </View>
            )}
          </ScrollView>
        </View>

        <View style={{marginBottom: 0}}>
          <InAppHeader LftHdr="Categories" btnYN={false} />
          <TopTabs
            borderwidth={1}
            bordercolor="#fff"
            data={dept?.map((item, i) => ({
              id: i,
              title: item.department_name,
            }))}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabfunc={fetchDoctorDepartments}
            funcstatus={true}
          />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}>
            {loading ? (
              <View
                style={{
                  flexDirection: 'column',
                  gap: 10,
                  backgroundColor: '#F0F0F0',
                  padding: 10,
                  borderRadius: 10,
                  height: hp(18),
                  width: wp(95),
                  marginTop: 10,
                }}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <SkeletonLoader
                    width={85}
                    height={90}
                    borderRadius={10}
                    style={styles.avatar}
                  />
                  <View style={{flexDirection: 'column', gap: 10}}>
                    <SkeletonLoader
                      width={wp(60)}
                      height={hp(3)}
                      borderRadius={10}
                      style={styles.avatar}
                    />
                    <SkeletonLoader
                      width={wp(60)}
                      height={hp(3)}
                      borderRadius={10}
                      style={styles.avatar}
                    />
                  </View>
                </View>
              </View>
            ) : categoriesDoctor?.length > 0 ? ( 
              categoriesDoctor.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={i}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid)}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital}
                  reviewstar={
                    item?.average_review
                      ? Math.min(5, Math.max(1, item?.average_review))
                      : ''
                  }
                />
              ))
            ) : (
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={require('../../../../assets/NoAppointment.png')}
                  style={{
                    height: hp(10),
                    width: wp(40),
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              </View>
            )}
          </ScrollView>
        </View>

        <View style={{marginBottom: 0}}>
          <InAppHeader LftHdr="Near you" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}>
            {loading ? (
              Array.from({length: 3}).map((_, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'column',
                    gap: 10,
                    backgroundColor: '#F0F0F0',
                    padding: 10,
                    borderRadius: 10,
                    height: hp(18),
                    width: wp(95),
                  }}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <SkeletonLoader width={85} height={90} borderRadius={10} />
                    <View style={{flexDirection: 'column', gap: 10}}>
                      <SkeletonLoader
                        width={150}
                        height={20}
                        borderRadius={10}
                      />
                      <SkeletonLoader
                        width={150}
                        height={20}
                        borderRadius={10}
                      />
                    </View>
                  </View>
                </View>
              ))
            ) : nearmeCards?.length > 0 ? (
              nearmeCards?.map((item, i) => (
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
                    item?.average_review == 1
                      ? 1
                      : item?.average_review == 2
                      ? 2
                      : item?.average_review == 3
                      ? 3
                      : item?.average_review == 4
                      ? 4
                      : item?.average_review == 5
                      ? 5
                      : ''
                  }
                />
              ))
            ) : (
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={require('../../../../assets/NoAppointment.png')}
                  style={{
                    height: hp(10),
                    width: wp(40),
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              </View>
            )}
          </ScrollView>
        </View>
        <View style={{marginBottom: 0}}>
          <InAppHeader LftHdr="Healthcare Facility" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}>
            {hcf?.length > 0 ? (
              hcf?.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={i}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateHCF(item?.suid)}
                  reviews={item?.review_name}
                  speciality={''}
                  hospital={item?.hospital_org}
                  reviewstar={
                    item?.average_review == 1
                      ? 1
                      : item?.average_review == 2
                      ? 2
                      : item?.average_review == 3
                      ? 3
                      : item?.average_review == 4
                      ? 4
                      : item?.average_review == 5
                      ? 5
                      : ''
                  }
                />
              ))
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  gap: 10,
                  backgroundColor: '#F0F0F0',
                  padding: 10,
                  borderRadius: 10,
                  height: hp(18),
                  width: wp(95),
                }}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <SkeletonLoader
                    width={85}
                    height={90}
                    borderRadius={10}
                    style={styles.avatar}
                  />
                  <View style={{flexDirection: 'column', gap: 10}}>
                    <SkeletonLoader
                      width={wp(60)}
                      height={hp(3)}
                      borderRadius={10}
                      style={styles.avatar}
                    />
                    <SkeletonLoader
                      width={wp(60)}
                      height={hp(3)}
                      borderRadius={10}
                      style={styles.avatar}
                    />
                  </View>
                </View>
                {/* <View style={{alignSelf: 'center'}}>
                <SkeletonLoader
                  width={wp(60)}
                  height={hp(5)}
                  borderRadius={30}
                  // style={{marginVertical:10}}
                />
              </View> */}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
