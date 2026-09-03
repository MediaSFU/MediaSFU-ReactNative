import React from 'react';
import { Text } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import { ModernMediasfuGenericHead } from '../src/components_modern/mediasfu_components/ModernMediasfuGenericHead';

describe('ModernMediasfuGenericHead', () => {
  it('uses the engine pure reader and invokes only its retained renderer', () => {
    const renderModernMediasfuUI = jest.fn(() => <Text>engine UI</Text>);
    const getCurrentParams = jest.fn(() => ({ renderModernMediasfuUI }));
    const getUpdatedAllParams = jest.fn(() => {
      throw new Error('publishing getter must not run during render');
    });

    let tree: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(
        <ModernMediasfuGenericHead
          parameters={{ getCurrentParams, getUpdatedAllParams }}
        />,
      );
    });

    expect(tree!.root.findByType(Text).props.children).toBe('engine UI');
    expect(getCurrentParams).toHaveBeenCalledTimes(1);
    expect(renderModernMediasfuUI).toHaveBeenCalledTimes(1);
    expect(getUpdatedAllParams).not.toHaveBeenCalled();
  });

  it('renders nothing until an engine renderer has been published', () => {
    let tree: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<ModernMediasfuGenericHead parameters={{}} />);
    });

    expect(tree!.toJSON()).toBeNull();
  });
});
