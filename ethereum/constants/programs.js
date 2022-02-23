import {
  STAKING_ADDRESS,
  STAKING_DEPOSIT_ADDRESS,
  STAKING_REWARD_ADDRESS,
} from "./address";

export const programs = (chainId) => [
  {
    title: "Staking",
    address: STAKING_ADDRESS[chainId],
    depositAsset: {
      address: STAKING_DEPOSIT_ADDRESS[chainId],
      symbol: "UNI",
      decimal: 18,
      name: "Uniswap",
      maximumFractionDigits: 4,
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    },
    rewardtAsset: {
      address: STAKING_REWARD_ADDRESS[chainId],
      symbol: "UNI",
      decimal: 18,
      name: "Uniswap",
      maximumFractionDigits: 4,
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    },
  },
];
