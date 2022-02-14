import {
  add,
  filter,
  identity,
  pipe,
  pluck,
  propSatisfies,
  reduce,
  path,
} from "ramda";

export const filterNulls = filter(identity);
export const filterByValue = filter(propSatisfies((x) => x > 0, "value"));

export const sumListValues = pipe(
  pluck("value"),
  filter(identity),
  reduce(add, 0)
);
export const getSymbol = path(["symbol"]);
export const getToken0 = path(["token0"]);
export const getToken1 = path(["token1"]);
export const getPlatform = path(["platform"]);
export const getImage = path(["image"]);
export const getBalance = path(["balance"]);
