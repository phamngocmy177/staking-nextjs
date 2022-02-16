import { isNil, not, path, pipe } from "ramda";
import { uniswapClient } from "./clients";

export const getUniswapLPTokenValue = async (tokenAddress, chainId) => {
  const pairValue = await uniswapClient[chainId]
    ?.request(
      `query {
            pair(id: "${tokenAddress}") {
              id
              token0 {
                name
                symbol
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
          }`
    )
    .then(path(["pair"]));

  return pairValue;
};

export const tokenExists = pipe(path(["tokens", 0, "name"]), isNil, not);