import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../../../../components/customComponents/Header/Header';

const {width,height} = Dimensions.get('window');

export default function StaticDisplayCard() {
  console.log("width",width)
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

      <SafeAreaView style={styles.container}>
        
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                Take control of your health with our user-friendly health care
                app.
              </Text>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/CardDoctor1.png')}
                style={styles.image}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                All your health related report at one place.
              </Text>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/CardDoctor2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>
                All your health related report at one place.
              </Text>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../../assets/images/CardDoctor2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

StaticDisplayCard.propTypes = {
  cardImage: PropTypes.any.isRequired, // Image prop can be any type (local or URL)
  cardText: PropTypes.string.isRequired, // cardText must be a string
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E6E1E5',
    borderRadius: 20,
    height: 180,
    width: width * 0.86, // Card width as 80% of the screen width
    marginHorizontal: 10,
    marginVertical: 15,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 7,
    paddingRight: 10,
  },
  cardText: {
    fontSize: hp(2),
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingTop: 20,
    // fontWeight: 'bold',
    color: '#313033',
    fontFamily:'Poppins-SemiBold'
  },
  bookNowButton: {
    marginTop: 10,
    marginLeft: 10,

    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    fontSize: 16,
    color: '#E72B4A',
  },
  imageContainer: {
    flex: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
