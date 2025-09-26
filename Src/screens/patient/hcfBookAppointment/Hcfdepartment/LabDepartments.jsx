import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useCommon} from '../../../../Store/CommonContext';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import SkeletonLoader from '../../../../components/customSkeleton/SkeletonLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomModal from '../../../../components/customModal/CustomModal';
import {Image} from 'react-native';

const LabDepartments = () => {
  const {
    labdept,
    LabactiveTab,
    setLabActiveTab,
    fetchLabTest,
    labtest,
    categoriesDoctor,
    labload,
    userId
  } = useCommon();
  const {width} = Dimensions.get('window');
  const [modalvisible, setModalVisible] = useState(false);
  const [examid, setExamId] = useState();
  const [hcfid, setHcfId] = useState();
  const [bookTest, setBookTest] = useState({
      book_date: '',
      patient_id: userId.toString(),
      test_subexam_id: '',
      status: 'requested',
      payment_method_nonce: '',
    });

  console.log('suiddddd', userId.toString());
  console.log('test', labtest);

  useEffect(() => {
    if(userId){
      setBookTest({...bookTest, patient_id: userId.toString()})
    }
  }, [userId]);
  return (
    <View style={{padding: 10}}>
      {modalvisible && (
        <CustomModal
          modalVisible={modalvisible}
          set={setModalVisible}
          examid={examid}
          bookTest={bookTest}
          hcfid={hcfid}
          setBookTest={setBookTest}
        />
      )}
      <TopTabs
        borderwidth={1}
        bordercolor="#fff"
        data={labdept?.map((item, i) => ({
          id: i,
          title: item.lab_department_name,
        }))}
        activeTab={LabactiveTab}
        setActiveTab={setLabActiveTab}
        tabfunc={fetchLabTest}
        funcstatus={true}
      />

      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}>
          {labload ? ( // Show loader while fetching
            <View
              style={{
                flexDirection: 'column',
                gap: 10,
                backgroundColor: '#F0F0F0',
                padding: 10,
                borderRadius: 10,
                height: hp(18),
                width: wp(95),
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <SkeletonLoader
                  width={85}
                  height={90}
                  borderRadius={10}
                  style={styles.avatar}
                />
                <View style={{flexDirection: 'column', gap: 10}}>
                  <SkeletonLoader
                    width={wp(60)}
                    height={hp(3)}
                    borderRadius={10}
                    style={styles.avatar}
                  />
                  <SkeletonLoader
                    width={wp(60)}
                    height={hp(3)}
                    borderRadius={10}
                    style={styles.avatar}
                  />
                </View>
              </View>
            </View>
          ) : labtest?.length > 0 ? ( // Show data if available
            labtest.map((item, i) => (
              <View
                key={i}
                style={{
                  padding: 15,
                  borderRadius: 16,
                  borderColor: '#E6E1E5',
                  borderWidth: 1,
                  margin: 10,
                  backgroundColor: '#fff',
                  width: width * 0.9,
                  flexDirection: 'column',
                  gap: 10,
                }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: hp(2),
                        color: '#1C1B1F',
                        fontWeight: '400',
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      {item?.sub_exam_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        color: '#787579',
                        fontFamily: 'Poppins-thin',
                      }}>
                      Price: {item?.test_price}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: hp(1.8),
                      color: '#787579',
                      fontFamily: 'Poppins-thin',
                    }}>
                    Working days: {item?.lab_working_days_from} -
                    {item?.lab_working_days_to}
                  </Text>
                  <Text
                    style={{
                      fontSize: hp(1.8),
                      color: '#787579',
                      fontFamily: 'Poppins-thin',
                    }}>
                    Working time: {item?.lab_working_time_from} -
                    {item?.lab_working_time_to}
                  </Text>
                </View>
                <View>
                  <CustomButton
                    title="Buy"
                    bgColor={'#E72B4A'}
                    borderRadius={20}
                    textColor={'white'}
                    onPress={() => {
                      setModalVisible(!modalvisible);
                      setBookTest({...bookTest, test_subexam_id: item?.sub_exam_id.toString()});
                      setExamId(item?.exam_id);
                      setHcfId(item?.hcf_id);
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={{alignSelf: 'center'}}>
              <Image
                source={require('../../../../assets/NoAppointment.png')}
                style={{
                  height: hp(10),
                  width: wp(40),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </View>
          )}
        </ScrollView>
        
      </View>
    </View>
  );
};

export default LabDepartments;
const styles = StyleSheet.create({});
