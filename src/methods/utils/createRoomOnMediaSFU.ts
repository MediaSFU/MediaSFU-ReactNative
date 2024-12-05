import { CreateJoinRoomError, CreateJoinRoomResponse, CreateJoinRoomType } from '../../@types/types';

/**
 * Async function to create a room on MediaSFU.
 *
 * @param {object} options - The options for creating a room.
 * @param {any} options.payload - The payload for the API request.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
 */
export const createRoomOnMediaSFU: CreateJoinRoomType = async ({
    payload,
    apiUserName,
    apiKey,
}: {
    payload: any;
    apiUserName: string;
    apiKey: string;
}): Promise<{
    data: CreateJoinRoomResponse | CreateJoinRoomError | null;
    success: boolean;
}> => {
    try {
        // Validate credentials
        if (
            !apiUserName
            || !apiKey
            || apiUserName === 'yourAPIUSERNAME'
            || apiKey === 'yourAPIKEY'
            || apiKey.length !== 64
            || apiUserName.length < 6
        ) {
            return { data: { error: 'Invalid credentials' }, success: false };
        }

        const response = await fetch('https://mediasfu.com/v1/rooms/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiUserName}:${apiKey}`,
                },
                body: JSON.stringify(payload),
            });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: CreateJoinRoomResponse = await response.json();
        return { data, success: true };
    } catch (error) {
        const errorMessage = (error as Error).message || 'unknown error';
        return {
            data: { error: `Unable to create room, ${errorMessage}` },
            success: false,
        };
    }
};



