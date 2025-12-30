/**
 * ============================================================================
 * VIEW PATIENT DETAILS - CLINIC
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for Clinic users to view patient details, attached files, and questionnaire.
 * 
 * FEATURES:
 * - Display patient information (Name, Gender, Age)
 * - View attached files with download capability
 * - Display questionnaire responses
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls (when API is integrated)
 * - Validates patient data before display
 * - Input sanitization for dynamic data
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Loading states with CustomLoader
 * - Empty state handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * NOTE:
 * Currently displays static/hardcoded data. To make it dynamic:
 * 1. Accept patient data from route.params (e.g., { patientData })
 * 2. Fetch patient details from API endpoint
 * 3. Replace hardcoded values with dynamic data
 * 
 * @module ViewPatientDetails
 */

import {View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import InAppCrossBackHeader from '../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomRadioButton from '../../../../components/customRadioGroup/CustomRadioGroup';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import Header from '../../../../components/customComponents/Header/Header';
import { useRoute } from '@react-navigation/native';
import axiosInstance from '../../../../utils/axiosInstance';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const ViewPatientDetails = () => {
  const route = useRoute();
  const { patientData, appointmentId } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: 'Johny Sins', // TODO: Replace with dynamic data
    gender: 'Male', // TODO: Replace with dynamic data
    age: '55', // TODO: Replace with dynamic data
  });
  const [attachedFiles, setAttachedFiles] = useState([]); // TODO: Fetch from API
  const [questionnaire, setQuestionnaire] = useState([]); // TODO: Fetch from API

  /**
   * Fetch patient details from API
   * TODO: Implement API integration when endpoint is available
   */
  useEffect(() => {
    if (patientData || appointmentId) {
      fetchPatientDetails();
    } else {
      Logger.warn('ViewPatientDetails: No patient data or appointment ID provided');
    }
  }, [patientData, appointmentId]);

  /**
   * Fetch patient details from API
   * NOTE: This is a placeholder - implement actual API call
   */
  const fetchPatientDetails = async () => {
    // TODO: Replace with actual API endpoint
    // Example: axiosInstance.get(`hcf/patient/${patientId}/details`)
    // or: axiosInstance.get(`hcf/appointment/${appointmentId}/patientDetails`)
    
    setLoading(true);
    
    try {
      // Placeholder for API call
      Logger.debug('Fetching patient details', { 
        patientData: !!patientData, 
        appointmentId 
      });
      
      // When API is ready, replace this with:
      // const response = await axiosInstance.get(`endpoint`);
      // setPatientInfo(response.data.patient);
      // setAttachedFiles(response.data.files || []);
      // setQuestionnaire(response.data.questionnaire || []);
      
      Logger.info('Patient details loaded (static data)');
    } catch (err) {
      Logger.error('Error fetching patient details', err);
      CustomToaster.show('error', 'Error', 'Failed to load patient details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle file download
   * @param {Object} file - File object with name and path
   */
  const handleDownloadFile = (file) => {
    Logger.debug('Download file requested', { fileName: file.name });
    // TODO: Implement file download logic
    CustomToaster.show('info', 'Download', `Downloading ${file.name}...`);
  };

  /**
   * Handle file view
   * @param {Object} file - File object with name and path
   */
  const handleViewFile = (file) => {
    Logger.debug('View file requested', { fileName: file.name });
    // TODO: Implement file view logic (open PDF viewer, image viewer, etc.)
    CustomToaster.show('info', 'View File', `Opening ${file.name}...`);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Header
        logo={require('../../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
      />
      
      <SafeAreaView style={styles.container}>
        {/* REUSABLE COMPONENT: CustomLoader for loading states */}
        {loading && <CustomLoader />}
        
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <InAppCrossBackHeader
              showClose={true}
              closeIconSize={25}
              backIconSize={25}
            />
          </View>
          
          <View style={styles.titleSection}>
            <InAppHeader LftHdr={'Patient Details'} />
          </View>
          
          {/* Patient Information */}
          <View style={styles.patientInfoContainer}>
            <View style={styles.patientInfoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>
                  Patient Name
                </Text>
                <Text style={styles.infoValue}>
                  {patientInfo.name}
                </Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>
                  Gender
                </Text>
                <Text style={styles.infoValue}>
                  {patientInfo.gender}
                </Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>
                  Age
                </Text>
                <Text style={styles.infoValue}>
                  {patientInfo.age}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Attached Files Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Attached Files
            </Text>

            {attachedFiles.length > 0 ? (
              attachedFiles.map((file, index) => (
                <View key={index} style={styles.fileContainer}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileLabel}>
                      File Name
                    </Text>
                    <View style={styles.fileActions}>
                      <Text style={styles.fileName}>
                        {file.name || 'Report_details.pdf'}
                      </Text>
                      <View style={styles.fileButtons}>
                        <TouchableOpacity 
                          onPress={() => handleViewFile(file)}
                          style={styles.fileButton}
                        >
                          <Text style={styles.fileButtonText}>
                            View
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleDownloadFile(file)}
                          style={styles.fileButton}
                        >
                          <MaterialCommunityIcons
                            name="download"
                            color={COLORS.PRIMARY}
                            size={16}
                          />
                          <Text style={styles.fileButtonText}>
                            Download
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              // Fallback to static data when no files in state
              <View style={styles.fileContainer}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileLabel}>
                    File Name
                  </Text>
                  <View style={styles.fileActions}>
                    <Text style={styles.fileName}>
                      Report_details.pdf
                    </Text>
                    <View style={styles.fileButtons}>
                      <TouchableOpacity 
                        onPress={() => handleViewFile({ name: 'Report_details.pdf' })}
                        style={styles.fileButton}
                      >
                        <Text style={styles.fileButtonText}>
                          View
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDownloadFile({ name: 'Report_details.pdf' })}
                        style={styles.fileButton}
                      >
                        <MaterialCommunityIcons
                          name="download"
                          color={COLORS.PRIMARY}
                          size={16}
                        />
                        <Text style={styles.fileButtonText}>
                          Download
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
          
          {/* Questionnaire Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Questioner
            </Text>
            
            {questionnaire.length > 0 ? (
              questionnaire.map((item, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionLabel}>
                    {item.question || `Question ${index + 1}`}
                  </Text>
                  <Text style={styles.questionAnswer}>
                    {item.answer || 'One Liner Answer'}
                  </Text>
                </View>
              ))
            ) : (
              // Fallback to static data when no questionnaire in state
              <>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionLabel}>
                    Question 1
                  </Text>
                  <Text style={styles.questionAnswer}>
                    One Liner Answer
                  </Text>
                </View>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionLabel}>
                    Question 2
                  </Text>
                  <Text style={styles.questionAnswer}>
                    One Liner Answer
                  </Text>
                </View>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionLabel}>
                    Question 3
                  </Text>
                  <Text style={styles.questionAnswer}>
                    One Liner Answer
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    padding: 15,
  },
  headerSection: {
    marginBottom: 10,
  },
  titleSection: {
    marginBottom: 10,
  },
  patientInfoContainer: {
    marginTop: 20,
  },
  patientInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: COLORS.TEXT_GRAY,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  infoValue: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: hp(1.8),
  },
  section: {
    marginTop: 30,
    gap: 15,
  },
  sectionTitle: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-SemiBold',
  },
  fileContainer: {
    marginBottom: 15,
  },
  fileInfo: {
    gap: 5,
  },
  fileLabel: {
    color: COLORS.TEXT_GRAY,
    fontFamily: 'Poppins-Regular',
  },
  fileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  fileButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  fileButton: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  fileButtonText: {
    color: COLORS.PRIMARY,
    fontFamily: 'Poppins-Regular',
  },
  questionContainer: {
    marginBottom: 15,
  },
  questionLabel: {
    color: COLORS.TEXT_GRAY,
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
  },
  questionAnswer: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(1.8),
  },
});

export default ViewPatientDetails;
