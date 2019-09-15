import React from 'react';
import Helmet from 'react-helmet';
import {useRouter} from '../core/routing/useRouter';
import {PackageRootParams} from './packageRoute';

export default function PackageRoot() {
  const router = useRouter<PackageRootParams>();
  return (
    <>
      <Helmet>
        <title>
          {router.match.params.pkg}@{router.match.params.version} - nodome.io
        </title>
      </Helmet>
      <div />
    </>
  );
}
