/**
 * ============================================================================
 * SCREEN: Reschedule Appointment
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for doctors to reschedule appointments with reason selection
 * 
 * SECURITY:
 * - Input sanitization should be added before API submission
 * - No sensitive data handled directly
 * 
 * @module ReSchedule
 */

import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';

// Components
import Header from '../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomRadioButton from '../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../components/customButton/CustomButton';

// Utils & Constants
import {COLORS} from '../../constants/colors'; // DESIGN: Color constants
import Logger from '../../constants/logger'; // UTILITY: Structured logging


const ReSchedule = () => {
  // STATE: Selected reschedule reason
  const [selectReschedule, setselectReschedule] = useState();

  // DATA: Available reschedule reasons
  const reschedule = [
    {id: 1, label: 'I have a schedule clash.'},
    {id: 2, label: 'I am not available at the schedule'},
    {id: 3, label: 'Reason 3'},
    {id: 4, label: 'Reason 4'},
    {id: 5, label: 'Reason 5'},
  ];

  /**
   * HANDLER: Update selected reschedule reason
   * 
   * @param {string} radio - Selected reason label
   */
  const handleChange = radio => {
    Logger.debug('Reschedule reason selected', { reason: radio });
    setselectReschedule(radio);
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <InAppCrossBackHeader showClose={true} />
        </View>
        <View style={{gap: 30}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                color: 'black',
                fontWeight: '400',
              }}>
              Reschedule Appointment
            </Text>
          </View>
          <View style={{padding: 15, gap: 25}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
              Reason for reschedule
            </Text>
            <View style={{gap: 10}}>
              {reschedule.map((radio, id) => (
                <CustomRadioButton
                  key={radio.id}
                  label={radio.label}
                  selected={selectReschedule === radio.label}
                  onPress={() => handleChange(radio.label)}
                  fontSize={18}
                  //   fontweight={200}
                />
              ))}
            </View>
          </View>
          <View style={{paddingHorizontal: 25}}>
            <Text style={{fontSize: 16, lineHeight: 22}}>
              Note : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo
              non dolor bibendum,
            </Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Continue"
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              bgColor={COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              width={250}
              padding={5}
              borderRadius={30}
              onPress={() => {
                // TODO: Add API call to submit reschedule request
                // TODO: Add input sanitization before submission
                // TODO: Add success/error toast notifications
                Logger.warn('Continue button pressed - API integration needed', {
                  selectedReason: selectReschedule,
                });
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ReSchedule;
