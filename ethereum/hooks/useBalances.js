import { useEffect, useState } from "react";
import { useVersion } from "../../state/application/hooks";
import { parseByDecimals, parseToEther } from "../utils/unitsHelper";
import { useTokenContract } from "./useContract";
import { useActiveWeb3React } from "./web3";

export const useTokenBalance = (token) => {
  const contract = useTokenContract(token?.address);
  const { account, library } = useActiveWeb3React();
  const version = useVersion();
  const [tokenBalance, setTokenBalance] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await (token?.isNative
          ? library.getBalance(account)
          : contract.balanceOf(account));

        setTokenBalance(
          token?.isNative
            ? parseToEther(balance)
            : parseByDecimals(token?.decimals, balance)
        );
      } catch (e) {
        console.log("error useTokenBalance", e);
      }
    };
    if (token?.isNative ? account : contract && account) {
      fetchData();
    }
  }, [contract, account, token, library, version]);

  return tokenBalance;
};

export const useEthBalance = (token) => {
  const { account, library } = useActiveWeb3React();
  const [ethBalance, setEthBalance] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await library.getBalance(account);

        setEthBalance(parseToEther(balance));
      } catch (e) {
        console.log("error", e);
        setEthBalance(0);
      }
    };
    if (library && account) {
      fetchData();
    }
  }, [library, account, token]);

  return ethBalance;
};
