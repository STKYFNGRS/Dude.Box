'use client';

import React from 'react';
import { CoreServices } from './services/CoreServices';
import { CommunityServices } from './services/CommunityServices';
import { PhysicalSpace } from './services/PhysicalSpace';

export const Vision: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">The Vision</h2>
      <div className="text-lg text-gray-200">
        <p className="mb-4">
          Imagine walking into a place where you don&apos;t have to have it all figured out.
          Where getting help isn&apos;t a sign of weakness, but of strength. That&apos;s what we&apos;re building:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <CoreServices />
          <CommunityServices />
          <PhysicalSpace />
        </div>
      </div>
    </div>
  );
};