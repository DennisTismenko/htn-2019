import React, {ReactNode} from 'react';
import styled from 'styled-components';

type TextType = 'headline' | 'body';
type TextLevel = 1 | 2;
type TextTypeAndLevel = 'headline1' | 'headline2' | 'body1' | 'body2';
type TextColor = 'black' | 'grey' | 'white' | 'green' | 'red' | 'orange';
type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';
type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p';
type TextFontStyle = 'normal' | 'italic' | 'oblique' | string;
type TextDecoration = 'underline' | 'none';

export interface TextProps {
  type?: TextType;
  level?: TextLevel;
  color?: TextColor;
  children?: ReactNode;
  transform?: TextTransform;
  inline?: boolean;
  textDecoration?: TextDecoration;
  fontStyle?: TextFontStyle;
  ellipsis?: boolean;
}

interface TextDefaultStyle {
  tag: TextTag;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  defaultColor: string;
  lineHeight: number;
  marginTop: number;
  marginBottom: number;
}

const colors: {
  [key in TextColor]: string;
} = {
  black: '#000000',
  grey: '#555555',
  white: '#ffffff',
  green: '#33aa33',
  red: '#cc3333',
  orange: '#cc8033',
};

const fonts = {
  primary: 'sans-serif',
};

const typography: {
  [key in TextTypeAndLevel]: TextDefaultStyle;
} = {
  headline1: {
    tag: 'h1',
    fontSize: 32,
    fontWeight: 600,
    fontFamily: fonts.primary,
    defaultColor: colors.black,
    lineHeight: 1,
    marginTop: -5,
    marginBottom: -5,
  },
  headline2: {
    tag: 'h2',
    fontSize: 28,
    fontWeight: 500,
    fontFamily: fonts.primary,
    defaultColor: colors.black,
    lineHeight: 1,
    marginTop: -4,
    marginBottom: -4,
  },
  body1: {
    tag: 'p',
    fontSize: 24,
    fontWeight: 400,
    fontFamily: fonts.primary,
    defaultColor: colors.black,
    lineHeight: 1,
    marginTop: -4,
    marginBottom: -4,
  },
  body2: {
    tag: 'p',
    fontSize: 16,
    fontWeight: 400,
    fontFamily: fonts.primary,
    defaultColor: colors.black,
    lineHeight: 1,
    marginTop: -3,
    marginBottom: -3,
  },
};

export const Text = ({
  type = 'body',
  level = 2,
  color,
  children,
  transform = 'none',
  inline = false,
  fontStyle = 'normal',
  textDecoration = 'none',
  ellipsis = false,
}: TextProps): React.ReactElement => {
  const typeAndLevel: TextTypeAndLevel = (type + level) as TextTypeAndLevel;
  const {
    tag,
    fontSize: defaultFontSize,
    fontWeight: defaultFontWeight,
    fontFamily: defaultFontFamily,
    defaultColor,
    lineHeight,
    marginTop,
    marginBottom,
  } = typography[typeAndLevel];
  return (
    <Root
      as={inline ? 'span' : tag}
      fontSize={defaultFontSize}
      fontWeight={defaultFontWeight}
      fontStyle={fontStyle}
      fontFamily={defaultFontFamily}
      textDecoration={textDecoration}
      color={color !== undefined ? colors[color] : defaultColor}
      lineHeight={lineHeight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      transform={transform}
      ellipsis={ellipsis}
    >
      {children}
    </Root>
  );
};

interface RootProps {
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  fontStyle: TextFontStyle;
  textDecoration: TextDecoration;
  color: string;
  lineHeight: number;
  marginTop: number;
  marginBottom: number;
  transform: TextTransform;
  ellipsis: boolean;
}

const Root = styled.div<RootProps>`
  font-size: ${({fontSize}: RootProps) => `${fontSize}px`};
  font-family: ${({fontFamily}: RootProps) => fontFamily};
  font-weight: ${({fontWeight}: RootProps) => `${fontWeight}`};
  color: ${({color}: RootProps) => color};
  line-height: ${({lineHeight}: RootProps) => `${lineHeight}`};
  margin-top: ${({marginTop}: RootProps) => `${marginTop}px`};
  margin-bottom: ${({marginBottom}: RootProps) => `${marginBottom}px`};
  text-transform: ${({transform}: RootProps) => transform};
  text-decoration: ${({textDecoration}: RootProps) => textDecoration};
  font-style: ${({fontStyle}: RootProps) => fontStyle};
  ${({ellipsis}: RootProps) =>
    ellipsis
      ? `
    text-overflow: ellipsis;
    overflow: hidden;
  `
      : ''}
`;
