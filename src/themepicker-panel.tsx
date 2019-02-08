/*************************************************************
 Copyright 2018-2019 eBay Inc.
 Developer/Architect: Frederik Goris

 Use of this source code is governed by an MIT-style
 license that can be found in the LICENSE file or at
 https://opensource.org/licenses/MIT.
 ************************************************************/

import {css} from 'emotion';
import * as React from 'react';
import {MESSAGE_SELECT_THEME, MESSAGE_SET_THEME_LIST} from './shared';
import {StorybookAPI} from './storybook__addons-more';
import * as Channel from '@storybook/channels';

type ThemePickerPanelProps = {
  channel: Channel;
  api: StorybookAPI;
};
type ThemePickerPanelState = {
  themeNames: string[];
};

export class ThemePickerPanel extends React.Component<ThemePickerPanelProps, ThemePickerPanelState> {
  stopListeningOnStory: () => void;

  constructor(props: ThemePickerPanelProps) {
    super(props);
    this.state = {
      themeNames: []
    };
  }

  setThemeNames = (themeNames: string[]) => this.setState({themeNames});

  componentDidMount() {
    this.props.channel.on(MESSAGE_SET_THEME_LIST, this.setThemeNames);
    this.stopListeningOnStory = this.props.api.onStory(() => this.setThemeNames([]));
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }
    this.props.channel.removeListener(MESSAGE_SET_THEME_LIST, this.setThemeNames);
  }

  selectTheme = (index: number) => this.props.channel.emit(MESSAGE_SELECT_THEME, index);

  render() {
    const themeNames = this.state.themeNames;
    if (themeNames.length === 0) {
      return null;
    }
    return (
      <div className={ThemePickerPanelStyles.container}>
        <label htmlFor="theme-picker" className={ThemePickerPanelStyles.label}>
          Theme
        </label>
        <select
          id="theme-picker"
          className={ThemePickerPanelStyles.select}
          onChange={e => this.selectTheme(parseInt(e.target.value, 10))}
        >
          {themeNames.map((themeName, index) => (
            <option key={index + themeName} value={index}>
              {themeName}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

class ThemePickerPanelStyles {
  static container = css`
    padding: 15px;
    width: 100%;
    display: flex;
    font-family: 'Market Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: rgb(68, 68, 68);
  `;
  static label = css`
    width: 80px;
    margin-right: 15px;
    line-height: 30px;
  `;
  static select = css`
    color: rgb(85, 85, 85);
    width: 100%;
    border: 1px solid rgb(247, 247, 247);
    background-color: rgb(247, 247, 247);
    border-radius: 3px;
    height: 30px;
  `;
}
