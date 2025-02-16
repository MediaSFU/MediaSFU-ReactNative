import { ProducerCodecOptions, RtpEncodingParameters } from 'mediasoup-client/lib/types';

export type HParamsType = {
  encodings: RtpEncodingParameters[];
  codecOptions?: ProducerCodecOptions;
};
/**
 * hParams configuration object for encoding and codec options.
 *
 * @type {HParamsType}
 * @property {Array<Object>} encodings - Array of encoding settings.
 * @property {string} encodings[].rid - The RTP stream identifier.
 * @property {number} encodings[].maxBitrate - Maximum bitrate for the encoding.
 * @property {string} encodings[].scalabilityMode - Scalability mode for the encoding.
 * @property {string} encodings[].priority - Priority of the encoding.
 * @property {string} encodings[].networkPriority - Network priority of the encoding.
 * @property {number} [encodings[].scaleResolutionDownBy] - Factor by which to scale down the resolution.
 * @property {Object} codecOptions - Codec options for the encoding.
 * @property {number} codecOptions.videoGoogleStartBitrate - Initial bitrate for Google video codec.
 */
export const hParams: HParamsType = {
  encodings: [
    {
      rid: 'r2',
      maxBitrate: 240000,
      scalabilityMode: 'L1T3',
      scaleResolutionDownBy: 4.0,
    },
    {
      rid: 'r1',
      maxBitrate: 480000,
      scalabilityMode: 'L1T3',
      scaleResolutionDownBy: 2.0,
    },
    {
      rid: 'r0',
      maxBitrate: 960000,
      scalabilityMode: 'L1T3',
    },
  ],

  codecOptions: {
    videoGoogleStartBitrate: 384,
  },
};
