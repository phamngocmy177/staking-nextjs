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
    },
    rewardtAsset: {
      address: STAKING_REWARD_ADDRESS[chainId],
      symbol: "UNI",
      decimal: 18,
      name: "Uniswap",
    },
  },
];
