/* eslint-disable @typescript-eslint/no-unused-vars */
// Import specific Mediasfu view components
import MediasfuConference from './src/components/mediasfuComponents/MediasfuConference';

// Import the PreJoinPage component for the Pre-Join Page use case
import PreJoinPage from './src/components/miscComponents/PreJoinPage';


/**
 * The main application component for MediaSFU.
 *
 * This component initializes the necessary credentials and configuration for the MediaSFU application,
 * including options for using seed data for generating random participants and messages.
 *
 * @returns {JSX.Element} The rendered Mediasfu component with the specified props.
 *
 * @remarks
 * - The `credentials` object contains the API username and API key for the Mediasfu account.
 * - The `useSeed` flag determines whether to use seed data for generating random participants and messages.
 * - The `eventType` variable indicates the type of UI display (e.g., 'broadcast', 'chat', 'webinar', 'conference').
 * - If `useSeed` is true, random participants, messages, requests, and waiting lists are generated and assigned to `seedData`.
 * - The `useLocalUIMode` flag is set to true if `useSeed` is true, preventing requests to the Mediasfu servers during UI development.
 *
 * @component
 * @example
 * // Example usage of the App component
 * <App />
 */

const App = () => {
  // Mediasfu account credentials
  // Replace 'your_api_username' and 'your_api_key' with your actual credentials
  const credentials = {apiUserName: "your_api_username", apiKey: "your_api_key"};


  // Choose the Mediasfu component based on the event type
  // Uncomment the component corresponding to your use case

  // Simple Use Case (Welcome Page)
  // Renders the default welcome page
  // No additional inputs required
  // return <MediasfuConference />;

  // Use Case with Pre-Join Page (Credentials Required)
  // Uses a pre-join page that requires users to enter credentials
  // return <MediasfuConference PrejoinPage={PreJoinPage} credentials={credentials} />;

  // Use Case with Local UI Mode (Seed Data Required)
  // Runs the application in local UI mode using seed data
  // return <MediasfuConference useLocalUIMode={true} useSeed={true} seedData={seedData} />;


  // Default to MediasfuConference without any props
  // This will render the welcome page
  return <MediasfuConference PrejoinPage={PreJoinPage} credentials={credentials} />;
};

export default App;
