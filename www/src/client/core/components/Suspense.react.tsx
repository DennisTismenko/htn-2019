import React, {Suspense as ReactSuspense, SuspenseProps} from 'react';
import {isBrowser} from '../isBrowser';

export function Suspense({fallback, children}: SuspenseProps) {
  return !isBrowser ? (
    <>{children}</>
  ) : (
    <ReactSuspense fallback={fallback}>{children}</ReactSuspense>
  );
}
