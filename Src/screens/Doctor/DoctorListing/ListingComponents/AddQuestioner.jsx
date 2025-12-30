import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';
import axiosInstance from '../../../../utils/axiosInstance';
import { useCommon } from '../../../../Store/CommonContext';
import CustomButton from '../../../../components/customButton/CustomButton';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';

export default function AddQuestioner({ setActiveTab, listingId, editMode = false, existingListing = null, existingQuestions = [] }) {
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useCommon();

  // Populate existing questions when in edit mode
  useEffect(() => {
    if (editMode && existingQuestions && existingQuestions.length > 0) {
      console.log('📝 Populating existing questions:', existingQuestions);
      
      // Transform API data to match component's expected format
      const transformedQuestions = existingQuestions.map((q, index) => ({
        id: q.doctor_questions_id || `existing-${index}`, // Use API ID or fallback
        questionDescription: q.question || '',
        questionType: 'Short Answer', // Default type, could be enhanced
        options: [q.ans_1 || '', q.ans_2 || '', q.ans_3 || '', q.ans_4 || ''].filter(opt => opt.trim() !== ''),
        doctor_questions_id: q.doctor_questions_id, // Keep original ID for updates
      }));
      
      console.log('📝 Transformed questions:', transformedQuestions);
      setQuestions(transformedQuestions);
    }
  }, [editMode, existingQuestions]);

  const questionTypes = [
    'Short Answer',
    'Long Answer',
    'Radio Button',
    'Multiple Choice',
    'Dropdown',
  ];

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionDescription: '',
      questionType: 'Short Answer',
      options: [''],
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => setQuestions(questions.filter((q) => q.id !== id)) },
      ]
    );
  };

  const handleQuestionChange = (id, field, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (id, index, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        const updatedOptions = [...q.options];
        updatedOptions[index] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const addOption = (id) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const deleteOption = (id, index) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        const updatedOptions = q.options.filter((opt, i) => i !== index);
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question.');
      return false;
    }

    for (const question of questions) {
      if (!question.questionDescription.trim()) {
        Alert.alert('Error', 'All questions must have a description.');
        return false;
      }

      if (
        ['Radio Button', 'Multiple Choice', 'Dropdown'].includes(question.questionType)
      ) {
        const validOptions = question.options.filter((opt) => opt.trim());
        if (validOptions.length < 2) {
          Alert.alert(
            'Error',
            `Question "${question.questionDescription}" must have at least two non-empty options.`
          );
          return false;
        }
      }
    }
    return true;
  };

  const submitQuestions = async () => {
    // Check if user is authenticated
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      Alert.alert('Error', 'Please login to submit questions');
      return;
    }

    if (!listingId) {
      Alert.alert('Error', 'No listing selected. Please complete previous steps first.');
      return;
    }

    if (!validateQuestions()) return;

    setIsSubmitting(true);
    const payload = {
      questions: questions.map((q) => ({
        doctor_list_id: listingId,
        doctor_id: userId,
        question: q.questionDescription,
        question_type: q.questionType,
        ans_1: q.options[0] || '',
        ans_2: q.options[1] || '',
        ans_3: q.options[2] || '',
        ans_4: q.options[3] || '',
        doctor_questions_id: q.doctor_questions_id, // Include original ID for updates
      })),
    };

    try {
      let response;
      if (editMode) {
        // Update existing questions - we'll need to update each question individually
        console.log('📝 Updating existing questions in edit mode');
        for (const question of payload.questions) {
          if (question.doctor_questions_id) {
            // Update existing question
            const updatePayload = {
              doctor_list_id: listingId,
              doctor_id: userId,
              doctor_questions_id: question.doctor_questions_id,
              question: question.question,
              ans_1: question.ans_1,
              ans_2: question.ans_2,
              ans_3: question.ans_3,
              ans_4: question.ans_4,
            };
            response = await axiosInstance.post('createUpdatedoctorlisting/questionUpdate', updatePayload);
          } else {
            // Create new question
            response = await axiosInstance.post('createUpdatedoctorlisting/questionCreate', { questions: [question] });
          }
        }
        Alert.alert('Success', 'Questions have been successfully updated.');
      } else {
        // Create new questions
        response = await axiosInstance.post('createUpdatedoctorlisting/questionCreate', payload);
        if (response.data?.response?.StatusCode === 200) {
          Alert.alert('Success', 'Questions have been successfully submitted.');
          setActiveTab('Terms & Condition');
        } else {
          throw new Error(response.data?.response?.body || 'Failed to submit questions.');
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.response?.body ||
        err.message ||
        'Failed to submit questions. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <InAppHeader
          LftHdr={'Add Questionnaire'}
          textcolor="#E72B4A"
          fontsize={hp(2.5)}
          fontfamily={'Poppins-SemiBold'}
        />
      </View>
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.appointmentContainer}>
            <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
              <Text style={styles.addButtonText}>Add Question</Text>
              <Ionicons name="add-circle-outline" size={hp(3)} color="#E72B4A" />
            </TouchableOpacity>

            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionCard}>
                <Text style={styles.questionLabel}>Question {index + 1}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter question description"
                  placeholderTextColor="#787579"
                  value={question.questionDescription}
                  onChangeText={(text) =>
                    handleQuestionChange(question.id, 'questionDescription', text)
                  }
                />

                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Question Type:</Text>
                  <ModalDropdown
                    options={questionTypes}
                    defaultValue={question.questionType}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownMenu}
                    dropdownTextStyle={styles.dropdownText}
                    onSelect={(idx, value) =>
                      handleQuestionChange(question.id, 'questionType', value)
                    }
                  />
                </View>

                {(question.questionType === 'Radio Button' ||
                  question.questionType === 'Multiple Choice' ||
                  question.questionType === 'Dropdown') && (
                  <View style={styles.optionsContainer}>
                    <Text style={styles.optionLabel}>Options:</Text>
                    {question.options.map((option, optIndex) => (
                      <View key={optIndex} style={styles.optionRow}>
                        <TextInput
                          style={styles.optionInput}
                          placeholder={`Option ${optIndex + 1}`}
                          placeholderTextColor="#787579"
                          value={option}
                          onChangeText={(text) =>
                            handleOptionChange(question.id, optIndex, text)
                          }
                        />
                        {optIndex > 0 && (
                          <TouchableOpacity
                            onPress={() => deleteOption(question.id, optIndex)}
                            style={styles.optionDeleteButton}
                          >
                            <Ionicons
                              name="remove-circle-outline"
                              size={hp(2.5)}
                              color="#E72B4A"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                    <TouchableOpacity
                      onPress={() => addOption(question.id)}
                      style={styles.addOptionButton}
                    >
                      <Ionicons name="add-circle-outline" size={hp(2.5)} color="#E72B4A" />
                      <Text style={styles.addOptionText}>Add Option</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteQuestion(question.id)}
                >
                  <Ionicons name="trash-outline" size={hp(2.5)} color="#E72B4A" />
                  <Text style={styles.deleteButtonText}>Delete Question</Text>
                </TouchableOpacity>
              </View>
            ))}

            {questions.length > 0 && (
              <CustomButton
                title={isSubmitting ? 'Submitting...' : 'Submit Questions'}
                bgColor={'#E72B4A'}
                fontfamily={'Poppins-SemiBold'}
                textColor={'white'}
                fontSize={hp(2)}
                borderRadius={20}
                width={wp(80)}
                onPress={submitQuestions}
                disabled={isSubmitting}
              />
            )}
          </View>
        </ScrollView>
        {isSubmitting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#E72B4A" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  appointmentContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#E6E1E5',
    padding: wp(4),
    backgroundColor: '#F9F9F9',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: wp(3),
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: hp(2),
  },
  addButtonText: {
    color: '#313033',
    fontSize: hp(2),
    fontFamily: 'Poppins-SemiBold',
  },
  questionCard: {
    marginBottom: hp(2),
    padding: wp(4),
    borderWidth: 1,
    borderColor: '#E6E1E5',
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  questionLabel: {
    fontSize: hp(2),
    fontFamily: 'Poppins-SemiBold',
    color: '#313033',
    marginBottom: hp(1),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E6E1E5',
    borderRadius: 8,
    padding: wp(3),
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#313033',
    backgroundColor: '#F9F9F9',
    marginBottom: hp(1.5),
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  dropdownLabel: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#313033',
    marginRight: wp(2),
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E1E5',
    borderRadius: 8,
    padding: wp(3),
    backgroundColor: '#F9F9F9',
  },
  dropdownText: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#313033',
  },
  dropdownMenu: {
    width: wp(60),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E1E5',
    backgroundColor: '#FFF',
  },
  optionsContainer: {
    marginBottom: hp(1.5),
  },
  optionLabel: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Medium',
    color: '#313033',
    marginBottom: hp(1),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E1E5',
    borderRadius: 8,
    padding: wp(3),
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#313033',
    backgroundColor: '#F9F9F9',
    marginRight: wp(2),
  },
  optionDeleteButton: {
    padding: wp(1),
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  addOptionText: {
    marginLeft: wp(1),
    color: '#E72B4A',
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  deleteButtonText: {
    marginLeft: wp(1),
    color: '#E72B4A',
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});