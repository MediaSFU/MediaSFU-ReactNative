// AudioGrid.tsx

import React from 'react';
import {
  View,
} from 'react-native';

export interface AudioGridOptions {
  componentsToRender: React.ReactNode[]; // Array of React components or elements
}

export type AudioGridType = (options: AudioGridOptions) => React.ReactNode;

/**
 * AudioGrid component renders a grid layout of audio components or elements.
 *
 * This component organizes an array of audio components or elements into a flexible grid.
 *
 * @component
 * @param {AudioGridOptions} props - Properties for the AudioGrid component.
 * @param {React.ReactNode[]} props.componentsToRender - Array of React components or elements to render in the grid.
 *
 * @returns {JSX.Element} The AudioGrid component rendering a grid of audio components.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { AudioGrid, AudioCard } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const components = [
 *     <AudioCard name="Participant 1" />,
 *     <AudioCard name="Participant 2" />,
 *     <AudioCard name="Participant 3" />
 *   ];
 *
 *   return (
 *     <AudioGrid componentsToRender={components} />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const AudioGrid: React.FC<AudioGridOptions> = ({ componentsToRender }) => {
  /**
   * renderGrid - Renders componentsToRender array into a grid.
   * @returns {React.ReactNode[]} - An array of React components rendered in the grid.
   */
  const renderGrid = (): React.ReactNode[] => {
    const renderedComponents = [];

    for (let index = 0; index < componentsToRender.length; index++) {
      const component = componentsToRender[index];
      renderedComponents.push(<View style={{ zIndex: 9 }} key={index}>{component}</View>);
    }

    return renderedComponents;
  };

  return (
    <View style={{ zIndex: 9 }}>{renderGrid()}</View>
  );
};

export default AudioGrid;
