import { resumeSendTransportAudio as sharedResumeSendTransportAudio } from 'mediasfu-shared';
import { Producer } from 'mediasoup-client/lib/types';
import { PrepopulateUserMediaParameters, PrepopulateUserMediaType } from '../@types/types';

export interface ResumeSendTransportAudioParameters extends PrepopulateUserMediaParameters {
  audioProducer: Producer | null;
  localAudioProducer?: Producer | null;
  islevel: string;
  hostLabel: string;
  lock_screen: boolean;
  shared: boolean;
  videoAlreadyOn: boolean;
  updateAudioProducer: (audioProducer: Producer | null) => void;
  updateLocalAudioProducer?: (localAudioProducer: Producer | null) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  // mediasfu functions
  prepopulateUserMedia: PrepopulateUserMediaType;
  prepopulateLocalUserMedia?: PrepopulateUserMediaType;
  [key: string]: any;
}

export interface ResumeSendTransportAudioOptions {
  parameters: ResumeSendTransportAudioParameters;
}

export type ResumeSendTransportAudioType = (options: ResumeSendTransportAudioOptions) => Promise<void>;

export const resumeSendTransportAudio: ResumeSendTransportAudioType = async (options): Promise<void> => {
  await (sharedResumeSendTransportAudio as unknown as ResumeSendTransportAudioType)(options);
};
