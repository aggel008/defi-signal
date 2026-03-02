import { getContract, IOP20Contract, OP_20_ABI } from 'opnet';
import { NETWORK } from '../config/protocols';
import { getProvider } from './provider';

// Cache by address string — never use Map<Address, T> (reference equality fails)
const cache = new Map<string, IOP20Contract>();

export function getTokenContract(address: string): IOP20Contract {
  if (!cache.has(address)) {
    const provider = getProvider();
    const contract = getContract<IOP20Contract>(address, OP_20_ABI, provider, NETWORK);
    cache.set(address, contract);
  }
  return cache.get(address)!;
}

export function clearContractCache(): void {
  cache.clear();
}
