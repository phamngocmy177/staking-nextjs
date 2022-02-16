import { groupBy, propOr, path } from "ramda";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";
import { TOKEN_CLASSES, TOKEN_LOGO_SOURCE } from "../constants/tokens";
import { isSushiswapLP, isUniswapLP } from "../hooks/tokenClassification";
import { getUniswapLPTokenValue, getTokenInfo } from "../queries";
import { parseByDecimals } from "../utils/unitsHelper";
import { ethplorerClient } from "../queries/clients";
import axios from "axios";

const classifyTokens = (token) => {
  let tokenClass = TOKEN_CLASSES.TOKEN;
  let platform;
  if (isUniswapLP(token) || isSushiswapLP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    platform = isUniswapLP(token) ? "Uniswap v2" : null;
  }
  return {
    ...token,
    address: token.tokenInfo.address,
    // balance: parseByDecimals(token.decimals, token.balance),
    class: tokenClass,
    platform: platform,
    image: `${TOKEN_LOGO_SOURCE}/${token.address}/logo.png`,
  };
};

export const useUserLpTokens = (lpTokens, chainId) => {
  function fetcher(...urls) {
    const f = (u) => getUniswapLPTokenValue(u, chainId);

    // if (urls.length > 1) {
    return Promise.all(urls.map(f));
    // }
    // return f(urls);
  }
  const lpAddresses = lpTokens?.map((item) => item.address);
  const address = lpAddresses;
  const { data } = useSWR(address, fetcher);

  return data?.map((item, index) => ({
    ...item,
    address: item?.id,
    ...lpTokens[index],
  }));
};

export const useUserDefaultTokens = (tokens, chainId) => {
  function fetcher(...urls) {
    const f = (u) => getTokenInfo(u, chainId);

    if (urls.length > 1) {
      return Promise.all(urls.map(f));
    }
    return f(urls);
  }
  const addresses = tokens?.map((item) => item.address);
  const { data } = useSWR(addresses, fetcher);
  return data?.map((item, index) => ({
    ...item,
    address: item?.id,
    ...tokens[index],
  }));
};

export const useUserTokens = () => {
  const { account, chainId } = useActiveWeb3React();

  const fetcher = async () =>
    await axios
      .create({
        baseURL: "https://api.ethplorer.io",
      })
      .get(`https://api.ethplorer.io/getAddressInfo/${account}?apiKey=freekey`)
      .then(path(["data"]));

  const { data } = useSWR("https://api.ethplorer.io", fetcher);

  // if (data) {
  console.log("data", data);
  const classifiedTokens =
    data?.tokens?.map((item) => classifyTokens(item)) || [];

  const groupedData = groupBy(
    propOr(TOKEN_CLASSES.TOKEN, "class"),
    classifiedTokens
  );

  const defaultTokens = groupedData[TOKEN_CLASSES.TOKEN];
  const lpTokens = groupedData[TOKEN_CLASSES.LP_TOKEN];

  const lps = useUserLpTokens(lpTokens, chainId);
  // const defaults = useUserDefaultTokens(defaultTokens, chainId);

  return {
    [TOKEN_CLASSES.TOKEN]: defaultTokens,
    [TOKEN_CLASSES.LP_TOKEN]: lps,
  };
  // }
  // return [];
};
