import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import {doctorDetails} from '../../../../utils/data';
import CustomEduLicAwardCard from '../../../../components/customEdu-Licen-AwardCard/CustomEduLicAwardCard';
import CustomButton from '../../../../components/customButton/CustomButton';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../Store/CommonContext';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function ProfessionalDetails({
  formData,
  setFormData,
  educationalDetail,
  profestionalDetail,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable,
  submitForm,
}) {
  // Educational details fields
  const check = false;
  const {userId} = useCommon();
  const [experience, setExperience] = useState([]);
  const [award, setAward] = useState([]);
  const [licenses, setLicenses] = useState([]);
  console.log('doc', userId);
  const EducationalDetails = [
    {id: 1, name: 'qualification', type: 'text', placeholder: 'Qualification'},
    {id: 2, name: 'degree', type: 'text', placeholder: 'Degree'},
    {id: 3, name: 'university', type: 'text', placeholder: 'University'},
    {
      id: 4,
      name: 'specialisation',
      type: 'select',
      placeholder: 'Specialisation',
      options: [
        {value: 'Neurologist', label: 'Neurologist'},
        {value: 'Orthopedics', label: 'Orthopedics'},
        {value: 'Gynecologist', label: 'Gynecologist'},
        {value: 'Dentist', label: 'Dentist'},
      ],
    },
  ];
  const navigation = useNavigation();
  // Professional details fields
  const ProfessionalDetails = [
    {
      id: 1,
      name: 'StateRegNo',
      type: 'number',
      placeholder: 'State Registration No',
    },
    {
      id: 2,
      name: 'RegistrationDate',
      type: 'number',
      placeholder: 'Registration Date',
    },
    {
      id: 3,
      name: 'IndianRegNo',
      type: 'text',
      placeholder: 'Indian Registration No',
    },
    {
      id: 4,
      name: 'RegistrationDate2',
      type: 'text',
      placeholder: 'Indian Registration No',
    }, // Changed ID and name
  ];

  const [markedDates, setMarkedDates] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDayPress = (day, name) => {
    setFormData({
      ...formData,
      DOB: day.dateString,
    }); // } else {;
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        color: '#E72B4A',
        textColor: 'white',
      },
    });
  };
  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {selected: true, color: '#E72B4A', textColor: 'white'};
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };
  const getexprience = async () => {
    try {
      const response = await axiosInstance.get(
        `Doctor/getDoctorExperience?doctor_id=${userId}`,
      );
      setExperience(response?.data?.response || []);
      console.log('setexp', response?.data?.response);
    } catch (error) {
      console.error('Error fetching lab data:', error.response);
    }
  };
  console.log('expp', experience);
  const getawards = async () => {
    try {
      const response = await axiosInstance.get(
        `Doctor/getDoctorAwards?doctor_id=${userId}`,
      );
      setAward(response?.data?.response || []);
      console.log('setAward', response?.data?.response);
    } catch (error) {
      console.error('Error fetching lab data:', error.response);
    }
  };

  const getlicenses = async () => {
    try {
      const response = await axiosInstance.get(
        `Doctor/getDoctorLicense?doctor_id=${userId}`,
      );
      setLicenses(response?.data?.response || []);

      console.log('setLicenses', response?.data?.response);
    } catch (error) {
      console.error('Error fetching lab data:', error.response);
    }
  };
  useEffect(() => {
    getawards();
    if (!check) {
      getexprience();
    }
    getlicenses();
  }, []);
  return (
    <View>
      {/* Educational Details Section */}
      <InAppHeader LftHdr="Educational Details" />
      {educationalDetail?.map(item => (
        <CustomInput
          ref={el => (inputRefs.current[index] = el)}
          key={item.id}
          name={item.name}
          type={item.type}
          placeholder={item.placeholder}
          value={formData[item.name] || ''}
          onChange={handleChange}
          options={item.options || []}
          format={item.format}
          startDate={formData.DOB}
          handleDayPress={handleDayPress}
          calculateMarkedDates={calculateMarkedDates}
          markedDates={markedDates}
          disabled={item.name === 'email' || isDisabled}
          fontFamily={'Poppins-Medium'}
                        fontSize={hp(1.7)}
          
        />
      ))}

      {/* InAppHeader between sections */}
      <InAppHeader LftHdr="Professional Details" />

      {/* Professional Details Section */}
      {profestionalDetail?.map(item => (
        <CustomInput
          ref={el => (inputRefs.current[index] = el)}
          key={item.id}
          name={item.name}
          type={item.type}
          placeholder={item.placeholder}
          value={formData[item.name] || ''}
          onChange={handleChange}
          options={item.options || []}
          format={item.format}
          startDate={formData.DOB}
          handleDayPress={handleDayPress}
          calculateMarkedDates={calculateMarkedDates}
          markedDates={markedDates}
          disabled={item.name === 'email' || isDisabled}
          fontFamily={'Poppins-Medium'}
          fontSize={hp(1.7)}
        />
      ))}

      <View>
        <View style={{paddingHorizontal: 10}}>
          <InAppHeader
            btnYN={true}
            iconSize={30}
            LftHdr={'Work Experiences'}
            iconname={'plus'}
            Navig={() => {
              navigation.navigate('AddExperience');
            }}
            lefticon={true}
            bgcolor="#fff"
          />
        </View>
        {experience
          ?.filter(
            item =>
              item?.job &&
              item?.organisation &&
              item?.from_date &&
              item?.to_date,
          )
          .map(item => (
            <CustomEduLicAwardCard
              key={item.doctor_experience_id}
              sideEdit={true}
              handleEditNavigation={() => {
                navigation.navigate('AddExperience');
              }}
              experienceIcon={item.organisation}
              job={item.job}
              organization={item.organisation}
              fromdate={item.from_date}
              todate={item.to_date}
              type="experience"
            />
          ))}

        {experience?.filter(
          item =>
            item?.job && item?.organisation && item?.from_date && item?.to_date,
        ).length === 0 && (
          <View>
            <Text>No Experience added</Text>
          </View>
        )}
      </View>
      <View>
        <View style={{paddingHorizontal: 10, marginTop: 10}}>
          <InAppHeader
            btnYN={true}
            iconSize={30}
            LftHdr={'Awards'}
            iconname={'plus'}
            Navig={() => {
              navigation.navigate('AddAward');
            }}
            lefticon={true}
            bgcolor="#fff"
          />
        </View>
        {award?.map(item =>
          item ? (
            <CustomEduLicAwardCard
              sideEdit={true}
              handleEditNavigation={() => {
                navigation.navigate('AddAward');
              }}
              experienceIcon={item.award_title}
              awardTitle={item.award_title}
              awardIssued={item.award_issuedby}
              issueDate={item.award_date}
              description={item.award_description} // Add the award description licenses
              type="awards"
            />
          ) : (
            <View>
              <Text>no Experience added</Text>
            </View>
          ),
        )}
      </View>
      <View>
        <View style={{paddingHorizontal: 10, marginTop: 10}}>
          <InAppHeader
            btnYN={true}
            iconSize={30}
            LftHdr={'Licences'}
            iconname={'plus'}
            Navig={() => {
              navigation.navigate('AddLisenceCertification');
            }}
            lefticon={true}
            bgcolor="#fff"
          />
        </View>
        {licenses?.map(item =>
          item ? (
            <CustomEduLicAwardCard
              handleEditNavigation={() => {
                navigation.navigate('AddLisenceCertification');
              }}
              sideEdit={true}
              certificateName={item.lic_title}
              authority={item.lic_issuedby}
              issueDate={item.lic_date}
              certificateId={item.lic_certificate_no}
              description={item.lic_description} // Add the award description licenses
              type="licenses"
            />
          ) : (
            <View>
              <Text>no Experience added</Text>
            </View>
          ),
        )}
      </View>
      <View>
        <CustomButton
          title="Save Changes"
          bgColor="#E72B4A" // Green background
          textColor="#FFF" // White text
          borderColor="#E72B4A" // Darker green border
          borderWidth={1} // 2px border
          borderRadius={30}
          onPress={submitForm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Add your styles here
  },
});
