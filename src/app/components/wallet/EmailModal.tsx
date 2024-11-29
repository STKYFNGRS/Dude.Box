'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error?: string;
}

export const EmailModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error
}: EmailModalProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Create Smart Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your email to create a smart wallet and get started with Web3
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Wallet...' : 'Create Wallet'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
