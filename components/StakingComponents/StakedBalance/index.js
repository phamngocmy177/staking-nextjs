import Typography from "@material-ui/core/Typography";
import Skeleton from "react-loading-skeleton";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakedBalance } from "../../../ethereum/hooks/useStakedBalance";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import AppButton from "../../AppComponents/AppButton";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { toPrice, toWei } from "../../../ethereum/utils/unitsHelper";

const useStyles = makeStyles(() => ({
  container: {
    border: "0.5px solid grey",
    borderRadius: 20,
    padding: 20,
    height: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  balanceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  balanceLabel: {
    fontSize: 16,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "bolder",
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
  const { account, chainId } = useActiveWeb3React();
  const classes = useStyles();
  const { userStakedAsset, loading, totalStakedAsset } = useStakedBalance(
    STAKING_ADDRESS[chainId],
    program.depositAsset
  );

  const stakingContract = useStakingContract(STAKING_ADDRESS[chainId]);
  const [sendTransaction, transactionState] = useTransaction(stakingContract);

  const onWinthdraw = async ({ enterAmount }) => {
    const txParams = [
      toWei(
        enterAmount.toString(),
        program.depositAsset?.decimals
      ).toHexString(),
    ];

    const payableAmount = 0;

    sendTransaction(
      "withdraw",
      txParams,
      payableAmount,
      account,
      `Withdraw ${toPrice(enterAmount, program.depositAsset?.symbol)} from ${
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

      <AppButton
        disabled={userStakedAsset.rawAmount.isZero()}
        label={"Withdraw"}
      />
    </Box>
  );
}

export default StakedBalance;
