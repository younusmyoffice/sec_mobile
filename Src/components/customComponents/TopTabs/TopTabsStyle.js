import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 1,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    // borderColor: '#e53935',
  },
  activeButton: {
    backgroundColor: '#E72B4A',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    margin: 5,
  },
});

export default styles;
