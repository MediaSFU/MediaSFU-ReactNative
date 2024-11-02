import React from 'react';
import {
  FlatList,
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Socket } from 'socket.io-client';
import { generatePageContent, GeneratePageContentOptions, GeneratePageContentParameters } from '../../consumers/generatePageContent';
import { ShowAlert, BreakoutParticipant } from '../../@types/types';

/**
 * Interface defining the parameters required by the Pagination component.
 */
export interface PaginationParameters extends GeneratePageContentParameters {
  mainRoomsLength: number;
  memberRoom: number;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  member: string;
  breakoutRooms: BreakoutParticipant[][];
  hostNewRoom: number;
  roomName: string;
  islevel: string;
  showAlert?: ShowAlert;
  socket: Socket;

  // Function to get updated parameters
  getUpdatedAllParams: () => PaginationParameters;
  [key: string]: any;
}

/**
 * Interface defining the options for the Pagination component.
 */
export interface PaginationOptions {
  totalPages: number;
  currentUserPage: number;
  handlePageChange?: (options: GeneratePageContentOptions) => Promise<void>;
  position?: 'left' | 'middle' | 'right';
  location?: 'top' | 'middle' | 'bottom';
  direction?: 'horizontal' | 'vertical';
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  activePageStyle?: StyleProp<ViewStyle>;
  inactivePageStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  paginationHeight?: number;
  showAspect?: boolean;
  parameters: PaginationParameters;
}

/**
 * Interface for individual page items.
 */
interface PageItem {
  id: string;
  number: number;
}

export type PaginationType = (options: PaginationOptions) => JSX.Element;

