import { groupBy, propOr } from "ramda";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";
import { TOKEN_CLASSES } from "../constants/tokens";
import { isSushiswapLP, isUniswapLP } from "../hooks/tokenClassification";
import { getUniswapLPTokenValue } from "../queries";
import { parseByDecimals } from "../utils/unitsHelper";

const classifyTokens = (token) => {
  let tokenClass = TOKEN_CLASSES.TOKEN;
  let platform;
  if (isUniswapLP(token) || isSushiswapLP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    platform = isUniswapLP(token) ? "Uniswap v2" : null;
  }
  return {
    ...token,
    address: token.token_address,
    balance: parseByDecimals(token.decimals, token.balance),
    class: tokenClass,
    platform: platform,
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
  return data?.map((item, index) => ({
    ...item,
    address: item.id,
    ...lpTokens[index],
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
  const classifiedTokens = data?.map((item) => classifyTokens(item)) || [];

  const groupedData = groupBy(
    propOr(TOKEN_CLASSES.TOKEN, "class"),
    classifiedTokens
  );
  console.log("classifiedTokens", classifiedTokens);
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
