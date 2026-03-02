import { JSONRpcProvider } from 'opnet';
import { MAINNET_RPC, NETWORK } from '../config/protocols';

// Singleton: never create more than one JSONRpcProvider instance
let _provider: JSONRpcProvider | null = null;
let _providerUrl: string | null = null;

export function getProvider(): JSONRpcProvider {
  if (!_provider || _providerUrl !== MAINNET_RPC) {
    _provider = new JSONRpcProvider({ url: MAINNET_RPC, network: NETWORK });
    _providerUrl = MAINNET_RPC;
  }
  return _provider;
}
