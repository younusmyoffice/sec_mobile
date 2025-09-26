import {
  PatientHomeScreens,
  AdminHomeScreens,
  ADoctorsScreen,
  ADiagnosticScreen,
  AManageScreen,
  DoctorHomeScreens,
  DoctorManageScreenStack,
  DoctorStatisticsScreenStack,
  DoctorAppointmentsScreenStack,
  DoctorListingScreenStack,
  DoctorHomeScreenStack,
  AdminHomeScreensStack,
  ADoctorsScreenSTack,
  ADiagnosticScreenStack,
  AManageScreenStack,
  ClinicHomeScreenStack,
  ClinicAppointmentScreenStack,
  ClinicProfileScreenStack,
  ClinicManageScreenStack,
  DiagnosticHomeScreenStack,
  DiagnosticLabScreenStack,
  DiagnosticProfileScreenStack,
  DiagnosticManageScreenStack,
  ProfileScreenStack,
  PatientSearchScreenStack,
} from './ScreensNavigation';

import AppointmentPage from '../screens/patient/appointments/AppointmentPage';
import PatientManageScreen from '../screens/patient/dashboard-DF/PatientManage/PatientManageScreen';
import DoctorDashboardScreen from '../screens/Doctor/DoctorDashboard/DoctorDashboardScreen';
import DoctorListingScreen from '../screens/Doctor/DoctorListing/DoctorListingScreen';
import DoctorAppointmentsScreen from '../screens/Doctor/DoctorAppointments/DoctorAppointmentsScreen';
import DoctorStatisticsScreen from '../screens/Doctor/DoctorStatistics/DoctorStatisticsScreen';
import DoctorManageScreen from '../screens/Doctor/DoctorManage/DoctorManageScreen';
import ProfileInformation from '../screens/patient/dashboard-DF/ProfileScreens/customComponents/ProfileInformation';

export const patientRoutes = [
  {
    name: 'Home',
    component: PatientHomeScreens,
    iconName: 'email-open',
    label: 'Home',

    resetToInitialScreen: true,
    initialScreen: 'Dashboard',
  },
  {
    name: 'Search',
    component: PatientSearchScreenStack,
    iconName: 'search',
    isthere:false,
    label: 'Search',
    resetToInitialScreen: true,
    initialScreen: 'Search',
  },
  {
    name: 'Appointments',
    component: AppointmentPage,
    iconName: 'account',
    label: 'Appointments',
    resetToInitialScreen: false,
  },
  {
    name: 'Manage',
    component: PatientManageScreen,
    iconName: 'cog',
    label: 'Manage',
    resetToInitialScreen: false,
  },
  {
    name: 'Profile',
    component: ProfileScreenStack,
    iconName: 'account',
    label: 'Profile',
    resetToInitialScreen: true,
    initialScreen: 'Profile',
  },
 


];

export const doctorRoutes = [
  {
    name: 'Home',
    component: DoctorHomeScreenStack,
    iconName: 'email-open',
    label: 'Dashboard',
    resetToInitialScreen: true,
    initialScreen: 'Dashboard',
  },
  {
    name: 'Listing',
    component: DoctorListingScreenStack,
    iconName: 'format-list-bulleted',
    label: 'Listing',
    resetToInitialScreen: false,
  },
  {
    name: 'Appointments',
    component: DoctorAppointmentsScreenStack,
    iconName: 'account',
    label: 'Appointments',
    resetToInitialScreen: false,
  },
  {
    name: 'Statistics',
    component: DoctorStatisticsScreenStack,
    iconName: 'chart-bar',
    label: 'Statistics',
    resetToInitialScreen: false,
  },
  {
    name: 'Manage',
    component: DoctorManageScreenStack,
    iconName: 'cog',
    label: 'Manage',
    resetToInitialScreen: false,
  },
];

export const adminRoutes = [
  {
    name: 'AdminHome',
    component: AdminHomeScreensStack,
    iconName: 'email-open',
    label: 'Dashboard',
    resetToInitialScreen: true,
    initialScreen: 'Dashboard',
  },
  {
    name: 'Doctor Home',
    component: ADoctorsScreenSTack,
    iconName: 'account',
    label: 'Doctors',
    resetToInitialScreen: true,
    initialScreen: 'admin-doctor',
  },
  {
    name: 'Diagnostic',
    component: ADiagnosticScreenStack,
    iconName: 'calendar-clock',
    label: 'Diagnostic',
    resetToInitialScreen: false,
  },
  {
    name: 'Manage',
    component: AManageScreenStack,
    iconName: 'cog',
    label: 'manage',
    resetToInitialScreen: false,
  },
];

export const clinicRoutes = [
  {
    name: 'ClinicHome',
    component: ClinicHomeScreenStack,
    iconName: 'email-open',
    label: 'Dashboard',
    resetToInitialScreen: true,
    initialScreen: 'clinic-home',
  },
  {
    name: 'ClinicAppointment',
    component: ClinicAppointmentScreenStack,
    iconName: 'format-list-bulleted',
    label: 'My Appointment',
    resetToInitialScreen: true,
    initialScreen: 'clinic-appointment',
  },
  {
    name: 'ClinicProfile',
    component: ClinicProfileScreenStack,
    iconName: 'account',
    label: 'Profile',
    resetToInitialScreen: true,
    initialScreen: 'clinic-profile',
  },
  {
    name: 'ClinicManage',
    component: ClinicManageScreenStack,
    iconName: 'cog',
    label: 'Manage',
    resetToInitialScreen: true,
    initialScreen: 'clinic-manage',
  },
];

export const diagnosticRoutes=[
  {
    name: 'DiagnosticHome',
    component: DiagnosticHomeScreenStack,
    iconName: 'email-open',
    label: 'Dashboard',
    resetToInitialScreen: true,
    initialScreen: 'diagnostic-home',
  },
  {
    name: 'DiagnosticLab',
    component: DiagnosticLabScreenStack,
    iconName: 'book',
    label: 'Lab',
    resetToInitialScreen: true,
    initialScreen: 'diagnostic-lab',
  },
  {
    name: 'DiagnosticProfile',
    component: DiagnosticProfileScreenStack,
    iconName: 'account',
    label: 'Profile',
    resetToInitialScreen: true,
    initialScreen: 'diagnostic-profile',
  },
  {
    name: 'DiagnosticManage',
    component: DiagnosticManageScreenStack,
    iconName: 'cog',
    label: 'Manage',
    resetToInitialScreen: true,
    initialScreen: 'diagnostic-manage',
  },
]
