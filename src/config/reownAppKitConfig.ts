import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks'; // Import chains from Reown AppKit
// import { cookieStorage, createStorage } from 'wagmi'; // No longer creating wagmiConfig directly here

// 1. Get projectID from Reown Cloud
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined');
}

// 2. Create metadata
export const metadata = {
  name: 'Dude.Box',
  description: 'Dude.Box - Collectibles and Experiences',
  url: 'https://yourwebsite.com', // TODO: Replace with your actual website URL
  icons: ['https://yourwebsite.com/android-chrome-192x192.png'], // TODO: Replace with your actual icon URL
};

export const networks = [base]; // Export networks

// Create the Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  // ssr: true, // ssr for the adapter itself might be configured differently or implicitly handled
  // storage for the adapter config might not be needed or is internal to WagmiAdapter
});

// The wagmiConfig to be used by WagmiProvider is now accessed via wagmiAdapter.wagmiConfig
// We don't need to export a separate wagmiConfig from this file if Providers.tsx imports wagmiAdapter 