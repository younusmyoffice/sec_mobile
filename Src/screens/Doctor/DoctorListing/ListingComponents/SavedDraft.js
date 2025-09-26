import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import axiosInstance from '../../../../utils/axiosInstance';
import CustomButton from '../../../../components/customButton/CustomButton';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCommon } from '../../../../Store/CommonContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function SavedDraft() {
  const [listingCards, setListingCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useCommon();

  const doctorListingCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`doctor/DocListingPlanDeactive/${userId}`);
      if (response.data?.DocListingPlanDeactive) {
        setListingCards(response.data.DocListingPlanDeactive);
      } else {
        setError('No listings available');
      }
    } catch (err) {
      setError('Failed to fetch listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doctorListingCards();
  }, [userId]);

  const handleActivateListing = async (doctorListId) => {
    setLoading(true);
    setError(null);  // Reset error state before deactivation
    try {
      console.log('Listing Activated: ',userId);
      const response = await axiosInstance.post(
        `doctor/docListingActiveDeactive`,
        {
          doctor_id: userId,
          doctor_list_id: doctorListId, // Pass the doctor list ID
          is_active: 1, // deactivated
        }
      );

      console.log('List', userId );
      console.log('List', doctorListId );

      console.log('Listing Activated:A ', response.data);

    
      // if (response.data && response.data.DocListingPlanDeactive) {
      //   // Filter out the deactivated listing
      //   const updatedListings = listingCards.filter(
      //     item => item.doctor_list_id !== doctorListId
      //   );
      doctorListingCards();

        // setListingCards(response.data.DocListingPlanDeactive); // Update state with filtered listings
      // }

      setModalIndex(null); // Close the modal after deactivation
    } catch (error) {
      console.error('Error deactivating listing:', error);
      setError('Failed to deactivate the listing. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteListing = async (doctorListId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`doctor/deleteDocListingPlan`, {
        doctor_list_id: doctorListId,
        doctor_id: userId,
      });

      if (response.data.response === 'Records deleted successfully') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Listing deleted successfully!',
        });

        setListingCards(prevListings => prevListings.filter(item => item.doctor_list_id !== doctorListId));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete listing. Please try again.';

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
          <View key={item.doctor_list_id} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.listingName}>{item.listing_name}</Text>
              <Text style={styles.listingId}>Listing Id: {item.doctor_list_id}</Text>
              <Text style={item.is_active ? styles.activeStatus : styles.inactiveStatus}>
                {item.is_active ? 'Active' : 'Not Active'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Activate"
                bgColor={'#fff'}
                borderRadius={30}
                borderWidth={1}
                borderColor={'#E72B4A'}
                textColor={'#E72B4A'}
                fontSize={14}
                fontWeight={'bold'}
                width={wp(35)}
                onPress={() => handleActivateListing(item.doctor_list_id)}
              />

              <CustomButton
                title="Delete"
                bgColor={'#FF0000'}
                borderRadius={30}
                textColor={'white'}
                fontSize={14}
                fontWeight={'bold'}
                width={wp(35)}
                onPress={() => handleDeleteListing(item.doctor_list_id)}
              />

              {/* <View style={styles.menuContainer}>
                <TouchableOpacity onPress={() => setModalIndex(modalIndex === index ? null : index)} style={{ alignSelf: 'center' }}>
                  <MaterialCommunityIcons name="dots-horizontal" size={15} color="#AEAAAE" />
                </TouchableOpacity>

                {modalIndex === index && (
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TouchableWithoutFeedback onPress={() => handleActivateListing(item.doctor_list_id)}>
                        <Text style={styles.modalText}>Activate listing</Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                )}
              </View> */}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noListingText}>No listings available</Text>
      )}

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderBottomWidth: 1,
    borderColor: '#C9C5CA',
    paddingBottom: 20,
    marginVertical: 10,
  },
  cardContent: {
    paddingHorizontal: 20,
    gap: 5,
  },
  listingName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#313033',
  },
  listingId: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#787579',
  },
  activeStatus: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#E72B4A',
  },
  inactiveStatus: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#313033',
  },
  buttonContainer: {
    gap: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  menuContainer: {
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 50,
    borderColor: '#E6E1E5',
    height: hp(4.5),
    width: wp(10),
  },
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
  noListingText: {
    color: '#787579',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
});
