import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ProfileImageUpload from './ProfileImageUpload';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomButton from '../../../../../components/customButton/CustomButton';
import Header from '../../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useCommon} from '../../../../../Store/CommonContext';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNFS from 'react-native-fs';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
export default function ProfileInformation({
  firstFive,
  formData,
  setFormData,
  local,
  setlocal,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable,
}) {
  const [localimage, setLocalImage] = useState('');
  console.log(formData.profile_picture)

  const [markedDates, setMarkedDates] = useState({});

  // const {userId} = useCommon();
  // const ProfileInformation = [
  //   {id: 1, name: 'email', type: 'email', placeholder: 'Email'},
  //   {id: 1, name: 'first_name', type: 'text', placeholder: 'First Name'},
  //   {id: 2, name: 'middle_name', type: 'text', placeholder: 'Middle Name'},
  //   {id: 3, name: 'last_name', type: 'text', placeholder: 'Last Name'},
  //   {
  //     id: 4,
  //     name: 'gender',
  //     type: 'select',
  //     placeholder: 'Gender',
  //     options: [
  //       {value: 'Male', label: 'Male'},
  //       {value: 'Female', label: 'Female'},
  //       {value: 'Others', label: 'Others'},
  //     ],
  //   },
  //   {
  //     id: 5,
  //     name: 'DOB',
  //     type: 'date',
  //     placeholder: 'Date Of Birth',
  //     format: 'singleline',
  //   },
  // ];

  // const firstFive = ProfileInformation.slice(0, 5);
  // const rest = ProfileInformation.slice(5);

  // const [formData, setFormData] = useState({
  //   suid: "",
  //   role_id: "",
  //   profile_picture:"",
  //   first_name: '',
  //   last_name: '',
  //   middle_name: '',
  //   email: '',
  //   dialing_code: '',
  //   contact_no_primary: '',
  //   contact_no_secondary: '',
  //   street_address1: '',
  //   street_address2: '',
  //   gender: '',
  //   DOB: '',
  //   zip_code: '',
  //   country_id: '',
  //   state_id: '',
  //   city_id: '',
  //   home_no: '',
  //   location: '',
  // });
  // console.log(userId);

  // const showDetails = async () => {
  //   const response = await axiosInstance.post(`patientprofile`, {
  //     suid: userId,
  //   });
  //   setFormData(response?.data.response[0]);
  //   console.log("pdata",response?.data.response[0])
  // };
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = newImage => {
    setFormData(prev => ({
      ...prev,
      profile_picture: newImage, // Update image URL in the state
    }));
  };

  async function documentUpload() {
    try {
      const docs = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
        allowMultiSelection: false,
      });

      if (docs && docs.length > 0) {
        console.log(docs);
        console.log('Document URI:', docs[0]?.uri);
        setlocal(true);

        setLocalImage(docs[0]?.uri);
        console.log(docs[0]?.name);
        try {
          const base64 = await RNFS.readFile(docs[0]?.uri, 'base64');
          setFormData(prevDetails => ({
            ...prevDetails,
            profile_picture: base64,
          }));
          return base64;
        } catch (error) {
          console.error('Error converting file to Base64:', error);
          return null;
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        console.error(error);
      }
    }
  }
  // useEffect(() => {
  //   showDetails();
  // }, [userId]);

  // console.log('image', formData.profile_picture);
  const handleDayPress = (day, name) => {
    // setStartDate(day.dateString);
    // console.log("field",name)
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
  const handlePersonalUpdate = async () => {
    try {
      const response = await axiosInstance.post('updatePateintProfile', {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        added_by: formData.added_by,
        gender: formData.gender,
        DOB: formData.DOB,
        // added profile picture
        profile_picture: formData.profile_picture,
        fileExtension: formData.fileExtension,
      });
      showdetails();
      CustomToaster.show('success','Profile Updated','Profile information updated')
      console.log('success', response.message);
    } catch (e) {
      console.log(e);
      CustomToaster.show('error',e.message)

    }
  };
  // console.log('first', formData);
  return (
    <SafeAreaView>
      {/* <View>
        <Header />
      </View> */}
      <ScrollView contentContainerStyle={styles.container1}>
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            padding: 15,
          }}>
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableWithoutFeedback onPress={handleEnable}>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={'#E72B4A'}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.container}>
            <Image
              source={{
                uri: local
                  ? localimage
                  : formData.profile_picture,
              }}
              style={styles.image}
            />
            {/* <Image
              source={{uri: formData.profile_picture}}
              style={styles.image}
            /> */}
            <TouchableOpacity style={styles.overlay} onPress={documentUpload}>
              <Icon name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{margin: 20}}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
                color: '#AEAAAE',
              }}>
              Profile ID : <Text style={{color: '#E72B4A'}}>SRC0001</Text>
            </Text>
          </View>
        </View>

        {/* Mapping the first 5 fields */}
        <View>
          {firstFive.map((item, index) => (
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
          {/* <InAppHeader LftHdr="Contact Details" />

{rest.map((item) => (
  <CustomInput
    key={item.id}
    name={item.name}
    type={item.type}
    placeholder={item.placeholder}
    value={formData[item.name] || ''}
    onChange={handleChange}
    options={item.options || []} 
  />
))} */}
          <View>
            <CustomButton
              title="Save Changes"
              bgColor="#E72B4A" // Green background
              textColor="#FFF" // White text
              borderColor="#E72B4A" // Darker green border
              borderWidth={1} // 2px border
              borderRadius={30}
              onPress={handlePersonalUpdate}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: 'white',
    // padding: 15,
  },
  container: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
  },
});
