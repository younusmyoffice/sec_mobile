import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React from 'react';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import {useCommon} from '../../../../Store/CommonContext';
import DoctorCard from '../../../../components/customCards/doctorCard/DoctorCard';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SkeletonLoader from '../../../../components/customSkeleton/SkeletonLoader';
const HcfDepartment = ({hcfid}) => {

  const navigation = useNavigation();

  const {
    dept,
    activeTab,
    setActiveTab,
    fetchHcfDoctorDepartments,
    HcfcategoriesDoctor,
    hcfLoading,
  } = useCommon();
console.log("hcfunderdept",hcfid)
  const handleNavigateDoctor = (item,mode,hcfid) => {
    console.log('mode', hcfid);
    navigation.navigate('DoctorBookAppointment', {data: item.toString(),mode:mode,hcfid:hcfid});
  };
  console.log("HcfcategoriesDoctor",HcfcategoriesDoctor)

  return (
    <View style={{padding: 15}}>
      <TopTabs
        borderwidth={1}
        bordercolor="#fff"
        data={dept?.map((item, i) => ({
          id: i,
          title: item.department_name,
        }))}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabfunc={fetchHcfDoctorDepartments}
        funcstatus={true}
      />
      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}>
          {hcfLoading ? ( // Show Skeleton Loader while fetching
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
                <SkeletonLoader width={85} height={90} borderRadius={10} />
                <View style={{flexDirection: 'column', gap: 10}}>
                  <SkeletonLoader
                    width={wp(60)}
                    height={hp(3)}
                    borderRadius={10}
                  />
                  <SkeletonLoader
                    width={wp(60)}
                    height={hp(3)}
                    borderRadius={10}
                  />
                </View>
              </View>
            </View>
          ) : HcfcategoriesDoctor?.length > 0 ? ( // Show Doctor Cards if data exists
            HcfcategoriesDoctor.map((item, i) => (
              <DoctorCard
                key={i}
                profile_picture={item?.profile_picture}
                firstname={item?.first_name}
                middlename={item?.middle_name}
                lastname={item?.last_name}
                onClick={() => handleNavigateDoctor(item?.suid,"hcf",hcfid)}
                reviews={item?.review_name}
                speciality={item?.department_name}
                hospital={item?.qualification}
                reviewstar={
                  item?.average_review
                    ? Math.min(5, Math.max(1, item?.average_review))
                    : ''
                }
              />
            ))
          ) : (
            // Show "No Doctors Available" if no data exists after loading
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
    </View>
  );
};

export default HcfDepartment;
const styles = StyleSheet.create({});
