import { GraphQLClient } from "graphql-request";
import { UNISWAP_ROPSTEN_URL, UNISWAP_MAINNET_URL } from "./constants";
import { SUPPORTED_CHAINS_IDS } from "../constants/chains";

export const uniswapRopstenClients = new GraphQLClient(UNISWAP_ROPSTEN_URL, {
  timeout: 15000,
});

export const uniswapMainnetClients = new GraphQLClient(UNISWAP_MAINNET_URL, {
  timeout: 15000,
});

export const uniswapClient = {
  [SUPPORTED_CHAINS_IDS.ROPSTEN]: uniswapRopstenClients,
  [SUPPORTED_CHAINS_IDS.MAINNET]: uniswapMainnetClients,
};
