import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainBox: {
    flexDirection: 'row',
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap:10
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 1,
    maxWidth: '90%',
    height: 50,
    gap:10,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
    fontFamily:'Poppins-SemiBold'
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default styles;
