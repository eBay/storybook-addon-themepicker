import * as React from 'react';
import {css} from 'emotion';
import {Theme} from './themes';
import {withTheme} from 'emotion-theming';

export type NameCardProps = {
  name: string;
  pictureUrl?: string;
};

type ThemedNameCardProps = NameCardProps & {
  theme: Theme;
};

const NameCard = (props: ThemedNameCardProps) => (
  <div className={NameCardStyles.container(props.theme)}>
    {props.pictureUrl && <img className={NameCardStyles.picture(props.theme)} src={props.pictureUrl} />}
    <div className={NameCardStyles.name(props.theme)}>{props.name}</div>
  </div>
);

const NameCardStyles = {
  container: (theme: Theme) => css`
    width: 200px;
    border: 1px solid ${theme.borderColor};
    border-radius: 5px;
    padding: 15px;
    background-color: ${theme.backgroundColor};
  `,
  picture: (theme: Theme) => css`
    display: block;
    border: 1px solid ${theme.borderColor};
    width: 100%;
  `,
  name: (theme: Theme) => css`
    margin-top: 15px;
    font-family: sans-serif;
    color: ${theme.textColor};
    text-align: center;
  `
};

export default withTheme<NameCardProps, Theme>(NameCard);
