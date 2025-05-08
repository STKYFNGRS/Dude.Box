import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks'; // Import chains from Reown AppKit
// import { cookieStorage, createStorage } from 'wagmi'; // No longer creating wagmiConfig directly here

// 1. Get projectID from Reown Cloud
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined');
}

// Use the correct domain as specified by the client
const IS_PROD = process.env.NODE_ENV === 'production';
const APP_URL = IS_PROD ? 'https://www.dude.box' : 'http://localhost:3000';

// 2. Create metadata
export const metadata = {
  name: 'Dude.Box',
  description: 'Dude.Box - Collectibles and Experiences',
  url: APP_URL,
  icons: [`${APP_URL}/android-chrome-192x192.png`],
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