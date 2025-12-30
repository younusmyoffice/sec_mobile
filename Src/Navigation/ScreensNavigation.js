import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PatientDashboardScreen from '../screens/patient/dashboard-DF/PatientDashboardScreen';
import DoctorPage from '../screens/patient/doctorBookAppointmnet/DoctorPage';
import AdminDashboardScreen from '../screens/HCF/Admin/AdminDashboard/AdminDashboardScreen';
import AdminDoctorsScreen from '../screens/HCF/Admin/AdminDoctors/AdminDoctorsScreen';
import AdminManageScreen from '../screens/HCF/Admin/AdminManage/AdminManageScreen';
import AdminDiagnosticScreen from '../screens/HCF/Admin/AdminDiagnostic/AdminDiagnosticScreen';
import AdminProfileScreen from '../screens/HCF/Admin/AdminProfile/AdminProfileScreen';
import CustomNotificationList from '../components/customNotificationList/CustomNotificationList';
import ProfileInfoMainScreen from '../screens/patient/dashboard-DF/ProfileScreens/ProfileInfoMainScreen';
import NotificationScreen from '../screens/additionalScreens/NotificationScreen';
import DoctorAppointmentsScreen from '../screens/Doctor/DoctorAppointments/DoctorAppointmentsScreen';
import DoctorListingScreen from '../screens/Doctor/DoctorListing/DoctorListingScreen';
import DoctorStatisticsScreen from '../screens/Doctor/DoctorStatistics/DoctorStatisticsScreen';
import DoctorManageScreen from '../screens/Doctor/DoctorManage/DoctorManageScreen';
import DoctorDashboardScreen from '../screens/Doctor/DoctorDashboard/DoctorDashboardScreen';
import AddDoctor from '../screens/HCF/Admin/AdminDoctors/AddDoctorPackage/AddDoctor';
import ParentDoctorPackage from '../screens/HCF/Admin/AdminDoctors/AddDoctorPackage/ParentDoctorPackage';
import AddDoctorPlans from '../screens/HCF/Admin/AdminDoctors/AddDoctorPackage/AddPackage/AddDoctorPlans';
import BookAppointmentStepper from '../screens/patient/doctorBookAppointmnet/BookAppointmentStepper';
import CreateLab from '../screens/HCF/Admin/AdminDiagnostic/CreateEditLab/CreateLab';
import ViewLab from '../screens/HCF/Admin/AdminDiagnostic/CreateEditLab/ViewLab';
import CreateTest from '../screens/HCF/Admin/AdminDiagnostic/CreateEditLab/CreateTest';
import CreateNewListingScreen from '../screens/Doctor/DoctorListing/CreateNewListingScreen';
import AddDoctorPlansListing from '../screens/Doctor/DoctorListing/ListingComponents/AddPackage/AddDoctorPlansListing';
import CreateStaff from '../screens/HCF/Admin/AdminDiagnostic/CreateEditStaff/CreateStaff';
import MobileVerify from '../authentication/MobileVerify';
import VerifyStaff from '../screens/HCF/Admin/AdminDiagnostic/CreateEditStaff/VerifyStaff';
import RequestCash from '../screens/HCF/Admin/AdminManage/Payout/ReuestCash';
import RejectAppointmentReq from '../screens/Doctor/AdditionalScreens/RejectAppointmentReq';
import ReuestCashDoctor from '../screens/Doctor/DoctorStatistics/StatisticsComponents/Payout/ReuestCashDoctor';
import ViewAudit from '../screens/HCF/Admin/AdminManage/Audit/ViewAudit';
import ClinicDashboardScreen from '../screens/HCF/Clinic/ClinicDashboard/ClinicDashboardScreen';
import ClinicAppointmentScreen from '../screens/HCF/Clinic/ClinicAppointmentScreen/ClinicAppointmentScreen';
import ClinicProfileScreen from '../screens/HCF/Clinic/ClinicProfile/ClinicProfileScreen';
import ClinicManageScreen from '../screens/HCF/Clinic/ClinicManage/ClinicManageScreen';

