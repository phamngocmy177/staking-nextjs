import { useMoralis } from "react-moralis";
import useSWR from "swr";
import { useActiveWeb3React } from "..//hooks/web3";

export const useUserTokens = () => {
  const { Moralis } = useMoralis();
  const { account, chainId } = useActiveWeb3React();

  const options = { chain: `0x${chainId.toString(16)}`, address: account };

  const fetcher = async () =>
    await Moralis.Web3API.account.getTokenBalances(options);
  const address = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
  const { data } = useSWR(address, fetcher);
  if (data) return data;
  return [];
};
