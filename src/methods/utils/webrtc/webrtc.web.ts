import {
  RTCView as RNRTCView, MediaStream, mediaDevices, registerGlobals, MediaStreamTrack,
} from 'react-native-webrtc-web-shim';

const RTCView: any = RNRTCView;

export {
  RTCView, mediaDevices, registerGlobals, MediaStream, MediaStreamTrack,
};
