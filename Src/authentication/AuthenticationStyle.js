import {StyleSheet} from 'react-native';

const authenticationStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 55,
    height: 'auto',
    gap: 15,
    justifyContent: 'center',
    //  backgroundColor:'red'
  },
  signUp: {
    fontSize: 25,
    color: '#333',
    marginTop: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  logo: {
    height: 40,
    width: 200,
    resizeMode: 'contain',
  },
  inputs: {
    padding: 15,
    gap: 10,
  },
  forgot: {
    fontSize: 19,
    textAlign: 'center',
    color: '#E72B4A',
  },

  pinCodeContainer: {
    borderRadius: 0,
    // borderLeftWidth:0,
    borderWidth: 0,
    borderBottomWidth: 1, 
    width: 50,
    borderColor: 'black',
  },
  pinCodeText: {
    color: '#E72B4A',
  },
  focusedPinCodeContainerStyle: {
    borderColor: '#E72B4A',
  },
  focusStick: {
    backgroundColor: '#E72B4A',
  },
});

export default authenticationStyle;
