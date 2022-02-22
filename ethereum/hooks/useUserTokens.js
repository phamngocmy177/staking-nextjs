import axios from "axios";
import { groupBy, path, propOr } from "ramda";
import { useMemo } from "react";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";
import { LP_TOKEN_PLATFORM, TOKEN_CLASSES } from "../constants/tokens";
import {
  isUniswapv2LP,
  isUniswapv3LP,
  isSushiswapLP,
} from "../hooks/tokenClassification";
import {
  getUniswapv2LPTokenValue,
  getUniswapv3LPTokenValue,
  getSushiswapLPTokenValue,
  fetchAddressInfo,
} from "../queries";
import { parseByDecimals } from "../utils/unitsHelper";

const classifyTokens = (token) => {
  let tokenClass = TOKEN_CLASSES.TOKEN;
  let platform;
  if (isUniswapv2LP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    platform = LP_TOKEN_PLATFORM.UNISWAP_V2;
  }
  if (isUniswapv3LP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    platform = LP_TOKEN_PLATFORM.UNISWAP_V3;
  }
  if (isSushiswapLP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    platform = LP_TOKEN_PLATFORM.SUSHISWAP;
  }
  const usdtRate = path(["tokenInfo", "price", "rate"], token);

  return {
    ...token,
    address: token.tokenInfo.address,
    class: tokenClass,
    platform: platform,
    balance: parseByDecimals(token.tokenInfo.decimals, token.rawBalance),
    value: usdtRate
      ? usdtRate * parseByDecimals(token.tokenInfo.decimals, token.rawBalance)
      : 0,
    ...token.tokenInfo,
  };
};

export const useUserLpTokens = (lpTokens) => {
  function fetcher(...tokens) {
    const f = (item) => {
      if (item.platform === LP_TOKEN_PLATFORM.UNISWAP_V2) {
        return getUniswapv2LPTokenValue(item.address);
      }
      if (item.platform === LP_TOKEN_PLATFORM.UNISWAP_V3) {
        return getUniswapv3LPTokenValue(item.address);
      }
      if (item.platform === LP_TOKEN_PLATFORM.SUSHISWAP) {
        return getSushiswapLPTokenValue(item.address);
      }
    };
    return Promise.all(tokens.map(f));
  }
  const lpAddresses = lpTokens;
  const address = lpAddresses;
  const { data } = useSWR(address, fetcher);

  return data?.map((item, index) => ({
    ...item,
    ...lpTokens[index],
    price: item.reserveUSD / item.totalSupply,
    value: (item.reserveUSD / item.totalSupply) * lpTokens[index].balance,
    address: item?.id,
  }));
};

export const useUserTokens = () => {
  const { account } = useActiveWeb3React();

  const params = useMemo(() => ({ account }), [account]);
  const fetcher = async () => await fetchAddressInfo(account);

  const { data } = useSWR(["https://api.ethplorer.io", params], fetcher);

  const classifiedTokens =
    data?.tokens?.map((item) => classifyTokens(item)) || [];

  const groupedData = groupBy(
    propOr(TOKEN_CLASSES.TOKEN, "class"),
    classifiedTokens
  );

  const defaultTokens = groupedData[TOKEN_CLASSES.TOKEN];
  const lpTokens = groupedData[TOKEN_CLASSES.LP_TOKEN];

  const lps = useUserLpTokens(lpTokens);

  return {
    [TOKEN_CLASSES.TOKEN]: defaultTokens,
    [TOKEN_CLASSES.LP_TOKEN]: lps,
  };
};
