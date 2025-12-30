import {View, Text, TouchableWithoutFeedback} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import DatePicker from '../callendarPicker/DatePickerCallendar';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import CustomButton from '../customButton/CustomButton';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stepper from '../customStepper/CustomStepper';
import axiosInstance from '../../utils/axiosInstance';
import HcfDateTime from '../../screens/patient/hcfBookAppointment/Hcfdepartment/hcfTestBuy/HcfDateTime';
import HcfPayment from '../../screens/patient/hcfBookAppointment/Hcfdepartment/hcfTestBuy/HcfPayment';
import { useCommon } from '../../Store/CommonContext';

const CustomModal = ({modalVisible, set, examid,bookTest,setBookTest,hcfid}) => {
  const [active, setActive] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setavailableSlots] = useState([]);
  const webviewRef = useRef(null);
const{userId}=useCommon()
  const fetchLabtestDates = async () => {
    try {
      const response = await axiosInstance.get(
        `patient/availableLabTestDates/${hcfid}/${examid}`,
      );
      setAvailableDates(response?.data?.availableDates);
      console.logailableDates(response?.data?.availableDates);
    } catch (error) {}
  };
  const fetchLabtestTime = async () => {
    try {
      const response = await axiosInstance.get(
        `patient/availableLabTestTime/${hcfid}/${examid}`,
      );
      console.log("slots",response.data.timeSlots)
      setavailableSlots(
        response.data?.timeSlots?.map((slot, i) => ({
          label: slot,
          value: slot,
        })),
      );
    } catch (error) {}
  };
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
  useEffect(() => {
      if(userId){
        setBookTest({...bookTest, patient_id: userId.toString()})
      }
    }, [userId]);
  const handlePaymentComplete = (success) => {
    console.log('💳 Payment completed with success:', success);
    if (success) {
      console.log('✅ Closing modal after successful payment');
      set(!modalVisible);
    } else {
      console.log('❌ Payment failed, keeping modal open');
    }
  };

  const testStepper = [
    <HcfDateTime
      availableDates={availableDates}
      availableSlots={availableSlots}
      bookTest={bookTest}
      setBookTest={setBookTest}

    />,
    <HcfPayment 
      webviewRef={webviewRef} 
      bookTest={bookTest}
      setBookTest={setBookTest}
      onPaymentComplete={handlePaymentComplete}
    />
  ];
  useEffect(() => {
    fetchLabtestDates();
    fetchLabtestTime();
  }, []);
  return (
    <View>
      <Modal
        isVisible={modalVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '100%',
              height: '70%',
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View>
                <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>Buy Test</Text>
                <Text style={{color: '#666', fontSize: 14}}>
                  Step {active + 1} of {testStepper.length}: {active === 0 ? 'Select Date' : 'Payment'}
                </Text>
              </View>
              <TouchableWithoutFeedback onPress={() => set(!modalVisible)}>
                <MaterialCommunityIcons
                  name="close"
                  size={heightPercentageToDP(3)}
                  color={'black'}
                />
              </TouchableWithoutFeedback>
            </View>
            <View>
              <Stepper
                heightofstepper={50}
                active={active}
                content={testStepper}
                onBack={() => setActive(p => p - 1)}
                onFinish={() => {
                  console.log('🎯 Finishing lab test booking with data:', bookTest);
                  
                  // Validate all required fields before payment
                  const requiredFields = ['book_date', 'patient_id', 'test_subexam_id'];
                  const missingFields = requiredFields.filter(field => !bookTest[field] || bookTest[field] === '');
                  
                  if (missingFields.length > 0) {
                    console.log('⚠️ Missing required fields:', missingFields);
                    console.log('📋 Current bookTest:', bookTest);
                    return;
                  }
                  
                  console.log('✅ All required fields present, proceeding with payment');
                  handlePayPress();
                }}
                onNext={() => {
                  console.log('🔄 Moving to next step, current active:', active);
                  console.log('📋 Current bookTest data:', bookTest);
                  
                  // Validate current step before proceeding
                  if (active === 0) {
                    // Validate date/time selection
                    if (!bookTest.book_date) {
                      console.log('⚠️ No date selected, staying on current step');
                      return;
                    }
                    console.log('✅ Date selected, proceeding to payment step');
                  }
                  
                  setActive(p => p + 1);
                }}
                showButton={true}
                bgColor={'#E72B4A'}
                fontfamily={'Poppins-SemiBold'}
                textColor={'white'}
                fontSize={heightPercentageToDP(2)}
                borderRadius={20}
                // width={widthPercentageToDP(60)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;
