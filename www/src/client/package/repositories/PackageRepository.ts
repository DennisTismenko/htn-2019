import superagent from 'superagent';
import {TextInputOptionEntry} from '../../core/components/inputs/TextInput.react';

export interface PackageSimpleModel {
  name: string;
  version: string;
  description: string;
}

export interface PackageHeuristic {
  reference: string;
  message: string;
  url: string | null;
  severity: 'high' | 'medium' | 'low' | 'none';
  category: 'security' | 'compliance' | 'risk' | 'quality';
}

type Trust = 'yes' | 'no' | 'idk';

export interface PackageAnalysisModel {
  pkg: {
    name: string;
    version: string;
    description: string;
  };
  trust: Trust;
  latestVersion: string;
  latestVersionTrust: Trust;
  latestTrustedVersion: string;
  heuristics: PackageHeuristic[];
}

export class PackageRepository {
  async autoComplete(
    query: string,
  ): Promise<TextInputOptionEntry<PackageSimpleModel>[]> {
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
        package: PackageSimpleModel;
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

  async pkgByVersion(
    pkg: string,
    version: string,
  ): Promise<PackageAnalysisModel> {
    const res = await superagent.get(
      `http://localhost:3000/api/heuristics/${encodeURIComponent(
        pkg,
      )}/${encodeURIComponent(version)}`,
    );
    return res.body;
  }
}
