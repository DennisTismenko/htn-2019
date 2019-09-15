import React, {ComponentType} from 'react';
import styled from 'styled-components';
import {Text} from '../text/Text.react';
import {genHTMLID} from '../genHTMLID';
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
  return <>{String(entry.value)}</>;
}

type TextInputProps<TTextInputOptionEntryValue> = {
  id?: string;
  label?: string;
  type?: 'text';
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
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
  name,
  value,
  placeholder,
  onChange = () => {},
  onOptionClick = () => {},
  options,
  OptionRenderer = TextInputDefaultOptionRenderer,
}: TextInputProps<TTextInputOptionEntryValue>) {
  const htmlID = id || genHTMLID();
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
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={({target}) => onChange(target.value)}
      />
      {options != null && options.length > 0 ? (
        <OptionsRoot>
          {options.map(entry => (
            <TextInputOptionEntry
              key={entry.key}
              onClick={() => onOptionClick(entry)}
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

const Input = styled.input`
  display: block;
  box-sizing: border-box;
  padding: 8px;
  margin: 0;
  width: 100%;
  font-size: 18px;
  border-radius: 4px;
  background-color: var(--input-background-color);
  border: 2px solid var(--input-border-color);
  box-shadow: var(--box-shadow-1);
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
`;

const TextInputOptionEntry = styled(UnstyledButton)`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid var(--input-border-color);
`;
