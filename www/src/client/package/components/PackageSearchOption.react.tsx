import React from 'react';
import styled from 'styled-components';
import {Text} from '../../core/components/text/Text.react';
import {TextInputOptionRendererProps} from '../../core/components/inputs/TextInput.react';
import {PackageSearchResponse} from '../repositories/PackageRepository';

export const PackageSearchOption = ({
  entry: {
    value: {
      package: {name, description},
    },
  },
}: TextInputOptionRendererProps<PackageSearchResponse['objects'][0]>) => (
  <>
    <Row>
      <Text type="body" level={2}>
        <strong>{name}</strong>
      </Text>
    </Row>
    <Row>
      <Text type="body" level={2} color="grey" ellipsis>
        <span style={{whiteSpace: 'nowrap'}}>{description}</span>
      </Text>
    </Row>
  </>
);

const Row = styled.div`
  margin: 8px 0;
  min-height: 1px;
`;
