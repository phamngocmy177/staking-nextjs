import { isNil, not, path, pipe } from "ramda";
import {
  sushiswapMainnetClients,
  uniswapMainnetv2Clients,
  uniswapMainnetv3Clients,
  ethPlorerClient,
} from "./clients";

const lpTokenQuery = (tokenAddress) => `query {
  pair(id: "${tokenAddress}") {
    id
    token0 {
      name
      symbol
      id
    }
    token1 {
      name
      symbol
      id
    }
    totalSupply
    reserveUSD
    reserve0
    reserve1
  }
}`;
export const getUniswapv2LPTokenValue = async (tokenAddress) => {
  const pairValue = await uniswapMainnetv2Clients
    ?.request(lpTokenQuery(tokenAddress))
    .then(path(["pair"]));

  return pairValue;
};

export const getUniswapv3LPTokenValue = async (tokenAddress) => {
  const pairValue = await uniswapMainnetv3Clients
    ?.request(lpTokenQuery(tokenAddress))
    .then(path(["pair"]));

  return pairValue;
};

export const getSushiswapLPTokenValue = async (tokenAddress) => {
  const pairValue = await sushiswapMainnetClients
    ?.request(lpTokenQuery(tokenAddress))
    .then(path(["pair"]));

  return pairValue;
};

export const fetchTokenInfo = async (address) =>
  await ethPlorerClient
    .get(
      `/getTokenInfo/${address}?apiKey=${process.env.NEXT_PUBLIC_ETHPLORER_KEY}`
    )
    .then((res) => res?.data);

export const fetchLPTokensInfo = async (lpTokens) => {
  const token0 = await fetchTokenInfo(lpTokens.token0.id);
  const token1 = await fetchTokenInfo(lpTokens.token1.id);
  return { token0, token1 };
};

export const fetchAddressInfo = async (account) =>
  await ethPlorerClient
    .get(
      `/getAddressInfo/${account}?apiKey=${process.env.NEXT_PUBLIC_ETHPLORER_KEY}`
    )
    .then((res) => res?.data);

export const tokenExists = pipe(path(["tokens", 0, "name"]), isNil, not);
