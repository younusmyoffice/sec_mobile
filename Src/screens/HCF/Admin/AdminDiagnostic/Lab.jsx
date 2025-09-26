import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PaginationComponent from '../../../../components/customPagination/PaginationComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
const Lab = ({data}) => {
  const navigation = useNavigation();
  console.log('data', data);

  // const cardData = [
  //   {
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     role_id: '001',
  //     department_name: 'Cardiology',
  //     is_active: true,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'Jane',
  //     last_name: 'Smith',
  //     role_id: '002',
  //     department_name: 'Neurology',
  //     is_active: false,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'Alice',
  //     last_name: 'Brown',
  //     role_id: '003',
  //     department_name: 'Pediatrics',
  //     is_active: true,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'Michael',
  //     last_name: 'Johnson',
  //     role_id: '004',
  //     department_name: 'Orthopedics',
  //     is_active: false,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     role_id: '001',
  //     department_name: 'Cardiology',
  //     is_active: true,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'Jane',
  //     last_name: 'Smith',
  //     role_id: '002',
  //     department_name: 'Neurology',
  //     is_active: false,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'Alice',
  //     last_name: 'Brown',
  //     role_id: '003',
  //     department_name: 'Pediatrics',
  //     is_active: true,
  //     booking_id: 102,
  //   },
  //   {
  //     first_name: 'Michael',
  //     last_name: 'Johnson',
  //     role_id: '004',
  //     department_name: 'Orthopedics',
  //     is_active: false,
  //     booking_id: 102,
  //   },
  // ];
  const is_active = true;

  const handleEditLab = item => {
    console.log('edit item', item);
    navigation.navigate('create-lab', {item: item, status: 'edit'});
  };
  const handleViewLab = (id) => {

    navigation.navigate('view-lab',{exam_id:id});
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style={styles.tableContainer}>
          <View style={styles.row}>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={styles.headerText}>Name & Details</Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, {textAlign: 'center'}]}>
                Department
              </Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, {textAlign: 'center'}]}>
                Status
              </Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, {textAlign: 'center'}]}>
                Action
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View>
            {data?.map((item, i) => (
              <TouchableOpacity onPress={()=>handleViewLab(item.exam_id)}>
                <>
                  <View style={styles.row}>
                    <View style={[styles.cell, {flex: 1}]}>
                      <View style={styles.cellContent}>
                        <View>
                          <Text style={styles.nameText}>{item?.exam_name}</Text>
                          <Text style={styles.detailsText}>
                            Lab Id:{item?.lab_department_id}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                      <Text style={[styles.cellText, {textAlign: 'center'}]}>
                        {item?.lab_department_name}
                      </Text>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                      <Text
                        style={[
                          styles.cellText,
                          {
                            textAlign: 'center',
                            color: item?.lab_status ? '#E72B4A' : 'black',
                            textAlign: 'center',
                            fontFamily: 'Poppins-Medium',
                            borderWidth: item?.lab_status ? 1 : 0.5,
                            borderRadius: 15,
                            padding: 7,
                            borderColor:
                              item?.lab_status === 1 ? '#E72B4A' : '#939094',
                            fontSize: hp(1.5),
                          },
                        ]}>
                        {item?.lab_status === 1 ? 'Active' : 'In-Active'}
                      </Text>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                      <TouchableWithoutFeedback
                        onPress={() => handleEditLab(item)}>
                        <MaterialCommunityIcons
                          style={[{textAlign: 'center'}]}
                          name="pencil"
                          size={30}
                          color="#E72B4A"
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                  <View style={styles.divider} />
                </>
              </TouchableOpacity>
            ))}
          </View>
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
    width: 800,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
    justifyContent: 'center',
    padding: 5,
  },
  cellContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  divider: {
    height: 1,
    backgroundColor: '#AEAAAE',
  },
});
export default Lab;
