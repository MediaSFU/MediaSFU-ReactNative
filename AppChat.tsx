/* eslint-disable @typescript-eslint/no-unused-vars */
// Import specific Mediasfu view components
import MediasfuChat from './src/components/mediasfuComponents/MediasfuChat';

// Import the PreJoinPage component for the Pre-Join Page use case
import PreJoinPage from './src/components/miscComponents/PreJoinPage';

/**
 * The main application component for MediaSFU.
 *
 * This component initializes the necessary configuration and credentials for the MediaSFU application.
 * Users can specify their own Community Edition (CE) server, utilize MediaSFU Cloud by default, or enable MediaSFU Cloud for egress features.
 *
 * @remarks
 * - **Using Your Own CE Server**: Set the `localLink` to point to your Community Edition server.
 * - **Using MediaSFU Cloud by Default**: If not using a custom server (`localLink` is empty), the application connects to MediaSFU Cloud.
 * - **MediaSFU Cloud Egress Features**: To enable cloud recording, capturing, and returning real-time images and audio buffers,
 *   set `connectMediaSFU` to `true` if `localLink` is provided.
 * - **Credentials Requirement**: If not using your own server, provide `apiUserName` and `apiKey`. The same applies when using MediaSFU Cloud for egress.
 * - **Deprecated Feature**: `useLocalUIMode` is deprecated due to updates for strong typing and improved configuration options.
 *
 * @component
 * @example
 * ```tsx
 * // Example usage of the App component
 * <App />
 * ```
 */
const App = () => {
    // ========================
    // ====== CONFIGURATION ======
    // ========================

    // Mediasfu account credentials
    // Replace 'your_api_username' and 'your_api_key' with your actual credentials
    const credentials = {
      apiUserName: 'your_api_username',
      apiKey: 'your_api_key',
    };

    // Specify your Community Edition (CE) server link or leave as an empty string if not using a custom server
    // If using localhost (e.g., 'http://localhost:3000'), you may not be able to connect to the server from a mobile device
    // To connect to a local server, use the IP address of your machine (e.g., 'http://100.0.0.55:3000')
    // Or use a tunneling service like ngrok (https://ngrok.com/) to expose your local server to the internet

    const localLink = 'http://100.0.0.55:3000'; // Set to '' if not using your own server

    /**
     * Automatically set `connectMediaSFU` to `true` if `localLink` is provided,
     * indicating the use of MediaSFU Cloud by default.
     *
     * - If `localLink` is not empty, MediaSFU Cloud will be used for additional features.
     * - If `localLink` is empty, the application will connect to MediaSFU Cloud by default.
     */
    const connectMediaSFU = localLink.trim() !== '';

    // ========================
    // ====== USE CASES ======
    // ========================

    // Deprecated Feature: useLocalUIMode
    // This feature is deprecated due to updates for strong typing.
    // It is no longer required and should not be used in new implementations.

    /**
     * Uncomment and configure the following section if you intend to use seed data
     * for generating random participants and messages.
     *
     * Note: This is deprecated and maintained only for legacy purposes.
     */
    /*
    const useSeed = false;
    let seedData = {};

    if (useSeed) {
      const memberName = 'Prince';
      const hostName = 'Fred';

      const participants_ = generateRandomParticipants({
        member: memberName,
        coHost: '',
        host: hostName,
        forChatChat: eventType === 'Chat' || eventType === 'chat',
      });

      const messages_ = generateRandomMessages({
        participants: participants_,
        member: memberName,
        host: hostName,
        forChatChat: eventType === 'Chat' || eventType === 'chat',
      });

      const requests_ = generateRandomRequestList({
        participants: participants_,
        hostName: memberName,
        coHostName: '',
        numberOfRequests: 3,
      });

      const waitingList_ = generateRandomWaitingRoomList();

      seedData = {
        participants: participants_,
        messages: messages_,
        requests: requests_,
        waitingList: waitingList_,
        member: memberName,
        host: hostName,
        eventType: eventType,
      };
    }
    */

    // ========================
    // ====== COMPONENT SELECTION ======
    // ========================

    /**
     * Choose the Mediasfu component based on the event type and use case.
     * Uncomment the component corresponding to your specific use case.
     */

    // ------------------------
    // ====== SIMPLE USE CASE ======
    // ------------------------

    /**
     * **Simple Use Case (Welcome Page)**
     *
     * Renders the default welcome page.
     * No additional inputs required.
     */
    // return <MediasfuChat />;

    // ------------------------
    // ====== PRE-JOIN USE CASE ======
    // ------------------------

    /**
     * **Use Case with Pre-Join Page (Credentials Required)**
     *
     * Uses a pre-join page that requires users to enter credentials.
     */
    // return <MediasfuChat PrejoinPage={PreJoinPage} credentials={credentials} />;

    // ------------------------
    // ====== SEED DATA USE CASE ======
    // ------------------------

    /**
     * **Use Case with Seed Data (Deprecated)**
     *
     * Runs the application using seed data.
     *
     * @deprecated Due to updates for strong typing, this feature is deprecated.
     */
    // return <MediasfuChat useSeed={useSeed} seedData={useSeed ? seedData : {}} />;

    // ========================
    // ====== CHAT EVENT TYPE ======
    // ========================

    /**
     * **MediasfuChat Component**
     *
     * Uncomment to use the chat event type.
     */
    /*
    return (
      <MediasfuChat
        credentials={credentials}
        localLink={localLink}
        connectMediaSFU={connectMediaSFU}
        // seedData={useSeed ? seedData : {}}
      />
    );
    */

    // ========================
    // ====== DEFAULT COMPONENT ======
    // ========================

    /**
     * **Default to MediasfuChat with Updated Configuration**
     *
     * Renders the MediasfuChat component with specified server and cloud connection settings.
     * This is the default use case if no specific event type is selected.
     */
    return (
      <MediasfuChat
        PrejoinPage={PreJoinPage}
        credentials={credentials}
        localLink={localLink}
        connectMediaSFU={connectMediaSFU}
        // seedData={useSeed ? seedData : {}}
      />
    );
  };

  export default App;