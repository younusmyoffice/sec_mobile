import {StyleSheet} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  ListView: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height:100
  },
  BookingText: {
    fontSize: heightPercentageToDP(2),
    color: '#313033',
    fontFamily:'Poppins-Medium'
  },
  BookingDesc: {
    fontFamily:'Poppins-Thin',
    maxWidth: 200,
    color: '#939094',
  },
  line: {
    position: 'relative',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
    width: 'auto',
    // top:-3
  },
});

export default styles;
