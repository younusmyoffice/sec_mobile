import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';

const ViewAudit = () => {
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View>
          <AdminHeader />
        </View>
        <View style={{padding:15,gap:10}}>
        <View>
            <InAppCrossBackHeader
              showClose={true}
              backIconSize={25}
              closeIconSize={25}
            />
          </View>
          <View>
            <InAppHeader LftHdr={'Details'}/>
          </View>
          <View>
            
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ViewAudit;
