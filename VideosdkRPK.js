import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const VideosdkRPKNative = NativeModules.VideosdkRPK || {}; // Fallback if undefined

class VideosdkRPK extends NativeEventEmitter {
  constructor(nativeModule) {
    super(nativeModule || {}); // Pass an empty object if null
    this.startBroadcast = Platform.OS === "ios" ? nativeModule?.startBroadcast : null;
  }
}

export default new VideosdkRPK(VideosdkRPKNative);
