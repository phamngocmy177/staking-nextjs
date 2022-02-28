import { useEffect, useMemo, useState } from "react";
import { useVersion } from "../../state/application/hooks";
import { CryptoAsset } from "../utils/classes";
import { useStakingContract } from "./useContract";
import { useActiveWeb3React } from "./web3";
import { BigNumber } from "@ethersproject/bignumber";

export const useUserStakedBalance = (contractAddress, token) => {
  const contract = useStakingContract(contractAddress);
  const { account } = useActiveWeb3React();

  const { loading, stakedAsset: userStakedAsset } = useStakedBalance({
    contract,
    token,
    functionName: "stakedBalance",
    functionParams: account,
    fetchCondition: !!account,
  });

  return { userStakedAsset, loading };
};

export const useTotalStakedBalance = (contractAddress, token) => {
  const contract = useStakingContract(contractAddress);
  const { loading, stakedAsset: totalStakedAsset } = useStakedBalance({
    contract,
    token,
    functionName: "totalStaked",
  });

  return { loading, totalStakedAsset };
};

export const useAPR = (contractAddress) => {
  const contract = useStakingContract(contractAddress);
  const { library } = useActiveWeb3React();
  const version = useVersion();
  const [apr, setAPR] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rewardRate = await contract.rewardRate();
        const totalSupply = await contract.totalStaked();
        const apr = (rewardRate * 604800 * 52) / totalSupply;

        setAPR(apr);
        setLoading(false);
      } catch (e) {
        console.log("error useStakedBalance", e);
        // setLoading(false);
      }
    };
    if (contract) {
      fetchData();
    }
  }, [contract, library, version]);
  return { loading, apr };
};

export const useEarnedBalance = (contractAddress, token) => {
  const contract = useStakingContract(contractAddress);
  const { account } = useActiveWeb3React();

  const { loading, stakedAsset: earnedAsset } = useStakedBalance({
    contract,
    token,
    functionName: "earned",
    functionParams: account,
    fetchCondition: !!account,
  });
  return { loading, earnedAsset };
};

const useStakedBalance = ({
  contract,
  token,
  functionName,
  fetchCondition = true,
  functionParams,
}) => {
  const { library } = useActiveWeb3React();
  const version = useVersion();

  const [stakedBalance, setStakedBalance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const balance = await contract[functionName](
          functionParams?.length ? functionParams : null
        );

        setStakedBalance(BigNumber.from(balance));
        setLoading(false);
      } catch (e) {
        console.log("error useStakedBalance", e);
        setLoading(false);
      }
    };
    if (contract && fetchCondition) {
      fetchData();
    }
  }, [
    contract,
    library,
    version,
    token.decimals,
    fetchCondition,
    functionName,
    functionParams,
  ]);

  const stakedAsset = useMemo(
    () => new CryptoAsset(token, stakedBalance),
    [token, stakedBalance]
  );

  return { loading, stakedAsset };
};
