// @material-ui/core
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  blackColor,
  greyColor,
} from "assets/jss/nextjs-material-dashboard-pro.js";
import { mapIndexed } from "components/utils";
import { curry } from "ramda";
import React, { useState } from "react";
import { useCatalystProgramBalance } from "../../../../ethereum/hooks/useCatalystProgramBalance";
import { useCatalystProgramWithdraw } from "../../../../ethereum/hooks/useCatalystProgramsWithdraw";
import KeytangoButton from "../../../KeytangoComponents/KeytangoButton";
import DialogTransactionWrapper from "../../../InvestmentComponents/InvestmentForm/DialogTransactionWrapper";

const useStyles = makeStyles((theme) => ({
  status: {
    textTransform: "lowercase",
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
  infoBox: {
    height: theme.spacing(8),
    display: "flex",
    justifyContent: "space-between",
    borderRadius: 8,
    background: greyColor[0],
    alignItems: "center",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(1.5),
    width: "100%",
  },
  infoTitle: {
    color: greyColor[1],
    fontWeight: 400,
    fontSize: 15,
  },
  infoValue: {
    color: `${blackColor} !important`,
    fontWeight: 400,
    fontSize: 15,
  },
}));

const getProgramData = ({ rewards, originalDeposit }) => [
  {
    label: "Claimable",
    value: rewards.formatValue(),
  },
  {
    label: "Original Deposit",
    value: originalDeposit.formatValue(),
  },
];

const ClaimButton = ({ program, ...props }) => {
  const classes = useStyles();

  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const programBalances = useCatalystProgramBalance(program);

  const programData = getProgramData({ ...programBalances, ...program });

  const [handleWithdraw, withdrawTransactionProps] = useCatalystProgramWithdraw(
    program,
    programBalances
  );

  const handleClaimClick = () => {
    handleWithdraw();
    setOpenTransactionModal(true);
  };
  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };
  const createAssetItem = curry((classes, { label, value }, index) => (
    <Box className={classes.infoBox} key={index}>
      <Typography className={classes.infoTitle}>{label}</Typography>
      <Typography className={classes.infoValue}>{value}</Typography>
    </Box>
  ));
  if (!program) return null;

  return (
    <React.Fragment>
      {mapIndexed(createAssetItem(classes))(programData)}
      <KeytangoButton
        className={classes.claimBtn}
        fullWidth={false}
        disableWrapper
        rounded
        label="Claim"
        onClick={handleClaimClick}
        {...props}
      />
      <DialogTransactionWrapper
        transactionProps={withdrawTransactionProps}
        open={openTransactionModal}
        handleClose={handleCloseTransactionModal}
      />
    </React.Fragment>
  );
};

export default ClaimButton;
