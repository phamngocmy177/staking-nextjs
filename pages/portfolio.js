import Layout from "layouts/Layout";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useActiveWeb3React } from "../ethereum/hooks/web3";

function Portfolio() {
  const { Moralis } = useMoralis();
  const { account, chainId } = useActiveWeb3React();
  useEffect(() => {
    const fetchData = async () => {
      const options = { chain: `0x${chainId.toString(16)}`, address: account };
      const balances = await Moralis.Web3API.account.getTokenBalances(options);
    };
    account && fetchData();
  });
  return <Layout></Layout>;
}

export default Portfolio;