import CreateStaffDoctor from '../screens/Doctor/DoctorManage/ManageComponents/CreateStaffDoctor';
import ProfileScreenDoctor from '../screens/Doctor/AdditionalScreens/ProfileScreenDoctor';
import HeaderDoctor from '../components/customComponents/HeaderDoctor/HeaderDoctor';
import AddAward from '../screens/Doctor/AdditionalScreens/ProfileScreenComponents/AddAward';
import AddExperience from '../screens/Doctor/AdditionalScreens/ProfileScreenComponents/AddExperience';
import AddLisenceCertification from '../screens/Doctor/AdditionalScreens/ProfileScreenComponents/AddLisenceCertification';

import RejectPatientAppointment from '../screens/HCF/Clinic/ClinicAppointmentScreen/RejectPatientAppointment';
import ViewPatientDetails from '../screens/HCF/Clinic/ClinicAppointmentScreen/ViewPatientDetails';
import DiagnosticDashboardScreen from '../screens/HCF/Diagnostic/DiagnosticDashboard/DiagnosticDashboardScreen';
import DiagnosticManageScreen from '../screens/HCF/Diagnostic/DiagnosticManage/DiagnosticManageScreen';
import DiagnosticLabScreen from '../screens/HCF/Diagnostic/DiagnosticLab/DiagnosticLabScreen';
import DiagnosticProfileScreen from '../screens/HCF/Diagnostic/DiagnosticProfile/DiagnosticProfileScreen';
import SendReport from '../screens/HCF/Diagnostic/DiagnosticLab/DiagnosticReport/SendReport';
import ProfileInformation from '../screens/patient/dashboard-DF/ProfileScreens/customComponents/ProfileInformation';
import Search from '../screens/patient/dashboard-DF/Search/Search';
import PatientDetailsViewDoc from '../screens/Doctor/AdditionalScreens/PatientDetailsViewDoc';
import Join from '../scenes/join';
import meeting from '../scenes/meeting';
import Home from '../ChatScreens/Components/Home';
import ChatsScreen from '../components/AppointmentComponents/ChatsScreen';
import ChatPage from '../ChatScreens/Components/ChatPage';
import HfcPage from '../screens/patient/hcfBookAppointment/HcfPage';



