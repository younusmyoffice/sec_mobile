import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function CustomCountDisplayCard({cards}) {
  // console.log(cards.length % 2 !== 0)
  // console.log(cards.length % 2 !== 0)
  console.log(cards)
  return (
    <View>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 6,
        }}>
        {cards?.map((item, i) => (
          <View
            key={item.id}  
            style={{
              borderColor: '#E6E1E5',
              minWidth: cards.length % 2 !== 0 && i === cards.length - 1 ? '100%' : '48%',
              borderWidth: 1.5,
              borderRadius: 10,
              minHeight: hp(12),
            }}>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{item.count}</Text>
              <Text style={styles.descriptionText}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  countContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // width: '95%',
  },
  countText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#E72B4A',
    fontSize: hp(4),
    textAlign: 'center',
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: hp(1.6),
    textAlign: 'center',
  },
});
