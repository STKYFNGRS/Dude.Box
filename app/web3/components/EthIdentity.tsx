'use client';

import { useEffect, useState } from 'react';
import { useEnsName, useEnsAvatar, useEnsText } from 'wagmi';

interface ProfileData {
  name: string | null;
  avatar: string | null;
  bio: string | null;
  twitter: string | null;
}

export default function EthIdentity({ address }: { address: string }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1
  });

  const { data: twitterHandle } = useEnsText({
    name: ensName || undefined,
    key: 'com.twitter'
  });

  useEffect(() => {
    if (ensName) {
      setProfileData({
        name: ensName || null,
        avatar: (ensAvatar as string) || null,
        bio: null,
        twitter: twitterHandle || null
      });
    }
  }, [ensName, ensAvatar, twitterHandle]);

  return (
    <div className="w-[400px] mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
      <div className="flex flex-col items-center space-y-4">
        {profileData?.avatar && (
          <img 
            src={profileData.avatar} 
            alt="Profile" 
            className="w-20 h-20 rounded-full"
          />
        )}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            {profileData?.name || truncateAddress(address)}
          </h2>
          {profileData?.twitter && (
            <a 
              href={`https://twitter.com/${profileData.twitter}`}
              className="text-blue-400 hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{profileData.twitter}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  function truncateAddress(addr: string) {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
}