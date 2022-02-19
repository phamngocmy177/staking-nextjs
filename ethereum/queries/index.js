import { isNil, not, path, pipe } from "ramda";
import { uniswapMainnetv2Clients, uniswapMainnetv3Clients } from "./clients";

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

export const tokenExists = pipe(path(["tokens", 0, "name"]), isNil, not);
