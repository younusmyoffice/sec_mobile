/**
 * ============================================================================
 * DIAGNOSTIC REPORT - SHARE LIST
 * ============================================================================
 *
 * PURPOSE:
 * List tests eligible for report sharing and provide an upload modal to attach
 * and share a report with the patient.
 *
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls (access token handled
 *   centrally and reused across the app).
 * - Validates userId before API calls.
 * - Validates selected file type and size before upload.
 *
 * ERROR HANDLING:
 * - All user-facing feedback via CustomToaster (no Alerts).
 * - Graceful fallbacks when API returns unexpected structures.
 *
 * REUSABLES:
 * - CustomTable for listing, CustomButton and CustomToaster.
 * - Modal for upload (could be extracted if needed elsewhere).
 */
import {View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ShareList = () => {
    const navigation=useNavigation();
    const [sharedlist, setSharedlist] = useState([]);
  const [load, setLoad] = useState(false);
        const {userId} = useCommon();

    // File upload modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const header = [
      'Name/Booking ID',
      'Test Name',
      'Date & Time',
      'Status',
      'Amount',
      'Action'
    ];
    const handleRecieved = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for share list', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoad(true);
    try {
      Logger.api('GET', `hcf/reportShareList/${userId}`);
        const response = await axiosInstance.get(`hcf/reportShareList/${userId}`);

      const raw = response?.data?.response;
      const list = Array.isArray(raw) ? raw : [];

      // Ensure each item has a working Action and normalized fields
      const dataWithAction = list.map(item => ({
        ...item,
        Action: 'Share',
        report_name: item.test_name || item.testname || 'Test Report',
        report_path: null,
      }));

      setSharedlist(dataWithAction);
      Logger.info('Share list fetched', { count: dataWithAction.length });
      } catch (e) {
      Logger.error('Error fetching share list', e);
      const errorMessage = e?.response?.data?.message || 'Failed to fetch share list. Please try again later.';
      CustomToaster.show('error', 'Error', errorMessage);
      setSharedlist([]);
      } finally {
      setLoad(false);
      }
    };
    useEffect(() => {
      handleRecieved();
    }, []);
  
