'use client';

import { Tab } from '@headlessui/react';
import { useState } from 'react';
import EnhanceTab from './EnhanceTab';
import MintTab from './MintTab';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TabInterface() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-full max-w-3xl px-2 sm:px-0">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-indigo-700 text-white shadow'
                  : 'text-blue-100 hover:bg-indigo-700/[0.12] hover:text-white'
              )
            }
          >
            Mint
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-indigo-700 text-white shadow'
                  : 'text-blue-100 hover:bg-indigo-700/[0.12] hover:text-white'
              )
            }
          >
            Enhance
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-indigo-700 text-white shadow'
                  : 'text-blue-100 hover:bg-indigo-700/[0.12] hover:text-white'
              )
            }
          >
            Leaderboard
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-gray-900/20 p-3',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <MintTab />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-gray-900/20 p-3',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <EnhanceTab />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-gray-900/20 p-3',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <div className="flex flex-col items-center justify-center p-8">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Coming Soon</h3>
              <p className="text-gray-300 text-center">
                The Leaderboard Interface is coming soon. Stay tuned for updates!
              </p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}