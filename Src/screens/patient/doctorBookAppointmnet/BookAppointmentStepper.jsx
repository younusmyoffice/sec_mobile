import { View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Stepper from '../../../components/customStepper/CustomStepper';
import BookAppointmentCard from '../../../components/customCards/bookAppointment/BookAppointmentCard';
import PatientDetails from './PatientDetails';
import Questioner from './Questioner';
import BookAppointmenrtDateSelector from './BookAppointmenrtDateSelector';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import { patientDetails, packageContact } from '../../../utils/data';
import Questioner2 from './Questioner2';
import AppointmenrPayment from './AppointmenrPayment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';
const BookAppointmentStepper = () => {
  const routes = useRoute();
  const { hcf_id, doctorid, mode } = routes.params;
  console.log('doctorid', doctorid);
  console.log('hcfid', hcf_id);
  console.log('mode in stepper', mode);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableDurations, setAvailableDurations] = useState([]);
  const [selectpackage, setselectpackage] = useState([]);
  const [availableSlots, setAvailableSlots] = useState();
  const [questions, setquestions] = useState([]);
  const [active, setActive] = useState(0);
  const [isTokenFetched, setIsTokenFetched] = useState(false);
  const [token, setToken] = useState('');
  const [isLoginValid, setIsLoginValid] = useState(false);
  const [patientdetails, SetPatientDetails] = useState({
    appointment_date: '',
    appointment_time: '',
    duration: '',
    patient_id: '5',
    ...(mode 
      ? { hcf_id: hcf_id?.toString(), doctor_id: doctorid.toString() } 
      : { doctor_id: doctorid.toString() }
    ),
    fileName: '',
    file: '',
    patient_type: '',
    name: '',
    gender: '',
    age: '',
    answer_1: '',
    answer_2: '',
    answer_3: '',
    answer_4: '',
    answer_5: '',
    doctor_fee_plan_id: '',
    payment_method_nonce: '',
    problem: '',
  });
  console.log("patientdetails", patientdetails)
  // console.log('docid', patientdetails.doctor_id);
  
  // Debug: Monitor patientdetails state changes
  useEffect(() => {
    console.log('🔄 PatientDetails state changed:', {
      step: active,
      hasName: !!patientdetails.name,
      hasGender: !!patientdetails.gender,
      hasAge: !!patientdetails.age,
      hasDate: !!patientdetails.appointment_date,
      hasTime: !!patientdetails.appointment_time,
      hasDuration: !!patientdetails.duration,
      hasPlanId: !!patientdetails.doctor_fee_plan_id,
      hasProblem: !!patientdetails.problem,
      fullData: patientdetails
    });
  }, [patientdetails, active]);
  const fetchAvailableDates = async () => {
    try {
      const response = await axiosInstance.post(
        `patient/getAvailableAppointmentDates`,
        {
          doctor_id: doctorid,
        },
      );
      setAvailableDates(response?.data?.availableDates);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDuration = async () => {
    console.log('doc id slots123', doctorid);
    const response = await axiosInstance.get(
      `patient/getAppointmentPlanDuration/${doctorid}?date=${patientdetails.appointment_date}`,
    );
    console.log('slots', response.data);
    setAvailableDurations(response.data.response.durations);
    console.log(response.data.response.durations);
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await axiosInstance.post(`patient/getAppointmentSlots`, {
        appointment_date: patientdetails.appointment_date,
        doctor_id: doctorid,
        duration: patientdetails.duration,
      });

      setAvailableSlots(
        response.data.response.availableSlots.map((slot, i) => ({
          label: slot,
          value: slot,
        })),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPackage = async () => {
    const response = await axiosInstance.post(
      'patient/createAppointmentPackageSelect',
      {
        doctor_id: doctorid,
        is_active: 1,
        duration: patientdetails.duration,
      },
    );

    setselectpackage(response.data.response.plan);
  };
  const [doctorListId, setDoctorListId] = useState();
  const [planDetails, setPlanDetails] = useState({
    amount: '',
    planname: '',
    duration: '',
  });
  const recieveListId = (id, amount, plan, duration) => {
    setDoctorListId(id);
    setPlanDetails(prev => ({
      ...prev,
      amount: amount,
      planname: plan,
      duration: duration,
    }));
  };
  console.log('list id', doctorListId);
  const fetchQuestions = async () => {
    const response = await axiosInstance.post(
      'patient/createAppointmentPackageQuestion',
      {
        doctor_id: doctorid,
        doctor_list_id: doctorListId,
        is_active: 1,
      },
    );
    console.log('questions', response.data.response.questions);
    setquestions(response.data.response.questions);
  };

  const webviewRef = useRef(null);

  const handlePayPress = () => {
    console.log('💳 handlePayPress called');
    console.log('💳 webviewRef.current:', webviewRef.current);
    
    if (!webviewRef.current) {
      console.error('❌ WebView ref is null - WebView not loaded yet');
      Alert.alert('Payment Error', 'Payment system is not ready. Please try again.');
      return;
    }
    
    try {
      webviewRef.current.injectJavaScript(`
        console.log('💳 Injecting payment JavaScript...');
        if (window.instance) {
          console.log('💳 Braintree instance found, requesting payment method...');
          window.instance.requestPaymentMethod((err, payload) => {
            if (err) {
              console.error('💳 Payment error:', err);
              window.ReactNativeWebView.postMessage(JSON.stringify({ error: err.message }));
            } else {
              console.log('💳 Payment method received:', payload.nonce);
              window.ReactNativeWebView.postMessage(JSON.stringify({ nonce: payload.nonce }));
            }
          });
        } else {
          console.error('💳 Braintree instance not found');
          window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Payment instance not found" }));
        }
      `);
    } catch (error) {
      console.error('❌ Error injecting JavaScript:', error);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    }
  };
  const fetchToken = async () => {
    try {
      console.log('🔑 Fetching payment token from:', `${baseUrl}payment/generateToken`);
      const response = await axios.get(`${baseUrl}payment/generateToken`);
      console.log('🔑 Token response:', response.data);
      setToken(response.data);
      setIsTokenFetched(true);
    } catch (error) {
      console.error('❌ Error fetching token:', error);
      Alert.alert('Error', 'Failed to fetch payment token. Please try again.');
    }
  };

  useEffect(() => {
    fetchAvailableDates();
    fetchDuration();
    fetchTimeSlots();
    fetchQuestions();
  }, [
    patientdetails.appointment_date,
    patientdetails.duration,
    doctorid,
    doctorListId,
  ]);
  useEffect(() => {
    fetchToken();
  }, []);

  // Memoize the patient information components to prevent re-creation on every render
  const patientInformation = useMemo(() => [
    <PatientDetails
      key="patient-details"
      data={patientDetails.slice(0, 5)}
      patientdetails={patientdetails}
      SetPatientDetails={SetPatientDetails}
    />,
    <BookAppointmenrtDateSelector
      key="date-selector"
      patientdetails={patientdetails}
      SetPatientDetails={SetPatientDetails}
      availableDates={availableDates}
      availableDurations={availableDurations}
    />,
    <Questioner2
      key="questioner2"
      data={patientDetails.slice(6, 7)}
      patientdetails={patientdetails}
      SetPatientDetails={SetPatientDetails}
      selectpackage={selectpackage}
      availableSlots={availableSlots}
      fetchPackage={fetchPackage}
      recieveListId={recieveListId}
    />,
    <Questioner
      key="questioner"
      data={patientDetails.slice(5, 10)}
      patientdetails={patientdetails}
      SetPatientDetails={SetPatientDetails}
      questions={questions}
    />,
    <AppointmenrPayment
      key="payment"
      patientdetails={patientdetails}
      SetPatientDetails={SetPatientDetails}
      webviewRef={webviewRef}
      handlePayPress={handlePayPress}
      price={planDetails}
      token={token}
      isFetched={isTokenFetched}
      docid={doctorid}
      mode={mode}
    />,
  ], [
    patientdetails,
    availableDates,
    availableDurations,
    selectpackage,
    availableSlots,
    questions,
    planDetails,
    token,
    isTokenFetched,
    doctorid,
    mode
  ]);

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header
        logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
        locationIcon={true}
        notificationIcon={true}
        showLocationMark={true}
        userIcon={true}
        id={5}
      />
      <ScrollView style={{}}>
        <View style={{ padding: 15 }}>
          <View>
            <InAppCrossBackHeader
              showClose={true}
              backIconSize={25}
              closeIconSize={25}
            />
          </View>
          <Stepper
            active={active}
            content={patientInformation}
            onBack={() => {
              setselectpackage([])
              setActive(p => p - 1);
            }}
            onFinish={() => {
              console.log('🏁 Stepper Finish - Final validation');
              console.log('🏁 Final patientdetails:', patientdetails);
              
              // Final validation before payment
              const requiredFields = [
                'name', 'gender', 'age', 'patient_type',
                'appointment_date', 'appointment_time', 'duration',
                'doctor_fee_plan_id', 'problem'
              ];
              
              const missingFields = requiredFields.filter(field => !patientdetails[field] || patientdetails[field] === '');
              
              if (missingFields.length > 0) {
                Alert.alert(
                  'Missing Information', 
                  `Please complete all required fields: ${missingFields.join(', ')}`
                );
                return;
              }
              
              console.log('✅ Final validation passed - proceeding to payment');
              handlePayPress();
            }}
            onNext={() => {
              console.log('🔄 Stepper Next - Current step:', active);
              console.log('🔄 Current patientdetails:', patientdetails);
              
              // Validate current step before proceeding
              if (active === 0) {
                // Step 1: Patient Details validation
                const requiredFields = ['name', 'gender', 'age', 'patient_type'];
                const missingFields = requiredFields.filter(field => !patientdetails[field] || patientdetails[field] === '');
                
                if (missingFields.length > 0) {
                  Alert.alert(
                    'Missing Information', 
                    `Please fill in: ${missingFields.join(', ')}`
                  );
                  return;
                }
                console.log('✅ Step 1 validation passed');
              } else if (active === 1) {
                // Step 2: Date and Duration validation
                const requiredFields = ['appointment_date', 'duration'];
                const missingFields = requiredFields.filter(field => !patientdetails[field] || patientdetails[field] === '');
                
                if (missingFields.length > 0) {
                  Alert.alert(
                    'Missing Information', 
                    `Please select: ${missingFields.join(', ')}`
                  );
                  return;
                }
                console.log('✅ Step 2 validation passed');
              } else if (active === 2) {
                // Step 3: Time slot validation
                const requiredFields = ['appointment_time', 'doctor_fee_plan_id'];
                const missingFields = requiredFields.filter(field => !patientdetails[field] || patientdetails[field] === '');
                
                if (missingFields.length > 0) {
                  Alert.alert(
                    'Missing Information', 
                    `Please select: ${missingFields.join(', ')}`
                  );
                  return;
                }
                console.log('✅ Step 3 validation passed');
              } else if (active === 3) {
                // Step 4: Questions validation
                const requiredFields = ['problem'];
                const missingFields = requiredFields.filter(field => !patientdetails[field] || patientdetails[field] === '');
                
                if (missingFields.length > 0) {
                  Alert.alert(
                    'Missing Information', 
                    `Please fill in: ${missingFields.join(', ')}`
                  );
                  return;
                }
                console.log('✅ Step 4 validation passed');
              }
              
              // If validation passes, proceed to next step
              setActive(p => p + 1);
            }}
            showButton={true}
            bgColor={'#E72B4A'}
            fontfamily={'Poppins-SemiBold'}
            textColor={'white'}
            fontSize={hp(2)}
            borderRadius={20}
            width={wp(60)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookAppointmentStepper;
