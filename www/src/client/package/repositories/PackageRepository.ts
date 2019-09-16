import superagent from 'superagent';
import {TextInputOptionEntry} from '../../core/components/inputs/TextInput.react';

export interface PackageSearchResponse {
  objects: {
    package: {
      name: string;
      scope: string;
      version: string;
      description: string;
      keywords: string[];
      date: string;
      links: {
        [key: string]: string;
      };
      author: {
        name: string;
      };
      publisher: {
        username: string;
        email: string;
      };
      maintainers: {
        username: string;
        email: string;
      }[];
    };
    score: {
      final: number;
      detail: {
        quality: number;
        popularity: number;
        maintenance: number;
      };
    };
    searchScore: number;
  }[];
  total: number;
  time: string;
}

export interface PackageHeuristic {
  reference: string;
  message: string;
  url: string | null;
  severity: 'high' | 'medium' | 'low' | 'none';
  category: 'security' | 'compliance' | 'risk' | 'quality';
}

type Trust = 'yes' | 'no' | 'idk';

export type PackageHeuristicsResponse =
  | {
      message: string;
    }
  | {
      message?: undefined | null;
      pkg: {
        name: string;
        version: string;
        description: string;
      };
      versions: string[];
      trust: Trust;
      latestVersion: string;
      latestVersionTrust: Trust;
      latestTrustedVersion: string;
      heuristics: PackageHeuristic[];
    };

export class PackageRepository {
  async search(
    query: string,
  ): Promise<TextInputOptionEntry<PackageSearchResponse['objects'][0]>[]> {
    const sanitizedQuery = query.trim();
    if (sanitizedQuery.length === 0) {
      return [];
    }
    const res = await superagent.get(
      `${process.env.NPM_REGISTRY_API_BASEURL}/-/v1/search?text=${encodeURIComponent(
        sanitizedQuery,
      )}`,
    );
    const body = res.body as PackageSearchResponse;
    return body.objects.map(value => ({
      key: `${value.package.name}@${value.package.version}`,
      value,
    }));
  }

  async pkgByVersion(
    pkg: string,
    version: string,
  ): Promise<PackageHeuristicsResponse> {
    const res = await superagent.get(
      `${process.env.NODOME_API_BASEURL}/api/heuristics/${encodeURIComponent(
        pkg,
      )}/${encodeURIComponent(version)}`,
    );
    return res.body;
  }
}
