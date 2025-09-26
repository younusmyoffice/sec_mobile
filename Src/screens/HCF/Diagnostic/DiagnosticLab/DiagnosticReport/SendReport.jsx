import {View, Text, ScrollView, SafeAreaView, Image, StyleSheet, Dimensions} from 'react-native';
import React, {useState} from 'react';
import ClinicHeader from '../../../../../components/customComponents/ClinicHeader/ClinicHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import DocumentPicker from 'react-native-document-picker';
import Header from '../../../../../components/customComponents/Header/Header';
// import Pdf from 'react-native-pdf';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const SendReport = () => {

  const [reportDetails, setreportDetails] = useState({
    file: [],
    fileCategory: '',
    image: [],
  });

  async function documentUpload() {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      let docs = [];
      let images = [];

      results.forEach(file => {
        if (file.type === 'application/pdf') {
          docs.push(file);
        } else if (file.type.includes('image')) {
          images.push(file);
        }
      });

      setreportDetails(prevDetails => ({
        ...prevDetails,
        file: docs,
        image: images,
      }));
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error(error);
      }
    }
  }

  console.log(reportDetails.file[0]);
  const getTrimmedFileName = (name, maxLength = 10) =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
           <Header
        logo={require('../../../../../assets/headerDiagonsis.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
      />
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{padding: 15}}>
          <View>
            <InAppCrossBackHeader
              showClose={true}
              backIconSize={25}
              closeIconSize={25}
            />
          </View>
          <View>
            <InAppHeader LftHdr={'Send Report'} />
          </View>
          <View>
            <CustomInput
              type={'file'}
              onpress={documentUpload}
              fileName={getTrimmedFileName(
                reportDetails.file[0]?.name ||
                  reportDetails.image[0]?.name ||
                  '',
                25,
              )}
            />
            <CustomInput
              type={'select'}
              placeholder={'Category'}
              options={[
                {
                  id: 1,
                  label: 'Cardio',
                  value: 'Cardio',
                },
                {
                  id: 2,
                  label: 'Radio',
                  value: 'Radio',
                },
              ]}
            />
          </View>
          <View>
          <Image source={reportDetails.image[0]} style={{height:100,width:100}}/>

          </View>
          {/* <View style={styles.container}>
                <Pdf
                    source={reportDetails.file[0]}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    // onPressLink={(uri) => {
                    //     console.log(`Link pressed: ${uri}`);
                    // }}
                    style={styles.pdf}/>
            </View> */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};



export default SendReport;
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});