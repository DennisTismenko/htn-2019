import {useContext} from 'react';
import {
  __RouterContext as RouterContext,
  RouteComponentProps,
} from 'react-router';

export function useRouter<RouteProps>(): RouteComponentProps<RouteProps> {
  return useContext(RouterContext) as any;
}
