import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    // paddingHorizontal:10
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns logo and input vertically centered
    // height: 50,
    borderBottomColor: '#AEAAAE',
    borderBottomWidth: 1,
    borderRadius: 5,
    // paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    // height: 50,
    paddingVertical: 15,
    paddingHorizontal: 5,
    // borderBottomColor: 'black',
    fontFamily:'Poppins-Regular',
    // color:'black'
    // fontSize: 16,
  },
  picker: {
    // paddingHorizontal: 10,
    
    height: 50,
    
    // color:'black',
    // borderBottomColor: '#AEAAAE',

   
  },
    //      inputContainer: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   backgroundColor: '#f0f0f0',
    //   borderRadius: 25,
    //   height: 50,
    //   paddingHorizontal: 10,
    // },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
    color:'black'
  },

  textArea: {
    borderWidth: 1,
    height: 10,
    borderRadius: 5,
    borderColor: '#E6E1E5',
    textAlignVertical: 'top',
    fontSize: 16,
    color:'black'
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },

  documentContainer: {
    paddingVertical: 10,
    // paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#AEAAAE',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  documentText: {
    color: 'black',
    padding:5,
    fontSize: 16,
  },
  attachmentIcon: {
    // fontSize: 20
    color: '#AEAAAE',
  },
  
});

export default styles;
