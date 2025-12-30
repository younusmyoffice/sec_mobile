/**
 * ============================================================================
 * DIAGNOSTIC PROFILE SCREEN
 * ============================================================================
 *
 * PURPOSE:
 * View and edit diagnostic staff profile details.
 *
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls.
 * - Validates userId before API calls and form submission.
 *
 * ERROR HANDLING:
 * - User feedback via CustomToaster; no alerts.
 * - Graceful loading/empty handling with CustomLoader and defaults.
 */
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import Header from '../../../../components/customComponents/Header/Header';
import {baseUrl} from '../../../../utils/baseUrl';
import {useCommon} from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function DiagnosticProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({
    suid: '',
    first_name: '',
    email: '',
    mobile: '',
    role_id: 4,
  });
  const inputRefs = useRef([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const ProfileDetails = [
    {id: 1, name: 'first_name', type: 'text', placeholder: 'First Name'},
    {id: 2, name: 'mobile', type: 'number', placeholder: 'Mobile Number'},
    {id: 3, name: 'email', type: 'text', placeholder: 'Email'},

    
  ]
  const handleEnable = () => {
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
  };
  const {userId} = useCommon();

  useEffect(() => {
    const fetchProfile = async () => {
      // SECURITY: Validate userId before API call
      if (!userId || userId === 'null' || userId === 'undefined') {
        Logger.error('Invalid userId for diagnostic profile', { userId });
        CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        Logger.api('GET', `hcf/getDiagnosticStaffProfile/${userId}`);
        const response = await axiosInstance.get(`${baseUrl}hcf/getDiagnosticStaffProfile/${userId}`);
        const body = response?.data?.response;
        if (Array.isArray(body) && body[0]) {
          const userData = body[0];
          setFormData({
            suid: userData.suid || userId,
            first_name: userData.first_name || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            role_id: userData.role_id || 4,
          });
          setName(userData.first_name || '');
          Logger.info('Diagnostic profile fetched');
        } else {
          Logger.warn('Diagnostic profile empty');
          CustomToaster.show('error', 'Error', 'Profile data not found.');
        }
      } catch (error) {
        Logger.error('Diagnostic profile fetch failed', error);
        const errorMessage = error?.response?.data?.message || 'Failed to fetch profile.';
        CustomToaster.show('error', 'Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    // BASIC VALIDATION
    if (!formData.first_name || !formData.email || !formData.mobile) {
      CustomToaster.show('error', 'Validation Error', 'Please fill First Name, Email and Mobile');
      return;
    }
    if (!userId || userId === 'null' || userId === 'undefined') {
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        suid: formData.suid || userId,
        first_name: String(formData.first_name || '').trim(),
        email: String(formData.email || '').trim(),
        mobile: String(formData.mobile || '').trim(),
        role_id: formData.role_id || 4,
      };
      Logger.api('POST', 'hcf/updateStaff', { email: payload.email });
      const response = await axiosInstance.post(`${baseUrl}hcf/updateStaff`, payload);
      if (response?.data?.response?.statusCode === 200) {
        CustomToaster.show('success', 'Success', 'Profile updated successfully');
        setIsDisabled(true);
      } else {
        const errorMessage = response?.data?.response?.message || 'Failed to update profile.';
        CustomToaster.show('error', 'Error', errorMessage);
      }
    } catch (error) {
      Logger.error('Diagnostic profile update failed', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update profile.';
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        onlybell={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View
            style={styles.sectionHeaderBox}>
            <Text style={styles.sectionHeaderText}>Profile Information</Text>
          </View>
          <TouchableWithoutFeedback onPress={handleEnable}>
          <View
            style={styles.editRow}>
            <MaterialCommunityIcons
              name="pencil"
              color={COLORS.PRIMARY}
              size={hp(2)}
            />
            <Text
              style={styles.editText}>
              Edit Profile
            </Text>
          </View>

          </TouchableWithoutFeedback>
          <View
            style={styles.profileIdRow}>
            <Text
              style={styles.profileIdLabel}>
              Profile ID:
            </Text>
            <Text
              style={styles.profileIdValue}>
              {formData.suid || userId || 'N/A'}
            </Text>
          </View>
          <View>
            {/* <CustomInput
              label={'Namesasa'}
              key={formData.first_name}
              type={'text'}
              name={'first_name'}
              value={formData.first_name || ''}
              onChange={handleChange}
              placeholder={'Namedsa'}
              fontSize={14}
            />

            <CustomInput
              label={'Mobile No'}
              key={formData.mobile}
              type={'number'}
              name={'mobile'}
              value={formData.mobile || ''}
              onChange={handleChange}
              placeholder={'mobile no'}
              fontSize={14}
            />
            <CustomInput
              ref={el => (inputRefs.current[2] = el)}
              label={'Email'}
              key={formData.email}
              type={'email'}
              name={'email'}
              value={formData.email || ''}
              onChange={handleChange}
              placeholder={'Email'}
              fontSize={14}
            /> */}
            {ProfileDetails.map((item, index) => (
                <CustomInput
                ref={el => (inputRefs.current[index] = el)}
                // label={'Email'}
                key={item.id}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                value={formData[item.name] || ''}
                disabled={item.name === 'email' || isDisabled}
                onChange={handleChange}
                fontSize={14}
              /> 
            ))}
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Submit"
              bgColor={COLORS.PRIMARY}
              fontfamily={'Poppins-SemiBold'}
              textColor={COLORS.TEXT_WHITE}
              fontSize={hp(2)}
              borderRadius={20}
              width={wp(60)}
              onPress={handleUpdate}
              disabled={isDisabled || updating}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG_WHITE,
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  container: {
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    padding: 15,
    gap: 10,
  },
  sectionHeaderBox: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: wp(41),
  },
  sectionHeaderText: {
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Poppins-Medium',
  },
  editRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
  editText: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2),
  },
  profileIdRow: {
    marginTop: '5%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  profileIdLabel: {
    color: COLORS.TEXT_GRAY,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2),
  },
  profileIdValue: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2),
  },
});
