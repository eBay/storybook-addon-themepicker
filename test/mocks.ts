import {StorybookAPI} from '../src/storybook__addons-more';
import * as Channel from '@storybook/channels';

export const mockChannel: Channel = {
  addListener: jest.fn(),
  addPeerListener: jest.fn(),
  emit: jest.fn(),
  eventNames: jest.fn(),
  listenerCount: jest.fn(),
  listeners: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  prependListener: jest.fn(),
  removeAllListeners: jest.fn(),
  removeListener: jest.fn()
};

export const mockStorybookAPI: StorybookAPI = {
  onStory: jest.fn()
};
