import {useContext} from 'react';
import {
  __RouterContext as RouterContext,
  RouteComponentProps,
} from 'react-router';

export function useRouter<RouteProps>(): RouteComponentProps<RouteProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useContext(RouterContext) as any;
}
