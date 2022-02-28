import { useEffect, useState, useMemo } from "react";
import { useTokenContract } from "./useContract";
import { useVersion } from "../../state/application/hooks";

export function useTokenAllowance(token, owner, spender) {
  const [allowance, setAllowance] = useState();
  const contract = useTokenContract(token?.address);
  const version = useVersion();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await contract.allowance(owner, spender);
        setAllowance(result);
      } catch (e) {
        setAllowance(null);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token, owner, spender, contract, version]);

  return useMemo(
    () => (token && allowance ? allowance : undefined),
    [token, allowance]
  );
}
