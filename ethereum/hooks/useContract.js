import { useMemo } from "react";
import { getContract } from "../utils";
import { useActiveWeb3React } from "./web3";
import {
  MULTICALL_NETWORKS,
  MULTICALL_ABI,
} from "../constants/multicall/index";
import { CONTRACT_ABI } from "../artifacts";

// returns null on errors
export function useContract(
  addressOrAddressMap,
  ABI,
  withSignerIfPossible = true
) {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account,
  ]);
}

export function useMulticallContract() {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}

export function useTokenContract(address) {
  return useContract(address, CONTRACT_ABI.ERC20_ABI);
}

export function useStakingContract(address) {
  return useContract(address, CONTRACT_ABI.STAKING_ABI);
}

export function usePairContract(address) {
  return useContract(address, CONTRACT_ABI.UNIv2_ABI);
}
