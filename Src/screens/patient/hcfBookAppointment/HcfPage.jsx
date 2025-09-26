import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import BookAppointmentCard from '../../../components/customCards/bookAppointment/BookAppointmentCard';
import CustomRatingBar from '../../../components/customRatingBar/CustomRatingBar';
import {doctorDetails} from '../../../utils/data';
import styles from '../../../components/customCards/doctorCard/DoctorCardStyle';
import InAppHeader from '../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomReviewCard from '../../../components/customReviewCard/CustomReviewCard';
import CustomEduLicAwardCard from '../../../components/customEdu-Licen-AwardCard/CustomEduLicAwardCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import SkeletonLoader from '../../../components/customSkeleton/SkeletonLoader';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import HcfDepartment from './Hcfdepartment/HcfDepartment';
import LabDepartments from './Hcfdepartment/LabDepartments';
const HfcPage = () => {
  const [activeTab, setActiveTab] = useState('About');

  const [isExpanded, setIsExpanded] = useState(false);
  const [doctorById, setDoctorrById] = useState({
    response: {},

    doctorLicense: [],
    doctorAwards: [],
    doctorExperience: [],
    doctorReviewData: [],
    doctorTotalconsultations: '',
    doctorTotalReviews: '',
    doctorAverageRating: '',
    doctorTotalExperience: '',
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const routes = useRoute();
  const {data} = routes.params;
console.log("hcfpage",data)
  const fetchHcfById = async () => {
    const suid = data.toString();
    try {
      const response = await axiosInstance.get(
        `patient/dashboardHcfdetailsbyId/${suid}`,
      );
      console.log('responsedata', response?.data?.response[0]);
      setDoctorrById({
        response: response?.data?.response[0],
      
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const fullText = doctorById?.response?.about;
  const truncateText = fullText?.slice(0, 200);

  const renderComponent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <>
            <View style={{padding: 19, gap: hp(0)}}>
              <Text
                style={{
                  fontSize: hp(2),
                  color: '#313033',
                  fontFamily: 'Poppins-SemiBold',
                }}>
                About Me
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    fontSize: hp(1.6),
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'justify',
                    color: '#AEAAAE',
                  }}>
                  {isExpanded ? fullText : truncateText}
                </Text>
                <Text onPress={toggleText} style={{color: '#E72B4A'}}>
                  {isExpanded ? ' Show less' : ' Show more'}
                </Text>
              </View>
            </View>

            <View>

              <CustomReviewCard reviwes={doctorById?.doctorReviewData} />
             
            </View>
          </>
        );
      case 'Department':
        return <HcfDepartment hcfid={data}/>;
      case 'Labs':
        return <LabDepartments />;
      default:
        return null;
    }
  };
  useEffect(() => {
    fetchHcfById();
  }, [data.toString()]);

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={true}
          notificationUserIcon={true}
          id={5}
        />
      </View>
      {loading ? (
        <>
          <View
            style={{
              flexDirection: 'column',
              gap: 10,
              backgroundColor: '#F0F0F0',
              padding: 10,
              borderRadius: 10,
              height: hp(100),
            }}>
            <SkeletonLoader
              width={wp(95)}
              height={hp(30)}
              borderRadius={10}
              // style={styles.avatar}
            />
            <SkeletonLoader
              width={wp(95)}
              height={hp(20)}
              borderRadius={10}
              // style={styles.avatar}
            />
            <SkeletonLoader
              width={wp(95)}
              height={hp(20)}
              borderRadius={10}
              // style={styles.avatar}
            />
            <SkeletonLoader
              width={wp(95)}
              height={hp(20)}
              borderRadius={10}
              // style={styles.avatar}
            />
          </View>
        </>
      ) : (
        <SafeAreaView style={{backgroundColor: '#fff'}}>
          <View>
            <BookAppointmentCard
              profile_picture={doctorById?.response?.profile_picture}
              firstname={doctorById?.response?.first_name}
              middlename={doctorById?.response?.middle_name}
              lastname={doctorById?.response?.last_name}
              dspecaility={doctorById?.response?.department_name}
              hospital={doctorById?.response?.hospital_org}
              day={doctorById?.response?.service_day_from}
              time={doctorById?.response?.service_day_to}
              showbtn={false}
              // onClick={() => handleBookAppointment(doctorById?.response?.doctor_id)}
            />
          </View>
          <View>
            <View style={{height: 2, backgroundColor: '#E6E1E5'}}></View>
          </View>
          <View style={{gap: 10}}>
           
            <View style={{padding: 10, gap: hp(0)}}>
              <TopTabs
                bordercolor={'#fff'}
                data={[
                  {id: 1, title: 'About'},
                  {id: 1, title: 'Department'},
                  {id: 1, title: 'Labs'},
                ]}
                borderwidth={1}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                // tabfunc={{}}
                funcstatus={false}
              />
            </View>

            <View>{renderComponent()}</View>
           
          </View>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};

export default HfcPage;
