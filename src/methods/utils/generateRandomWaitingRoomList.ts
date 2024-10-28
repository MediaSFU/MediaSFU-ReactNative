import { WaitingRoomParticipant } from '../../@types/types';

// Export the type definition for the function
export type GenerateRandomWaitingRoomListType = (
) => WaitingRoomParticipant[];

/**
 * Generates a random list of participants for a waiting room.
 *
 * @param options - Configuration options for generating the waiting room list.
 * @returns An array of `WaitingRoomParticipant` objects, each with a random name, mute status, and unique ID.
 *
 * @example
 * const options = {};
 * const waitingRoomList = generateRandomWaitingRoomList(options);
 * console.log(waitingRoomList);
 */
const generateRandomWaitingRoomList = (): WaitingRoomParticipant[] => {
  // Array of random names to assign to participants in the waiting room
  const names = ['Dimen', 'Nore', 'Ker', 'Lor', 'Mik'];

  // Loop through the names array and add participants to the waiting room list
  const waitingRoomList: WaitingRoomParticipant[] = [];
  for (let i = 0; i < names.length; i++) {
    const randomName = names[i];
    waitingRoomList.push({
      name: randomName,
      id: i.toString(),
    });
  }

  return waitingRoomList;
};

export { generateRandomWaitingRoomList };
