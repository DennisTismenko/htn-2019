import {RouteProps} from 'react-router';

export function routePathToString(path: RouteProps['path']) {
  return (Array.isArray(path) ? path.join('/') : path) || '__NotFound__';
}
