import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {COLORS, SIZES} from '../../Src/utils/theme';

const Launchscreen = ({navigation}) => {
  const slides = [
    {
      id: 1,
      Image: require('../assets/images/SplashScreen(1st).png'),
    },
    {
      id: 2,
      Image: require('../assets/images/SplashScreen(2nd).png'),
    },
    {
      id: 3,
      Image: require('../assets/images/SplashScreen(3rd).png'),
    },
  ];

  const [showHomePage, setShowHomePage] = useState(false);

  const buttonLabel = label => {
    return (
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    );
  };

  if (!showHomePage) {
    return (
      <AppIntroSlider
        data={slides}
        renderItem={({item}) => {
          return (
            <View style={styles.slide}>
              <Image
                source={item.Image}
                style={styles.image}
                resizeMode="stretch" // Ensures the image fits within the boundaries
              />
              {/* You can uncomment and add title/description if needed */}
              {/* <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text> */}
            </View>
          );
        }}
        activeDotStyle={styles.activeDot}
        showSkipButton
        renderNextButton={() => buttonLabel('Next')}
        renderSkipButton={() => buttonLabel('Skip')}
        renderDoneButton={() => buttonLabel('Done')}
        onDone={() => {
          navigation.navigate('ChoiceScreen1');
        }}
      />
    );
  }

  return (
    <View style={styles.homeContainer}>
      <TouchableOpacity
        style={styles.gotohome}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Launchscreen;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 20,
  },
  image: {
    width: '100%', // Ensure the image takes the full width
    height: '100%', // Set height relative to the screen size
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.title,
    fontSize: SIZES.h1,
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    textAlign: 'center',
    paddingTop: 5,
    color: COLORS.title,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 20,
    borderColor: '#E72B4A',
    borderWidth: 1,
    elevation: 2,
  },
  buttonContainer: {
    padding: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: SIZES.h4,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gotohome: {
    backgroundColor: '#E72B4A',
    padding: 10,
    borderRadius: 5,
  },
});
