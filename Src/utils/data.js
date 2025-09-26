import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const tabbtn = [
  {title: 'Personal Information'},
  {title: 'Contact Details'},
  {title: 'Payment Information'},
];
export const searchfilter = [
  {title: 'All'},
  {title: 'Dentist'},
  {title: 'Doctors'},
];

export const DATA = [
  {
    id: 1,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM',
  },
  {
    id: 2,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM',
  },
  {
    id: 3,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM',
  },
  {
    id: 4,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM',
  },
  {
    id: 5,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM ',
  },
  {
    id: 6,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM',
  },
  {
    id: 7,
    title: 'Appointment Remainder',
    desc: 'You have an appointment with Dr. Maria Garcia | Today | 10:30 AM IST',
    date: '01-2023 10:30 AM',
  },
];

export const formFields = [
  {
    name: 'email',
    type: 'email',
    id: 1,
    placeholder: 'Enter Your Email',
    label: 'Enter Your Email',
  },
  {
    name: 'first_name',
    type: 'text',
    id: 2,
    placeholder: 'First Name',
    label: 'First Name',
  },
  {
    name: 'middle_name',
    type: 'text',
    id: 3,
    placeholder: 'Middle Name',
    label: 'Middle Name',
  },
  {
    name: 'last_name',
    type: 'text',
    id: 4,
    placeholder: 'Last Name',
    label: 'Last Name',
  },
  {
    name: 'DOB',
    type: 'date',
    id: 5,
    placeholder: 'Date of Birth',
    label: 'Date of Birth',
    format: 'singleline',

  },
  {
    name: 'gender',
    type: 'select',
    id: 6,
    placeholder: 'Gender.',
    label: 'Gender',
    options: [
      {value: 'Male', label: 'Male'},
      {value: 'Female', label: 'Female'},
      {value: 'Others', label: 'Others'},
    ],
  },
  {
    name: 'street_address1',
    type: 'text',
    id: 7,
    placeholder: 'Street Line 1',
    label: 'Street Address Line 1',
  },
  {
    name: 'street_address2',
    type: 'text',
    id: 8,
    placeholder: 'Street Line 2',
    label: 'Street Address Line 2',
  },
  {
    name: 'country_id',
    type: 'select',
    id: 9,
    // options:[],
    placeholder: 'Country',
    label: 'Country',
  },
  {
    name: 'state_id',
    type: 'select',
    id: 10,
    placeholder: 'State',
    label: 'State',
  },
  {
    name: 'city_id',
    type: 'select',
    id: 11,
    placeholder: 'City',
    label: 'City',
  },
  {
    name: 'zip_code',
    type: 'text',
    id: 12,
    placeholder: 'Zip Code',
    label: 'Zipcode',
  },
  {id: 13, name: 'qualification', type: 'text', placeholder: 'Qualification'},
  {
    id: 14,
    name: 'university_name',
    type: 'text',
    placeholder: 'University Name',
  },
  {
    id: 15,
    name: 'qualified_year',
    type: 'date',
    placeholder: 'Qualified Year',
  },
  {
    id: 16,
    name: 'speciality_id',
    type: 'select',
    placeholder: 'Speciality Id',
    options: [
      {value: '1', label: 'Cardiology'},
      {value: '2', label: 'Neurology'},
      {value: '3', label: 'Orthopedics'},
    ],
  },
  {id: 17, name: 'degree', type: 'text', placeholder: 'Degree'},
  {
    id: 18,
    name: 'state_reg_number',
    type: 'number',
    placeholder: 'State Registration Number',
  },
  {
    id: 19,
    name: 'country_reg_number',
    type: 'number',
    placeholder: 'Country Registration Number',
  },
  {
    id: 20,
    name: 'state_reg_date',
    type: 'date',
    placeholder: 'State Registration Date',
  },
  {id: 21, name: 'council_name', type: 'text', placeholder: 'Council Name'},
];
export const ProfileInfo = [
  {
    name: 'firstName',
    type: 'text',
    id: 1,
    placeholder: 'First Name',
    label: 'First Name',
  },
  {
    name: 'middleName',
    type: 'text',
    id: 2,
    placeholder: 'Middle Name',
    label: 'Middle Name',
  },
  {
    name: 'lastName',
    type: 'text',
    id: 3,
    placeholder: 'Last Name',
    label: 'Last Name',
  },
  {
    name: 'gender',
    type: 'select',
    id: 4,
    placeholder: 'Gender.',
    label: 'Gender',
    options: [
      {value: 'Male', label: 'Male'},
      {value: 'Female', label: 'Female'},
      {value: 'Others', label: 'Others'},
    ],
  },
];
export const rating = [
  {
    id: 1,
    icon: 'rocket',
    number: `4000+`,
    name: 'Patients',
    size: 50,
  },
  {
    id: 2,
    icon: 'rocket',
    number: `10+`,
    name: 'Experience',
    size: 50,
  },
  {
    id: 3,
    icon: 'rocket',
    number: `4.8`,
    name: 'Rating',
    size: 50,
  },
  {
    id: 4,
    icon: 'rocket',
    number: `3207`,
    name: 'Reviews',
    size: 50,
  },
];

