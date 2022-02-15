import { GraphQLClient } from "graphql-request";
import { UNISWAP_ROPSTEN_URL } from "./constants";

export const uniswapRopstenClients = new GraphQLClient(UNISWAP_ROPSTEN_URL, {
  timeout: 15000,
});
