import { JSONRpcProvider } from 'opnet';
import { MAINNET_RPC, NETWORK } from '../config/protocols';

// Singleton: never create more than one JSONRpcProvider instance
let _provider: JSONRpcProvider | null = null;

export function getProvider(): JSONRpcProvider {
  if (!_provider) {
    _provider = new JSONRpcProvider({ url: MAINNET_RPC, network: NETWORK });
  }
  return _provider;
}
