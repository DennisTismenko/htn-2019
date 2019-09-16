import React, {ComponentType, useMemo, useState, KeyboardEvent} from 'react';
import styled from 'styled-components';
import uniqueId from 'lodash/uniqueId';
import {Text} from '../text/Text.react';
import {UnstyledButton} from './UnstyledButton.react';

export interface TextInputOptionEntry<TextInputTOptionEntry> {
  key: string;
  value: TextInputTOptionEntry;
}

export interface TextInputOptionRendererProps<TextInputTOptionEntryValue> {
  entry: TextInputOptionEntry<TextInputTOptionEntryValue>;
}

export function TextInputDefaultOptionRenderer<TextInputTOptionEntryValue>({
  entry,
}: TextInputOptionRendererProps<TextInputTOptionEntryValue>) {
  return (
    <Text type="body" level={2}>
      {String(entry.value)}
    </Text>
  );
}

type TextInputProps<TTextInputOptionEntryValue> = {
  id?: string;
  label?: string;
  variant?: 'regular' | 'unstyled';
  type?: 'text';
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onOptionClick?: (
    option: TextInputOptionEntry<TTextInputOptionEntryValue>,
  ) => void;
  options?: TextInputOptionEntry<TTextInputOptionEntryValue>[];
  OptionRenderer?: ComponentType<
    TextInputOptionRendererProps<TTextInputOptionEntryValue>
  >;
};

export function TextInput<TTextInputOptionEntryValue>({
  id,
  label,
  type = 'text',
  variant = 'regular',
  name,
  value,
  placeholder,
  onChange = () => {},
  onKeyPress = () => {},
  onOptionClick = () => {},
  onFocus = () => {},
  onBlur = () => {},
  options,
  OptionRenderer = TextInputDefaultOptionRenderer,
}: TextInputProps<TTextInputOptionEntryValue>) {
  const htmlID = useMemo(() => id || uniqueId(), [id]);
  const [isFocused, setIsFocused] = useState(false);
  const [timeoutID, setTimeoutID] = useState<number>(-1);
  return (
    <Root>
      {label != null ? (
        <Label htmlFor={htmlID}>
          <Text type="body" level={2} inline>
            {label}
          </Text>
        </Label>
      ) : null}
      <Input
        id={htmlID}
        variant={variant}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={({target}) => onChange(target.value)}
        onFocus={() => {
          clearTimeout(timeoutID);
          setIsFocused(true);
          onFocus();
        }}
        onBlur={() => {
          setTimeoutID(setTimeout(() => setIsFocused(false), 100));
          onBlur();
        }}
        onKeyPress={onKeyPress}
      />
      {options != null && options.length > 0 && isFocused ? (
        <OptionsRoot>
          {options.map(entry => (
            <TextInputOptionEntry
              key={entry.key}
              onClick={() => {
                onOptionClick(entry);
                setIsFocused(false);
              }}
              onFocus={() => {
                clearTimeout(timeoutID);
                setIsFocused(true);
              }}
              onBlur={() => {
                setTimeoutID(setTimeout(() => setIsFocused(false), 100));
              }}
            >
              <OptionRenderer entry={entry} />
            </TextInputOptionEntry>
          ))}
        </OptionsRoot>
      ) : null}
    </Root>
  );
}

const Root = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  width: 100%;
  margin: 0;
`;

interface InputProps {
  variant: 'regular' | 'unstyled';
}

const Input = styled.input<InputProps>`
  display: block;
  box-sizing: border-box;
  font-size: inherit;
  font-weight: inherit;
  width: 100%;
  margin: 0;
  ${({variant}) =>
    variant === 'regular'
      ? `
    padding: 8px;
    background-color: var(--input-background-color);
    border: 2px solid var(--input-border-color);
    border-radius: 4px;
    box-shadow: var(--box-shadow-1);
  `
      : ''}
  ${({variant}) =>
    variant === 'unstyled'
      ? `
    padding: 0;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
  `
      : ''}
`;

const OptionsRoot = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  bottom: 0;
  transform: translateY(100%);
  box-sizing: border-box;
  background-color: white;
  border: 2px solid var(--input-border-color);
  border-bottom: none;
  border-radius: 4px;
  box-shadow: var(--box-shadow-2);
  max-height: 520px;
  overflow-y: scroll;
  z-index: 1;
`;

const TextInputOptionEntry = styled(UnstyledButton)`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid var(--input-border-color);
`;
