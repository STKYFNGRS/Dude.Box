import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Dude.Box',
      headlessMode: true // Enable smart wallet mode
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
});