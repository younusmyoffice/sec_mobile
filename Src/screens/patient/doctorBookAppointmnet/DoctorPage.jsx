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
const DoctorPage = () => {

  const routes = useRoute();
const{mode}=routes.params;
console.log("mode in doctore page",mode)
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

  const {data,hcfid} = routes.params;
console.log("data",hcfid)
  const fetchDoctorById = async () => {
    try {
      const response = await axiosInstance.post(
        `patient/DashboardDoctordetailsbyId`,
        {suid: data.toString()},
      );
      console.log('responsedata', response?.data?.response);
      setDoctorrById({
        response: response?.data?.response,
        doctorLicense: response?.data?.doctorLicense,
        doctorAwards: response?.data?.doctorAwards,
        doctorExperience: response?.data?.doctorExperience,
        doctorReviewData: response?.data?.doctorReviewData,

        doctorAverageRating: response?.data?.doctorAverageRating,
        doctorTotalconsultations: response?.data?.doctorTotalconsultations,
        doctorTotalReviews: response?.data?.doctorTotalReviews,
        doctorTotalExperience: response?.data?.doctorTotalExperience,

      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log('doctoridstate', doctorById);
  console.log('doctor id', typeof data);
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const fullText = doctorById?.response?.description;
  const truncateText = fullText?.slice(0, 200);
  const handleBookAppointment = doctor_id => {
    // console.log(item)
    navigation.navigate('BookAppointment', {hcf_id:hcfid,doctorid: doctor_id,mode:mode});
  };

  useEffect(() => {
    fetchDoctorById();
  }, [data.toString()]);
  console.log(doctorById?.response?.university_name?.charAt(0));
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}

          locationIcon={false}
          showLocationMark={true}
          notificationUserIcon={true}
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
              day={doctorById?.response?.working_days_start}
              time={doctorById?.response?.working_time_start}
              onClick={() => handleBookAppointment(doctorById?.response?.doctor_id)}
            />
          </View>
          <View>
            <View style={{height: 2, backgroundColor: '#E6E1E5'}}></View>
          </View>
          <View style={{gap: 10}}>
            <View>
              <CustomRatingBar
                pat={doctorById?.doctorTotalconsultations}
                exp={doctorById?.doctorTotalExperience || "0"}
                rat={doctorById?.doctorAverageRating}
                rev={doctorById?.doctorTotalReviews}
              />

            </View>

            <View style={{padding: 19, gap: hp(0)}}>
              <Text
                style={{
                  fontSize: hp(2),
                  color: '#313033',
                  fontFamily: 'Poppins-SemiBold',
                }}>
                About Me
              </Text>
              <Text
                style={{
                  fontSize: hp(1.6),
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'justify',
                  color: '#AEAAAE',
                }}>
                {isExpanded ? fullText : truncateText}
                <Text onPress={toggleText} style={{color: '#E72B4A'}}>
                  {isExpanded ? ' Show less' : ' Show more'}
                </Text>
              </Text>
            </View>

            <View>

              {/* {doctorDetails.reviews ? ( */}
              <CustomReviewCard reviwes={doctorById?.doctorReviewData} />
              {/* ) : null} */}

            </View>

            <View>
              <View style={{paddingHorizontal: 10}}>
                <InAppHeader LftHdr={'Education'} textbtn={false} />
              </View>
              <CustomEduLicAwardCard
                // Header={'Education'}
                collegename={doctorById?.response?.university_name}
                collegeDegree={doctorById?.response?.degree}
                year={doctorById?.response?.qualified_year}
                collegeicon={doctorById?.response?.university_name?.charAt(0)}
                type="education"
              />
            </View>
            <View>
              <View style={{paddingHorizontal: 10}}>
                {doctorById?.doctorLicense?.length > 0 && (
                  <InAppHeader
                    LftHdr={'Licenses & Certifications'}
                    textbtn={false}
                  />
                )}
              </View>
              {doctorById.doctorLicense.map((lic, i) => (
                <CustomEduLicAwardCard
                  // Header={'Licenses & Certifications'}
                  type="licenses"
                  certificateName={lic?.lic_title}
                  certificateId={lic?.lic_certificate_no}
                  issueDate={lic?.lic_date}
                  authority={lic?.lic_issuedby}
                  certificateIcon={lic?.lic_title?.charAt(0)}
                  description={lic?.lic_description}
                />
              ))}
            </View>
            <View>
              <View style={{paddingHorizontal: 10}}>
                {doctorById?.doctorAwards?.length > 0 && (
                  <InAppHeader LftHdr={'Honours  & Awards'} textbtn={false} />
                )}
              </View>
              {doctorById?.doctorAwards?.map((award, i) => (
                <CustomEduLicAwardCard
                  type="awards"
                  // Header={'Honours  & Awards'}
                  awardTitle={award?.award_title}
                  awardIssued={award?.award_issuedby}
                  issueDate={award?.award_date}
                  description={award?.award_description}
                  awardIcon={award?.award_title?.charAt(0)}
                  // data={doctorDetails.awards}
                />
              ))}
            </View>
            <View>
              <View style={{paddingHorizontal: 10}}>
                {doctorById?.doctorExperience?.length > 0 && (
                  <InAppHeader LftHdr={'Work Experience'} textbtn={false} />
                )}
              </View>
              {doctorById?.doctorExperience?.map((exp, i) => (
                <CustomEduLicAwardCard
                  type="experience"
                  // Header={'Work Experience'}
                  job={exp?.job}
                  organization={exp?.organisation}
                  fromdate={exp?.from_date}
                  todate={exp?.to_date}
                  experienceIcon={exp?.organisation?.charAt(0)}


                  // awardIssued={award?.award_issuedby}
                  // issueDate={award?.award_date}
                  // desc={award?.award_description}
                  // awardIcon={award?.award_title?.charAt(0)}
                  // data={doctorDetails.awards}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};

export default DoctorPage;
