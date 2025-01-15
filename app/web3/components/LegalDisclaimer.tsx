'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BookOpen } from 'lucide-react';

const LegalDisclaimer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button to open modal */}
      <div className="text-center py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>NFT Ownership Rights</span>
        </button>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-gray-900 p-6 text-left align-middle shadow-xl transition-all border border-blue-900/30">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-blue-300 mb-4"
                  >
                    NFT Ownership Rights & Benefits
                  </Dialog.Title>
                  
                  <div className="space-y-4 text-sm text-gray-400">
                    <p>
                      As a Dude Box NFT holder, you own both the NFT and full rights to its artwork. You are free to use, 
                      print, display, modify, and create derivative works from your NFT artwork for both personal and 
                      commercial purposes. Express yourself and show your membership pride however you choose.
                    </p>

                    <p>
                      While holding the NFT, you are entitled to all associated membership benefits including Elite Gym 
                      Access, Advisory Board participation, and other perks as outlined. These benefits are tied to active 
                      ownership of the NFT and transfer with the NFT if sold.
                    </p>

                    <p>
                      The purchase of a Dude Box NFT does not constitute ownership, equity, or shares in Dude Box LLC 
                      itself. However, NFT holders are valued members of our community and have a direct voice in shaping 
                      our future through the Advisory Board program.
                    </p>

                    <p>
                      Gym access and other physical benefits are subject to standard facility rules, safety requirements, 
                      and capacity limitations. While we strive to ensure consistent service quality, availability may vary 
                      and certain restrictions apply.
                    </p>

                    <p>
                      The NFT market can be volatile and we make no guarantees about future NFT value. However, our focus 
                      is on providing real, lasting utility through our benefits program and community engagement.
                    </p>

                    <p className="text-xs text-gray-500 mt-6">
                      Full terms available at dudebox.com/terms. These terms are subject to updates, with any changes 
                      being put to community vote through our Advisory Board.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-blue-900/50 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Got it, thanks
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LegalDisclaimer;