import { Transport, CloseAndResizeParameters, CloseAndResizeType } from '../../@types/types';

export interface ProducerClosedParameters extends CloseAndResizeParameters {
  consumerTransports: Transport[];
  screenId?: string;
  updateConsumerTransports: (transports: Transport[]) => void;

  // mediasfu functions
  closeAndResize: CloseAndResizeType;
  getUpdatedAllParams: () => ProducerClosedParameters;
  [key: string]: any;

}

export interface ProducerClosedOptions {
  remoteProducerId: string;
  parameters: ProducerClosedParameters;
}

// Export the type definition for the function
export type ProducerClosedType = (options: ProducerClosedOptions) => Promise<void>;

export const producerClosed = async ({
  remoteProducerId,
  parameters,
}: ProducerClosedOptions): Promise<void> => {
  let {
    consumerTransports, closeAndResize, screenId, updateConsumerTransports,
  } = parameters;

  // Handle producer closed
  const producerToClose = consumerTransports.find(
    (transportData: any) => transportData.producerId === remoteProducerId,
  );

  if (!producerToClose) {
    return;
  }

  // Check if the ID of the producer to close is the same as the screenId
  let { kind } = producerToClose.consumer as { kind: string }; // Allow 'screenshare' as well

  if (producerToClose.producerId === screenId) {
    kind = 'screenshare' as string;
  }

  try {
    await producerToClose.consumerTransport.close();
  } catch (error) {
    console.error('Error closing consumer transport:', error);
  }

  try {
    producerToClose.consumer.close();
  } catch (error) {
    console.error('Error closing consumer:', error);
  }

  // Filter out the closed producer
  consumerTransports = consumerTransports.filter(
    (transportData: any) => transportData.producerId !== remoteProducerId,
  );
  updateConsumerTransports(consumerTransports);

  // Close and resize the videos
  await closeAndResize({ producerId: remoteProducerId, kind, parameters });
};
