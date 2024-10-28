import { ProducerCodecOptions, RtpEncodingParameters } from 'mediasoup-client/lib/types';

export type ScreenParamsType = {
  encodings: RtpEncodingParameters[];
  codecOptions?: ProducerCodecOptions;
};
/**
 * Screen parameters configuration object.
 *
 * @constant
 * @type {ScreenParamsType}
 *
 * @property {Array<Object>} encodings - Array of encoding settings.
 * @property {string} encodings[].rid - The RTP stream identifier.
 * @property {number} encodings[].maxBitrate - Maximum bitrate for the encoding.
 * @property {string} encodings[].priority - Priority of the encoding.
 * @property {string} encodings[].networkPriority - Network priority of the encoding.
 *
 * @property {Object} codecOptions - Codec options for the screen parameters.
 * @property {number} codecOptions.videoGoogleStartBitrate - Initial bitrate for the video codec.
 */
export const screenParams: ScreenParamsType = {
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 3000000,
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};
