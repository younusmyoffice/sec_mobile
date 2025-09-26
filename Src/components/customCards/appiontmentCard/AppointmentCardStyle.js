import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  card: {
    // position:'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 10,
    padding: 1,
    borderColor: '#C9C5CA',
    // borderWidth:1,
    // borderBottomWidth: 1,
    borderRadius: 15,
    margin:0
  },

  cardbody: {
    minHeight: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    // padding: 10,
  },
  line: {
    position: 'relative',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
    width: 'auto',
  },

  info: {
    fontSize: 14,
    color: '#777',
  },
  review: {
    fontSize: 14,
    color: '#777',
  },

  textContainer: {
    // padding: 10,
    flexDirection: 'column',
    // margin: 5,
    // backgroundColor: 'red',
    // justifyContent:"space-evenly"
    // width: '90%',
    gap: 5,
  },
  cardTextSmall: {
    fontSize: hp(2),
    color: '#787579',
    fontFamily: 'Poppins-thin',
  },
});

export default styles;
