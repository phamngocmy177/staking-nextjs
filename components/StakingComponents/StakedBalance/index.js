import { BigNumber } from "@ethersproject/bignumber";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import { useStakedBalance } from "../../../ethereum/hooks/useStakedBalance";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import { parseByDecimals } from "../../../ethereum/utils/unitsHelper";
import AppButton from "../../AppComponents/AppButton";
import DialogTransactionWrapper from "../StakingForm/InvestBase/DialogTransactionWrapper";

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
    color: theme.colors.text1,
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
    color: theme.colors.text1,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "bolder",
    color: theme.colors.text1,
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
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

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
  const onCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };
  const onWithdraw = async () => {
    setOpenTransactionModal(true);
    const txParams = [amountWithdraw];

    const payableAmount = 0;

    sendTransaction(
      "withdraw",
      txParams,
      payableAmount,
      account,
      `Withdraw 
        ${parseByDecimals(program.depositAsset.decimals, amountWithdraw)}
         ${program.depositAsset?.symbol}
       from ${program.title}`
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
      <Divider />
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
        disabled={amountWithdraw?.isZero()}
        onClick={onWithdraw}
        label={"Withdraw"}
      />
      <DialogTransactionWrapper
        transactionProps={transactionState}
        open={openTransactionModal}
        handleClose={onCloseTransactionModal}
      />
    </Box>
  );
}

export default StakedBalance;
