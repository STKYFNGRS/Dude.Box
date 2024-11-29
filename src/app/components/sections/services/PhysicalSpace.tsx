'use client';

import React from 'react';

export const PhysicalSpace: React.FC = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800 md:col-span-2 lg:col-span-1">
      <h3 className="text-xl font-semibold mb-3">Our Future Home</h3>
      <ul className="text-left space-y-3">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          10,000 sq ft hub in San Diego
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Retail space with complete product line
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Dedicated counseling spaces
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Blueprint for nationwide expansion
        </li>
      </ul>
    </div>
  );
};