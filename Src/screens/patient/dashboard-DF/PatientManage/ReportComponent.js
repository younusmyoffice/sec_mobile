import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateRangePicker from '../../../../components/callendarPicker/RangeDatePicker';
import CustomButton from '../../../../components/customButton/CustomButton';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTable from '../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {useCommon} from '../../../../Store/CommonContext';

export default function ReportComponent({length}) {
  const {
    sharedReports,
    recievedReports,
    setPageReceivedReports,
    setPageSharedReports,
    pageReceivedReports,
    pageSharedReports,
  } = useCommon();
  console.log('length', length);
  const [reportsState, setReportState] = useState('All Files');
  const [userId, setUserId] = useState();
  const [pageAllReports, setPageAllReports] = useState(1);
  const [pageExamineReports, setPageExamineReports] = useState(1);
  // const [pageSharedReports, setPageSharedReports] = useState(1);
  // const [pageReceivedReports, setPageReceivedReports] = useState(1);
  const [limit] = useState(5);
  const [allReports, setAllReports] = useState([]);
  const [examineReports, setExamineReports] = useState([]);
  // const [recievedReports, setRecieveReports] = useState([]);
  // const [sharedReports, setSharedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuid = async () => {
    try {
      const suid = await AsyncStorage.getItem('suid');
      console.log('SUID:', suid);
      setUserId(suid);
    } catch (error) {
      console.error('Error fetching suid:', error);
    }
  };

  const handleScrollEnd = ({nativeEvent}) => {
    console.log('hello');
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !isLoading) {
      setPageAllReports(prevPage => prevPage + 1);
      switch (reportsState) {
        case 'All Files':
          setPageAllReports(prev => prev + 1);
          fetchAllReports();
          break;
        case 'Examine':
          setPageExamineReports(prev => prev + 1);
          fetchExamineReports();
          break;
        case 'Shared':
          setPageSharedReports(prev => prev + 1);
          fetchSharedReports();
          break;
        case 'Received':
          setPageReceivedReports(prev => prev + 1);
          fetchRecievedReports();
          break;
        default:
          console.log('Unknown report type');
      }
    }
  };
  const fetchAllReports = async () => {
    try {
      console.log('Fetching data...');
      const startTime = performance.now();

      setIsLoading(true);

      const response = await axiosInstance.get(
        `patient/reportsRequested/${userId}/requested`,
        {
          params: {page: pageAllReports, limit: 8},
        },
      );

      setAllReports(prevReports => [...prevReports, ...response.data.response]);
      setIsLoading(false);
      const endTime = performance.now();
      console.log('Data fetched successfully');
      console.log(
        `Time taken to fetch data: ${(endTime - startTime).toFixed(
          2,
        )} milliseconds`,
      );
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  const fetchExamineReports = async () => {
    try {
      // setLoading(false);
      const response = await axiosInstance.get(
        `patient/reportsExamine/${userId}/examine`,
        {
          params: {
            page: pageExamineReports,
            limit: limit,
          },
        },
      );

      setExamineReports(response.data.response);
      // setLoading(true);
      // console.log("reports",response.data.response)
    } catch (e) {
      console.log(e);
    }
  };
  // const fetchSharedReports = async () => {
  //   try {
  //     // setLoading(false);
  //     const response = await axiosInstance.get(
  //       `patient/reportsShared/${userId}`,
  //       {
  //         params: {
  //           page: pageSharedReports,
  //           limit: limit,
  //         },
  //       },
  //     );

  //     setSharedReports(response.data.response);
  //     // setLoading(true);
  //     // console.log("reports",response.data.response)
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const fetchRecievedReports = async () => {
  //   try {
  //     // setLoading(false);
  //     const response = await axiosInstance.get(
  //       `patient/reportsReceived/${userId}/completed`,
  //       {
  //         params: {
  //           page: pageReceivedReports,
  //           limit: limit,
  //         },
  //       },
  //     );

  //     setRecieveReports(response.data.response);
  //     // setLoading(true);
  //     // console.log("reports",response.data.response)
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const downloadFile = async (reportName, reportPath) => {
    console.log('im getting clicked');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to download the file.',
          );
          return;
        }
      }

      const downloadDir =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.DownloadDirectoryPath;
      const filePath = `${downloadDir}/${reportName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: reportPath,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('Download Complete', `File saved to: ${filePath}`);
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      console.error('Download Error:', error);
      console.log('Error', 'Could not download the file.');
    }
  };

  useEffect(() => {
    fetchSuid();

    fetchAllReports();
    fetchExamineReports();
    // fetchRecievedReports();
    // fetchSharedReports();
  }, [
    userId,
    pageAllReports,
    pageExamineReports,
    pageReceivedReports,
    pageSharedReports,
  ]);
  const Reqheader = [
    'Lab Name',
    'Diagnostic Name',
    'Scheduled',
    'Booked Date',
    'Booked Time',
    'Status',
    'Test Price',
    'Test Name',
  ];

  const Eheader = [
    'Lab Name/Booking Id',
    'Date & Time',
    'Schedule',
    'Test Name',
    'Price',
  ];
  const Rheader = [
    'File Name/Booking Id',
    'Lab/Booking Id',
    'Date & Time',
    'Category',
  ];
  const Sheader = ['Doctor Name', 'Date & Time', 'File Name', 'Category'];
  const filteredResponse = recievedReports.map(
    ({report_name, hcf_diag_name, book_date, book_time, report_path}) => ({
      report_name,
      hcf_diag_name,
      book_date,
      book_time,
      report_path,
    }),
  );
  const reports = {
    'All Files': allReports,
    Examine: examineReports,
    Recieved: recievedReports,
    Shared: sharedReports,
  };
  const header = {
    'All Files': Reqheader,
    Examine: Eheader,
    Recieved: Rheader,
    Shared: Sheader,
  };
  // console.log("rep",reports['Recieved'])
  return (
    <SafeAreaView>
      {/* <DateRangePicker Type={'normal'} /> */}
      {/* <CustomTable /> */}
      <View>
        <TopTabs
          activeTab={reportsState}
          bordercolor={'#fff'}
          borderwidth={1}
          data={[
            {title: 'All Files'},
            {title: 'Examine'},
            {title: 'Recieved'},
            {title: 'Shared'},
          ]}
          setActiveTab={setReportState}
          funcstatus={false}
        />
      </View>
      <View style={{marginTop:10}}>
        <CustomTable
          header={header[reportsState] || null}
          isUserDetails={false}
          textCenter={'center'}
          data={reports[reportsState] || null}
          flexvalue={1}
          rowDataCenter={true}
          functionKey={'report_name'}
          onpress={downloadFile}
          loadmore={handleScrollEnd}
          loading={isLoading}
          length={length}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'white',
  },
  container2: {},
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  datePickerText: {
    fontSize: 16,
    color: 'black',
    margin: 15,
    justifyContent: 'space-evenly',
  },
  selectedDateText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  transactionContainer: {
    borderColor: '#939094',
    borderWidth: 1,
    width: '88%',
    height: '70%',
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 10,
  },
  transactionContent: {
    padding: '2%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginTop: 30,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: 220,
    height: 150,
    marginTop: 45,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 30,
  },
  bookAppointmentText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  tableContainer: {
    borderColor: '#AEAAAE',
    borderWidth: 1,
    borderRadius: 12,
    width: 700,
  },
  header: {
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#AEAAAE',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
  },
  verticalScroll: {
    maxHeight: 400,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#AEAAAE',
    height: 100,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  columnName: {
    width: 200,
  },
  columnStatus: {
    width: 100,
    justifyContent: 'center',
  },
  columnDate: {
    width: 150,
    justifyContent: 'center',
  },
  columnPackage: {
    width: 120,
    justifyContent: 'center',
  },
  columnAmount: {
    width: 100,
    justifyContent: 'center',
  },

  nameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  GreyText: {
    color: '#AEAAAE',
  },
  editIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
