/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MediaSFU React Native - Custom Components Example
 *
 * This file demonstrates how to create and use custom components
 * with MediaSFU React Native. You can copy these examples and
 * modify them to fit your design requirements.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MediasfuGeneric from './src/components/mediasfuComponents/MediasfuGeneric';
import MediasfuBroadcast from './src/components/mediasfuComponents/MediasfuBroadcast';
import {
  CustomVideoCardType,
  CustomAudioCardType,
  CustomMiniCardType,
  CustomVideoCardOptions,
  CustomAudioCardOptions,
  CustomMiniCardOptions,
  Participant,
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
} from './src/@types/types';

// =========================================================
//                  CUSTOM COMPONENT EXAMPLES
// =========================================================

// Custom VideoCard Example for React Native
const MyCustomVideoCard: CustomVideoCardType = (options: CustomVideoCardOptions) => {
  const {
    participant,
    backgroundColor,
    parameters,
  } = options;

  return (
    <View
      style={[
        styles.videoCardContainer,
        {
          backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.8)',
        },
      ]}
    >
      {/* Custom video display would go here */}
      {/* Note: Video rendering in React Native requires platform-specific implementation */}

      {/* Custom participant info overlay */}
      <View style={styles.videoInfoOverlay}>
        <Text style={styles.videoInfoText}>
          🎥 {participant?.name || 'Participant'}
        </Text>
      </View>

      {/* Custom controls overlay */}
      <View style={styles.videoControlsOverlay}>
        <View style={styles.controlButton}>
          <Text style={styles.controlButtonText}>🔇</Text>
        </View>
        <View style={styles.controlButton}>
          <Text style={styles.controlButtonText}>📹</Text>
        </View>
      </View>
    </View>
  );
};

// Custom AudioCard Example for React Native
const MyCustomAudioCard: CustomAudioCardType = (options: CustomAudioCardOptions) => {
  const {
    name,
    barColor,
    textColor,
    parameters,
  } = options;

  const isActive = barColor; // barColor indicates if participant is speaking

  return (
    <View
      style={[
        styles.audioCardContainer,
        {
          backgroundColor: isActive ? '#ef4444' : '#6b7280',
        },
      ]}
    >
      {/* Audio wave animation background */}
      {isActive && (
        <View style={styles.audioWaveOverlay} />
      )}

      {/* Avatar */}
      <View style={styles.audioAvatar}>
        <Text style={styles.audioAvatarText}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>

      {/* Name */}
      <Text style={[styles.audioNameText, { color: textColor || 'white' }]}>
        {name}
      </Text>

      {/* Speaking indicator */}
      {isActive && (
        <Text style={styles.speakingIndicator}>
          🎤 Speaking...
        </Text>
      )}
    </View>
  );
};

// Custom MiniCard Example for React Native
const MyCustomMiniCard: CustomMiniCardType = (options: CustomMiniCardOptions) => {
  const {
    initials,
    name,
    showVideoIcon,
    showAudioIcon,
    parameters,
  } = options;

  return (
    <View style={styles.miniCardContainer}>
      {/* Avatar/Initials */}
      <View style={styles.miniAvatar}>
        <Text style={styles.miniAvatarText}>
          {initials || name?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      </View>

      {/* Name */}
      <Text style={styles.miniNameText} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>

      {/* Media status icons */}
      <View style={styles.miniMediaIcons}>
        {showVideoIcon && (
          <Text style={styles.miniMediaIcon}>📹</Text>
        )}
        {showAudioIcon && (
          <Text style={styles.miniMediaIcon}>🎤</Text>
        )}
      </View>
    </View>
  );
};

// =========================================================
//                     STYLES
// =========================================================

const styles = StyleSheet.create({
  // Video Card Styles
  videoCardContainer: {
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  videoInfoOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  videoInfoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoControlsOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Audio Card Styles
  audioCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  audioWaveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  audioAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    zIndex: 1,
  },
  audioAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  audioNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
  },
  speakingIndicator: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },

  // Mini Card Styles
  miniCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    minHeight: 80,
    minWidth: 80,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  miniAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  miniAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  miniNameText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 6,
    color: 'white',
    maxWidth: '100%',
  },
  miniMediaIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  miniMediaIcon: {
    fontSize: 12,
    opacity: 0.7,
  },
});

