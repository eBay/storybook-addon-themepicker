import * as React from 'react';
import {configure, mount} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import {ThemeDescriptor, WithThemes} from '../with-themes';
import {withTheme} from 'emotion-theming';
import {mockChannel, mockStorybookAPI} from '../../test/mocks';
import addonAPI, {AddonStore} from '@storybook/addons';
import {MESSAGE_SELECT_THEME, MESSAGE_SET_THEME_LIST} from '../shared';

configure({adapter: new Adapter()});

jest.mock('@storybook/addons', () => ({
  default: {
    register: jest.fn(),
    addPanel: jest.fn(),
    getChannel: jest.fn(() => mockChannel)
  }
}));
const mockAddonAPI: jest.Mocked<AddonStore> = addonAPI as any;

type Theme = {
  color: string;
}
const defaultTheme: Theme = {
  color: 'gray'
};
const darkTheme: Theme = {
  color: 'black'
};
const brightTheme: Theme = {
  color: 'canary'
};
const justThemes: Theme[] = [
  defaultTheme,
  darkTheme,
  brightTheme
];
const themeDescriptors: ThemeDescriptor<Theme>[] = [
  {
    name: 'Default',
    theme: defaultTheme
  },
  {
    name: 'Dark',
    theme: darkTheme
  },
  {
    name: 'Bright',
    theme: brightTheme
  }
];

type ThemeNameProps = {
  theme: Theme
};
const ThemeNameWithTheme: React.FunctionComponent<ThemeNameProps> = (props: ThemeNameProps) => <span>{props.theme.color}</span>;
const ThemeName = withTheme<{}>(ThemeNameWithTheme);

describe('WithThemes', () => {
  beforeEach(() => {
    const mockOn: jest.Mock<(type: PropertyKey, listener: (...args: any) => void) => void> = mockChannel.on as any;
    mockOn.mockClear();
    const mockEmit: jest.Mock<(type: PropertyKey, ...args: any) => void> = mockChannel.emit as any;
    mockEmit.mockClear();
    // const mockOnStory: jest.Mock<(callback: (kind: string, story?: string) => void) => () => void> = mockStorybookAPI.onStory as any;
    // mockOnStory.mockClear();
  });

  it('should mount', () => {
    const wrapper = mount(<WithThemes themes={themeDescriptors}><ThemeName /></WithThemes>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should emit a MESSAGE_SET_THEME_LIST event if it has themes', () => {
    const wrapper = mount(<WithThemes themes={themeDescriptors}><ThemeName /></WithThemes>);
    expect(mockChannel.emit).toHaveBeenCalledWith(MESSAGE_SET_THEME_LIST, ['Default', 'Dark', 'Bright']);
  });

  it('should not emit a MESSAGE_SET_THEME_LIST event if has no themes', () => {
    // @ts-ignore
    const wrapper = mount(<WithThemes><ThemeName /></WithThemes>);
    expect(mockChannel.emit).not.toHaveBeenCalledWith();
  });

  it('should subscribe to MESSAGE_SELECT_THEME events', () => {
    const wrapper = mount(<WithThemes themes={themeDescriptors}><ThemeName /></WithThemes>);
    expect(mockChannel.on).toHaveBeenCalledWith(MESSAGE_SELECT_THEME, expect.any(Function));
  });

  it('should update the theme sent to a child component if it receives a MESSAGE_SELECT_THEME event', () => {
    const wrapper = mount(<WithThemes themes={themeDescriptors}><ThemeName /></WithThemes>);
    let mockOn: jest.Mock<(type: PropertyKey, listener: (...args: any) => void) => void> = mockChannel.on as any;
    expect(mockOn).toHaveBeenCalledWith(MESSAGE_SELECT_THEME, expect.any(Function));
    const callback = mockOn.mock.calls[0][1];
    expect(wrapper.text()).toEqual('gray');
    callback(2);
    expect(wrapper.text()).toEqual('canary');
  });

  it("should display an error if it doesn't have themes", () => {
    // @ts-ignore
    const wrapper = mount(<WithThemes><ThemeName /></WithThemes>);
    expect(wrapper.text()).toEqual('Missing property for WithThemes: themes');
  });

  describe('getThemes', () => {
    it('should handle a single theme', () => {
      const wrapper = mount<WithThemes<Theme>>(<WithThemes themes={defaultTheme}><ThemeName /></WithThemes>);
      expect(wrapper.instance().getThemes()).toEqual([
        {
          name: 'Default',
          theme: defaultTheme
        }
      ]);
    });

    it('should handle a single ThemeDescriptor', () => {
      const wrapper = mount<WithThemes<Theme>>(<WithThemes themes={{
        name: 'My Special Theme',
        theme: brightTheme
      }}><ThemeName /></WithThemes>);
      expect(wrapper.instance().getThemes()).toEqual([
        {
          name: 'My Special Theme',
          theme: brightTheme
        }
      ]);
    });

    it('should handle an array of themes', () => {
      const wrapper = mount<WithThemes<Theme>>(<WithThemes themes={justThemes}><ThemeName /></WithThemes>);
      expect(wrapper.instance().getThemes()).toEqual([
        {
          name: 'Theme 1',
          theme: defaultTheme
        },
        {
          name: 'Theme 2',
          theme: darkTheme
        },
        {
          name: 'Theme 3',
          theme: brightTheme
        }
      ]);
    });

    it('should handle an array of ThemeDescriptors', () => {
      const wrapper = mount<WithThemes<Theme>>(<WithThemes themes={themeDescriptors}><ThemeName /></WithThemes>);
      expect(wrapper.instance().getThemes()).toEqual([
        {
          name: 'Default',
          theme: defaultTheme
        },
        {
          name: 'Dark',
          theme: darkTheme
        },
        {
          name: 'Bright',
          theme: brightTheme
        }
      ]);
    });

    it('should return undefined if there are no themes', () => {
      // @ts-ignore
      const wrapper = mount<WithThemes<Theme>>(<WithThemes><ThemeName /></WithThemes>);
      expect(wrapper.instance().getThemes()).toEqual(undefined);
      const wrapper2 = mount<WithThemes<Theme>>(<WithThemes themes={[]}><ThemeName /></WithThemes>);
      expect(wrapper2.instance().getThemes()).toEqual(undefined);
    });
  });
});
