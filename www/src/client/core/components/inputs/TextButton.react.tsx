import React from 'react';
import styled from 'styled-components';
import {TextProps, Text} from '../text/Text.react';
import {UnstyledButtonProps, UnstyledButton} from './UnstyledButton.react';

export type TextButtonProps = UnstyledButtonProps & {
  text?: TextProps;
};

export const TextButton: React.FunctionComponent<TextButtonProps> = ({
  children,
  text: textProps = {
    type: 'body',
    level: 1,
    inline: true,
  },
  ...buttonProps
}): React.ReactElement => {
  return (
    <Root {...buttonProps}>
      <Text {...textProps}>{children}</Text>
    </Root>
  );
};

const Root = styled(UnstyledButton)`
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;
