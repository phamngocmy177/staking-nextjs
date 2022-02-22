import axios from "axios";
import { GraphQLClient } from "graphql-request";
import {
  SUSHISWAP_MAINNET_URL,
  UNISWAP_MAINNET_V2_URL,
  UNISWAP_MAINNET_V3_URL,
  UNISWAP_ROPSTEN_URL,
} from "./constants";

export const uniswapRopstenClients = new GraphQLClient(UNISWAP_ROPSTEN_URL, {
  timeout: 15000,
});

export const uniswapMainnetv2Clients = new GraphQLClient(
  UNISWAP_MAINNET_V2_URL,
  {
    timeout: 15000,
  }
);

export const uniswapMainnetv3Clients = new GraphQLClient(
  UNISWAP_MAINNET_V3_URL,
  {
    timeout: 15000,
  }
);

export const sushiswapMainnetClients = new GraphQLClient(
  SUSHISWAP_MAINNET_URL,
  { timeout: 15000 }
);

export const ethPlorerClient = axios.create({
  baseURL: "https://api.ethplorer.io",
});
