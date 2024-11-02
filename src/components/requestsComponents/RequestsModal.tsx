import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Socket } from 'socket.io-client';
import RenderRequestComponent, {
  RenderRequestComponentOptions,
} from './RenderRequestComponent';
import {
  respondToRequests,
  RespondToRequestsType,
} from '../../methods/requestsMethods/respondToRequests';
import { Request } from '../../@types/types';
import { getModalPosition } from '../../methods/utils/getModalPosition';

export interface RequestsModalParameters {
  /**
   * Function to get updated parameters, particularly the filtered request list.
   */
  getUpdatedAllParams: () => { filteredRequestList: Request[] };
  [key: string]: any;
}

export interface RequestsModalOptions {
  /**
   * Flag to control the visibility of the modal.
   */
  isRequestsModalVisible: boolean;

  /**
   * Callback function to handle the closing of the modal.
   */
  onRequestClose: () => void;

  /**
   * Initial count of requests.
   */
  requestCounter: number;

  /**
   * Function to handle the filter input changes.
   */
  onRequestFilterChange: (text: string) => void;

  /**
   * Function to handle the action when a request item is pressed.
   */
  onRequestItemPress?: RespondToRequestsType;

  /**
   * List of requests.
   */
  requestList: Request[];

  /**
   * Function to update the request list.
   */
  updateRequestList: (newRequestList: Request[]) => void;

  /**
   * Name of the room.
   */
  roomName: string;

  /**
   * Socket instance for real-time communication.
   */
  socket: Socket;

  /**
   * Component to render each request item.
   * Defaults to RenderRequestComponent.
   */
  renderRequestComponent?: React.FC<RenderRequestComponentOptions>;

  /**
   * Background color of the modal.
   * Defaults to '#83c0e9'.
   */
  backgroundColor?: string;

  /**
   * Position of the modal on the screen.
   * Possible values: 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'.
   * Defaults to 'topRight'.
   */
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

  /**
   * Additional parameters for the modal.
   */
  parameters: RequestsModalParameters;
}

export type RequestsModalType = (options: RequestsModalOptions) => JSX.Element;

/**
 * RequestsModal component displays a modal that shows a list of participant requests with options to filter, accept, or reject requests.
 *
 * @component
 * @param {RequestsModalOptions} props - The properties for the RequestsModal component.
 * @returns {JSX.Element} The rendered RequestsModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { RequestsModal } from 'mediasfu-reactnative';
 *
 * const requestList = [
 *   { id: 1, name: 'Request to share screen', icon: 'fa-desktop' },
 *   { id: 2, name: 'Request to unmute', icon: 'fa-microphone' },
 * ];
 *
 * function App() {
 *   const handleRequestAction = (params) => {
 *     console.log(`Request action taken: ${params.action}`);
 *   };
 * 
 *   return (
 *     <RequestsModal
 *       isRequestsModalVisible={true}
 *       onRequestClose={() => console.log('Modal closed')}
 *       requestCounter={requestList.length}
 *       onRequestFilterChange={(text) => console.log('Filter text:', text)}
 *       onRequestItemPress={handleRequestAction}
 *       requestList={requestList}
 *       updateRequestList={(newList) => console.log('Updated request list:', newList)}
 *       roomName="exampleRoom"
 *       socket={socketInstance}
 *       backgroundColor="#83c0e9"
 *       position="topRight"
 *       parameters={{
 *         getUpdatedAllParams: () => ({ filteredRequestList: requestList }),
 *       }}
 *     />
 *   );
 * }
 * export default App;
 * ```
 */

const RequestsModal: React.FC<RequestsModalOptions> = ({
  isRequestsModalVisible,
  onRequestClose,
  requestCounter,
  onRequestFilterChange,
  onRequestItemPress = respondToRequests,
  requestList,
  updateRequestList,
  roomName,
  socket,
  renderRequestComponent = RenderRequestComponent,
  backgroundColor = '#83c0e9',
  position = 'topRight',
  parameters,
}) => {
  const [filteredRequestList, setFilteredRequestList] =
    useState<Request[]>(requestList);
  const [localRequestCounter, setLocalRequestCounter] =
    useState<number>(requestCounter);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    const { getUpdatedAllParams } = parameters;
    const updatedParams = getUpdatedAllParams();
    setFilteredRequestList(updatedParams.filteredRequestList);
    setLocalRequestCounter(updatedParams.filteredRequestList.length);
  }, [requestList, parameters]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isRequestsModalVisible}
      onRequestClose={onRequestClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor,
              width:
                0.8 * Dimensions.get('window').width > 350
                  ? 350
                  : 0.8 * Dimensions.get('window').width,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Requests <Text style={styles.badge}>{localRequestCounter}</Text>
            </Text>
            <Pressable onPress={onRequestClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="black" />
            </Pressable>
          </View>

          <View style={styles.separator} />

          {/* Filter Input */}
          <View style={styles.modalBody}>
            <View style={styles.filterContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search ..."
                value={filterText}
                onChangeText={(text) => {
                  setFilterText(text);
                  onRequestFilterChange(text);
                }}
              />
            </View>
          </View>

          {/* Request List */}
          <ScrollView style={styles.scrollView}>
            <View style={styles.requestList}>
              {filteredRequestList && filteredRequestList.length > 0 ? (
                filteredRequestList.map((requestItem, index) => (
                  <View key={index} style={styles.requestItem}>
                    {renderRequestComponent({
                      request: requestItem,
                      onRequestItemPress,
                      requestList: filteredRequestList,
                      updateRequestList,
                      roomName,
                      socket,
                    })}
                  </View>
                ))
              ) : (
                <Text style={styles.noRequestsText}>No requests found.</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default RequestsModal;

/**
 * Stylesheet for the RequestsModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
  },
  modalContent: {
    height: '65%',
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 20,
    maxHeight: '65%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'black',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  badge: {
    backgroundColor: '#ffffff',
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 5,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
  filterContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  },
  requestList: {
    flexGrow: 1,
  },
  requestItem: {
    marginBottom: 10,
  },
  noRequestsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});
