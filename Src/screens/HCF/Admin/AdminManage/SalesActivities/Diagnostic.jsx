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
import CustomTable from '../../../../../components/customTable/CustomTable';

const Diagnostic = ({header, data}) => {
  return (
    <View>
      <CustomTable
        textCenter={'center'}
        header={header}
        data={data}
        flexvalue={2}
        isUserDetails={true}
        rowTextCenter={true}
      />
    </View>
  );
};

export default Diagnostic;
