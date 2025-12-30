import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomButton from '../../../../components/customButton/CustomButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCommon } from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';
import Toast from 'react-native-toast-message';

export default function ActiveListing({ onEditListing }) {
  const [listingCards, setListingCards] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);  
  const [error, setError] = useState(null);
  const { userId } = useCommon();

  const doctorListingCards = async () => {
    // Check if user is authenticated
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      console.log('⚠️ User not authenticated, skipping active listings fetch');
      setError('Please login to view listings');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`doctor/DocListingPlanActive/${userId}`);
      console.log('Active listings response:', response.data);
      
      if (response.data && response.data.DocListingPlanActive) {
        setListingCards(response.data.DocListingPlanActive);
      } else {
        setError('No active listings available');
      }
    } catch (err) {
      console.error('Error fetching active listings:', err);
      const errorMessage = err?.response?.data?.error || 'Failed to fetch listings. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doctorListingCards();
  }, []);

  const handleDeactivateListing = async (doctorListId) => {
    // Check if user is authenticated
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Please login to manage listings',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Deactivating listing:', { doctor_id: userId, doctor_list_id: doctorListId });
      
      const response = await axiosInstance.post(
        `doctor/docListingActiveDeactive`,
        {
          doctor_id: parseInt(userId),
          doctor_list_id: parseInt(doctorListId),
          is_active: 0, // deactivated
        }
      );
      
      console.log('Listing deactivated successfully:', response.data);
      
      // Refresh the listings after successful deactivation
      await doctorListingCards();
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Listing deactivated successfully',
      });
      
      setModalIndex(null);
    } catch (error) {
      console.error('Error deactivating listing:', error);
      const errorMessage = error?.response?.data?.error || 'Failed to deactivate the listing. Please try again later.';
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleEditListing = (listingData) => {
    console.log('📝 Opening edit mode for listing:', listingData);
    if (onEditListing) {
      onEditListing(listingData);
    } else {
      Alert.alert('Error', 'Edit functionality not available');
    }
  };

  const handleDeleteListing = async (doctorListId) => {
    // Check if user is authenticated
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Please login to manage listings',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('🗑️ Deleting listing:', { 
        doctor_id: userId, 
        doctor_list_id: doctorListId,
        doctor_id_type: typeof userId,
        doctor_list_id_type: typeof doctorListId
      });
      
      const payload = {
        doctor_list_id: parseInt(doctorListId),
        doctor_id: parseInt(userId),
      };
      
      console.log('📤 Delete payload:', payload);
      
      const response = await axiosInstance.post(`doctor/deleteDocListingPlan`, payload);

      console.log('Delete response:', response.data);

      if (response.data && response.data.response) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Listing deleted successfully',
        });

        // Remove the deleted listing from state
        setListingCards(prevListings => 
          prevListings.filter(item => item.doctor_list_id !== doctorListId)
        );
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete the listing.';
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setModalIndex(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E72B4A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      {listingCards?.length > 0 ? (
        listingCards.map((item, index) => (
          <View key={item.doctor_list_id} style={{ borderBottomWidth: 1, borderColor: '#C9C5CA', paddingBottom: 20, marginVertical: 10 }}>
            <View style={{ paddingHorizontal: 20, gap: 5 }}>
              <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#313033' }}>{item.listing_name}</Text>
              <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 10, color: '#787579' }}>Listing Id: {item.doctor_list_id}</Text>
              <View>
                {item.is_active ? (
                  <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#E72B4A' }}>Active</Text>
                ) : (
                  <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#313033' }}>Not Active</Text>
                )}
              </View>
            </View>

            <View style={{ gap: 10, justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', marginTop: 25 }}>
              <CustomButton
                title="Edit"
                bgColor={'#E72B4A'}
                borderRadius={30}
                textColor={'white'}
                fontSize={14}
                fontWeight={'bold'}
                width={wp(25)}
                onPress={() => handleEditListing(item)}
              />

              <CustomButton
                title="Deactivate"
                bgColor={'#fff'}
                borderRadius={30}
                borderWidth={1}
                borderColor={'#E72B4A'}
                textColor={'#E72B4A'}
                fontSize={14}
                fontWeight={'bold'}
                width={wp(35)}
                onPress={() => handleDeactivateListing(item.doctor_list_id)}
              />

              <CustomButton
                title="Delete"
                bgColor={'#FF0000'}
                borderRadius={30}
                textColor={'white'}
                fontSize={14}
                fontWeight={'bold'}
                width={wp(25)}
                onPress={() => handleDeleteListing(item.doctor_list_id)}
              />

              {/* <View
                style={{
                  borderWidth: 1.5,
                  padding: 10,
                  borderRadius: 50,
                  borderColor: '#E6E1E5',
                  height: hp(4.5),
                  width: wp(10),
                }}
              >
                <TouchableOpacity onPress={() => setModalIndex(modalIndex === index ? null : index)} style={{ alignSelf: 'center' }}>
                  <MaterialCommunityIcons name="dots-horizontal" size={15} color="#AEAAAE" />
                </TouchableOpacity>

                {modalIndex === index && (
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TouchableWithoutFeedback onPress={() => handleDeactivateListing(item.doctor_list_id)}>
                        <Text style={styles.modalText}>De-Activate listing</Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                )}
              </View> */}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noListingContainer}>
          <Text style={styles.noListingText}>No active listings available</Text>
          <Text style={styles.noListingSubText}>Create a new listing to get started</Text>
        </View>
      )}

      {/* Toast Notification */}
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 10,
    right: 40,
    zIndex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C9C5CA',
    padding: 10,
    minWidth: 120,
    top: -10,
  },
  modalText: {
    fontSize: hp(1.4),
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  noListingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noListingText: {
    color: '#787579',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  noListingSubText: {
    color: '#787579',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
});
