import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 10,
    // padding: 10,
    paddingHorizontal:10,
    borderColor: '#C9C5CA',
    borderBottomWidth: 1,
    borderRadius: 15,
  },

  cardbody: {
    minHeight: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    // gap: 10,
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
    margin: 5,
    // backgroundColor: 'red',
    // justifyContent: 'flex-start',
    // width: '90%',
    gap: 5,
  },
  cardTextSmall: {
    fontSize: 14,
    color: '#787579',
  },
});

export default styles;