/**
 * Pagination Component
 *
 * The `Pagination` component enables page navigation with support for breakout room logic. It shows page numbers, controls access to breakout rooms based on the user level, and provides customizable layout and styling options.
 *
 * @component
 * @param {PaginationOptions} props - Properties to configure the `Pagination` component.
 * @param {number} props.totalPages - Total number of pages.
 * @param {number} props.currentUserPage - Current page number for the user.
 * @param {(options: GeneratePageContentOptions) => Promise<void>} [props.handlePageChange] - Function to handle page changes.
 * @param {'left' | 'middle' | 'right'} [props.position='middle'] - Horizontal alignment of pagination.
 * @param {'top' | 'middle' | 'bottom'} [props.location='middle'] - Vertical alignment of pagination.
 * @param {'horizontal' | 'vertical'} [props.direction='horizontal'] - Direction of pagination (horizontal or vertical).
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Custom styles for the pagination container.
 * @param {StyleProp<ViewStyle>} [props.activePageStyle] - Custom styles for the active page.
 * @param {StyleProp<ViewStyle>} [props.inactivePageStyle] - Custom styles for inactive pages.
 * @param {string} [props.backgroundColor='#ffffff'] - Background color for the pagination container.
 * @param {number} [props.paginationHeight=40] - Height of the pagination container.
 * @param {boolean} [props.showAspect=true] - Flag to display the pagination aspect.
 * @param {PaginationParameters} props.parameters - Parameters necessary for pagination and breakout room logic.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { Pagination } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const parameters = {
 *     mainRoomsLength: 3,
 *     memberRoom: 1,
 *     breakOutRoomStarted: true,
 *     breakOutRoomEnded: false,
 *     member: 'John Doe',
 *     breakoutRooms: [/* array of breakout room participants * /],
 *     hostNewRoom: 2,
 *     roomName: 'Room A',
 *     islevel: '2',
 *     showAlert: (alert) => console.log(alert.message),
 *     socket: /* Socket connection * /,
 *     getUpdatedAllParams: () => parameters,
 *   };

 *   return (
 *     <Pagination
 *       totalPages={10}
 *       currentUserPage={1}
 *       parameters={parameters}
 *       backgroundColor="lightgray"
 *       paginationHeight={50}
 *       direction="horizontal"
 *       position="middle"
 *       location="bottom"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const Pagination: React.FC<PaginationOptions> = ({
  totalPages,
  currentUserPage,
  handlePageChange = generatePageContent,
  position = 'middle',
  location = 'middle',
  direction = 'horizontal',
  activePageStyle = { backgroundColor: '#2c678f' },
  inactivePageStyle,
  backgroundColor = '#ffffff',
  paginationHeight = 40,
  showAspect = true,
  parameters,
}) => {
  // Update parameters using the provided function
  const { getUpdatedAllParams } = parameters;
  const updatedParameters = getUpdatedAllParams();
  const {
    mainRoomsLength,
    memberRoom,
    breakOutRoomStarted,
    breakOutRoomEnded,
    member,
    breakoutRooms,
    hostNewRoom,
    roomName,
    islevel,
    showAlert,
    socket,
  } = updatedParameters;

  // Generate data for FlatList
  const data: PageItem[] = Array.from({ length: totalPages + 1 }, (_, index) => ({
    id: `${index}`,
    number: index,
  }));

  /**
   * Handles the page button click.
   *
   * @param {number} page - The page number that was clicked.
   */
  const onPagePress = async (page: number) => {
    if (page === currentUserPage) {
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded && page !== 0) {
      const roomMember = breakoutRooms.find((r) => r.find((p) => p.name === member));
      const pageInt = page - mainRoomsLength;
      let memberBreakRoom = -1;
      if (roomMember) {
        memberBreakRoom = breakoutRooms.indexOf(roomMember);
      }

      if (
        (memberBreakRoom === -1 || memberBreakRoom !== pageInt)
        && pageInt >= 0
      ) {
        if (islevel !== '2') {
          if (showAlert) {
            showAlert({
              message: `You are not part of the breakout room ${pageInt + 1}.`,
              type: 'danger',
            });
          }
          return;
        }

        await handlePageChange({
          page,
          parameters: updatedParameters,
          breakRoom: pageInt,
          inBreakRoom: true,
        });

        if (hostNewRoom !== pageInt) {
          socket.emit(
            'updateHostBreakout',
            { newRoom: pageInt, roomName },
            () => {},
          );
        }
      } else {
        await handlePageChange({
          page,
          parameters: updatedParameters,
          breakRoom: pageInt,
          inBreakRoom: pageInt >= 0,
        });

        if (islevel === '2' && hostNewRoom !== -1) {
          socket.emit(
            'updateHostBreakout',
            { prevRoom: hostNewRoom, newRoom: -1, roomName },
            () => {},
          );
        }
      }
    } else {
      await handlePageChange({
        page,
        parameters: updatedParameters,
        breakRoom: 0,
        inBreakRoom: false,
      });

      if (islevel === '2' && hostNewRoom !== -1) {
        socket.emit(
          'updateHostBreakout',
          { prevRoom: hostNewRoom, newRoom: -1, roomName },
          () => {},
        );
      }
    }
  };

  /**
   * Renders each page item.
   *
   * @param {PageItem} item - The page item to render.
   * @returns {JSX.Element} The rendered page button.
   */
  const renderItem = ({ item }: { item: PageItem }) => {
    const isActive = item.number === currentUserPage;
    const pageStyle = isActive ? [styles.activePage, activePageStyle] : [styles.inactivePage, inactivePageStyle];

    let displayItem: React.ReactNode = item.number;
    const targetPage = memberRoom;

    if (breakOutRoomStarted && !breakOutRoomEnded && item.number >= mainRoomsLength) {
      const roomNumber = item.number - (mainRoomsLength - 1);
      if (targetPage + 1 !== roomNumber) {
        if (islevel !== '2') {
          displayItem = (
            <View style={styles.lockContainer}>
              <Text style={styles.pageText}>
                Room {roomNumber}
              </Text>
              <FontAwesome name="lock" size={16} style={styles.lockIcon} />
            </View>
          );
        } else {
          displayItem = (
            <Text style={styles.pageText}>
              Room {roomNumber}
            </Text>
          );
        }
      } else {
        displayItem = (
          <Text style={styles.pageText}>
            Room {roomNumber}
          </Text>
        );
      }
    } else {
      // Wrap item.number in a Text component to avoid the error
      displayItem = <Text style={styles.pageText}>{item.number}</Text>;
  }

    return (
      <Pressable
        key={item.id}
        style={[styles.pageButton, pageStyle]}
        onPress={() => onPagePress(item.number)}
        accessibilityRole="button"
        accessibilityLabel={`Page ${item.number === 0 ? 'Star' : item.number}`}
      >
        {item.number === 0 ? (
          <FontAwesome name="star" size={18} color={isActive ? 'yellow' : 'gray'} />
        ) : (
          displayItem
        )}
      </Pressable>
    );
  };

  /**
   * Determines the alignment styles based on position and location props.
   *
   * @returns StyleProp<ViewStyle> - The alignment style object.
   */
  const getAlignmentStyle = (): StyleProp<ViewStyle> => {
    const alignmentStyle: StyleProp<ViewStyle> = {};

    switch (position) {
      case 'left':
        alignmentStyle.justifyContent = 'flex-start';
        break;
      case 'right':
        alignmentStyle.justifyContent = 'flex-end';
        break;
      case 'middle':
      default:
        alignmentStyle.justifyContent = 'center';
        break;
    }

    switch (location) {
      case 'top':
        alignmentStyle.alignItems = 'flex-start';
        break;
      case 'bottom':
        alignmentStyle.alignItems = 'flex-end';
        break;
      case 'middle':
      default:
        alignmentStyle.alignItems = 'center';
        break;
    }

    return alignmentStyle;
  };

  return (

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal={direction === 'horizontal'}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.paginationContainer,
          { backgroundColor },
            getAlignmentStyle(),
          { flexDirection: direction === 'vertical' ? 'column' : 'row' },
          { justifyContent: 'space-evenly' },
        ]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          display: showAspect ? 'flex' : 'none',
          padding: 0,
          margin: 0,
          width: direction === 'horizontal' ? '100%' : paginationHeight,
          height: direction === 'horizontal' ? paginationHeight : '100%',
          maxHeight: direction === 'horizontal' ? paginationHeight : '100%',
          maxWidth: direction === 'horizontal' ? '100%' : paginationHeight,
         }}
      />
  );

};

export default Pagination;

/**
 * Stylesheet for the Pagination component.
 */
const styles = StyleSheet.create({
  paginationContainer: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
  },
  pageButton: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#2c678f',
    marginHorizontal: 5,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePage: {
    backgroundColor: '#2c678f',
    borderColor: '#2c678f',
  },
  inactivePage: {
    backgroundColor: '#ffffff',
    borderColor: '#2c678f',
  },
  pageText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.2,
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    marginLeft: 2,
    color: '#000000',
  },
});
