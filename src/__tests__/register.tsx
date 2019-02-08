import * as React from 'react';
import addonAPI, {AddonStore} from '@storybook/addons';
import {ThemePickerPanel} from '../themepicker-panel';
import {mockChannel, mockStorybookAPI} from '../../test/mocks';

jest.mock('@storybook/addons', () => ({
  default: {
    register: jest.fn(),
    addPanel: jest.fn(),
    getChannel: jest.fn(() => mockChannel)
  }
}));
const mockAddonAPI: jest.Mocked<AddonStore> = addonAPI as any;

describe('register', () => {
  it('registers ebay/themepicker and adds the ThemePickerPanel in the callback', () => {
    expect(mockAddonAPI.register).not.toHaveBeenCalled();
    expect(mockAddonAPI.addPanel).not.toHaveBeenCalled();
    require('../register');
    expect(mockAddonAPI.register).toHaveBeenCalledWith('ebay/themepicker', expect.any(Function));
    const callback = mockAddonAPI.register.mock.calls[0][1];
    callback(mockStorybookAPI);
    expect(mockAddonAPI.addPanel).toHaveBeenCalledWith('ebay/themepicker/panel', {
      title: 'Theme',
      render: expect.any(Function)
    });
    const render = mockAddonAPI.addPanel.mock.calls[0][1].render;
    expect(render()).toEqual(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI} />);
  });
});
