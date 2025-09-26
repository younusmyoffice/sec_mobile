// import {
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import React from 'react';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// export default function ChatsScreen() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#fff',
//         borderColor: '#E6E1E5',
//         borderWidth: 1,
//         borderRadius: 8,
//         height: hp(72),
//       }}>
//       <View
//         style={{
//           height: 80,
//           borderBottomColor: '#E6E1E5',
//           borderBottomWidth: 1,
//           justifyContent: 'center',
//           padding: 10,
//           paddingHorizontal: 20,
//         }}>
//         <Text
//           style={{
//             fontFamily: 'Poppins-SemiBold',
//             color: '#313003',
//             fontSize: 16,
//           }}>
//           Chats
//         </Text>
//       </View>


//       <ScrollView contentContainerStyle={{paddingBottom: 20}}>
//         <TouchableWithoutFeedback>
//           <View
//             style={{
//               height: 80,
//               justifyContent: 'space-between',
//               paddingHorizontal: 20,
//               alignItems: 'center',
//               borderBottomColor: '#E6E1E5',
//               borderBottomWidth: 1,
//               flexDirection: 'row',
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginRight: 10,
//               }}>
//               <Image
//                 style={{
//                   width: 50,
//                   height: 50,
//                   borderRadius: 30,
//                   marginRight: 10,
//                 }}
//                 source={require('../../assets/cimg.png')}
//               />
//               <Text
//                 style={{
//                   fontFamily: 'Poppins-SemiBold',
//                   color: '#313003',
//                   fontSize: 14,
//                 }}>
//                 John doe
//               </Text>
//             </View>
//             <View
//               style={{
//                 height: 24,
//                 width: 24,
//                 backgroundColor: '#E72B4A',
//                 borderRadius: 15,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <Text
//                 style={{
//                   color: '#fff',
//                   fontFamily: 'Poppins-Medium',
//                   fontSize: 12,
//                 }}>
//                 1
//               </Text>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({});

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function ChatsScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>ChatsScreen</Text>
      <View>
        <Text>Hello from ChatsScreen</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Join_Screen')} style={{height: 50,backgroundColor:'#E72B4A',}}><Text style={{color:'#fff'}}>go to Join screen</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChatHome')} style={{height: 50,backgroundColor:'#E72B4A',}}><Text style={{color:'#fff'}}>go to Join screen</Text></TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({})