import {View, TouchableOpacity, Text, ScrollView} from 'react-native';
import CustomButton from '../customButton/CustomButton';

const StepperNormal = ({
  active,
  content,
  onBack,
  onNext,
  onFinish,
  setActive, // Add setActive prop here
  wrapperStyle,
  stepTextStyle,
  showButton = true,
}) => {
  return (
    <View>
      <View style={wrapperStyle}>
        {/* Step Titles */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {/* Profile Information Tab */}
          <TouchableOpacity
            style={{
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active === 0 ? '#E72B4A' : '#fff',
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            onPress={() => setActive(0)} // Navigate to Profile Information
          >
            <Text
              style={[
                {
                  color: active === 0 ? '#fff' : '#313033',
                  fontSize: 16,
                  fontWeight: 'bold',
                },
                stepTextStyle,
              ]}>
              Profile Information
            </Text>
          </TouchableOpacity>

          {/* Contact Details Tab */}
          <TouchableOpacity
            style={{
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active === 1 ? '#E72B4A' : '#fff',
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            onPress={() => setActive(1)} // Navigate to Contact Details
          >
            <Text
              style={[
                {
                  color: active === 1 ? '#fff' : '#313033',
                  fontSize: 16,
                  fontWeight: 'bold',
                },
                stepTextStyle,
              ]}>
              Contact Details
            </Text>
          </TouchableOpacity>

          {/* Payment Details Tab */}
          <TouchableOpacity
            style={{
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active === 2 ? '#E72B4A' : '#fff',
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            onPress={() => setActive(2)} // Navigate to Payment Details
          >
            <Text
              style={[
                {
                  color: active === 2 ? '#fff' : '#313033',
                  fontSize: 16,
                  fontWeight: 'bold',
                },
                stepTextStyle,
              ]}>
              Payment Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render Step Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 20}}>
          {content[active]}
        </ScrollView>

        {/* Navigation Buttons */}
        {showButton && (
          <View style={{marginTop: 20, paddingHorizontal: 20}}>
            {content.length - 1 !== active && (
              <CustomButton
                title="Next"
                bgColor={'#E72B4A'}
                textColor={'white'}
                borderRadius={19}
                fontWeight={'bold'}
                padding={5}
                onPress={onNext}
              />
            )}
            {content.length - 1 === active && (
              <CustomButton
                title="Save"
                bgColor={'#E72B4A'}
                textColor={'white'}
                borderRadius={19}
                fontWeight={'bold'}
                padding={5}
                onPress={onFinish}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default StepperNormal;
