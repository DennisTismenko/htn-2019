import flow from 'lodash/flow';
import React, {useState, useEffect, useMemo} from 'react';
import {
  TextInput,
  TextInputOptionEntry,
} from '../../core/components/inputs/TextInput.react';
import {Text} from '../../core/components/text/Text.react';
import {
  PackageRepository,
  PackageSearchResponse,
} from '../repositories/PackageRepository';
import {useRouter} from '../../core/routing/useRouter';
import {urlBuilder} from '../../core/routing/urlBuilder';
import {packageRoute} from '../packageRoute';
import {PackageSearchOption} from './PackageSearchOption.react';

const queryTransform = (query: string) => query.toLowerCase();

interface PackageSearchProps {
  defaultQuery?: string;
}

export function PackageSearch({defaultQuery = ''}: PackageSearchProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [options, setOptions] = useState<
    TextInputOptionEntry<PackageSearchResponse['objects'][0]>[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const packageSearch = useMemo(() => new PackageRepository().search, []);
  useEffect(() => {
    packageSearch(query)
      .then(setOptions)
      .catch(setError);
  }, [query, packageSearch]);
  const router = useRouter();

  return (
    <div>
      <Text type="body" level={1}>
        <TextInput
          onChange={flow([queryTransform, setQuery])}
          value={query}
          placeholder="Search"
          options={options}
          onOptionClick={({
            value: {
              package: {name, version},
            },
          }) => {
            setQuery(name);
            router.history.push(
              urlBuilder(packageRoute.path, {
                pkg: name,
                version,
              }),
            );
          }}
          OptionRenderer={PackageSearchOption}
        />
      </Text>
      {error != null ? (
        <Text type="body" level={2} color="red">
          {error.message}
        </Text>
      ) : null}
    </div>
  );
}
