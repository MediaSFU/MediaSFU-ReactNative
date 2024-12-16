
import {
    CreateMediaSFURoomOptions,
    JoinMediaSFURoomOptions,
} from '../../@types/types';

export type CreateJoinRoomType = (options: {
    payload: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
    apiUserName: string;
    apiKey: string;
    localLink?: string;
}) => Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;

export type CreateRoomOnMediaSFUType = (options: {
    payload: CreateMediaSFURoomOptions;
    apiUserName: string;
    apiKey: string;
    localLink?: string;
}) => Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;


export interface CreateJoinRoomResponse {
    message: string;
    roomName: string;
    secureCode?: string;
    publicURL: string;
    link: string;
    secret: string;
    success: boolean;
}

export interface CreateJoinRoomError {
    error: string;
    success?: boolean;
}

export type JoinRoomOnMediaSFUType = (options: {
    payload: JoinMediaSFURoomOptions;
    apiUserName: string;
    apiKey: string;
    localLink?: string;
}) => Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}>;

/**
 * Async function to join a room on MediaSFU.
 *
 * @param {object} options - The options for joining a room.
 * @param {JoinMediaSFURoomOptions} options.payload - The payload for the API request.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @param {string} options.localLink - The local link.
 * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
 */

export const joinRoomOnMediaSFU: CreateJoinRoomType = async ({
    payload,
    apiUserName,
    apiKey,
    localLink = '',
}: {
    payload: JoinMediaSFURoomOptions | CreateMediaSFURoomOptions;
    apiUserName: string;
    apiKey: string;
    localLink?: string;
}): Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}> => {
    try {
        if (
            !apiUserName ||
            !apiKey ||
            apiUserName === 'yourAPIUSERNAME' ||
            apiKey === 'yourAPIKEY' ||
            apiKey.length !== 64 ||
            apiUserName.length < 6
        ) {
            return { data: { error: 'Invalid credentials' }, success: false };
        }

        let finalLink = 'https://mediasfu.com/v1/rooms/';
        if (localLink && localLink.trim() !== '' && !localLink.includes('mediasfu.com')) {
            localLink = localLink.replace(/\/$/, '');
            finalLink = localLink + '/joinRoom';
        }

        const response = await fetch(finalLink,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiUserName}:${apiKey}`,
                },
                body: JSON.stringify(payload),
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: CreateJoinRoomResponse = await response.json();
        return { data, success: true };
    } catch (error) {
        const errorMessage = (error as Error).message || 'unknown error';
        return {
            data: { error: `Unable to join room, ${errorMessage}` },
            success: false,
        };
    }
};
