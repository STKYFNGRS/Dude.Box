'use client';

import React from 'react';

export const Mission: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg mb-12 transition duration-300 hover:bg-gray-800 border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-lg text-gray-200">
        To create products that guys actually want while building spaces where they can
        be themselves. Every purchase helps us get closer to opening physical locations offering
        free counseling, group support, and a place to just breathe.
      </p>
    </div>
  );
};