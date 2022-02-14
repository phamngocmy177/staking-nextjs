import { useMoralis } from "react-moralis";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";
import { TOKEN_CLASSES } from "../constants/tokens";
import { isUniswapLP, isSushiswapLP } from "../hooks/tokenClassification";

const classifyTokens = (token) => {
  if (isUniswapLP(token) || isSushiswapLP(token)) {
    return {
      ...token,
      class: TOKEN_CLASSES.LP_TOKEN,
    };
  }
  return {
    ...token,
    class: TOKEN_CLASSES.TOKEN,
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
