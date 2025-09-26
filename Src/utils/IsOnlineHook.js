import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";


const useOnlineHook = () => {
    const [online , setOnline] = useState();
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
        //   console.log("Is Online : ",state);
          setOnline(state?.isConnected)
        });

        return () => {
          unsubscribe();
        };

      }, []);
      return online;
}

export default useOnlineHook;

 {/* {
           
            online ? 
            <Text style={{color: 'red'}}>It sechromeems that you are online...</Text>:
             <Text style={{color: 'red'}}>It seems that you are offline bro...</Text>
            } */}