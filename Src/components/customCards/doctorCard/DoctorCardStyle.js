import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    // elevation: 2,
    borderColor: '#E6E1E5',
    borderWidth: 1,
    margin: 10,
    backgroundColor: '#fff',
    width: width * 0.9, 
  },
  cardbody: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    borderRadius: 10,
    elevation: 2,
    height: hp(15),
    // 35% of screen width
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-evenly',
  },
  doctorName: {
    fontSize: hp(2),
    color: '#1C1B1F',
    fontWeight: '400',
    fontFamily: 'Poppins-SemiBold',
  },
  line: {
    height: 1,
    backgroundColor: '#E6E1E5',
    width: '90%',
    marginTop: 5,
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'column',
    gap: 10, // Spacing between items
  },
  detailsText: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    fontSize: hp(1.8),
    color: '#787579',
    fontFamily: 'Poppins-thin',
  },
});

export default styles;
