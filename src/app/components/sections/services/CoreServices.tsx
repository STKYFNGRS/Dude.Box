'use client';

import React from 'react';

export const CoreServices: React.FC = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg transition duration-300 hover:bg-gray-800">
      <h3 className="text-xl font-semibold mb-3">Core Services</h3>
      <ul className="text-left space-y-3">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Free one-on-one counseling with licensed therapists
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Free use space for AA meetings and support groups
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Professional services like resume writing and interview prep
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          A community of dudes who get it
        </li>
      </ul>
    </div>
  );
};