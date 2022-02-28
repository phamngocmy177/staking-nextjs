import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
// import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
// import TransactionSubmittedImage from "../../../assets/img/transaction-submitted.svg";
// import Danger from "components/DashboardComponents/Typography/Danger.js";
// import Info from "components/DashboardComponents/Typography/Info.js";
import React from "react";
import { useActiveWeb3React } from "../../../../ethereum/hooks/web3";
import {
  getExplorerLink,
  ExplorerDataType,
} from "../../../../ethereum/utils/getEthplorerLink";
import AppButton from "../../../AppComponents/AppButton";
import CloudDone from "@material-ui/icons/CloudDone";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    // padding: theme.spacing(0, 3),
  },
  titleTypography: {
    fontSize: 20,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    width: "100%",
    textAlign: "center",
  },
  subtitleTypography: {
    fontSize: 16,
    fontWeight: 300,
    marginBottom: theme.spacing(2),
  },
  icon: {
    width: "auto",
    height: 100,
  },
  progressBar: {
    marginBottom: theme.spacing(1),
  },
  successDescription: {
    fontSize: 18,
  },
  txStatusIcon: {
    fill: theme.colors.primary,
  },
}));

const TransactionWrapper = ({
  attempting,
  error,
  txHash,
  success,
  children = null,
  errorText = "Transaction Rejected",
  attemptingText = "Deposit...",
  resetState,
  withoutRetry,
  onTryAgain = () => {},
  successDescription,
}) => {
  const { chainId } = useActiveWeb3React();
  const classes = useStyles();

  if (!attempting && !error && !success) {
    return children;
  }

  if (attempting) {
    return (
      <Box className={classes.container}>
        <CircularProgress
          size={50}
          className={classes.progressBar}
        ></CircularProgress>
        <Typography className={classes.titleTypography} tabIndex="0">
          Waiting for confirmation
        </Typography>
        <Typography
          className={classes.subtitleTypography}
          tabIndex="0"
          align="center"
        >
          {attemptingText}
        </Typography>
        <Typography tabIndex="0" variant="caption">
          Confirm this transaction in your wallet
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.container}>
        {/* <Danger> */}
        <ErrorOutlineIcon
          className={classes.icon}
          style={{ fill: "#F8B3C1" }}
        />
        {/* </Danger> */}
        <Typography
          className={classes.titleTypography}
          tabIndex="0"
          gutterBottom
        >
          {errorText}
        </Typography>
        {!withoutRetry && (
          <AppButton
            disableWrapper
            label={"Try again"}
            onClick={() => {
              resetState();
              onTryAgain();
            }}
          ></AppButton>
        )}
      </Box>
    );
  }

  if (success) {
    return (
      <Box className={classes.container}>
        <CloudDone className={classes.icon} style={{ fill: "#9DD9CF" }} />
        <Typography
          className={classes.titleTypography}
          tabIndex="0"
          gutterBottom
        >
          Transaction submitted
        </Typography>
        {successDescription && (
          <Typography variant="body2" className={classes.successDescription}>
            {successDescription}
          </Typography>
        )}
        <Link
          className={classes.largeText}
          href={getExplorerLink(chainId, txHash, ExplorerDataType.TRANSACTION)}
          target="_blank"
        >
          View your transaction
        </Link>
      </Box>
    );
  }

  return null;
};

export default TransactionWrapper;
