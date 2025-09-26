import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import AllDoctors from './AllDoctors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../components/customComponents/Header/Header';
import {useCommon} from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';
import CustomTable from '../../../../components/customTable/CustomTable';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
const Stack = createNativeStackNavigator();
export default function AdminDoctorsScreen() {
  const {dept, activeTab, setActiveTab, setRun, userId} = useCommon();
  console.log('dept', dept);
  const [activeTabDoctors, setActiveTabDoctors] = useState('All Doctors');
  const [categoriesDoctor, setCategoriesDoctor] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState([]);
  const [blockedDoctor, setBlockedDoctor] = useState([]);
  const [loading, setLoading] = useState();
  // const [activeTabDoctors, setActiveTabDoctors] = useState( 'All');

  const header = ['Name', 'Department', 'Status', 'Action'];
  const activeHeader = ['Name & Details', 'Email Id', 'Department Name'];
  const blockHeader = ['Name & Details', 'Email Id', 'Department Name'];
  const navigation = useNavigation();
  const handleAddDoctor = () => {
    navigation.navigate('doctor-package');
  };

  const fetchcatrgoryDoctor = async department => {
    try {
      setLoading(true);
      console.log('fetching data....');
      const response = await axiosInstance.get(
        `hcf/clinicDoctorsByDept/${userId}/${department}`,
      );
      console.log(department);
      console.log(response.data?.response[department]);

      setCategoriesDoctor(response.data?.response[department]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  console.log('category', categoriesDoctor);

  const fetchActiveDoctor = async activeTab => {
    try {
      const response = await axiosInstance.get(
        `hcf/ActiveBlockedClinicDoctors/1/${userId}/${activeTab}`,
      );
      console.log(response.data.response);
      setActiveDoctor(response.data.response);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchBlockedDoctor = async activeTab => {
    try {
      const response = await axiosInstance.get(
        `hcf/ActiveBlockedClinicDoctors/0/${userId}/${activeTab}`,
      );
      console.log(response.data.response);
      setBlockedDoctor(response.data.response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleActivateDoctor = async (id, status) => {
    try {
      console.log('clinic doctorid', id);
      console.log(status === 1 ? 'Activating' : 'Deactivating');

      const response = await axiosInstance.post(
        `hcf/ActiveDeactiveClinicDoctor`,
        {
          hcf_id: userId.toString(),
          clinic_doctor_id: id.toString(),
          status: status.toString(),
        },
      );

      console.log(response.data);
      CustomToaster.show('success', status === 1 ? 'Accpeted' : 'Rejected');
      setCategoriesDoctor(prevDoctors =>
        prevDoctors.map(doctor =>
          doctor.user_id === id
            ? {...doctor, status: status === 1 ? 'Active' : 'Inactive'}
            : doctor,
        ),
      );
      // fetchcatrgoryDoctor()
    } catch (error) {
      console.log(error);
    }
  };

  const renderDoctor = () => {
    switch (activeTabDoctors) {
      case 'All Doctors':
        return (
          <CustomTable
            header={header}
            isUserDetails={false}
            flexvalue={1}
            rowDataCenter={true}
            textCenter={'center'}
            data={categoriesDoctor}
            width={500}
            loading={loading}
            enableMenu={true}
            id={'user_id'}
            acceptPress={handleActivateDoctor}
            rejectPress={handleActivateDoctor}
            // backgroundkey={'status'}
            // backgroundInactive={''}
          />
        );
      case 'Active':
        return (
          <CustomTable
            header={activeHeader}
            isUserDetails={true}
            flexvalue={2}
            rowDataCenter={true}
            textCenter={'center'}
            data={activeDoctor}
            width={1000}
            loading={loading}
          />
        );

      case 'Blocked':
        return (
          <CustomTable
            header={blockHeader}
            isUserDetails={true}
            flexvalue={2}
            rowDataCenter={true}
            textCenter={'center'}
            data={blockedDoctor}
            width={1000}
            loading={loading}
          />
        );

      default:
        break;
    }
  };

  useEffect(() => {
    fetchActiveDoctor(activeTab);
    fetchBlockedDoctor(activeTab);
    fetchcatrgoryDoctor(activeTab);
    setRun(false);
  }, [activeTab]);

  useEffect(() => {}, [userId]);

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View>
          <Header
            logo={require('../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15}}>
          <View style={{alignSelf: 'flex-end'}}>
            <CustomButton
              title="Add Doctor"
              fontfamily={'Poppins-SemiBold'}
              textColor={'#E72B4A'}
              borderWidth={1}
              borderRadius={20}
              borderColor={'#E72B4A'}
              height={hp(5.5)}
              width={wp(35)}
              fontSize={hp(1.8)}
              onPress={handleAddDoctor}
            />
          </View>
          <View style={{gap: 10}}>
            <View>
              <TopTabs
                data={[
                  {id: 1, title: 'All Doctors'},
                  {id: 2, title: 'Active'},
                  {id: 3, title: 'Blocked'},
                ]}
                activeTab={activeTabDoctors}
                setActiveTab={setActiveTabDoctors}
                borderRadius={8}
              />
            </View>
            <View>
              <TopTabs
                data={dept?.map((item, i) => ({
                  id: i,
                  title: item.department_name,
                }))}
                bordercolor={'#E72B4A'}
                borderwidth={1}
                borderRadius={30}
                fontSize={hp(1.5)}
                ph={15}
                pv={8}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabfunc={fetchcatrgoryDoctor}
                funcstatus={true}
              />
            </View>
            <View>{renderDoctor()}</View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
