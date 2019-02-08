/*************************************************************
 Copyright 2018-2019 eBay Inc.
 Developer/Architect: Frederik Goris

 Use of this source code is governed by an MIT-style
 license that can be found in the LICENSE file or at
 https://opensource.org/licenses/MIT.
 ************************************************************/

import * as React from 'react';
import addonAPI from '@storybook/addons';
import {StorybookAPI} from './storybook__addons-more';
import {ThemePickerPanel} from './themepicker-panel';

addonAPI.register('ebay/themepicker', (storybookAPI: StorybookAPI) => {
  addonAPI.addPanel('ebay/themepicker/panel', {
    title: 'Theme',
    render: () => <ThemePickerPanel channel={addonAPI.getChannel()} api={storybookAPI} />
  });
});
