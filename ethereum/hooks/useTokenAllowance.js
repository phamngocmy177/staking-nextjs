import { useMemo } from "react";
import useSWR from "swr";
import { useTokenContract } from "./useContract";

export function useTokenAllowance(token, owner, spender) {
  const contract = useTokenContract(token?.address);

  const fetcher = async () => await contract.allowance(owner, spender);
  const { data: allowance } = useSWR("allowance", fetcher);

  return useMemo(
    () => (token && allowance ? allowance : undefined),
    [token, allowance]
  );
}
