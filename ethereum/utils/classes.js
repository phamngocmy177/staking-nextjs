import { parseUnits } from "@ethersproject/units";
import { isNil, propOr } from "ramda";
import { parseByDecimals } from "./unitsHelper";

export class CryptoAsset {
  constructor(asset, bigNumber) {
    this.symbol = asset?.symbol;
    this.usdRate = asset?.usdRate;
    this.address = asset?.address;
    this.maximumFractionDigits = propOr(3, "maximumFractionDigits", asset);
    this.rawAmount = bigNumber;
    this.amount = parseByDecimals(asset?.decimals, bigNumber);
    this.asset = asset;
  }

  _formatUSD(value) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  addByUSD(cryptoAsset, format = true) {
    const rawValue = cryptoAsset.getUSDValue() + this.getUSDValue();
    return format ? this._formatUSD(rawValue) : rawValue;
  }

  getRawValue() {
    return this.rawAmount;
  }

  getAmount() {
    return this.amount;
  }

  getFloatValue() {
    return parseFloat(this.rawAmount);
  }

  getUSDValue() {
    if (this.usdRate) {
      return this.usdRate * this.amount;
    }
    return 0;
  }

  formatUSDValue() {
    return this._formatUSD(this.usdRate * this.amount);
  }

  formatValue(disableSymbol, overrideMaxFrictionDigits) {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: isNil(overrideMaxFrictionDigits)
        ? this.maximumFractionDigits
        : overrideMaxFrictionDigits,
    }).format(this.amount)} ${disableSymbol ? "" : this.symbol}`;
  }

  getRoundedValue() {
    return parseUnits(parseInt(this.amount).toString(), this.asset?.decimals);
  }

  add(assetToAdd) {
    if (assetToAdd && assetToAdd.address === this.address) {
      const newAmount = this.rawAmount.add(assetToAdd.getRawValue());
      return new CryptoAsset(this.asset, newAmount);
    }
    throw Error(
      "invalid add operation - trying to add 2 different type of assets"
    );
  }
}