const handleSendReport=(reportName, reportPath)=>{
  Logger.debug('Open upload modal', { reportName, hasReportPath: !!reportPath });
  
  // Find the corresponding row data from the current data
  const currentData = sharedlist.length > 0 ? sharedlist : ddata;
  const testData = currentData.find(item => 
    item.report_name === reportName || 
    item.test_name === reportName || 
    item.testname === reportName
  );
  
  if (testData) {
    const testInfo = {
      test_id: testData.test_id || testData.appointment_id,
      patient_name: `${testData.first_name} ${testData.last_name}`.trim(),
      test_name: testData.test_name || testData.testname || reportName,
      report_path: reportPath
    };
    
    setSelectedTest(testInfo);
    setShowUploadModal(true);
  } else {
    // Fallback if we can't find the test data
    const testInfo = {
      test_id: 'unknown',
      patient_name: 'Patient',
      test_name: reportName || 'Test Report',
      report_path: reportPath
    };
    
    setSelectedTest(testInfo);
    setShowUploadModal(true);
  }
}

    // File upload functions
    const handleFileUpload = async () => {
      try {
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
          allowMultiSelection: false,
        });

        if (results.length > 0) {
          const file = results[0];

          // VALIDATION: Require name/type/uri
          if (!file?.name || !file?.type || !file?.uri) {
            CustomToaster.show('error', 'Invalid file selected. Please try another file.');
            return;
          }

          // VALIDATION: Allowed types and size guard (<= 10 MB)
          const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
          const maxBytes = 10 * 1024 * 1024;
          if (!allowedTypes.includes(file.type)) {
            CustomToaster.show('error', 'Only PDF, JPG, or PNG files are allowed.');
            return;
          }
          if (typeof file.size === 'number' && file.size > maxBytes) {
            CustomToaster.show('error', 'File is too large. Max size is 10 MB.');
            return;
          }

          setSelectedFile(file);
          CustomToaster.show('success', 'Success', `File selected: ${file.name}`);
        }
      } catch (error) {
        if (!DocumentPicker.isCancel(error)) {
          Logger.error('File picker error', error);
          CustomToaster.show('error', 'Error', 'Error selecting file');
        }
      }
    };

    const convertToBase64 = async (file) => {
      try {
        const base64 = await RNFS.readFile(file.uri, 'base64');
        return `data:${file.type};base64,${base64}`;
      } catch (error) {
        Logger.error('Base64 conversion failed', error);
        throw error;
      }
    };

    const handleUploadReport = async () => {
      if (!selectedFile) {
        CustomToaster.show('error', 'Error', 'Please select a file to upload');
        return;
      }

      // SECURITY: Validate userId and test_id
      if (!userId || !selectedTest?.test_id) {
        CustomToaster.show('error', 'Error', 'Invalid request. Please try again.');
        return;
      }

      setIsUploading(true);
      try {
        const base64File = await convertToBase64(selectedFile);
        const uploadData = {
          test_id: String(selectedTest.test_id).trim(),
          staff_id: String(userId).trim(),
          fileName: String(selectedFile.name || 'report').trim(),
          file: base64File,
        };

        Logger.api('POST', 'hcf/testReportUpload', { fileName: uploadData.fileName });
        const response = await axiosInstance.post('hcf/testReportUpload', uploadData);

        if (response?.data?.response) {
          CustomToaster.show('success', 'Success', 'Report uploaded successfully');
          // Close modal and refresh data
          setShowUploadModal(false);
          setSelectedTest(null);
          setSelectedFile(null);
          handleRecieved();
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        Logger.error('Upload error', error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to upload report. Please try again.';
        CustomToaster.show('error', 'Error', errorMessage);
      } finally {
        setIsUploading(false);
      }
    };

    const closeUploadModal = () => {
      setShowUploadModal(false);
      setSelectedTest(null);
      setSelectedFile(null);
    };

  const ddata = [
    {
      id: 1,
      profile_picture: null, // Use null instead of require() to avoid number type
      first_name: 'Patient',
      middle_name: '',
      last_name: 'Name',
      department_name: 'Diagnostic',
      appointment_id: 'TST00012',
      test_id: 'TST00012',
      examination_date: '19:00-20:00',
      testname: 'Rad-1',
      test_name: 'Rad-1',
      status: 'requested',
      amount: 12,
      details: 'Share',
      Action: 'Share',
      report_name: 'Rad-1',
      report_path: null,
    },
  ];
  return (
    <View>
      <CustomTable
        header={header}
        isUserDetails={true}
        flexvalue={1}
        rowDataCenter={true}
        textCenter={'center'}
        data={sharedlist.length > 0 ? sharedlist : ddata}
        roundedBtn={'Action'}
        functionKey={"Action"}
        onpress={handleSendReport}
        backgroundkey={'Action'}
        loading={load}
      />

      {/* File Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeUploadModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScrollView}>
              <SafeAreaView style={styles.modalSafeArea}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Upload Test Report</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeUploadModal}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {selectedTest && (
                  <View style={styles.testInfo}>
                    <Text style={styles.testInfoTitle}>Test Details:</Text>
                    <Text style={styles.testInfoText}>
                      Test ID: {selectedTest.test_id}
                    </Text>
                    <Text style={styles.testInfoText}>
                      Patient: {selectedTest.patient_name || 'N/A'}
                    </Text>
                    <Text style={styles.testInfoText}>
                      Test Name: {selectedTest.test_name || 'N/A'}
                    </Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.fileButton}
                    onPress={handleFileUpload}
                    activeOpacity={0.7}>
                    <Text style={styles.fileButtonText}>
                      {selectedFile ? selectedFile.name : 'Select File'}
                    </Text>
                    <Text style={styles.fileButtonSubtext}>
                      {selectedFile ? 'Tap to change file' : 'Tap to select PDF or image'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedFile && (
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileInfoTitle}>Selected File:</Text>
                    <Text style={styles.fileInfoText}>Name: {selectedFile.name}</Text>
                    <Text style={styles.fileInfoText}>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                    <Text style={styles.fileInfoText}>
                      Type: {selectedFile.type || 'Unknown'}
                    </Text>
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <CustomButton
                    title={isUploading ? 'Uploading...' : 'Upload Report'}
                    onPress={handleUploadReport}
                    disabled={isUploading}
                    bgColor={isUploading ? COLORS.GRAY_LIGHT : COLORS.PRIMARY}
                    textColor={COLORS.TEXT_WHITE}
                    borderRadius={10}
                    height={hp(6)}
                  />
                </View>

                <View style={styles.instructions}>
                  <Text style={styles.instructionsTitle}>Instructions:</Text>
                  <Text style={styles.instructionsText}>
                    • Select a PDF or image file containing the test report
                  </Text>
                  <Text style={styles.instructionsText}>
                    • Click "Upload Report" to complete the process
                  </Text>
                  <Text style={styles.instructionsText}>
                    • The report will be automatically shared with the patient
                  </Text>
                </View>
              </SafeAreaView>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShareList;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: wp(90),
    maxHeight: hp(80),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalScrollView: {
    maxHeight: hp(75),
  },
  modalSafeArea: {
    padding: wp(4),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: wp(4),
    color: '#666',
    fontWeight: 'bold',
  },
  testInfo: {
    backgroundColor: '#f0f8ff',
    padding: wp(3),
    borderRadius: 8,
    marginBottom: hp(2),
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  testInfoTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  testInfoText: {
    fontSize: wp(3.5),
    color: '#666',
    marginBottom: hp(0.5),
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  fileButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#E6E1E5',
    borderRadius: 10,
    padding: wp(4),
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  fileButtonText: {
    fontSize: wp(4),
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  fileButtonSubtext: {
    fontSize: wp(3),
    color: '#666',
  },
  fileInfo: {
    backgroundColor: '#f0f8ff',
    padding: wp(3),
    borderRadius: 8,
    marginBottom: hp(2),
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  fileInfoTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  fileInfoText: {
    fontSize: wp(3.5),
    color: '#666',
    marginBottom: hp(0.5),
  },
  buttonContainer: {
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  instructions: {
    backgroundColor: '#f9f9f9',
    padding: wp(4),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  instructionsTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  instructionsText: {
    fontSize: wp(3.5),
    color: '#666',
    marginBottom: hp(0.5),
    lineHeight: hp(2.5),
  },
});
