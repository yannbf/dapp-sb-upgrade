import { PresetTypedChainId, SubstrateChainId } from '@webb-tools/dapp-types';
import { ChainType } from '@webb-tools/sdk-core/typed-chain-id';
import { ChainConfig } from '../chain-config.interface';

// All substrate chains temporary use in `development` environment now
export const chainsConfig: Record<number, ChainConfig> = {
  [PresetTypedChainId.TangleMainnetNative]: {
    chainType: ChainType.Substrate,
    group: 'tangle',
    tag: 'live',
    id: SubstrateChainId.TangleMainnetNative,
    name: 'Tangle Mainnet Native',
    nativeCurrency: {
      name: 'Tangle Mainnet Token',
      symbol: 'TNT',
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: 'Tangle Explorer',
        url: 'https://tangle.statescan.io/',
      },
    },
    rpcUrls: {
      default: {
        http: [],
        webSocket: ['wss://rpc.tangle.tools'],
      },
      public: {
        http: [],
        webSocket: ['wss://rpc.tangle.tools'],
      },
    },
  },

  [PresetTypedChainId.TangleTestnetNative]: {
    chainType: ChainType.Substrate,
    group: 'tangle',
    tag: process.env['USING_LOCAL_TANGLE'] ? 'dev' : 'test',
    id: SubstrateChainId.TangleTestnetNative,
    name: 'Tangle Testnet Native',
    nativeCurrency: {
      name: 'Tangle',
      symbol: 'tTNT',
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: 'Tangle Explorer',
        url: process.env['USING_LOCAL_TANGLE']
          ? 'https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer'
          : 'https://tangle-testnet.statescan.io/',
      },
    },
    rpcUrls: {
      default: {
        http: [],
        webSocket: process.env['USING_LOCAL_TANGLE']
          ? ['ws://127.0.0.1:9944']
          : ['wss://testnet-rpc.tangle.tools'],
      },
      public: {
        http: [],
        webSocket: process.env['USING_LOCAL_TANGLE']
          ? ['ws://127.0.0.1:9944']
          : ['wss://testnet-rpc.tangle.tools'],
      },
    },
    env: ['development'],
  },

  [PresetTypedChainId.Kusama]: {
    chainType: ChainType.KusamaRelayChain,
    id: SubstrateChainId.Kusama,
    name: 'Kusama',
    group: 'kusama',
    tag: 'live',
    nativeCurrency: {
      name: 'Kusama',
      symbol: 'KSM',
      decimals: 12,
    },
    blockExplorers: {
      default: {
        name: 'Kusama Explorer',
        url: 'https://kusama.statescan.io/',
      },
    },
    rpcUrls: {
      default: {
        http: [],
        webSocket: ['wss://kusama-rpc.polkadot.io'],
      },
      public: {
        http: [],
        webSocket: ['wss://kusama-rpc.polkadot.io'],
      },
    },
    env: ['development'],
  },

  [PresetTypedChainId.Polkadot]: {
    chainType: ChainType.PolkadotRelayChain,
    id: SubstrateChainId.Polkadot,
    name: 'Polkadot',
    group: 'polkadot',
    tag: 'live',
    nativeCurrency: {
      name: 'Polkadot',
      symbol: 'DOT',
      decimals: 10,
    },
    blockExplorers: {
      default: {
        name: 'Polkadot Explorer',
        url: 'https://polkadot.statescan.io/',
      },
    },
    rpcUrls: {
      default: {
        http: [],
        webSocket: ['wss://rpc.polkadot.io'],
      },
      public: {
        http: [],
        webSocket: ['wss://rpc.polkadot.io'],
      },
    },
    env: ['development'],
  },
};

