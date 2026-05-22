export {
  findOriginalProducerForSpeaker,
  getActiveTranslationConsumers,
  isConsumingTranslationForSpeaker,
  isSpeakerInMyBreakoutRoom,
  pauseOriginalProducer,
  resumeOriginalProducer,
  stopConsumingTranslation,
  syncTranslationStateAfterBreakoutChange,
} from 'mediasfu-shared';

export type {
  PauseOriginalProducerOptions,
  PauseOriginalProducerType,
  ResumeOriginalProducerOptions,
  ResumeOriginalProducerType,
  StopConsumingTranslationOptions,
  StopConsumingTranslationType,
  TranslationConsumerSwitchParameters,
} from 'mediasfu-shared';