export const doctorDetails = {
  id: 1,
  dname: 'Dr. Maria Garcia',
  dspecaility: 'Pediatric',
  hospital: 'B&B Hospital',
  day: 'Monday To Friday',
  time: '10:00AM to 4:00PM',
  ratings: [
    {
      id: 1,
      icon: 'user',
      number: `4000+`,
      name: 'Patients',
      size: hp(3),
    },
    {
      id: 2,
      icon: 'suitcase',
      number: `10+`,
      name: 'Experience',
      size: hp(3),
    },
    {
      id: 3,
      icon: 'star',
      number: `4.8`,
      name: 'Rating',
      size: hp(3),
    },
    {
      id: 4,
      icon: 'message',
      number: `3207`,
      name: 'Reviews',
      size: hp(3),
    },
  ],
  about:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum, vitae elementum elit tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi maximus, nisl vel varius bibendum, libero metus ultricies est',
  reviews: [
    {
      id: 1,
      avatar: 'Emma',
      reviewname: 'Emma',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut thellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum,',
    },
    {
      id: 2,
      avatar: 'Emma',
      reviewname: 'Emma',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut thellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum,',
    },
    {
      id: 3,
      avatar: 'Emma',
      reviewname: 'Emma',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut thellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum,',
    },
    {
      id: 4,
      avatar: 'Emma',
      reviewname: 'Emma',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut thellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum,',
    },
    {
      id: 5,
      avatar: 'Emma',
      reviewname: 'Emma',
      rating: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut thellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum,',
    },
  ],
  education: [
    {
      id: 1,
      collegeicon: 'college',
      collegename: 'xyz university',
      collegeDegree: 'degree',
      year: 2020,
    },
    {
      id: 2,
      collegeicon: 'college',
      collegename: 'xyz university',
      collegeDegree: 'degree',
      year: 2020,
    },
  ],
  licenses: [
    {
      id: 1,
      certificateIcon: 'C',
      certificateName: 'Medical ceryificate',
      issueDate: 'May 2016',
      certificateId: 'UT528VH6',
    },
    {
      id: 2,
      certificateIcon: 'C',
      certificateName: 'Medical ceryificate',
      issueDate: 'May 2016',
      certificateId: 'UT528VH6',
    },
  ],
  awards: [
    {
      id: 1,
      awardIcon: 'a',
      awardTitle: 'Award Title',
      issueDate: 'May 2016',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum, vitae elementum elit tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
    },
    {
      id: 2,
      awardIcon: 'a',
      awardTitle: 'Award Title',
      issueDate: 'May 2016',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo non dolor bibendum, vitae elementum elit tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac.',
    },
  ],
};

export const patientDetails = [
  {
    id: 1,
    placeholder: 'First Name',
    type: 'text',
    name: 'name',
  },
  {
    id: 2,
    placeholder: 'Gender',
    type: 'select',
    name: 'gender',
    options: [
      {value: 'Male', label: 'Male'},
      {value: 'Female', label: 'Female'},
    ],
  },
  {
    id: 3,
    placeholder: 'Age',
    type: 'number',
    name: 'age',
  },
  {
    id: 4,
    type: 'file',
    name: 'file',
  },
  {
    id: 5,
    placeholder: 'Write Your Problem',
    label: 'Write Your Problem',
    type: 'textarea',
    name:'problem',
    problem: 'parienttextarea',
  },
  {
    id: 6,
    // placeholder: 'Question 1',
    label: 'Write Your Problem',
    type: 'select',
    name: 'question1',
  },

  {
    id: 7,
    name: 'appointment_time',
    type: 'select',
    placeholder: 'Select Time Slots',
  },
];

export const packageContact = [
  {
    id: 12,
    icon: 'message',
    name: 'Messaging Plan',
    subtitle: 'Chat and message with doctor',
    price: '$12/30min',
  },
  {
    id: 13,
    icon: 'phone',
    name: 'Voice Call & Messaging',
    subtitle: 'Chat and message with doctor',
    price: '$20/30min',
  },
  {
    id: 14,
    icon: 'video',
    name: 'Video & Messaging',
    subtitle: 'Chat and message with doctor',
    price: '$25/30min',
  },
];
