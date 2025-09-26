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
    webviewRef.current.injectJavaScript(`
      if (window.instance) {
        window.instance.requestPaymentMethod((err, payload) => {
          if (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ error: err.message }));
          } else {
           
            window.ReactNativeWebView.postMessage(JSON.stringify({ nonce: payload.nonce }));
          }
        });
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Payment instance not found" }));
      }
    `);
  };
  useEffect(() => {
      if(userId){
        setBookTest({...bookTest, patient_id: userId.toString()})
      }
    }, [userId]);
  const testStepper = [
    <HcfDateTime
      availableDates={availableDates}
      availableSlots={availableSlots}
      bookTest={bookTest}
      setBookTest={setBookTest}

    />,
    <HcfPayment webviewRef={webviewRef} bookTest={bookTest}
    setBookTest={setBookTest}/>
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
              <Text style={{color: 'black'}}>Buy test</Text>
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
                  handlePayPress()
                }}
                onNext={() => {
                  console.log('hello');
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
