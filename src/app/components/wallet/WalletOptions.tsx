'use client';

import { Mail, Wallet } from 'lucide-react';
import { useWeb3 } from '@/app/context/Web3Context';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WalletOptionsProps {
  onConnect?: () => void;
}

export const WalletOptions: React.FC<WalletOptionsProps> = ({ onConnect }) => {
  const { connect, error } = useWeb3();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Connected Successfully",
        description: "Your smart wallet has been created and connected.",
      });
      onConnect?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to create smart wallet. Please try again.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      {/* Smart Wallet Option */}
      <Card 
        className="relative group transition-all cursor-pointer bg-gray-800/50 border-gray-700 hover:border-blue-500"
        onClick={handleConnect}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-400" />
            <div>
              <CardTitle className="text-xl text-white">Smart Wallet</CardTitle>
              <CardDescription className="text-gray-400">Easy Web3 Onboarding</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• No Extension Required</li>
            <li>• Perfect for New Users</li>
            <li>• One-Click Setup</li>
          </ul>
          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Regular Wallet Option (disabled for now) */}
      <Card className="opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-orange-400" />
            <div>
              <CardTitle className="text-xl text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-400">Coming Soon</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Use Existing Wallet</li>
            <li>• Connect with Extension</li>
            <li>• Full Web3 Features</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};