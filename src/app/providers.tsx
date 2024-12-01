'use client';

import React from "react";
import { OnchainKitProvider } from '@coinbase/onchainkit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider>
      {children}
    </OnchainKitProvider>
  );
}