const SEC = createNativeStackNavigator();
// Patient Screens Navigations
export const PatientHomeScreens = () => {
  return (
    <SEC.Navigator initialRouteName="Dashboard">
      <SEC.Screen
        name="Dashboard"
        component={PatientDashboardScreen}
        options={{headerShown: false}}
      />
      {/* <SEC.Screen
        name="ProfileScreen"
        component={ProfileInfoMainScreen}
        options={{headerShown: false}}
      /> */}

      <SEC.Screen
        name="DoctorBookAppointment"
        component={DoctorPage}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="HcfPage"
        component={HfcPage}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="BookAppointment"
        component={BookAppointmentStepper}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};

export const ProfileScreenStack=()=>{
  return(

  <SEC.Navigator initialRouteName="Profile">
    <SEC.Screen
        name="Profile"
        component={ProfileInfoMainScreen}
        options={{headerShown: false}}
      />
  </SEC.Navigator>
  )
}
export const PatientSearchScreenStack=()=>{
  return(

  <SEC.Navigator initialRouteName="Profile">
    <SEC.Screen
        name="Profile"
        component={Search}
        options={{headerShown: false}}
      />
  </SEC.Navigator>
  )
}


export const DoctorHomeScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="Dashboard">
     <SEC.Screen
    name="Dashboard"
    component={DoctorDashboardScreen}
    options={{headerShown: false}}

/>
      <SEC.Screen
        name="RejectAppointmentReq"
        component={RejectAppointmentReq}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="ProfileScreenDoctor"
        component={ProfileScreenDoctor}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="PatientDetailsViewDoc"
        component={PatientDetailsViewDoc}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="AddAward"
        component={AddAward}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="AddExperience"
        component={AddExperience}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="AddLisenceCertification"
        component={AddLisenceCertification}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DoctorListingScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="Dashboard">
      <SEC.Screen
        name="Dashboard"
        component={DoctorListingScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="DoctorListing"
        component={CreateNewListingScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="DoctorListingAddPlans"
        component={AddDoctorPlansListing}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DoctorAppointmentsScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="Dashboard">
      <SEC.Screen
        name="Dashboard"
        component={DoctorAppointmentsScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="RejectAppointmentReq"
        component={RejectAppointmentReq}
        options={{headerShown: false}}
      />
       <SEC.Screen
        name="PatientDetailsViewDoc"
        component={PatientDetailsViewDoc}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="Join_Screen"
        component={Join}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="Meeting_Screen"
        component={meeting}
        options={{headerShown: false}}
      />
       {/* <SEC.Screen
        name="ChatHome"
        component={Home}
        options={{headerShown: false}}
      />
       <SEC.Screen
        name="ChatsScreenChat"
        component={ChatPage}
        options={{headerShown: false}}
      /> */}
    </SEC.Navigator>
  );
};
export const DoctorStatisticsScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="Dashboard">
      <SEC.Screen
        name="Dashboard"
        component={DoctorStatisticsScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="ReuestCashDoctor"
        component={ReuestCashDoctor}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DoctorManageScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="Dashboard">
      <SEC.Screen
        name="Dashboard"
        component={DoctorManageScreen}
        options={{headerShown: false}}
      />


<SEC.Screen
        name="CreateStaffDoctor"
        component={CreateStaffDoctor}
        options={{headerShown: false}}
      />
      {/* <SEC.Screen
          name="DoctorBookAppointment"
          component={DoctorPage}
          options={{headerShown: false}}
        />
        <SEC.Screen
          name="Notification"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <SEC.Screen
          name="ProfileScreen"
          component={ProfileInfoMainScreen}
          options={{headerShown: false}}
        /> */}

      <SEC.Screen
        name="DoctorBookAppointment"
        component={DoctorPage}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};

//HCF Admin Screens Navigations
export const AdminHomeScreensStack = () => {
  return (
    <SEC.Navigator initialRouteName="admin-dashboard">
      <SEC.Screen
        name="admin-dashboard"
        component={AdminDashboardScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="admin-profile"
        component={AdminProfileScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};

export const ADoctorsScreenSTack = () => {
  return (
    <SEC.Navigator initialRouteName="admin-doctor">
      <SEC.Screen
        name="admin-doctor"
        component={AdminDoctorsScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="doctor-package"
        component={ParentDoctorPackage}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="add-plans"
        component={AddDoctorPlans}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="verify-doctorotp"
        component={VerifyStaff}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const ADiagnosticScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="admin-diagnostic">
      <SEC.Screen
        name="admin-diagnostic"
        component={AdminDiagnosticScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="create-lab"
        component={CreateLab}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="view-lab"
        component={ViewLab}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="create-test"
        component={CreateTest}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="create-staff"
        component={CreateStaff}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="createstaff-otpverify"
        component={VerifyStaff}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const AManageScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="admin-manage">
      <SEC.Screen
        name="admin-manage"
        component={AdminManageScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="request-cash"
        component={RequestCash}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="view-audit"
        component={ViewAudit}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};

export const ClinicHomeScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="clinic-home">
      <SEC.Screen
        name="clinic-home"
        component={ClinicDashboardScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const ClinicAppointmentScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="clinic-appointment">
      <SEC.Screen
        name="clinic-appointment"
        component={ClinicAppointmentScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="rejectpatient-appointment"
        component={RejectPatientAppointment}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="patient-details"
        component={ViewPatientDetails}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const ClinicProfileScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="clinic-profile">
      <SEC.Screen
        name="clinic-profile"
        component={ClinicProfileScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const ClinicManageScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="clinic-manage">
      <SEC.Screen
        name="clinic-manage"
        component={ClinicManageScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DiagnosticHomeScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="diagnostic-home">
      <SEC.Screen
        name="diagnostic-home"
        component={DiagnosticDashboardScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DiagnosticLabScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="diagnostic-lab">
      <SEC.Screen
        name="diagnostic-lab"
        component={DiagnosticLabScreen}
        options={{headerShown: false}}
      />
      <SEC.Screen
        name="send-report"
        component={SendReport}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DiagnosticProfileScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="diagnostic-profile">
      <SEC.Screen
        name="diagnostic-profile"
        component={DiagnosticProfileScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
export const DiagnosticManageScreenStack = () => {
  return (
    <SEC.Navigator initialRouteName="diagnostic-manage">
      <SEC.Screen
        name="diagnostic-manage"
        component={DiagnosticManageScreen}
        options={{headerShown: false}}
      />
    </SEC.Navigator>
  );
};
