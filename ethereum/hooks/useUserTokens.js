import { useMoralis } from "react-moralis";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";
import { TOKEN_CLASSES } from "../constants/tokens";
import { isUniswapLP, isSushiswapLP } from "../hooks/tokenClassification";
import { parseByDecimals } from "../utils/unitsHelper";
import { getUniswapLPTokenValue } from "../queries";
import { useState } from "react";
import { groupBy, propOr } from "ramda";
import { UNISWAP_ROPSTEN_URL, UNISWAP_MAINNET_URL } from "../queries/constants";

const classifyTokens = (token, chainId) => {
  //   const [lpTokens, setLpTokens] = useState([]);

  let tokenClass = TOKEN_CLASSES.TOKEN;
  if (isUniswapLP(token) || isSushiswapLP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    // const lpTokens = await getUniswapLPTokenValue(token.address, chainId);
    // console.log("lpTokens", lpTokens);
  }
  return {
    ...token,
    address: token.token_address,
    balance: parseByDecimals(token.decimals, token.balance),
    class: tokenClass,
  };
};

export const useUserLpTokens = (lpTokens, chainId) => {
  function fetcher(...urls) {
    const f = (u) => getUniswapLPTokenValue(u, chainId);

    if (urls.length > 1) {
      return Promise.all(urls.map(f));
    }
    return f(urls);
  }
  const lpAddresses = lpTokens?.map((item) => item.address);
  const address = lpAddresses;
  const { data } = useSWR(address, fetcher);
  return data?.map((item) => ({
    ...item,
    address: item.id,
  }));
};

export const useUserTokens = () => {
  const { Moralis } = useMoralis();
  const { account, chainId } = useActiveWeb3React();

  const options = { chain: `0x${chainId.toString(16)}`, address: account };

  const fetcher = async () =>
    await Moralis.Web3API.account.getTokenBalances(options);
  const address = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
  const { data } = useSWR(address, fetcher);
  // if (data) {
  const classifiedTokens =
    data?.map((item) => classifyTokens(item, chainId)) || [];

  const groupedData = groupBy(
    propOr(TOKEN_CLASSES.TOKEN, "class"),
    classifiedTokens
  );

  const defaultTokens = groupedData[TOKEN_CLASSES.TOKEN];
  const lpTokens = groupedData[TOKEN_CLASSES.LP_TOKEN];

  const lps = useUserLpTokens(lpTokens, chainId);
  return {
    [TOKEN_CLASSES.TOKEN]: defaultTokens,
    [TOKEN_CLASSES.LP_TOKEN]: lps,
  };
  // }
  // return [];
};
