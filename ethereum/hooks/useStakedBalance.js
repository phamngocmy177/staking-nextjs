import { useEffect, useMemo, useState } from "react";
import { useVersion } from "../../state/application/hooks";
import { CryptoAsset } from "../utils/classes";
import { useStakingContract } from "./useContract";
import { useActiveWeb3React } from "./web3";
import { BigNumber } from "@ethersproject/bignumber";

export const useStakedBalance = (contractAddress, token) => {
  const contract = useStakingContract(contractAddress);

  const { account, library } = useActiveWeb3React();
  const version = useVersion();

  const [userStakedBalance, setUserStakedBalance] = useState(BigNumber.from(0));
  const [totalStakedBalance, setTotalStakedBalance] = useState(
    BigNumber.from(0)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stakedBalance = await contract.stakedBalance(account);
        const totalBalance = await contract.totalStaked();

        setUserStakedBalance(BigNumber.from(stakedBalance));
        setTotalStakedBalance(BigNumber.from(totalBalance));
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

  const userStakedAsset = useMemo(
    () => new CryptoAsset(token, userStakedBalance),
    [token, userStakedBalance]
  );
  const totalStakedAsset = useMemo(
    () => new CryptoAsset(token, totalStakedBalance),
    [token, totalStakedBalance]
  );

  return { userStakedAsset, loading, totalStakedAsset };
};
