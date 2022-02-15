import { useMoralis } from "react-moralis";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";
import { TOKEN_CLASSES } from "../constants/tokens";
import { isUniswapLP, isSushiswapLP } from "../hooks/tokenClassification";
import { parseByDecimals } from "../utils/unitsHelper";
import { getUniswapLPTokenValue } from "../queries";

const classifyTokens = async (token) => {
  let tokenClass = TOKEN_CLASSES.TOKEN;
  if (isUniswapLP(token) || isSushiswapLP(token)) {
    tokenClass = TOKEN_CLASSES.LP_TOKEN;
    const lpTokens = await getUniswapLPTokenValue(token.address);
    console.log("lpTokens", lpTokens);
  }
  return {
    ...token,
    address: token.token_address,
    balance: parseByDecimals(token.decimals, token.balance),
    class: tokenClass,
  };
};

export const useUserTokens = () => {
  const { Moralis } = useMoralis();
  const { account, chainId } = useActiveWeb3React();

  const options = { chain: `0x${chainId.toString(16)}`, address: account };

  const fetcher = async () =>
    await Moralis.Web3API.account.getTokenBalances(options);
  const address = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
  const { data } = useSWR(address, fetcher);
  if (data) {
    const classifiedTokens = data?.map((item) => classifyTokens(item));

    return classifiedTokens;
  }
  return [];
};
