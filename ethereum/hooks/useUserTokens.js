import axios from "axios";
import { groupBy, path, propOr } from "ramda";
import { useMemo } from "react";
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

export const useUserLpTokens = (lpTokens, chainId) => {
  function fetcher(...urls) {
    const f = (u) => getUniswapLPTokenValue(u, chainId);
    return Promise.all(urls.map(f));
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

export const useUserTokens = () => {
  const { account, chainId } = useActiveWeb3React();
  const params = useMemo(() => ({ account }), [account]);
  const fetcher = async () =>
    await axios
      .create({
        baseURL: "https://api.ethplorer.io",
      })
      .get(
        `https://api.ethplorer.io/getAddressInfo/${account}?apiKey=${process.env.NEXT_PUBLIC_ETHPLORER_KEY}`
      )
      .then(path(["data"]));

  const { data } = useSWR(["https://api.ethplorer.io", params], fetcher);

  const classifiedTokens =
    data?.tokens?.map((item) => classifyTokens(item)) || [];

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
};
