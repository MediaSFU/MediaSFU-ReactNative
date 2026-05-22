import { disconnectSendTransportScreen as sharedDisconnectSendTransportScreen } from 'mediasfu-shared';
import { Producer } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';

export interface DisconnectSendTransportScreenParameters {
    screenProducer: Producer | null;
    socket: Socket;
    localSocket?: Socket;
    roomName: string;
    updateScreenProducer: (screenProducer: Producer | null) => void;
    updateLocalScreenProducer?: (localScreenProducer: Producer | null) => void;

    getUpdatedAllParams: () => DisconnectSendTransportScreenParameters;
    [key: string]: any;
}
export interface DisconnectSendTransportScreenOptions {
    parameters: DisconnectSendTransportScreenParameters;
}

export type DisconnectSendTransportScreenType = (options: DisconnectSendTransportScreenOptions) => Promise<void>;

export const disconnectSendTransportScreen: DisconnectSendTransportScreenType = async (options): Promise<void> => {
    await (sharedDisconnectSendTransportScreen as unknown as DisconnectSendTransportScreenType)(options);
};
