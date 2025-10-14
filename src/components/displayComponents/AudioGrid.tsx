// AudioGrid.tsx

import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * Options for rendering `AudioGrid`.
 *
 * @interface AudioGridOptions
 *
 * **Content:**
 * @property {React.ReactNode[]} componentsToRender Children to be rendered inside the grid.
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [style] Additional styling for the grid container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the rendered grid content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for the surrounding container implementation.
 */
export interface AudioGridOptions {
  componentsToRender: React.ReactNode[];
  style?: StyleProp<ViewStyle>;
  renderContent?: (options: {
    defaultContent: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
}

export type AudioGridType = (options: AudioGridOptions) => JSX.Element;

/**
 * AudioGrid arranges a list of audio-centric components within a simple grid wrapper. It is typically used to
 * render collections of `AudioCard` or custom mini cards and supports override hooks for layout customization.
 *
 * @param {AudioGridOptions} props Audio grid configuration.
 * @returns {JSX.Element} Rendered audio grid container.
 */

const AudioGrid: React.FC<AudioGridOptions> = ({
  componentsToRender,
  style,
  renderContent,
  renderContainer,
}) => {
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

  const dimensions = { width: 0, height: 0 }; // AudioGrid doesn't have fixed dimensions

  const defaultContent = (
    <>
      {renderGrid()}
    </>
  );
  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View style={[{ zIndex: 9 }, style]}>{content}</View>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
};

export default AudioGrid;
