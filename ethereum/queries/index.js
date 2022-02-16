import { isNil, not, path, pipe } from "ramda";
import {
  uniswapClient,
  uniswapMainnetClients,
  ethPlorerClient,
} from "./clients";

export const getUniswapLPTokenValue = async (tokenAddress, chainId) => {
  const pairValue = await uniswapMainnetClients
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

export const getUniswapTokenValue = async (tokenAddress, chainId) => {
  const pairValue = await uniswapMainnetClients
    ?.request(
      `query {
            token(id: "${tokenAddress}") {
              id
             symbol
             name
             decimals
            }
          }`
    )
    .then(path(["token"]));

  return pairValue;
};

export const getTokenInfo = async (tokenAddress, chainId) => {
  const tokenValue = await ethPlorerClient
    ?.get(`/getAddressInfo/${tokenAddress}`)
    .then(path(["data"]));

  return tokenValue;
};

export const tokenExists = pipe(path(["tokens", 0, "name"]), isNil, not);
