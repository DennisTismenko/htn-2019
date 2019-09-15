import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

export interface UnstyledButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
  link?: {
    to: string;
  };
  onClick?: (el: React.MouseEvent<HTMLElement>) => void;
  ellipsis?: boolean;
}

export const UnstyledButton: React.FunctionComponent<UnstyledButtonProps> = ({
  type = 'button',
  link: linkProps = {
    to: null,
  },
  ...props
}): React.ReactElement => {
  const tag = linkProps.to != null ? Link : undefined;
  return <Root as={tag} type={type} {...props} {...linkProps} />;
};

interface RootProps {
  ellipsis?: boolean;
}

const Root = styled.button<RootProps>`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  cursor: pointer;
  ${({ellipsis}: RootProps) =>
    ellipsis
      ? `
    text-overflow: ellipsis;
    overflow: hidden;
  `
      : ''}

  background: transparent;

  color: inherit;
  font: inherit;

  line-height: normal;
  text-decoration: none;

  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  -webkit-appearance: none;
`;
