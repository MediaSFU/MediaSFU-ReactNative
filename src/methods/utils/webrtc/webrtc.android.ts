import { loadNativeWebRTC } from './nativeWebRTC';

const nativeWebRTC = loadNativeWebRTC();
const {
  RTCView: RNRTCView, registerGlobals, MediaStream, MediaStreamTrack,
} = nativeWebRTC;
const mediaDevices: any = nativeWebRTC.mediaDevices;

const RTCView: any = RNRTCView;

export {
  mediaDevices, RTCView, registerGlobals, MediaStream, MediaStreamTrack,
};
