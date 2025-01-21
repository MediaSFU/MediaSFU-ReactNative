import { CreateJoinRoomError, CreateJoinRoomResponse, CreateJoinRoomType, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from '../../@types/types';


/**
 * Asynchronously creates a room on MediaSFU.
 *
 * This function sends a POST request to the MediaSFU API to create a new room.
 * It validates the provided credentials and constructs the appropriate API endpoint,
 * including support for the Community Edition via a custom `localLink`.
 *
 * @param {object} options - Configuration options for creating the room.
 * @param {CreateMediaSFURoomOptions} options.payload - The payload containing the room creation details.
 * @param {string} options.apiUserName - The API username, used for authentication.
 * @param {string} options.apiKey - The API key, used for authentication.
 * @param {string} [options.localLink=""] - The local link for Community Edition users. If provided, it overrides the default API URL.
 *
 * @returns {Promise<{
*   data: CreateJoinRoomResponse | CreateJoinRoomError | null;
*   success: boolean;
* }>} A promise resolving to an object containing the API response:
* - `data`: The response object, either `CreateJoinRoomResponse` or `CreateJoinRoomError`.
* - `success`: Boolean indicating whether the operation was successful.
*
* @throws {Error} Throws an error if the request fails or if the provided credentials are invalid.
*
* @example
* const response = await createRoomOnMediaSFU({
*   payload: {
*     action: 'create',
*     duration: 60, // Duration in minutes
*     capacity: 10, // Max participants
*     userName: 'hostUser',
*     scheduledDate: Date.now() + 3600000, // One hour from now
*     secureCode: 'secure123', // Optional
*     eventType: 'conference', // Optional
*   },
*   apiUserName: 'yourAPIUSERNAME',
*   apiKey: 'yourAPIKEY',
*   localLink: 'http://localhost:3000', // Optional for Community Edition
* });
*
* if (response.success) {
*   console.log('Room created successfully:', response.data);
* } else {
*   console.error('Failed to create room:', response.data?.error);
* }
*/

export const createRoomOnMediaSFU: CreateJoinRoomType = async ({
    payload,
    apiUserName,
    apiKey,
    localLink = '',
}: {
    payload: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
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
            finalLink = localLink + '/createRoom';
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
            data: { error: `Unable to create room, ${errorMessage}` },
            success: false,
        };
    }
};



