import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomButton from '../../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Header from '../../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useAuth} from '../../../../../Store/Authentication';
import axios from 'axios';

const ViewLab = () => {
  const route = useRoute();
  const {exam_id} = route.params;
  const {userId} = useAuth();
  console.log('exam_id', exam_id);
  const navigation = useNavigation();
  const [labDetails, setLabDetails] = useState({});
  const [hcfTests, setHcfTests] = useState([]);

  const fetchLabs = async () => {
    try {
      const response = await axiosInstance.get(
        `hcf/getHcfSingleLab/${userId}/${exam_id}`,
      );
      console.log(response.data.response[0]);
      setLabDetails(response.data.response[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateTest = () => {
    navigation.navigate('create-test', {exam_id: exam_id});
  };
  const handlEditTest = (item) => {
    navigation.navigate('create-test', {exam_id: exam_id,status:'edit',item:item});
  };
  const fetchTest = async () => {
    try {
      const response = await axiosInstance.get(
        `hcf/getHcfTests/${userId}/${exam_id} `,
      );
      console.log('tests', response.data.response);
      setHcfTests(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTest();
    }, []),
  );
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
          <Header
            logo={require('../../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 18, gap: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <InAppCrossBackHeader
              showClose={false}
              iconColor="#E72B4A"
              backIconSize={25}
              text={'Back'}
              roundicon={false}
              onBackPress={() => navigation.goBack()}
            />
          </View>
          <View style={{gap: 10}}>
            <View>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-Regular',
                  fontSize: hp(2),
                }}>
                Department
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Medium',
                  fontSize: hp(2),
                }}>
                {labDetails?.exam_name}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Medium',
                    fontSize: hp(2),
                  }}>
                  Working Time
                </Text>
                <Text style={{color: '#AEAAAE', fontFamily: 'Poppins-Regular'}}>
                  {labDetails?.lab_working_time_from} to{' '}
                  {labDetails?.lab_working_time_to}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Medium',
                    fontSize: hp(2),
                    textAlign: 'center',
                  }}>
                  Working Days
                </Text>
                <Text style={{color: '#AEAAAE', fontFamily: 'Poppins-Regular'}}>
                  {labDetails?.lab_working_days_from} to{' '}
                  {labDetails?.lab_working_days_to}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-Regular',
                  fontSize: hp(1.7),
                }}>
                Description
              </Text>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-Regular',
                  fontSize: hp(1.5),
                }}>
                {labDetails?.lab_description}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Medium',
                  fontSize: hp(2),
                }}>
                Listed Tests
              </Text>
              <CustomButton
                title="Create Test"
                borderColor={'#E72B4A'}
                borderWidth={1}
                borderRadius={18}
                fontfamily={'Poppins-SemiBold'}
                textColor={'#E72B4A'}
                fontSize={hp(1.5)}
                onPress={handleCreateTest}
              />
            </View>
          </View>
          <View>
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
                        Pricing
                      </Text>
                    </View>
                    <View style={[styles.headerCell, {flex: 1}]}>
                      <Text style={[styles.headerText, {textAlign: 'center'}]}>
                        Action
                      </Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  {hcfTests?.map((item, i) => (
                    <View style={styles.row} key={i}>
                      <View style={[styles.cell, {flex: 1}]}>
                        <View style={styles.cellContent}>
                          <View>
                            <Text style={styles.nameText}>
                              {item?.sub_exam_name}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.cell, {flex: 1}]}>
                        <Text style={[styles.cellText, {textAlign: 'center'}]}>
                          {item?.exam_name}
                        </Text>
                      </View>
                      <View style={[styles.cell, {flex: 1}]}>
                        <Text
                          style={[
                            styles.cellText,
                            {
                              textAlign: 'center',
                            },
                          ]}>
                          {item?.test_subexam_price}
                        </Text>
                      </View>
                      <View style={[styles.cell, {flex: 1}]}>
                        <TouchableWithoutFeedback onPress={()=>handlEditTest(item)}>
                          <MaterialCommunityIcons
                            style={[{textAlign: 'center'}]}
                            name="pencil"
                            size={30}
                            color="#E72B4A"
                          />
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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

export default ViewLab;
