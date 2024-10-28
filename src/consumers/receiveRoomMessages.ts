import { Socket } from 'socket.io-client';
import { Message } from '../@types/types';

export interface ReceiveRoomMessagesOptions {
  socket: Socket;
  roomName: string;
  updateMessages: (messages: Message[]) => void;
}

// Export the type definition for the function
export type ReceiveRoomMessagesType = (options: ReceiveRoomMessagesOptions) => Promise<void>;

export async function receiveRoomMessages({
  socket,
  roomName,
  updateMessages,
}: ReceiveRoomMessagesOptions): Promise<void> {
  try {
    // Retrieve messages from the server
    socket.emit('getMessage', { roomName }, async ({ messages_ }: { messages_: Message[]; }) => {
      updateMessages(messages_);
    });
  } catch (error) {
    // Handle errors if any
    if (error instanceof Error) {
      console.log('Error tuning messages:', error.message);
    } else {
      console.log('Error tuning messages:', error);
    }
  }
}
