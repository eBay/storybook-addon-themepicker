/*************************************************************
 Copyright 2018-2019 eBay Inc.
 Developer/Architect: Frederik Goris

 Use of this source code is governed by an MIT-style
 license that can be found in the LICENSE file or at
 https://opensource.org/licenses/MIT.
 ************************************************************/

import * as React from 'react';
import addonAPI from '@storybook/addons';
import {MESSAGE_SELECT_THEME, MESSAGE_SET_THEME_LIST} from './shared';
import {ThemeProvider} from 'emotion-theming';

export type ThemeDescriptor<T extends object> = {
  name: string;
  theme: T;
};

export type WithThemesProps<T extends object> = {
  themes: Array<ThemeDescriptor<T> | T> | ThemeDescriptor<T> | T;
  children: React.ReactNode;
};

type WithThemeState = {
  currentThemeIndex: number;
};

function isThemeDescriptor<T extends object>(theme: ThemeDescriptor<T> | T): theme is ThemeDescriptor<T> {
  return (theme as ThemeDescriptor<T>).name !== undefined && (theme as ThemeDescriptor<T>).theme !== undefined;
}

export class WithThemes<T extends object> extends React.Component<WithThemesProps<T>, WithThemeState> {
  constructor(props: WithThemesProps<T>) {
    super(props);
    this.state = {
      currentThemeIndex: 0
    };
    const themes = this.getThemes();
    const channel = addonAPI.getChannel();
    if (themes) {
      channel.emit(MESSAGE_SET_THEME_LIST, themes.map(td => td.name));
      channel.on(MESSAGE_SELECT_THEME, this.selectTheme);
    }
  }

  getThemes(): Array<ThemeDescriptor<T>> | void {
    const themes = this.props.themes;
    if (!themes) {
      return undefined;
    }
    const themesList: Array<ThemeDescriptor<T> | T> = themes instanceof Array ? themes : [themes];
    if (themesList.length === 0) {
      return undefined;
    }
    return themesList.map((theme: ThemeDescriptor<T> | T, index: number): ThemeDescriptor<T> => {
      if (isThemeDescriptor(theme)) {
        // already a ThemeDescriptor
        return theme;
      } else {
        return {
          name: themesList.length === 1 ? 'Default' : `Theme ${index + 1}`,
          theme
        };
      }
    });
  }

  selectTheme = (newIndex: number) => this.setState({currentThemeIndex: newIndex});

  render() {
    const themes = this.getThemes();
    if (!themes) {
      return <div>Missing property for WithThemes: themes</div>;
    }
    const currentTheme = themes[this.state.currentThemeIndex].theme;
    return <ThemeProvider theme={currentTheme}>{this.props.children}</ThemeProvider>;
  }
}
