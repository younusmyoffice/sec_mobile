import React, {useRef} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const   TopTabs = ({
  borderwidth,
  bordercolor,
  data,
  activeTab,
  setActiveTab,
  borderRadius = 10,
  padding,
  fontSize = 16,
  ph = 20,
  pv = 10,
  activeButtonColor = '#E72B4A',
  nonactivecolor,
  tabfunc,
  funcstatus
}) => {
  const scrollViewRef = useRef(null);

  const handleTabPress = (title, index) => {
    setActiveTab(title);
    scrollViewRef.current?.scrollTo({x: index * 100, animated: true});
    if(funcstatus==true){
      tabfunc(title);

    }
  };

  return (
    <ScrollView
      horizontal={true}
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}>
      {data?.map((item, index) => (
        <View key={index} style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              activeTab === item.title
                ? {backgroundColor: activeButtonColor}
                : {
                    backgroundColor: nonactivecolor,
                    // padding:100
                    
                  },
              {
                borderWidth: borderwidth,
                borderColor: bordercolor,
                borderRadius: borderRadius,
                paddingHorizontal: ph,
                paddingVertical: pv,
              },
            ]}
            onPress={() => handleTabPress(item.title, index)}>
            <Text
              style={[
                styles.buttonText,
                activeTab === item.title ? styles.activeButtonText : null,
              ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles

export default TopTabs;

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    marginHorizontal: 5,
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // activeButton: {
  //   backgroundColor: activeButtonColor,
  // },
  buttonText: {
    color: '#313033',

    fontFamily: 'Poppins-Medium',
  },
  activeButtonText: {
    color: '#FFFFFF', // Active text color
    // fontWeight: 'bold',
  },
});
