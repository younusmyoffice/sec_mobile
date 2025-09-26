import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

 const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#E6E1E5',
        borderWidth: 1,
        marginBottom: 3,
        marginTop: 1,
        height: hp(7),
        // elevation: 2,
        paddingHorizontal: 15,
      },
      logo: {
        width: wp(41),
        height: hp(4),
        resizeMode:'contain'
      },
});

export default styles