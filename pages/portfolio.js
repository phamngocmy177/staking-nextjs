import Layout from "layouts/Layout";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useActiveWeb3React } from "../ethereum/hooks/web3";
import { useUserTokens } from "../ethereum/hooks/useUserTokens";

function Portfolio() {
  const { Moralis } = useMoralis();
  const { account, chainId } = useActiveWeb3React();
  const userTokens = useUserTokens();

  return <Layout></Layout>;
}

export default Portfolio;
