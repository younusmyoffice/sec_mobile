import React, {FC, useState, ReactElement} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import CustomButton from '../customButton/CustomButton';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const search = (keyName, myArray) => {
  let value = false;
  myArray.map(val => {
    if (val === keyName) {
      value = true;
    }
  });
  return value;
};

const Stepper = props => {
  const {
    active,
    content,
    onBack,
    onNext,
    onFinish,
    wrapperStyle,
    stepStyle,
    stepTextStyle,
    showButton = true,
    width,
    padding,
    borderRadius,
    fontSize,
    heightofstepper=75,
  } = props;

  const [step, setStep] = useState([0]);

  const pushData = val => {
    setStep(prev => [...prev, val]);
  };

  const removeData = () => {
    setStep(prev => {
      prev.pop();
      return prev;
    });
  };

  return (
    <ScrollView>
      <View style={[wrapperStyle, {flex: 1, height: heightPercentageToDP(heightofstepper)}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {content.map((_, i) => {
            return (
              <React.Fragment key={i}>
                {i !== 0 && (
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: '#E72B4A',
                      opacity: 1,
                      marginHorizontal: 10,
                    }}
                  />
                )}
                {/* Wrap each circle in a TouchableOpacity */}
                <TouchableOpacity
                  disabled={i >= active} // Disable future steps
                  onPress={() => {
                    if (i < active) {
                      removeData(); // Pop the last step
                      onBack(); // Trigger the back action
                    }
                  }}>
                  <View
                    style={[
                      {
                        backgroundColor: '#E72B4A',
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: search(i, step) ? 1 : 0.3,
                      },
                      stepStyle,
                    ]}>
                    {search(i, step) ? (
                      <Text
                        style={[
                          {
                            color: 'white',
                          },
                          stepTextStyle,
                        ]}>
                        {i + 1}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          {
                            color: 'white',
                          },
                          stepTextStyle,
                        ]}>
                        {i + 1}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {content[active]}
        </ScrollView>

        {showButton && (
          <View>
            {content.length - 1 !== active && (
              <View style={{marginTop: 20, alignSelf: 'center'}}>
                <CustomButton
                  title="Next"
                  bgColor={'#E72B4A'}
                  textColor={'white'}
                  borderRadius={borderRadius}
                  fontWeight={'bold'}
                  fontSize={fontSize}
                  // padding={5}
                  onPress={() => {
                    pushData(active + 1);
                    onNext();
                  }}
                  width={width}
                  padding={padding}
                />
              </View>
            )}
            {content.length - 1 === active && (
              <View style={{marginTop: 20, alignSelf: 'center'}}>
                <CustomButton
                  title="Save"
                  bgColor={'#E72B4A'}
                  textColor={'white'}
                  borderRadius={borderRadius}
                  fontWeight={'bold'}
                  // padding={padding}
                  fontSize={fontSize}
                  width={width}
                  padding={padding}
                  // borderRadius={18}
                  onPress={() => {
                    onFinish();
                  }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Stepper;
