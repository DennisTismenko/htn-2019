import flow from 'lodash/flow';
import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {
  TextInput,
  TextInputOptionEntry,
  TextInputOptionRendererProps,
} from '../../core/components/inputs/TextInput.react';
import {Text} from '../../core/components/text/Text.react';
import {
  PackageRepository,
  PackageSimpleModel,
} from '../repositories/PackageRepository';
import {useRouter} from '../../core/routing/useRouter';
import {urlBuilder} from '../../core/routing/urlBuilder';
import {packageRoute} from '../packageRoute';

const queryTransform = (query: string) => query.toLowerCase();

const PackageOptionRenderer = ({
  entry: {
    value: {name, version, description},
  },
}: TextInputOptionRendererProps<PackageSimpleModel>) => (
  <>
    <Row>
      <Text type="body" level={2}>
        <strong>
          {name}@{version}
        </strong>
      </Text>
    </Row>
    <Row>
      <Text type="body" level={2} ellipsis color="grey">
        <span style={{whiteSpace: 'nowrap'}}>{description}</span>
      </Text>
    </Row>
  </>
);

interface PackageSearchProps {
  defaultQuery?: string;
}

export function PackageSearch({defaultQuery = ''}: PackageSearchProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [options, setOptions] = useState<
    TextInputOptionEntry<PackageSimpleModel>[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const packageRepository = useMemo(() => new PackageRepository(), []);
  useEffect(() => {
    packageRepository
      .autoComplete(query)
      .then(setOptions)
      .catch(setError);
  }, [query, packageRepository]);

  return (
    <div>
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
        OptionRenderer={PackageOptionRenderer}
      />
      {error != null ? (
        <Text type="body" level={2} color="red">
          {error.message}
        </Text>
      ) : null}
    </div>
  );
}

const Row = styled.div`
  margin: 8px 0;
  min-height: 1px;
`;
