import React, {useState} from 'react';
import CustomInputs from './CustomInputs';
import {View} from 'react-native';

const ExampleForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    number: 0,
  });

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState, [name]: value,
    }));
  };

  const formFields = [
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      placeholder: 'Enter your username',
    },
    {
      label: 'Username',
      name: 'cvv',
      type: 'number',
      placeholder: 'Enter your cvv',
      maxLength: 3,
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      format:'singleline',
      placeholder: 'Enter your cvv',
      maxLength: 3,
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      format:'doubleline',
      placeholder: 'Enter your cvv',
      maxLength: 3,
    },
   
    {
      label: 'Username',
      name: 'vcc',
      type: 'number',
      placeholder: 'Enter your cvv',
      maxLength: 3,

      logo: require('../../assets/logo.png'),
    },
    {
      label: 'card',
      name: 'card',
      type: 'cardNumber',
      placeholder: 'Enter your card',
      maxLength: 19,
      logo: require('../../assets/logo.png'),
    },

    {
      label: 'Role',
      name: 'role',
      type: 'select',
      options: [
        {value: '', label: 'Select a role'},
        {value: 'admin', label: 'Admin'},
        {value: 'user', label: 'User'},
        {value: 'guest', label: 'Guest'},
      ],
    },
    {
      label: 'Role',
      name: 'location',
      type: 'select',
      options: [
        {value: '', label: 'Select a role'},
        {value: 'location1', label: 'loc'},
        {value: 'user1', label: 'User'},
        {value: 'guest2', label: 'Guest'},
      ],
    },
  ];

  return (
    <View>
      {formFields.map(field => (
        <CustomInputs
          key={field.name}
          label={field.label}
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange
            
          }
          placeholder={field.placeholder}
          options={field.options}
          maxLength={field.maxLength}
          logo={field.logo}
          format={field.format}
          
        />
      ))}
      {}
    </View>
  );
};

export default ExampleForm;
