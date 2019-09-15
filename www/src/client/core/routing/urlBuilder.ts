import {generatePath, RouteProps} from 'react-router';
import {routePathToString} from './routePathToString';

export function urlBuilder(
  pattern: RouteProps['path'],
  parameters?:
    | {
        [paramName: string]: string | number | boolean | undefined;
      }
    | undefined,
): string {
  return generatePath(routePathToString(pattern), parameters);
}
