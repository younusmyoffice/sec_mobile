import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {
  togglePasswordVisibilityHelper,
  handleChangeTextHelper,
  getMaxLengthHelper,
} from './InputsHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './CustomInputsStyle';

import DatePicker from '../callendarPicker/DatePickerCallendar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateRangePicker from '../callendarPicker/RangeDatePicker';
const CustomInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  options = [],
  icon,
  logo,
  fontSize,
  eyeicon,
  onpress,
  fileName,
  selectborderWidth,
  selectborderRadius,
  selectborderColor,
  elevation,
  addorment,
  adormentText,
  selectborderBottomWidth = 1,
  selectbackgroundColor = 'white',
  selectborderBottomColor = '#AEAAAE',
  selectwidth,
  selectplaceholdercolor = '#AEAAAE',
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setMarkedDates,
  handleDayPress,
  calculateMarkedDates,
  resetDates,
  markedDates,
  format,
  disabled,
  fontFamily,
  datevalue,
  handleVerify
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    togglePasswordVisibilityHelper(isPasswordVisible, setPasswordVisible);
  };

  const handleChangeText = text => {
    handleChangeTextHelper(text, type, name, onChange);
  };

  const getMaxLength = () => {
    return getMaxLengthHelper(name, value);
  };
  // console.log(type);
  console.log('file', fileName);
  return (
    <View style={styles.container}>
      {type === 'select' ? (
        <Dropdown
          style={[
            styles.picker,
            {
              borderWidth: selectborderWidth,
              borderRadius: selectborderRadius,
              borderColor: selectborderColor,
              backgroundColor: selectbackgroundColor,
              borderBottomWidth: selectborderBottomWidth,
              borderBottomColor: selectborderBottomColor,
              width: selectwidth,
            },
          ]}
          selectedTextStyle={{
            fontSize: fontSize,
            fontFamily:fontFamily,
            paddingHorizontal: 10,
            color: disabled ? 'gray' : 'black',
          }}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={options}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          placeholderStyle={{
            // fontFamily: 'Poppins-Medium',
            fontSize: fontSize,
            paddingHorizontal: 10,
            color: selectplaceholdercolor,
          }}
          itemTextStyle={{
            fontSize: fontSize,
            color: 'black',
            fontFamily: 'Poppins-Medium',
            fontSize: hp(1.7),
          }}
          searchPlaceholder="Search..."
          value={value}
          onChange={item => onChange(name, item.value)}
          disable={disabled}
        />
      ) : type === 'email' ||
        type === 'text' ||
        type === 'number' ||
        type === 'password' ||
        type === 'cardNumber' ? (
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            name={name}
            type={type}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={'#AEAAAE'}
            style={[
              styles.input,
              {fontSize: fontSize, color: disabled ? 'gray' : 'black', fontFamily:fontFamily,},
            ]}
            keyboardType={
              type === 'text'
                ? 'default'
                : type === 'email'
                ? 'email-address'
                : type === 'number'
                ? 'numeric'
                : type === 'password'
                ? 'default'
                : 'default'
            }
            secureTextEntry={type === 'password' && !isPasswordVisible}
            maxLength={getMaxLength()}
            editable={!disabled}
          />
          {addorment && (
            <TouchableWithoutFeedback onPress={()=>handleVerify()}>

            <Text style={{color: '#E72B4A', fontFamily: 'Poppins-Medium'}}>
              {adormentText}
            </Text>
            </TouchableWithoutFeedback>
          )}
          {logo && (
            <MaterialCommunityIcons name={icon} color="#AEAAAE" size={25} />
          )}
          {type === 'password' && (
            <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialCommunityIcons name="eye" color="#AEAAAE" size={25} />
            </TouchableOpacity>
          )}
        </View>
      ) : type === 'textarea' ? (
        <View style={{gap: 5}}>
          <TextInput
            style={{
              borderWidth: 1,
              height: 120,
              borderRadius: 5,
              borderColor: '#E6E1E5',
              color: 'black',
              textAlignVertical: 'top',

              padding: 6,
            }}
            name={name}
            value={value}
            type={type}
            placeholder={placeholder}
            placeholderTextColor={'#E6E1E5'}
            multiline
            numberOfLines={50}
            onChangeText={handleChangeText}
          />
        </View>
      ) : type === 'file' ? (
        <View>
          <View style={styles.containerr}>
            <TouchableOpacity
              style={styles.documentContainer}
              onPress={onpress}>
              <Text style={styles.documentText}>
                {fileName ? fileName : 'Attach Report'}
              </Text>
              <MaterialCommunityIcons
                style={styles.attachmentIcon}
                name="attachment"
                size={30}
                color="#AEAAAE"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : type === 'date' ? (
        <DateRangePicker
        value={datevalue}
          Type={format}
          calculateMarkedDates={calculateMarkedDates}
          endDate={endDate}
          startDate={startDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          handleDayPress={day => handleDayPress(day, name)}
          resetDates={resetDates}
          markedDates={markedDates}
          name={name}
          fontSize={fontSize}
        />
      ) : null}
    </View>
  );
};
export default CustomInput;
