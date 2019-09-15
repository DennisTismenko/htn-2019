import React, {useState, useEffect} from 'react';
import flow from 'lodash/flow';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import {
  TextInput,
  TextInputOptionEntry,
  TextInputOptionRendererProps,
} from '../core/components/inputs/TextInput.react';
import {Text} from '../core/components/text/Text.react';
import {
  HomePackageRepository,
  HomePackageModel,
} from './repositories/HomePackageRepository';
import {useRouter} from '../core/routing/useRouter';
import {urlBuilder} from '../core/routing/urlBuilder';
import {packageRoute} from '../package/packageRoute';

const queryTransform = (query: string) => query.toLowerCase();

const homePackageRepository = new HomePackageRepository();

const HomePackageOptionRenderer = ({
  entry: {
    value: {name, version, description},
  },
}: TextInputOptionRendererProps<HomePackageModel>) => (
  <>
    <Row>
      <Text type="body" level={2}>
        <strong>
          {name}@{version}
        </strong>
      </Text>
    </Row>
    <Row>
      <Text type="body" level={2} ellipsis>
        <span style={{whiteSpace: 'nowrap'}}>{description}</span>
      </Text>
    </Row>
  </>
);

export default function HomeRoot() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<
    TextInputOptionEntry<HomePackageModel>[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  useEffect(() => {
    homePackageRepository
      .autoComplete(query)
      .then(setOptions)
      .catch(setError);
  }, [query]);
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
          <TextInput
            onChange={flow([queryTransform, setQuery])}
            value={query}
            placeholder="Search"
            options={options}
            onOptionClick={({key, value: {name, version}}) => {
              setQuery(key);
              router.history.push(
                urlBuilder(packageRoute.path, {
                  pkg: name,
                  version,
                }),
              );
            }}
            OptionRenderer={HomePackageOptionRenderer}
          />
        </Row>
        <Row>
          {error != null ? (
            <Text type="body" level={2} color="red">
              {error.message}
            </Text>
          ) : null}
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
