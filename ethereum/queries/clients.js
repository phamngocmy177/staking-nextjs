import { GraphQLClient } from "graphql-request";
import {
  UNISWAP_ROPSTEN_URL,
  UNISWAP_MAINNET_V2_URL,
  UNISWAP_MAINNET_V3_URL,
} from "./constants";
import { SUPPORTED_CHAINS_IDS } from "../constants/chains";
import axios from "axios";

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

export const uniswapClient = {
  [SUPPORTED_CHAINS_IDS.ROPSTEN]: uniswapRopstenClients,
  [SUPPORTED_CHAINS_IDS.MAINNET]: uniswapMainnetv2Clients,
};

export const ethPlorerClient = axios.create({
  baseURL: "https://api.ethplorer.io",
});
