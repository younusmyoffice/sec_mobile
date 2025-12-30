import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseUrl} from '../utils/baseUrl';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAuth} from './Authentication';

export const CommonContext = createContext({});

export const useCommon = () => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error('context error ');
  }
  return context;
};

const CommonProvider = ({children}) => {
  // const [data, setData] = useState('turab');
  const navigation = useNavigation();

  const {userId} = useAuth();
  // const [userId, setUserId] = useState();

  const [recievedReports, setRecieveReports] = useState([]);
  const [sharedReports, setSharedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSharedReports, setPageSharedReports] = useState(1);
  const [pageReceivedReports, setPageReceivedReports] = useState(1);
  const [dept, setDept] = useState([]);
  const [labdept, setLabDept] = useState([]);
  const [activeTab, setActiveTab] = useState('CARDIOLOGIST');
  const [LabactiveTab, setLabActiveTab] = useState('Microbiology');
  const [doctorDepartmentsCache, setDoctorDepartmentsCache] = useState({});
  const [categoriesDoctor, setCategoriesDoctor] = useState([]);
  const [HcfcategoriesDoctor, setHcfCategoriesDoctor] = useState([]);
  const [labtest, setlabtest] = useState([]);
  const [run, setRun] = useState(true);
  const [limit] = useState(5);
  const [load, setLoad] = useState(false);
  const [hcfLoading, setHcfLoading] = useState(false);
  const [labload, setLabLoad] = useState(false);
  const[doctor_id,setDoctorId]=useState()
  // const [notification, setNotification] = useState([]);

  // const fetchUserId=async()=>{
  //   const suidString = await AsyncStorage.getItem('suid');
  //   const suid = suidString ? JSON.parse(suidString) : null;
  //   setUserId(suid)
  // }

  const fetchSharedReports = async () => {
    try {
      console.log('🔄 Fetching shared reports for userId:', userId);
      const response = await axiosInstance.get(
        `patient/reportsShared/${userId}`,
        {
          params: {
            page: pageSharedReports,
            limit: limit,
          },
        },
      );

      console.log('📥 Shared Reports API Response:', response.data);
      console.log('📥 Shared Reports Response Data:', response.data.response);
      console.log('📥 Shared Reports Count:', response.data.response?.length || 0);
      
      setSharedReports(response.data.response);
    } catch (e) {
      console.log('❌ Error fetching shared reports:', e);
    }
  };
  const fetchRecievedReports = async status => {
    try {
      // setLoading(false);
      const response = await axiosInstance.get(
        `patient/reportsReceived/${userId}/${status}`,
        {
          params: {
            page: pageReceivedReports,
            limit: limit,
          },
        },
      );

      setRecieveReports(response.data.response);
      // setLoading(true);
      // console.log("reports",response.data.response)
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDepartments = async () => {
    console.log('department api');
    try {
      const response = await axiosInstance.get(`patient/doctorDepartments`);
      console.log('deptarments', response.data.response);
      if (response?.data?.response) {
        setDept(response?.data?.response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchLabDepartments = async () => {
    try {
      const response = await axiosInstance.get(`labDepartments`);
      console.log('labdeptarments', response.data.response);
      if (response?.data?.response) {
        setLabDept(response?.data?.response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchDoctorDepartments = async department => {
    if (doctorDepartmentsCache[department]) {
      setCategoriesDoctor(doctorDepartmentsCache[department]);
      console.log('Using cached data for', department);
      return;
    }

    console.log('Fetching data for', department);
    try {
      const response = await axiosInstance.get(
        `patient/getdoctorsByDept/${department}/3`,
      );
      console.log('Doctors by department:', response?.data?.response);

      const key = Object.keys(response.data.response)[0];
      const doctorsData = response.data.response[key];

      setDoctorDepartmentsCache(prevCache => ({
        ...prevCache,
        [department]: doctorsData,
      }));

      setCategoriesDoctor(doctorsData);
    } catch (e) {
      console.warn(e);
    }
  };
  const fetchHcfDoctorDepartments = async department => {
    if (doctorDepartmentsCache[department]) {
      setHcfCategoriesDoctor(doctorDepartmentsCache[department]);
      console.log('Using cached data for', department);
      return;
    }

    console.log('Fetching data for', department);
    setHcfLoading(true); // Start loading before fetching

    try {
      const response = await axiosInstance.get(
        `patient/getHcfdocByDept/${department}/6`,
      );
      console.log('Doctors by department:', response?.data?.response);

      const key = Object.keys(response.data.response)[0];
      const doctorsData = response.data.response[key];

      // Store fetched data in cache
      setHcfCategoriesDoctor(prevCache => ({
        ...prevCache,
        [department]: doctorsData,
      }));

      setHcfCategoriesDoctor(doctorsData);
    } catch (e) {
      console.warn(e);
    } finally {
      setHcfLoading(false); // Stop loading after fetching
    }
  };
  const fetchLabTest = async department => {
    if (doctorDepartmentsCache[department]) {
      setlabtest(doctorDepartmentsCache[department]);
      console.log('Using cached data for', department);
      return;
    }

    console.log('Fetching data for', department);
    setLabLoad(true);
    try {
      const response = await axiosInstance.get(
        `patient/SingleLabFilters/${department}/11`,
      );
      console.log('Doctors by department:', response?.data?.response);

      const key = Object.keys(response.data.response)[0];
      const doctorsData = response.data.response[key];

      setlabtest(prevCache => ({
        ...prevCache,
        [department]: doctorsData,
      }));

      setlabtest(doctorsData);
    } catch (e) {
      console.warn(e);
    } finally {
      setLabLoad(false);
    }
  };

  console.log('idfdsfdsa', userId);

   const handleVerify = async (verifyOtp, setisSuccess, isSuccess, settitle) => {
      try {
        setLoad(false);
        console.log('🔐 Verifying doctor email OTP:', verifyOtp);
        
        const response = await axiosInstance.post('auth/verifyEmail', verifyOtp);
        console.log('✅ Email verification response:', response.data);
        
        if (response.data?.response?.suid) {
          setDoctorId(response.data.response.suid);
          setLoad(true);
          setisSuccess(!isSuccess);
          settitle('Doctor Registered Successfully');
          console.log('✅ Doctor verification successful, doctor_id:', response.data.response.suid);
        } else {
          console.log('⚠️ No suid in response');
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('❌ Email verification failed:', error);
        setLoad(false);
        // Show error message to user
        if (error.response?.data?.message) {
          console.log('❌ Server error:', error.response.data.message);
        }
        throw error; // Re-throw to let the UI handle the error
      }
    };


 

  // const fetchNotification = async () => {
  //   console.log('called notificatiion');
  //   try {
  //     const response = await axiosInstance.get(`patient/patientNotification/${userId}`);
  //     console.log('not', response.data.response);
  //     setNotification(response?.data?.response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleRead = async id => {
  //   try {
  //     const response = await axiosInstance.put(`notification/status/${id}/1`);
  //     fetchNotification();
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };
  // useEffect(() => {
  //   if (userId) {
  //     fetchNotification();
  //   }
  // }, [userId]);

  // useEffect(() => {
  //   fetchDepartments();
  //   if (activeTab) {
  //     fetchDoctorDepartments(activeTab);
  //   }
  // }, [activeTab]);

  useEffect(() => {
    // fetchSuid();
    fetchSharedReports();
    fetchRecievedReports('completed');
  }, [userId, pageReceivedReports, pageSharedReports, 'completed']);
  useEffect(() => {
    // fetchUserId()
    if (userId) {
      fetchDepartments();
      fetchLabDepartments();
    }
  }, [userId]);

 
  useEffect(() => {
    if (run) {
      if (activeTab) {
        fetchDoctorDepartments(activeTab);
        // fetchHcfDoctorDepartments(activeTab)
      }
    } else {
      return;
    }
  }, [activeTab]);
  useEffect(() => {
    if (activeTab) {
      fetchHcfDoctorDepartments(activeTab);
    }
  }, [activeTab]);
  useEffect(() => {
    if (LabactiveTab) {
      fetchLabTest(LabactiveTab);
    }
  }, [LabactiveTab]);

  return (
    <CommonContext.Provider
      value={{
        userId,
        recievedReports,
        sharedReports,
        setPageReceivedReports,
        setRecieveReports,
        dept,
        setDept,
        activeTab,
        setActiveTab,
        doctorDepartmentsCache,
        setDoctorDepartmentsCache,
        categoriesDoctor,
        setCategoriesDoctor,
        fetchDoctorDepartments,
        setRun,
        load,
        setLoad,
        HcfcategoriesDoctor,
        fetchHcfDoctorDepartments,
        labdept,
        LabactiveTab,
        setLabActiveTab,
        fetchLabTest,
        labtest,
        hcfLoading,
        labload,
        setDoctorId,
        handleVerify,
        doctor_id,
        
      }}>
      {children}
    </CommonContext.Provider>
  );
};

export default CommonProvider;