// =========================================================
//                   USAGE EXAMPLES
// =========================================================

// Example 1: Basic Usage with MediasfuGeneric
const ExampleApp1 = () => {
  const credentials = {
    apiUserName: 'your-api-username',
    apiKey: 'your-api-key',
  };

  return (
    <MediasfuGeneric
      credentials={credentials}
      localLink=""
      connectMediaSFU={true}

      // Add your custom components here
      customVideoCard={MyCustomVideoCard}
      customAudioCard={MyCustomAudioCard}
      customMiniCard={MyCustomMiniCard}
    />
  );
};

// Example 2: Usage with MediasfuBroadcast
const ExampleApp2 = () => {
  const credentials = {
    apiUserName: 'your-api-username',
    apiKey: 'your-api-key',
  };

  return (
    <MediasfuBroadcast
      credentials={credentials}
      localLink=""
      connectMediaSFU={true}

      // Custom components work with all MediaSFU components
      customVideoCard={MyCustomVideoCard}
      customAudioCard={MyCustomAudioCard}
      customMiniCard={MyCustomMiniCard}
    />
  );
};

// Example 3: Custom UI with No Default MediaSFU Interface
const ExampleApp3 = () => {
  const [sourceParameters, setSourceParameters] = React.useState({});

  const updateSourceParameters = (data: any) => {
    setSourceParameters(data);
  };

  const noUIPreJoinOptions: CreateMediaSFURoomOptions = {
    action: 'create',
    capacity: 10,
    duration: 15,
    eventType: 'broadcast',
    userName: 'YourName',
  };

  return (
    <MediasfuGeneric
      credentials={{ apiUserName: 'test', apiKey: 'test' }}

      // Disable default UI
      returnUI={false}
      noUIPreJoinOptions={noUIPreJoinOptions}
      sourceParameters={sourceParameters}
      updateSourceParameters={updateSourceParameters}

      // Custom components will still be used in your custom UI implementation
      customVideoCard={MyCustomVideoCard}
      customAudioCard={MyCustomAudioCard}
      customMiniCard={MyCustomMiniCard}
    />
  );
};

// =========================================================
//                     EXPORTS
// =========================================================

export default ExampleApp1;
export {
  MyCustomVideoCard,
  MyCustomAudioCard,
  MyCustomMiniCard,
  ExampleApp1,
  ExampleApp2,
  ExampleApp3,
};

/**
 * =========================================================
 *                   IMPLEMENTATION NOTES
 * =========================================================
 *
 * 1. Custom Component Props:
 *    - Each component receives specific props as defined in the TypeScript interfaces
 *    - The 'parameters' prop gives you access to all MediaSFU state and functions
 *    - Props like 'barColor' indicate dynamic states (e.g., speaking status)
 *
 * 2. React Native Compatibility:
 *    - Uses standard React Native components (View, Text, etc.)
 *    - Compatible with react-native-vector-icons
 *    - Works on both iOS and Android
 *
 * 3. Integration:
 *    - Custom components automatically replace default ones throughout MediaSFU
 *    - They work with all MediaSFU components (Generic, Broadcast, Conference, Chat, Webinar)
 *    - No additional configuration needed beyond passing the components as props
 *
 * 4. Performance:
 *    - Components are optimized for React Native performance
 *    - Use React.memo if needed for complex components
 *    - Follow React Native best practices for styling and layout
 *
 * 5. Customization Tips:
 *    - You can access MediaSFU functions through the 'parameters' prop
 *    - Create multiple theme sets for different use cases
 *    - Use conditional rendering based on participant state
 *    - Implement animations using React Native Animated API
 */
