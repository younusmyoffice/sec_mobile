import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import SkeletonLoader from '../customSkeleton/SkeletonLoader';
import { getProfileImageSource } from '../../utils/imageUtils';
const CustomTable = ({
  textCenter,
  header,
  data,
  isUserDetails,
  rowDataCenter,
  flexvalue,
  onpress,
  backgroundkey,
  roundedBtn,
  functionKey,
  amount,
  loadmore,
  loading,
  enableMenu,
  acceptPress,
  rejectPress,
  // onMenuPress,
  width = 1200,
  id,
}) => {
  const navigation = useNavigation();
  const [load, setload] = useState(true);
  const [modalIndex, setModalIndex] = useState(null); // Keep track of which row's menu is open

  const handleOpen = index => {
    // Toggle modal visibility for the given row
    setModalIndex(modalIndex === index ? null : index);
  };

  console.log(id);
  console.log("data from custom table",data)
  
  // Debug: Log the first row to see the exact structure
  if (data && data.length > 0) {
    console.log("🔍 First row data structure:", Object.keys(data[0]));
    console.log("🔍 First row department_name:", data[0].department_name);
    console.log("🔍 First row full data:", data[0]);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true} style={styles.scrollView} >
        <View style={[styles.tableContainer, {width: width}]}>
          <View style={styles.row}>
            {header?.length > 0 ? (
              header?.map((head, i) => (
                <View
                  style={[styles.headerCell, {flex: i == 0 ? flexvalue : 1}]}>
                  <Text style={[styles.headerText, {textAlign: textCenter}]}>
                    {head}
                  </Text>
                </View>
              ))
            ) : (
              <Text>no header</Text>
            )}
          </View>
          <View style={styles.divider} />
          <ScrollView onScroll={loadmore}>
            {loading ? (
              <>
                <View style={{padding: 10, gap: 10}}>
                  {Array.from({length: 4}).map((_, index) => (
                    <SkeletonLoader
                      // key={index}
                      height={hp(5)}
                      width={1200}
                      borderRadius={10}
                    />
                  ))}
                </View>
              </>
            ) : data?.length > 0 ? (
              data?.map((rowdata, i) => (
                <React.Fragment key={i}>
                  <TouchableWithoutFeedback onPress={onpress}>
                    <View style={styles.row}>
                      {isUserDetails && (
                        <View style={[styles.cell, {flex: 2}]}>
                          <View style={styles.cellContent}>
                            <Image
                              source={getProfileImageSource(rowdata.profile_picture)}
                              style={styles.image}
                              onError={() => {
                                console.log('🖼️ CustomTable image failed to load');
                              }}
                            />
                            <View>
                              <Text style={styles.nameText}>
                                {rowdata.first_name +
                                  ' ' +
                                  rowdata.middle_name +
                                  ' ' +
                                  rowdata.last_name}
                              </Text>
                              <Text style={styles.detailsText}>
                                {rowdata.department_name || rowdata.dept} | Booking Id:
                                {rowdata.appointment_id || rowdata.test_id}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                      {(() => {
                        // Create ordered fields array to match header order
                        const orderedFields = [];
                        const remainingFields = [];
                        
                        // Process fields in order
                        Object.entries(rowdata).forEach(([key, value]) => {
                          // Skip excluded fields
                          if (key === 'image' ||
                              key === 'first_name' ||
                              key === 'middle_name' ||
                              key === 'last_name' ||
                              key === 'id' ||
                              key === 'booking_id' ||
                              key === 'func' ||
                              key === 'doctor_id' ||
                              key === 'appointment_id' ||
                              key === 'action_id' ||
                              key === 'user_id' ||
                              key === 'suid' ||
                              key === 'patient_id' ||
                              key === 'appointment_id' ||
                              key === 'role_id' ||
                              key === 'suid' ||
                              key === 'clinic_status' ||
                              key === 'dept_id' ||
                              key === 'department_id' ||
                              key === 'report_path' ||
                              (isUserDetails ? key === 'profile_picture' : false) ||
                              key === 'hcf_id' ||
                              key === 'test_id' ||
                              key === 'updated_at') {
                            return;
                          }
                          
                          // Add profile_picture at the end
                          if (key === 'profile_picture') {
                            remainingFields.push([key, value]);
                          } else {
                            orderedFields.push([key, value]);
                          }
                        });
                        
                        // Combine ordered fields with profile_picture at the end
                        const finalFields = [...orderedFields, ...remainingFields];
                        
                        return finalFields.map(([key, value], index) => {
                        console.log(`📋 CustomTable field: ${key} = ${value}`);
                        // Special handling for department_name
                        if (key === 'department_name') {
                          console.log(`🏥 Department field found: ${key} = ${value}`);
                        }
                        
                        // Special handling for book_time
                        if (key === 'book_time') {
                          console.log(`🕐 Book time field found: ${key} = ${value}`);
                        }
                        
                        // Special handling for profile_picture
                        if (key === 'profile_picture') {
                          console.log(`🖼️ Profile picture field found: ${key} = ${value ? 'present' : 'missing'}`);
                        }
                        
                        // Convert time to 12-hour format
                        let displayValue = value;
                        if ((key === 'appointment_time' || key === 'book_time') && value) {
                          try {
                            // Handle different time formats
                            if (value.includes('T')) {
                              // ISO format: "2025-01-18T03:55:44.000Z"
                              // const date = new Date(value);
                              // const hours = date.getHours();
                              // const minutes = date.getMinutes();
                              // const ampm = hours >= 12 ? 'PM' : 'AM';
                              // const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                              // displayValue = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
                              displayValue = `${value}`
                              console.log(`🕐 ISO Time converted: ${value} → ${displayValue}`);
                            } else if (value.includes('-')) {
                              // Format like "17-00"
                              const timeParts = value.split('-');
                              if (timeParts.length >= 2) {
                                const hours = parseInt(timeParts[0]);
                                const minutes = timeParts[1];
                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                                displayValue = `${displayHours}:${minutes} ${ampm}`;
                                console.log(`🕐 Dash Time converted: ${value} → ${displayValue}`);
                              }
                            } else if (value.includes(':')) {
                              // Format like "16:11:00" or "00:02:00"
                              const timeParts = value.split(':');
                              if (timeParts.length >= 2) {
                                // const hours = parseInt(timeParts[0]);
                                // const minutes = timeParts[1];
                                // const ampm = hours >= 12 ? 'PM' : 'AM';
                                // const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                                // displayValue = `${displayHours}:${minutes} ${ampm}`;
                                 displayValue = `${value}`
                                console.log(`🕐 Colon Time converted: ${value} → ${displayValue}`);
                              }
                            } else if (value.includes('AM') || value.includes('PM')) {
                              // Already in 12-hour format, keep as is
                              displayValue = value;
                              console.log(`🕐 Already 12-hour format: ${value}`);
                            }
                          } catch (error) {
                            console.error('❌ Time conversion error:', error);
                            displayValue = value; // Fallback to original value
                          }
                        }
                        
                        return key !== 'image' &&
                        key !== 'first_name' &&
                        key !== 'middle_name' &&
                        key !== 'last_name' &&
                        key !== 'id' &&
                        key !== 'booking_id' &&
                        key !== 'func' &&
                        key !== 'doctor_id' &&
                        key !== 'appointment_id' &&
                        key !== 'action_id' && //suid
                        key !== 'user_id' &&
                        key !== 'suid' &&
                        key !== 'patient_id' &&
                        key !== 'appointment_id' &&
                        key !== 'role_id' &&
                        key !== 'suid' &&
                        key !== 'clinic_status' &&
                        key !== 'dept_id' &&
                        key !== 'department_id' &&
                        key !== 'report_path' &&
                        (isUserDetails ? key !== 'profile_picture' : true) &&
                        key !== 'hcf_id' &&
                        key !== 'test_id' &&
                        key!=='updated_at' ? (
                          <View
                            key={index}
                            style={[
                              styles.cell,
                              {
                                flex: 1,
                                backgroundColor:
                                  key === backgroundkey
                                    ? '#FDEAED'
                                    : key === roundedBtn
                                    ? 'white'
                                    : '',
                                borderRadius:
                                  key === backgroundkey || roundedBtn ? 15 : '',
                                borderColor:
                                  key === roundedBtn ? '#E72B4A' : '',
                                borderWidth: key === roundedBtn ? 1.5 : 0,
                              },
                            ]}>
                            <TouchableWithoutFeedback
                              onPress={
                                key === functionKey
                                  ? () =>
                                      onpress(
                                        rowdata.report_name,
                                        rowdata.report_path,
                                      )
                                  : null
                              }>
                              <Text
                                style={[
                                  styles.cellText,
                                  {
                                    textAlign:
                                      rowDataCenter == true ? 'center' : '',
                                    color:
                                      key === backgroundkey
                                        ? '#E72B4A'
                                        : key === roundedBtn
                                        ? '#E72B4A'
                                        : key === amount
                                        ? '#E72B4A'
                                        : 'black',
                                  },
                                ]}>
                                {key === 'status' ? (
                                  value === 1 ? (
                                    <Text
                                      style={{
                                        color: '#E72B4A',
                                        fontWeight: 'bold',
                                      }}>
                                      Completed
                                    </Text>
                                  ) : value === 0 ? (
                                    <Text
                                      style={{
                                        color: 'grey',
                                        fontWeight: 'bold',
                                      }}>
                                      Not Completed
                                    </Text>
                                  ) : value === 'canceled' ? (
                                    <Text
                                      style={{
                                        color: 'grey',
                                        fontWeight: 'bold',
                                      }}>
                                      Canceled
                                    </Text>
                                  ) : value === 'completed' ? (
                                    <Text
                                      style={{
                                        color: '#E72B4A',
                                        fontWeight: 'bold',
                                      }}>
                                      Completed
                                    </Text>
                                  ) : value === 'Active' ? (
                                    
                                    <Text
                                      style={{
                                        color: '#E72B4A',
                                        fontWeight: 'bold',
                                      }}>
                                      {displayValue}
                                    </Text>
                                  ): value === 'Inactive' ? (
                                    <Text
                                      style={{
                                        color: 'grey',
                                        fontWeight: 'bold',
                                      }}>
                                      {displayValue}
                                    </Text>
                                  ): (
                                    displayValue
                                  )
                                ) : key === 'profile_picture' ? (
                                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                      source={getProfileImageSource(value)}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        backgroundColor: '#f0f0f0'
                                      }}
                                      onError={() => console.log('🖼️ Image failed to load:', value)}
                                    />
                                  </View>
                                ) : (
                                  <Text>{displayValue}</Text>
                                )}
                              </Text>
                            </TouchableWithoutFeedback>
                          </View>
                        ) : null;
                        });
                      })()}
                      {enableMenu && (
                        <View style={[styles.cell, {flex: 1}]}>
                          <TouchableOpacity onPress={() => handleOpen(i)}>
                            <MaterialCommunityIcons
                              name="dots-vertical"
                              size={24}
                              color="#E72B4A"
                              style={{textAlign: 'center'}}
                            />
                          </TouchableOpacity>
                          {modalIndex === i && (
                            <View
                              style={{
                                position: 'absolute',
                                right: 0,
                                backgroundColor: 'white',
                                elevation: 10,
                                borderRadius: 10,
                                padding: 8,
                                marginTop: 10,
                              }}>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  console.log("id status",rowdata[id])
                                  acceptPress(rowdata[id],1)}}>
                                <Text
                                  style={{
                                    fontSize: hp(2),
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {/* {list.menuItem} */}
                                  Accept
                                </Text>
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback
                                onPress={() => rejectPress(rowdata[id],0)}>
                                <Text
                                  style={{
                                    fontSize: hp(2),
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {/* {list.menuItem} */}
                                  Reject
                                </Text>
                              </TouchableWithoutFeedback>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.divider} />
                </React.Fragment>
              ))
            ) : (
              <View style={{marginVertical: 100,alignSelf:'flex-start',}}>
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'Poppins-Medium',
                    fontSize: hp(2),
                    textAlign: 'center',
                    margin:30,
                    marginHorizontal:70,
                  }}>
                  No Data Found . . . . . 
                </Text>
              </View>
            )}
          </ScrollView>
          {loading ? (
            <View>
              <TouchableOpacity>
                <ActivityIndicator color={'#E72B4A'} size={'large'} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    marginBottom: 20,
  },
  tableContainer: {
    borderColor: '#AEAAAE',
    borderWidth: 1,
    borderRadius: 12,
    // width: 600,
    height: hp(55),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // gap:10
  },
  headerCell: {
    padding: 5,
    // alignSelf:'center'
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#313033',
    fontFamily: 'Poppins-Medium',
  },
  cell: {
    // alignItems:'center',
    justifyContent: 'center',
    padding: 5,
  },
  cellContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap:10
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 15,
    resizeMode: 'contain',
    marginRight: 10,
  },
  nameText: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
  },
  detailsText: {
    color: '#939094',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  cellText: {
    color: 'black',
    // backgroundColor:'red',
    // minWidth:150
  },
  divider: {
    height: 1,
    backgroundColor: '#AEAAAE',
  },
});
export default CustomTable;
{
  /* <View style={[styles.cell, {flex: 1}]}>
{rowdata.is_active ? (
  <Text
    style={[
      styles.cellText,
      {
        textAlign: 'center',
        color: rowdata.is_active ? '#E72B4A' : 'black',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        borderWidth: rowdata.is_active ? 1 : 0.5,
        borderRadius: 15,
        padding: 7,
        borderColor: rowdata.is_active
          ? '#E72B4A'
          : '#939094',
        fontSize: hp(1.5),
      },
    ]}>
    {rowdata.is_active ? 'Active' : 'In-Active'}
  </Text>
) :null}
</View>
{rowdata.test_name ? (
<View style={[styles.cell, {flex: 1}]}>
  <Text style={[styles.cellText, {textAlign: 'center'}]}>
    {rowdata.test_name}
  </Text>
</View>
) : null}

<View style={[styles.cell, {flex: 1}]}>
{rowdata.editicon ? (
  <TouchableWithoutFeedback>
    <MaterialCommunityIcons
      style={[{textAlign: 'center'}]}
      name={rowdata.editicon}
      size={30}
      color="#E72B4A"
    />
  </TouchableWithoutFeedback>
) : (
  <Text style={[styles.cellText, {textAlign: 'center'}]}>
    {rowdata.price}
  </Text>
)}
</View> */
}
