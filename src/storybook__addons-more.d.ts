/*************************************************************
 Copyright 2018-2019 eBay Inc.
 Developer/Architect: Frederik Goris

 Use of this source code is governed by an MIT-style
 license that can be found in the LICENSE file or at
 https://opensource.org/licenses/MIT.
 ************************************************************/

import * as React from 'react';
export interface StorybookPanel {
  title: string;
  render: () => React.ReactNode;
}
export interface StorybookAPI {
  onStory: (callback: (kind: string, story?: string) => void) => () => void;
  // TODO add more here
}
