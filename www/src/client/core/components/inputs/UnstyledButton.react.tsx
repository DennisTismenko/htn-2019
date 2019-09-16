import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

export interface UnstyledButtonProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  ellipsis?: boolean;
  link?: {to: string};
  onBlur?: () => void;
  onClick?: (el: React.MouseEvent<HTMLElement>) => void;
  onFocus?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const UnstyledButton: React.FunctionComponent<UnstyledButtonProps> = ({
  children,
  className,
  disabled,
  ellipsis,
  link: linkProps = {to: null},
  onBlur,
  onClick,
  onFocus,
  type = 'button',
}): React.ReactElement => {
  const tag = linkProps.to != null ? Link : undefined;
  return (
    <Root
      {...linkProps}
      as={tag}
      className={className}
      disabled={disabled}
      ellipsis={ellipsis}
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      type={type}
    >
      {children}
    </Root>
  );
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
