import { curry } from "ramda";

import { formatEther, parseUnits, formatUnits } from "@ethersproject/units";

import { BigNumber } from "@ethersproject/bignumber";

export const parseToEther = curry((bigInt, digits) =>
  bigInt ? parseFloat(formatEther(bigInt)).toFixed(digits || 3) : 0
);

export const parseByDecimals = curry((decimals, bigInt) =>
  bigInt ? formatUnits(bigInt, decimals) : 0
);

export const toWei = (ammount, decimals) =>
  parseUnits(ammount, decimals || "ether");

export const toPrice = (value, symbol) =>
  `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
  }).format(value)} ${symbol}`;

// add 30%
export function calculateGasMargin(value, marginFactor = 3000) {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(marginFactor)))
    .div(BigNumber.from(10000));
}
