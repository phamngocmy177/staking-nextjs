import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Skeleton from "react-loading-skeleton";

const useStyles = makeStyles((theme) => ({
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
  return <Typography className={classes.balanceValue}>{balance}</Typography>;
}

export default function BalanceRow({ loading, balance, symbol, label }) {
  const classes = useStyles();

  return (
    <Box className={classes.balanceRow}>
      <Typography className={classes.balanceLabel}>{label}:</Typography>
      <BalanceTypography loading={loading} balance={balance} symbol={symbol} />
    </Box>
  );
}
