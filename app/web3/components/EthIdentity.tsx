'use client';

import { useEffect, useState } from 'react';
import { useEnsName, useEnsAvatar, useEnsText } from 'wagmi';
import { ProfileCard } from 'ethereum-identity-kit';

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
      <ProfileCard 
        address={address}
        name={profileData?.name}
        avatar={profileData?.avatar}
        socials={{
          twitter: profileData?.twitter
        }}
        config={{
          theme: 'dark',
          size: 'md',
          customStyles: {
            card: {
              backgroundColor: 'transparent',
              width: '100%',
              maxWidth: '400px',
              padding: '1rem'
            },
            avatar: {
              width: '80px',
              height: '80px'
            },
            text: {
              color: '#e5e7eb',
              fontSize: '0.9rem'
            },
            heading: {
              color: '#a78bfa',
              fontSize: '1.1rem'
            }
          }
        }}
      />
    </div>
  );
}