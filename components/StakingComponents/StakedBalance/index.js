import Typography from "@material-ui/core/Typography";
import Skeleton from "react-loading-skeleton";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakedBalance } from "../../../ethereum/hooks/useStakedBalance";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import AppButton from "../../AppComponents/AppButton";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { toPrice, toWei } from "../../../ethereum/utils/unitsHelper";
import Slider from "@material-ui/core/Slider";
import { BigNumber } from "@ethersproject/bignumber";
import { parseByDecimals } from "../../../ethereum/utils/unitsHelper";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "0.5px solid grey",
    borderRadius: 20,
    padding: 20,
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  balanceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "bolder",
  },
  selectTypography: {
    margin: theme.spacing(2, 0),
    fontSize: 16,
  },
}));

function BalanceTypography({ loading, balance }) {
  const classes = useStyles();

  if (loading) {
    return <Skeleton width={100} height={30} />;
  }
  return (
    <Typography className={classes.balanceValue}>
      {balance.formatValue()}
    </Typography>
  );
}
function StakedBalance({ program }) {
  const classes = useStyles();
  const { account, chainId } = useActiveWeb3React();

  const [percentWithdraw, setPercentWithdraw] = useState(0);

  const { userStakedAsset, loading, totalStakedAsset } = useStakedBalance(
    STAKING_ADDRESS[chainId],
    program.depositAsset
  );
  const [amountWithdraw, setAmountWithdraw] = useState(BigNumber.from(0));

  const stakingContract = useStakingContract(STAKING_ADDRESS[chainId]);
  const [sendTransaction, transactionState] = useTransaction(stakingContract);

  const handleWithdrawPercentChange = (event, newValue) => {
    setPercentWithdraw(newValue);
    setAmountWithdraw(userStakedAsset.rawAmount.mul(newValue).div(100));
  };

  const onWithdraw = async () => {
    const txParams = [amountWithdraw];

    const payableAmount = 0;

    sendTransaction(
      "withdraw",
      txParams,
      payableAmount,
      account,
      `Withdraw ${toPrice(amountWithdraw, program.depositAsset?.symbol)} from ${
        program.title
      }`
    );
  };

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>Withdraw</Typography>
      <Box className={classes.balanceRow}>
        <Typography className={classes.balanceLabel}>TVL:</Typography>
        <BalanceTypography
          loading={loading}
          balance={totalStakedAsset}
          symbol={program.depositAsset.symbol}
        />
      </Box>
      <Box className={classes.balanceRow}>
        <Typography className={classes.balanceLabel}>
          Staked Balance:
        </Typography>
        <BalanceTypography
          loading={loading}
          balance={userStakedAsset}
          symbol={program.depositAsset.symbol}
        />
      </Box>
      <hr />
      <Box className={classes.balanceRow}>
        <Typography className={classes.balanceLabel}>Select Amount</Typography>
        <Typography className={classes.balanceValue}>
          {parseByDecimals(program.depositAsset.decimals, amountWithdraw)}
        </Typography>
      </Box>

      <Slider
        value={percentWithdraw}
        valueLabelDisplay="auto"
        onChange={handleWithdrawPercentChange}
      />
      <AppButton
        disabled={
          userStakedAsset?.rawAmount?.isZero &&
          userStakedAsset?.rawAmount?.isZero()
        }
        onClick={onWithdraw}
        label={"Withdraw"}
      />
    </Box>
  );
}

export default StakedBalance;
