import * as React from 'react';
import {mount} from 'enzyme';
import {ThemePickerPanel} from '../themepicker-panel';
import {mockChannel, mockStorybookAPI} from '../../test/mocks';
import {configure} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import {MESSAGE_SELECT_THEME, MESSAGE_SET_THEME_LIST} from '../shared';
import * as EventEmitter from 'events';

configure({adapter: new Adapter()});

describe('ThemePickerPanel', () => {
  beforeEach(() => {
    const mockOn: jest.Mock<(type: PropertyKey, listener: (...args: any) => void) => void> = mockChannel.on as any;
    mockOn.mockClear();
    const mockEmit: jest.Mock<(type: PropertyKey, ...args: any) => void> = mockChannel.emit as any;
    mockEmit.mockClear();
    const mockOnStory: jest.Mock<(callback: (kind: string, story?: string) => void) => () => void> = mockStorybookAPI.onStory as any;
    mockOnStory.mockClear();
  });

  it('should mount', () => {
    const wrapper = mount(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI}/>);
    wrapper.setState({themeNames: ['Theme A', 'Theme B', 'Theme C']});
    expect(wrapper).toMatchSnapshot();
  });

  it('should display the theme names in a select menu', () => {
    const wrapper = mount(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI}/>);
    wrapper.setState({themeNames: ['Theme A', 'Theme B', 'Theme C']});
    expect(wrapper.find('select')).toHaveLength(1);
    expect(wrapper.find('option')).toHaveLength(3);
    expect(wrapper.find('option').at(0).text()).toEqual('Theme A');
    expect(wrapper.find('option').at(1).text()).toEqual('Theme B');
    expect(wrapper.find('option').at(2).text()).toEqual('Theme C');
  });

  it('should subscribe to MESSAGE_SET_THEME_LIST events, and set the theme names on that event', () => {
    const wrapper = mount(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI}/>);
    const mockOn: jest.Mock<any> = mockChannel.on as any;
    expect(mockOn).toHaveBeenCalledWith(MESSAGE_SET_THEME_LIST, expect.any(Function));
    let instance = wrapper.instance();
    expect(instance.state).toEqual({themeNames: []});
    const callback = mockOn.mock.calls[0][1];
    let themeNames = ['Theme 1', 'Theme 2', 'Theme 3'];
    callback(themeNames);
    expect(instance.state).toEqual({themeNames});
  });

  it('should send a MESSAGE_SELECT_THEME event when a user selects a theme', () => {
    const wrapper = mount(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI}/>);
    wrapper.setState({themeNames: ['Theme A', 'Theme B', 'Theme C']});
    const themeCValue = wrapper.find('option').at(2).prop('value');
    wrapper.find('select').simulate('change', {target: {value: themeCValue}});
    expect(mockChannel.emit).toHaveBeenCalledWith(MESSAGE_SELECT_THEME, 2);
  });

  it('should unsubscribe from MESSAGE_SET_THEME_LIST when it unmounts', () => {
    const eventEmitter = new EventEmitter();
    expect(eventEmitter.listenerCount(MESSAGE_SET_THEME_LIST)).toEqual(0);
    const wrapper = mount(<ThemePickerPanel channel={eventEmitter as any} api={mockStorybookAPI}/>);
    expect(eventEmitter.listenerCount(MESSAGE_SET_THEME_LIST)).toEqual(1);
    wrapper.unmount();
    expect(eventEmitter.listenerCount(MESSAGE_SET_THEME_LIST)).toEqual(0);
  });

  it('should reset the themes to an empty array when opening a new story', () => {
    const wrapper = mount(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI}/>);
    let mockOnStory: jest.Mock<(callback: (kind: string, story?: string) => void) => () => void> = mockStorybookAPI.onStory as any;
    expect(mockOnStory).toHaveBeenCalledWith(expect.any(Function));
    const callback = mockOnStory.mock.calls[0][0];
    wrapper.setState({themeNames: ['Default', 'Dark', 'Sparkly']});
    expect(wrapper.instance().state).toEqual({themeNames: ['Default', 'Dark', 'Sparkly']});
    callback('some.kind.of', 'Story');
    expect(wrapper.instance().state).toEqual({themeNames: []});
  });

  it('should not render unless it receives theme names', () => {
    const wrapper = mount(<ThemePickerPanel channel={mockChannel} api={mockStorybookAPI}/>);
    expect(wrapper.html()).toBeNull();
  });
});
