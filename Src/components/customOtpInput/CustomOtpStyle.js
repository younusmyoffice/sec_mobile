import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    pinCodeContainer:{
        borderRadius:0,
        // borderLeftWidth:0,
        borderWidth:0,
        borderBottomWidth:1,
        width:50,
        borderColor:'black'
       },
       pinCodeText:{
        color:'#E72B4A'
       },
       focusedPinCodeContainerStyle:{
        borderColor:'#E72B4A'
       },
       focusStick:{
        backgroundColor:'#E72B4A'
       }
})

export default styles