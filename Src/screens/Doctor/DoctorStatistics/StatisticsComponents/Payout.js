/**
 * ============================================================================
 * COMPONENT: Payout Management
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying payout information and managing cash out requests
 * 
 * SECURITY:
 * - Currently using static data
 * - Should integrate with API for real payout data
 * 
 * TODO:
 * - Integrate with API to fetch actual payout data
 * - Add balance calculation from earnings
 * - Add proper error handling and loading states
 * 
 * @module Payout
 */

import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

// Components
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomTable from '../../../../components/customTable/CustomTable';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';

// Utils & Constants
import {useCommon} from '../../../../Store/CommonContext';
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

const Payout = () => {
  const navigation = useNavigation();
  const {userId} = useCommon();

  Logger.debug('Payout component rendered', { userId });

  /**
   * HANDLER: Navigate to cash out request screen
   */
  const handleRequestCash = () => {
    Logger.debug('Navigate to ReuestCashDoctor');
    navigation.navigate('ReuestCashDoctor');
  };

  // DATA: Table headers
  const header = ['Date', 'Account No', 'Amount', 'Status'];

  // DATA: Static sample data (TODO: Replace with API data)
  const data = [
    {
      id: 1,
      datetime: '16-oct',
      acc_no: '220020020202',
      amount: 200.0,
      status: 'in-progress',
    },
  ];

  return (
    <View style={styles.container}>
      <View>
        <InAppHeader LftHdr={'Cash Out'} />
      </View>

      <View style={styles.content}>
        {/* CARD: Earnings Balance Summary */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceDescription}>
            Earning Balance Sales Overview $120 ShareEcare Affiliation Program
            $0Amount you earned from Sales, Custom order and Affiliation
            Balance. You can cashout this balance.
          </Text>
          <Text style={styles.balanceAmount}>$120</Text>
        </View>

        {/* CARD: Request Cash Out */}
        <View style={styles.requestCard}>
          <Text style={styles.requestTitle}>Request Cash Out</Text>

          <Text style={styles.requestDescription}>
            Earning Balance Sales Overview $120 ShareEcare Affiliation Program
            $0Amount you earned from Sales, Custom order and Affiliation
            Balance. You can cashout this balance.
          </Text>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Request"
              bgColor={COLORS.PRIMARY} // DESIGN: Use color constant
              fontfamily={'Poppins-SemiBold'}
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              fontSize={hp(1.5)}
              borderRadius={20}
              width={wp(50)}
              onPress={handleRequestCash}
            />
          </View>
        </View>
      </View>

      {/* TABLE: Payout History */}
      <View>
        <CustomTable
          header={header}
          data={data}
          isUserDetails={false}
          flexvalue={1}
          rowDataCenter={false}
        />
      </View>
    </View>
  );
};

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  content: {
    gap: 15,
  },
  balanceCard: {
    backgroundColor: COLORS.PRIMARY, // DESIGN: Use color constant
    borderRadius: 6,
    padding: 12,
    gap: 10,
  },
  balanceDescription: {
    lineHeight: 25,
    fontFamily: 'Poppins-Regular',
    textAlign: 'justify',
    color: COLORS.TEXT_WHITE, // DESIGN: Use color constant
  },
  balanceAmount: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(3),
    color: COLORS.TEXT_WHITE, // DESIGN: Use color constant
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    borderRadius: 6,
    padding: 12,
    gap: 10,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    borderWidth: 0.6,
  },
  requestTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2.2),
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    textAlign: 'center',
  },
  requestDescription: {
    lineHeight: 25,
    fontFamily: 'Poppins-Regular',
    textAlign: 'justify',
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default Payout;
