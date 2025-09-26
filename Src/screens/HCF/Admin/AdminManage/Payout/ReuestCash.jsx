import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import React, { useState } from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import BankAccount from './BankAccount';
import Paypal from './Paypal';
import Header from '../../../../../components/customComponents/Header/Header';

const ReuestCash = () => {
    const [activeTab, setactiveTab] = useState('Bank Account')

    const renderComponent=()=>{
        switch (activeTab) {
            case 'Bank Account':
                return <BankAccount/>
            case 'Paypal':
                return <Paypal/>
                
               

        }
    }
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
        <Header  logo={require('../../../../../assets/hcfadmin.png')} notificationUserIcon={true} width={wp(41)} height={hp(4)} resize={'contain'}/>

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

export default ReuestCash;
