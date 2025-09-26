import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import React, { useState } from 'react';
import DoctorBankAccount from './DoctorBankAccount';
import Paypal from './Paypal';
import HeaderDoctor from '../../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';


const ReuestCashDoctor = () => {
    const [activeTab, setactiveTab] = useState('Bank Account')

    const renderComponent=()=>{
        switch (activeTab) {
            case 'Bank Account':
                return <DoctorBankAccount/>
            case 'Paypal':
                return <Paypal/>
                
               

        }
    }
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
          <HeaderDoctor />
        </View>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <InAppCrossBackHeader
              showBack={false}
              title={'Request Cash Out'}
              showClose={true}
              closeIconSize={20}
            />
          </View>
          <View>
            <TopTabs data={[
                {id:1,title:'Bank Account'},
                {id:2,title:'Paypal'},
            ]}
            setActiveTab={setactiveTab}
            activeTab={activeTab}
            />
          </View>
          <View style={{marginTop:'10%'}}>
            {renderComponent()}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ReuestCashDoctor;
