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
  StyleProp,
  ViewStyle,
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

/**
 * Configuration parameters used by `RequestsModal` to hydrate dynamic state.
 *
 * @interface RequestsModalParameters
 *
 * **Utility:**
 * @property {() => { filteredRequestList: Request[] }} getUpdatedAllParams Fetches the latest filtered request list snapshot.
 * @property {Record<string, any>} [key: string] Additional values exposed to modal consumers.
 */
export interface RequestsModalParameters {
  /**
   * Function to get updated parameters, particularly the filtered request list.
   */
  getUpdatedAllParams: () => { filteredRequestList: Request[] };
  [key: string]: any;
}

/**
 * Configuration options for the `RequestsModal` component.
 *
 * @interface RequestsModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isRequestsModalVisible Toggles modal visibility.
 * @property {() => void} onRequestClose Invoked when the modal should close.
 *
 * **Request Management:**
 * @property {number} requestCounter Total pending requests displayed in the badge.
 * @property {Request[]} requestList Complete list of requests to render.
 * @property {(newRequestList: Request[]) => void} updateRequestList Updates persistent request state after actions.
 * @property {(text: string) => void} onRequestFilterChange Tracks filter input changes.
 * @property {RespondToRequestsType} [onRequestItemPress] Optional handler for accept/deny actions (defaults to `respondToRequests`).
 *
 * **Session Context:**
 * @property {string} roomName Identifier for the active room used when responding.
 * @property {Socket} socket Active socket.io connection enabling real-time updates.
 *
 * **State Parameters:**
 * @property {RequestsModalParameters} parameters Encapsulated helpers that deliver filtered lists to the modal.
 *
 * **Customization:**
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'} [position='topRight'] Placement of the modal container.
 * @property {string} [backgroundColor='#83c0e9'] Background color applied to the modal card.
 * @property {StyleProp<ViewStyle>} [style] Additional styling injected into the modal container.
 * @property {React.FC<RenderRequestComponentOptions>} [renderRequestComponent] Custom renderer for individual request items.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the default body layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for the modal container wrapper.
 */
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

  /**
   * Optional custom style for the modal container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom render function for modal content.
   */
  renderContent?: (options: {
    defaultContent: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;

  /**
   * Custom render function for the modal container.
   */
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
}

export type RequestsModalType = (options: RequestsModalOptions) => JSX.Element;

/**
 * RequestsModal - Participant request management modal.
 *
 * Presents host/co-host controls for reviewing, filtering, and responding to
 * participant requests (raise hand, mic access, etc.) in real time. Supports
 * custom row renderers and override hooks for deeper UI customization.
 *
 * **Key Features:**
 * - Real-time request badge that mirrors the incoming queue length.
 * - Inline search/filtering to quickly find participants.
 * - Default integration with `respondToRequests` for socket acknowledgements.
 * - Configurable modal positioning and optional container styling.
 * - Empty-state messaging when no results match the filter.
 * - Override hooks (`renderContent`/`renderContainer`) for advanced layouts.
 * - Custom request row support via `renderRequestComponent`.
 * - Keyboard-friendly text input for quick filtering.
 *
 * **UI Customization:**
 * Supply a replacement component through `uiOverrides.requestsModal` to swap
 * the entire modal while reusing the provided action handlers.
 *
 * @component
 * @param {RequestsModalOptions} props Component properties.
 * @returns {JSX.Element} Rendered request management modal.
 *
 * @example
 * ```tsx
 * // Basic host usage
 * <RequestsModal
 *   isRequestsModalVisible={isOpen}
 *   onRequestClose={closeModal}
 *   requestCounter={requests.length}
 *   onRequestFilterChange={setFilter}
 *   requestList={requests}
 *   updateRequestList={setRequests}
 *   roomName={roomName}
 *   socket={socket}
 *   parameters={{ getUpdatedAllParams: () => ({ filteredRequestList: filtered }) }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom request renderer
 * <RequestsModal
 *   isRequestsModalVisible={visible}
 *   onRequestClose={handleClose}
 *   requestCounter={filtered.length}
 *   onRequestFilterChange={handleFilter}
 *   requestList={filtered}
 *   updateRequestList={setRequests}
 *   roomName="studio"
 *   socket={socket}
 *   renderRequestComponent={MyRequestRow}
 *   parameters={{ getUpdatedAllParams: () => ({ filteredRequestList: filtered }) }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // uiOverrides integration
 * const RequestsModalComponent = withOverride(uiOverrides.requestsModal, RequestsModal);
 * <RequestsModalComponent
 *   isRequestsModalVisible={isOpen}
 *   onRequestClose={close}
 *   requestCounter={count}
 *   onRequestFilterChange={setFilter}
 *   requestList={requests}
 *   updateRequestList={setRequests}
 *   roomName={roomId}
 *   socket={socket}
 *   parameters={params}
 * />
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
  style,
  renderContent,
  renderContainer,
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

  const modalWidth =
    0.8 * Dimensions.get('window').width > 350
      ? 350
      : 0.8 * Dimensions.get('window').width;
  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
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
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
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
            { backgroundColor, width: modalWidth },
            style,
          ]}
        >
          {content}
        </View>
      </View>
    </Modal>
  );

  const container = renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;

  return <>{container}</>;
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
