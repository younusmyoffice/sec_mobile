/**
 * ============================================================================
 * SCREEN: Patient Details View (Doctor)
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for doctors to view patient details, attached files, and questionnaire
 * responses
 * 
 * SECURITY:
 * - Static data display (no API calls currently)
 * - Should fetch patient data from route params
 * 
 * TODO:
 * - Integrate with API to fetch actual patient data
 * - Add file download functionality
 * - Add dynamic questionnaire display
 * 
 * @module PatientDetailsViewDoc
 */

import {View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';

// Components
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../components/customComponents/InAppHeadre/InAppHeader';

// Utils & Constants
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import axiosInstance from '../../../utils/axiosInstance'; // SECURITY: Auto token injection (if API needed)

const PatientDetailsViewDoc = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // STATE: Patient data
  // TODO: Fetch from route params or API
  const [patientData, setPatientData] = useState({
    name: 'Johny Sins',
    gender: 'Male',
    age: 55,
    files: [
      {name: 'Report_details.pdf', path: '#'},
    ],
    questions: [
      {question: 'Question 1', answer: 'One Liner Answer'},
      {question: 'Question 1', answer: 'One Liner Answer'},
      {question: 'Question 1', answer: 'One Liner Answer'},
    ],
  });

  // Get appointment/patient ID from route params
  const appointmentId = route?.params?.appointmentId || null;

  useEffect(() => {
    if (appointmentId) {
      Logger.debug('Patient details initialized', { appointmentId });
      // TODO: Fetch patient data from API
      // fetchPatientData(appointmentId);
    }
  }, [appointmentId]);

  /**
   * HANDLER: Handle file view/download
   * 
   * @param {string} filePath - File path or URL
   * @param {string} fileName - File name
   */
  const handleFileAction = (filePath, fileName) => {
    Logger.debug('File action triggered', { fileName, filePath });
    // TODO: Implement file viewing/downloading
    // Linking.openURL(filePath);
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
    <Header
        logo={require('../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
      />
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{padding: 15}}>
          <View>
            <InAppCrossBackHeader
              showClose={false}
              closeIconSize={25}
              backIconSize={25}
              onBackPress={()=> navigation.goBack('')}
            />
          </View>
          <View>
            <InAppHeader LftHdr={'Patient Details'} />
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.labelText}>Patient Name</Text>
                <Text style={styles.valueText}>
                  {patientData.name}
                </Text>
              </View>
              <View>
                <Text style={styles.labelText}>Gender</Text>
                <Text style={styles.valueText}>
                  {patientData.gender}
                </Text>
              </View>
              <View>
                <Text style={styles.labelText}>Age</Text>
                <Text style={styles.valueText}>
                  {patientData.age}
                </Text>
              </View>
            </View>
          </View>
          {/* SECTION: Attached Files */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attached Files</Text>

            <View>
              {patientData.files && patientData.files.length > 0 ? (
                patientData.files.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <Text style={styles.labelText}>File Name</Text>
                    <View style={styles.fileActions}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          onPress={() => handleFileAction(file.path, file.name)}>
                          <Text style={styles.actionText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.downloadButton}
                          onPress={() => handleFileAction(file.path, file.name)}>
                          <MaterialCommunityIcons
                            name="download"
                            color={COLORS.PRIMARY} // DESIGN: Use color constant
                            size={16}
                          />
                          <Text style={styles.actionText}>Download</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noFilesText}>No files attached</Text>
              )}
            </View>
          </View>
          {/* SECTION: Questionnaire Responses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Questionnaire</Text>
            {patientData.questions && patientData.questions.length > 0 ? (
              patientData.questions.map((item, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.labelText}>{item.question}</Text>
                  <Text style={styles.valueText}>{item.answer}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No questionnaire responses</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

// DESIGN: Styles using color constants and StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  labelText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  valueText: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: hp(1.8),
  },
  section: {
    marginTop: 30,
    gap: 15,
  },
  sectionTitle: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
  },
  fileItem: {
    marginBottom: 15,
  },
  fileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  fileName: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Regular',
  },
  downloadButton: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  questionItem: {
    marginBottom: 15,
  },
  noFilesText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noDataText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default PatientDetailsViewDoc;
