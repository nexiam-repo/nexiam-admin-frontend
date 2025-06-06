'use client';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

import { CounterStoreProvider } from './CounterStoreProvider';
import ProgressBarProvider from './ProgressBarProvider';
import { ReactQueryProvider } from './ReactQueryProvider';

// import ThemeProvider, I18nProvider, etc.

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ProgressBarProvider>
        <ReactQueryProvider>
          <CounterStoreProvider>{children}</CounterStoreProvider>
        </ReactQueryProvider>
      </ProgressBarProvider>
    </SessionProvider>
  );
}
