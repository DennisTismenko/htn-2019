import superagent from 'superagent';
import {TextInputOptionEntry} from '../../core/components/inputs/TextInput.react';

export interface HomePackageModel {
  name: string;
  version: string;
  description: string;
}

export class HomePackageRepository {
  async autoComplete(
    query: string,
  ): Promise<TextInputOptionEntry<HomePackageModel>[]> {
    const sanitizedQuery = query.trim();
    if (sanitizedQuery.length === 0) {
      return [];
    }
    const res = await superagent.get(
      `https://registry.npmjs.com/-/v1/search?text=${encodeURIComponent(
        sanitizedQuery,
      )}`,
    );
    return res.body.objects.map(
      ({
        package: {name, version, description},
      }: {
        package: HomePackageModel;
      }) => ({
        key: `${name}@${version}`,
        value: {
          name,
          version,
          description,
        },
      }),
    );
  }
}
