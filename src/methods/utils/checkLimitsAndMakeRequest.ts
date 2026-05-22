import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Socket } from 'socket.io-client';
import { PreJoinPageParameters } from '../../@types/types';

const MAX_ATTEMPTS = 10;
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000;

const readStoredNumber = async (key: string): Promise<number> => {
    const value = await AsyncStorage.getItem(key);
    const parsed = parseInt((value ?? '0').toString(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const writeStoredNumber = async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, value.toString());
};

const hasConnectedSocketId = (socket: unknown): socket is Socket & { id: string } => {
    if (!socket || typeof socket !== 'object') {
        return false;
    }

    const candidate = socket as { id?: unknown };
    return typeof candidate.id === 'string' && candidate.id.length > 0;
};

export const checkLimitsAndMakeRequest = async ({
    apiUserName,
    apiToken,
    link,
    apiKey = '',
    userName,
    parameters,
    validate = true,
}: {
    apiUserName: string;
    apiToken: string;
    link: string;
    apiKey?: string;
    userName: string;
    parameters: PreJoinPageParameters;
    validate?: boolean;
}) => {
    const TIMEOUT_DURATION = 10000;

    try {
        let unsuccessfulAttempts = await readStoredNumber('unsuccessfulAttempts');
        const lastRequestTimestamp = await readStoredNumber('lastRequestTimestamp');

        if (
            unsuccessfulAttempts >= MAX_ATTEMPTS &&
            Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION
        ) {
            parameters.showAlert?.({
                message: 'Too many unsuccessful attempts. Please try again later.',
                type: 'danger',
                duration: 3000,
            });
            await writeStoredNumber('lastRequestTimestamp', Date.now());
            return;
        }

        if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
            unsuccessfulAttempts = 0;
            await writeStoredNumber('unsuccessfulAttempts', unsuccessfulAttempts);
            await writeStoredNumber('lastRequestTimestamp', Date.now());
        }

        parameters.updateIsLoadingModalVisible(true);

        const socketPromise = parameters.connectSocket({ apiUserName, apiKey, apiToken, link });
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_DURATION),
        );

        const socket = await Promise.race([socketPromise, timeoutPromise]);

        if (hasConnectedSocketId(socket)) {
            unsuccessfulAttempts = 0;
            await writeStoredNumber('unsuccessfulAttempts', unsuccessfulAttempts);
            await writeStoredNumber('lastRequestTimestamp', Date.now());

            if (validate) {
                parameters.updateSocket(socket);
            } else {
                parameters.updateLocalSocket?.(socket);
            }

            parameters.updateApiUserName(apiUserName);
            parameters.updateApiToken(apiToken);
            parameters.updateLink(link);
            parameters.updateRoomName(apiUserName);
            parameters.updateMember(userName);
            if (validate) parameters.updateValidated(true);
        } else {
            unsuccessfulAttempts += 1;
            await writeStoredNumber('unsuccessfulAttempts', unsuccessfulAttempts);
            await writeStoredNumber('lastRequestTimestamp', Date.now());
            parameters.updateIsLoadingModalVisible(false);
            parameters.showAlert?.({
                message: unsuccessfulAttempts >= MAX_ATTEMPTS
                    ? 'Too many unsuccessful attempts. Please try again later.'
                    : 'Invalid credentials.',
                type: 'danger',
                duration: 3000,
            });
        }
    } catch (error) {
        console.error('Error connecting to socket:', error);
        parameters.showAlert?.({
            message: 'Unable to connect. Check your credentials and try again.',
            type: 'danger',
            duration: 3000,
        });

        const unsuccessfulAttempts = (await readStoredNumber('unsuccessfulAttempts')) + 1;
        await writeStoredNumber('unsuccessfulAttempts', unsuccessfulAttempts);
        await writeStoredNumber('lastRequestTimestamp', Date.now());
        parameters.updateIsLoadingModalVisible(false);
    }
};
