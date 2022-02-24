import { useEffect, useState } from "react";
import { useVersion } from "../../state/application/hooks";
import { parseByDecimals } from "../utils/unitsHelper";
import { useStakingContract } from "./useContract";
import { useActiveWeb3React } from "./web3";

export const useStakedBalance = (contractAddress, token) => {
  const contract = useStakingContract(contractAddress);

  const { account, library } = useActiveWeb3React();
  const version = useVersion();

  const [stakedBalance, setStakedBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stakedBalance = await contract.stakedBalance(account);
        setStakedBalance(parseByDecimals(token?.decimals, stakedBalance));
        setLoading(false);
      } catch (e) {
        console.log("error useTokenBalance", e);
        setLoading(false);
      }
    };
    if (contract && account) {
      fetchData();
    }
  }, [contract, account, library, version, token?.decimals]);

  return { stakedBalance, loading };
};
