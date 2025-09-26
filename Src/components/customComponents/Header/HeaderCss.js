import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// const   styles = StyleSheet.create({
//     navbar: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       // paddingHorizontal: 15,
//       backgroundColor: '#fff',
//       height: 60,
//       elevation: 2,
//       padding:15
//     },
//     logo: {
//       width: 40,
//       height: 40,
//     },
//     locationContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     locationText: {
//       marginLeft: 5,
//       fontSize: 16,
//       color: 'gray',
//     },
//     spacer: {
//       flex: 1,
//     },
//     rightIcons: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     icon: {
//       marginLeft: 15,
//     },
//   });

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#E6E1E5',
    borderWidth: 1,
    marginBottom: 3,
    marginTop: 1,
    height: hp(7),
    // elevation: 2,
    paddingHorizontal: 15,
  },
  logo: {
    width: 50,
    height: 31,
  },
  centeredView: {
    // backgroundColor:'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // height:500
  },
  modalView: {
    // height: hp(100),
    width:wp(100),
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default styles;
