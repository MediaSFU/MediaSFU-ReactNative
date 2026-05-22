/**
 * @format
 */

import 'react-native';
import React from 'react';
import { View } from 'react-native';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../src/components/mediasfuComponents/MediasfuGeneric', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockMediasfuGeneric() {
    return React.createElement(View, { testID: 'mock-mediasfu-generic' });
  };
});

jest.mock('../src/components/mediasfuComponents/MediasfuBroadcast', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockMediasfuBroadcast() {
    return React.createElement(View, { testID: 'mock-mediasfu-broadcast' });
  };
});

jest.mock('../src/components/mediasfuComponents/MediasfuChat', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockMediasfuChat() {
    return React.createElement(View, { testID: 'mock-mediasfu-chat' });
  };
});

jest.mock('../src/components/mediasfuComponents/MediasfuWebinar', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockMediasfuWebinar() {
    return React.createElement(View, { testID: 'mock-mediasfu-webinar' });
  };
});

jest.mock('../src/components/mediasfuComponents/MediasfuConference', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockMediasfuConference() {
    return React.createElement(View, { testID: 'mock-mediasfu-conference' });
  };
});

jest.mock('../src/components/miscComponents/PreJoinPage', () => {
  const React = require('react');
  const { View } = require('react-native');

  return function MockPreJoinPage() {
    return React.createElement(View, { testID: 'mock-prejoin-page' });
  };
});

jest.mock('../src/methods/utils/generateRandomParticipants', () => ({
  generateRandomParticipants: jest.fn(() => []),
}));

jest.mock('../src/methods/utils/generateRandomMessages', () => ({
  generateRandomMessages: jest.fn(() => []),
}));

jest.mock('../src/methods/utils/generateRandomRequestList', () => ({
  generateRandomRequestList: jest.fn(() => []),
}));

jest.mock('../src/methods/utils/generateRandomWaitingRoomList', () => ({
  generateRandomWaitingRoomList: jest.fn(() => []),
}));

jest.mock('../src/methods/utils/createRoomOnMediaSFU', () => ({
  createRoomOnMediaSFU: jest.fn(),
}));

jest.mock('../src/methods/utils/joinRoomOnMediaSFU', () => ({
  joinRoomOnMediaSFU: jest.fn(),
}));

const App = require('../App').default;

it('renders correctly', () => {
  const tree = renderer.create(<App />);

  expect(tree.root.findByProps({ testID: 'mock-mediasfu-generic' })).toBeTruthy();
  expect(tree.root.findAllByType(View).length).toBeGreaterThan(0);
});
