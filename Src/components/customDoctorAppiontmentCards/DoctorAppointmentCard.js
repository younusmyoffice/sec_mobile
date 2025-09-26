// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import React, {useState} from 'react';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
// import {useNavigation} from '@react-navigation/native';

// import CustomButton from '../customButton/CustomButton';

// export default function DoctorAppointmentCard({AppoiStatus}) {
//   const navigation = useNavigation();

//   {
//     const CardData = [
//       {
//         id: 1,
//         name: 'Ronda Rosy',
//         date: '10-3-2024',
//         day: 'Today',
//         attachedReport: 'report.pdf',
//         callStatus: 'Messaging',
//       },
//       {
//         id: 2,
//         name: 'John Doe',
//         date: '11-3-2024',
//         day: 'Tomorrow',
//         attachedReport: 'scan_results.pdf',
//         callStatus: 'In Call',
//       },
//       // Additional cards
//     ];

//     const [modalVisible, setModalVisible] = useState(null);

//     return (
//       <View style={{backgroundColor: '#fff', gap: 10}}>
//         {CardData.map(item => (
//           <View key={item.id} style={styles.cardContainer}>
//             <View style={styles.textContainer}>
//               <Image
//                 style={{
//                   borderRadius: 20,
//                   elevation: 10,
//                   height: hp(12),
//                   width: wp(24),
//                 }}
//                 source={require('../../assets/cimg.png')}
//               />
//               <Text style={styles.name}>{item.name}</Text>
//               {/* Render the status button if AppoiStatus is 'upcoming' */}
//               {AppoiStatus === 'upcoming' && (
//                 <View style={styles.statusButton}>
//                   <Text style={styles.statusText}>{item.callStatus}</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.detailsContainer}>
//               <Text style={styles.detailsText}>Schedule | </Text>
//               <Text style={styles.detailsText}>{item.day} | </Text>
//               <Text style={styles.detailsText}>{item.date} | </Text>
//               <Text style={styles.detailsText}>
//                 Attached Reports: {item.attachedReport}
//               </Text>
//               <TouchableOpacity>
//                 <Text style={styles.viewText}>View</Text>
//               </TouchableOpacity>
//             </View>


//           <View style={{height: 1, backgroundColor: '#E6E1E5'}}></View>
//         </View>
//       ))}
//     </View>
//   );
// }




//             {/* Render 'Book Appointment' if AppoiStatus is 'request' */}
//             {AppoiStatus === 'request' && (
//               <View style={styles.buttonRow}>
//                 <CustomButton
//                   title="Accept"
//                   bgColor={'#E72B4A'}
//                   borderRadius={30}
//                   textColor={'white'}
//                   fontSize={14}
//                   fontWeight={'bold'}
//                   width={wp(70)}
//                 />
//                 <TouchableOpacity
//                   style={styles.kebabButton}
//                   onPress={() =>
//                     setModalVisible(modalVisible === item.id ? null : item.id)
//                   }>
//                   <MaterialCommunityIcons
//                     name="kebab-horizontal"
//                     size={20}
//                     color={'#E6E1E5'}
//                   />
//                 </TouchableOpacity>

//                 {modalVisible === item.id && (
//                   <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                       <TouchableWithoutFeedback
//                         onPress={() => {
//                           navigation.navigate('RejectAppointmentReq');
//                           setModalVisible(false);
//                         }}>
//                         <Text style={styles.modalText}>Reject</Text>
//                       </TouchableWithoutFeedback>
//                     </View>
//                   </View>
//                 )}
//               </View>
//             )}

//             {AppoiStatus === 'upcoming' && (
//               <View style={styles.buttonRow}>
//                 <CustomButton
//                   title="Join"
//                   bgColor={'#E72B4A'}
//                   borderRadius={30}
//                   textColor={'white'}
//                   fontSize={14}
//                   fontWeight={'bold'}
//                   width={wp(70)}
//                 />
//                 {patientUpcommingMenu && (
//                   <>
//                     <TouchableOpacity
//                       style={styles.kebabButton}
//                       onPress={() =>
//                         setModalVisible(
//                           modalVisible === item.id ? null : item.id,
//                         )
//                       }>
//                       <MaterialCommunityIcons
//                         name="kebab-horizontal"
//                         size={20}
//                         color={'#E6E1E5'}
//                       />
//                     </TouchableOpacity>

//                     {modalVisible === item.id && (
//                       <View style={styles.modalContainer}>
//                         <View style={styles.modalContent}>
//                           <TouchableWithoutFeedback
//                             onPress={() => setModalVisible(false)}>
//                             <Text style={styles.modalText}>Reject</Text>
//                           </TouchableWithoutFeedback>
//                         </View>
//                       </View>
//                     )}
//                   </>
//                 )}
//               </View>
//             )}
//             <View style={{height: 1, backgroundColor: '#E6E1E5'}}></View>
//           </View>
//         ))}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   cardContainer: {
//     // padding: 10,
//     // borderBottomWidth: 1,
//     // borderBottomColor: '#E6E1E5',
//     gap: 10,
//   },
//   image: {
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//   },
//   textContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     flex: 1,
//   },
//   name: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     color: '#313003',
//   },
//   statusButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#E72B4A',
//     borderRadius: 20,
//   },
//   statusText: {
//     color: '#E72B4A',
//     fontFamily: 'Poppins-Medium',
//     fontSize: 10,
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingRight: 12,
//     top: -10,
//     left: 50,
//   },
//   detailsText: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 12,
//     color: '#787579',
//   },
//   viewText: {
//     fontFamily: 'Poppins-Medium',
//     fontSize: 12,
//     color: '#E72A4B',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//     gap: 5,
//   },
//   kebabButton: {
//     borderWidth: 1.5,
//     padding: 10,
//     borderRadius: 30,
//     borderColor: '#E6E1E5',
//     position: 'relative',
//   },
//   modalContainer: {
//     position: 'absolute',
//     flexDirection: 'row',
//     left: 170,
//   },
//   modalContent: {
//     minWidth: 100,
//     borderRadius: 10,
//     marginBottom: 10,
//     backgroundColor: 'white',
//     elevation: 10,
//     padding: 10,
//   },
//   modalText: {
//     fontSize: 20,
//     color: 'black',
//   },
// });
