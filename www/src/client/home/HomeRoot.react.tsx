import React from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import {Text} from '../core/components/text/Text.react';
import {PackageSearch} from '../package/components/PackageSearch.react';

export default function HomeRoot() {
  return (
    <>
      <Helmet>
        <title>nodome.io</title>
      </Helmet>
      <Root>
        <Row>
          <Text type="headline" level={1}>
            nodome.io
          </Text>
        </Row>
        <Row>
          <Text type="headline" level={2}>
            Finding trust in Node.js packages
          </Text>
        </Row>
        <Row />
        <Row>
          <PackageSearch />
        </Row>
      </Root>
    </>
  );
}

const Root = styled.div`
  padding: 32px 16px;
  max-width: 480px;
  margin: auto;
`;

const Row = styled.div`
  margin: 8px 0;
  min-height: 1px;
`;
