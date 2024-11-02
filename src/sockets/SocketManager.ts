// Socket manager for media socket.
import io, { Socket } from 'socket.io-client'; // Importing socket type

/**
 * Validates the provided API key or token.
 * @param {string} value - The API key or token to validate.
 * @returns {Promise<Boolean>} - True if the API key or token is valid, false otherwise.
 */
async function validateApiKeyToken(value: string): Promise<boolean> {
  // API key or token must be alphanumeric and length 64
  if (!/^[a-z0-9]{64}$/i.test(value)) {
    throw new Error('Invalid API key or token.');
  }
  return true;
}

export interface ConnectSocketOptions {
  apiUserName: string;
  apiKey?: string;
  apiToken?: string;
  link: string;
}

export interface DisconnectSocketOptions {
  socket: Socket;
}

// Export the type definition for the function
export type ConnectSocketType = (options: ConnectSocketOptions) => Promise<Socket>;
export type DisconnectSocketType = (options: DisconnectSocketOptions) => Promise<boolean>;

/**
 * Connects to a media socket using the provided connection options.
 *
 * @param {ConnectSocketOptions} options - The connection options.
 * @param {string} options.apiUserName - The API username.
 * @param {string} [options.apiKey] - The API key (optional if apiToken is provided).
 * @param {string} [options.apiToken] - The API token (optional if apiKey is provided).
 * @param {string} options.link - The socket link.
 *
 * @returns {Promise<Socket>} A promise that resolves to the connected socket.
 *
 * @example
 * ```typescript
 * const options = {
 *   apiUserName: "user123",
 *   apiKey: "yourApiKeyHere",
 *   link: "https://socketlink.com",
 * };
 * 
 * try {
 *   const socket = await connectSocket(options);
 *   console.log("Connected to socket:", socket);
 * } catch (error) {
 *   console.error("Failed to connect to socket:", error);
 * }
 * ```
 */

async function connectSocket(
  {
    apiUserName, apiKey, apiToken, link,
  }: ConnectSocketOptions,
): Promise<Socket> {
  // Validate inputs
  if (!apiUserName) {
    throw new Error('API username required.');
  }
  if (!(apiKey || apiToken)) {
    throw new Error('API key or token required.');
  }
  if (!link) {
    throw new Error('Socket link required.');
  }

  // Validate the API key or token
  let useKey = false;
  try {
    if (apiKey && apiKey.length === 64) {
      await validateApiKeyToken(apiKey);
      useKey = true;
    } else if (apiToken && apiToken.length === 64) {
      await validateApiKeyToken(apiToken);
      useKey = false;
    } else {
      throw new Error('Invalid API key or token format.');
    }
  } catch {
    throw new Error('Invalid API key or token.');
  }

  let socket: Socket;

  return new Promise((resolve, reject) => {
    // Connect to socket using the link provided
    if (useKey) {
      socket = io(`${link}/media`, {
        transports: ['websocket'],
        query: {
          apiUserName,
          apiKey: apiKey!,
        },
      });
    } else {
      socket = io(`${link}/media`, {
        transports: ['websocket'],
        query: {
          apiUserName,
          apiToken: apiToken!,
        },
      });
    }

    // Handle socket connection events
    socket.on('connection-success', ({ socketId }: { socketId: string }) => {
      console.log('Connected to media socket.', socketId);
      resolve(socket);
    });

    socket.on('connect_error', (error: Error) => {
      reject(new Error(`Error connecting to media socket: ${error.message}`));
    });
  });
}

/**
 * Disconnects from the socket.
 *
 * @param {Socket} socket - The socket instance to disconnect.
 * @returns {Promise<boolean>} - A promise that resolves once the socket is disconnected.
 *
 * @example
 * ```typescript
 * const options = { socket: socketInstance };
 * 
 * try {
 *   const isDisconnected = await disconnectSocket(options);
 *   console.log("Disconnected:", isDisconnected);
 * } catch (error) {
 *   console.error("Failed to disconnect:", error);
 * }
 * ```
 */

async function disconnectSocket({ socket }: DisconnectSocketOptions): Promise<boolean> {
  if (socket) {
    await socket.disconnect();
  }
  return true;
}

export { connectSocket, disconnectSocket };
