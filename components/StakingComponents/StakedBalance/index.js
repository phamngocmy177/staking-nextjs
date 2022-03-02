import { BigNumber } from "@ethersproject/bignumber";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { STAKING_ADDRESS } from "../../../ethereum/constants/address";
import { useStakingContract } from "../../../ethereum/hooks/useContract";
import {
  useEarnedBalance,
  useUserStakedBalance,
} from "../../../ethereum/hooks/useStakedBalance";
import { useTransaction } from "../../../ethereum/hooks/useTransaction";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import { parseByDecimals } from "../../../ethereum/utils/unitsHelper";
import AppButton from "../../AppComponents/AppButton";
import BalanceRow from "../BalanceRow";
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
}));

function StakedBalance({ program }) {
  const classes = useStyles();
  const { account, chainId } = useActiveWeb3React();

  const [percentWithdraw, setPercentWithdraw] = useState(0);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  const { userStakedAsset, loading: userLoading } = useUserStakedBalance(
    STAKING_ADDRESS[chainId],
    program.depositAsset
  );

  const { loading: earnedLoading, earnedAsset } = useEarnedBalance(
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
  const onClaim = async () => {
    setOpenTransactionModal(true);

    const payableAmount = 0;

    sendTransaction(
      "getReward",
      [],
      payableAmount,
      account,
      `Claim 
        ${earnedAsset.formatValue()}
       from ${program.title}`
    );
  };

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>Withdraw</Typography>

      <BalanceRow
        label={"Staked Balance"}
        loading={userLoading}
        balance={userStakedAsset.formatValue()}
        symbol={program.depositAsset.symbol}
      />
      <BalanceRow
        label={"Earned"}
        loading={earnedLoading}
        balance={earnedAsset.formatValue()}
        symbol={program.depositAsset.symbol}
      />

      <Divider />
      <BalanceRow
        label={"Select Amount"}
        balance={parseByDecimals(program.depositAsset.decimals, amountWithdraw)}
        symbol={program.depositAsset.symbol}
      />

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
      <AppButton
        disabled={earnedAsset.getAmount() <= 0}
        onClick={onClaim}
        label={"Claim Reward"}
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
