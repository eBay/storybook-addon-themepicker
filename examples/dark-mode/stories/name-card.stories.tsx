import * as React from 'react';
import {storiesOf} from '@storybook/react';
import NameCard from '../src/name-card';
import {ThemeDescriptor, WithThemes} from '@ebay/storybook-addon-themepicker';
import {defaultTheme, darkTheme, Theme} from '../src/themes';

const themeChoices: Array<ThemeDescriptor<Theme>> = [
  {
    name: 'Normal',
    theme: defaultTheme
  },
  {
    name: 'Dark Mode',
    theme: darkTheme
  }
];

storiesOf('NameCard', module).add('with picture', () => (
  <WithThemes themes={themeChoices}>
    <NameCard
      name="Frederik Goris"
      pictureUrl="https://en.gravatar.com/userimage/27876738/391990c35c2973126ab55c0d849d3d7d.jpg?size=200"
    />
  </WithThemes>
));
