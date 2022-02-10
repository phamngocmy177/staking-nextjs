import { SUPPORTED_CHAINS_IDS } from "../constants/chains";

const ETHERSCAN_PREFIXES = {
  [SUPPORTED_CHAINS_IDS.MAINNET]: "",
  [SUPPORTED_CHAINS_IDS.ROPSTEN]: "ropsten.",
  [SUPPORTED_CHAINS_IDS.RINKEBY]: "rinkeby.",
  [SUPPORTED_CHAINS_IDS.GOERLI]: "goerli.",
  [SUPPORTED_CHAINS_IDS.KOVAN]: "kovan.",
};

export const ExplorerDataType = {
  TRANSACTION: "transaction",
  TOKEN: "token",
  ADDRESS: "address",
  BLOCK: "block",
};

export function getExplorerLink(chainId, data, type) {
  if (chainId === SUPPORTED_CHAINS_IDS.ARBITRUM_KOVAN) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://explorer5.arbitrum.io/#/tx/${data}`;
      case ExplorerDataType.ADDRESS:
        return `https://explorer5.arbitrum.io/#/address/${data}`;
      case ExplorerDataType.BLOCK:
        return `https://explorer5.arbitrum.io/#/block/${data}`;
      default:
        return `https://explorer5.arbitrum.io`;
    }
  }

  if (chainId === SUPPORTED_CHAINS_IDS.ARBITRUM_ONE) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://mainnet-arb-explorer.netlify.app/tx/${data}`;
      case ExplorerDataType.ADDRESS:
        return `https://mainnet-arb-explorer.netlify.app/address/${data}`;
      case ExplorerDataType.BLOCK:
        return `https://mainnet-arb-explorer.netlify.app/block/${data}`;
      default:
        return `https://mainnet-arb-explorer.netlify.app`;
    }
  }

  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] ?? ""}etherscan.io`;

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`;

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`;

    case ExplorerDataType.BLOCK:
      return `${prefix}/block/${data}`;

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`;
    default:
      return `${prefix}`;
  }
}
