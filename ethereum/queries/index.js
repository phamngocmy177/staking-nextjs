import { isNil, not, path, pipe } from "ramda";
import { uniswapRopstenClients } from "./clients";

export const getUniswapLPTokenValue = async (tokenAddress) => {
  const pairValue = await uniswapRopstenClients
    .request(
      `query {
            pair(id: "${tokenAddress}") {
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
