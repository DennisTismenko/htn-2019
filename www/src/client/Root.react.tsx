import React from 'react';
import {GlobalStyle} from './core/providers/GlobalStyle';
import {Routes} from './core/routing/Routes.react';
import LoadingRoot from './core/routing/LoadingRoot.react';
import {ErrorBoundary} from './core/components/ErrorBoundary.react';
import {Suspense} from './core/components/Suspense.react';

export function Root() {
  return (
    <ErrorBoundary>
      <GlobalStyle />
      <Suspense fallback={LoadingRoot}>
        <Routes />
      </Suspense>
    </ErrorBoundary>
  );
}
