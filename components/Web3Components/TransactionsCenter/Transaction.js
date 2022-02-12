import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import classnames from "classnames";
import {
  ExplorerDataType,
  getExplorerLink,
} from "ethereum/utils/getEthplorerLink";
import React from "react";
import { useAllTransactions } from "state/transactions/hooks";
import { timeAgo } from "../../utils";

const useStyles = makeStyles((theme) => ({
  linkTypography: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.palette.primary.main,
    textDecoration: "underline",
    "&:hover": {
      color: theme.palette.text.primary,
    },
    "&:focus": {
      color: theme.palette.text.primary,
    },
  },
  icon: {
    fontSize: 38,
    color: theme.palette.text.primary,
  },
  // error: { color: theme.palette.dangerColor[0] },
  // success: { color: theme.palette.successColor[0] },
  title: {
    color: "#4C4C66",
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.8,
    marginBottom: theme.spacing(1),
    whiteSpace: "break-word",
  },
  summary: {
    color: "#6F6C99",
    fontSize: 12,
    fontWeight: 400,
    marginBottom: theme.spacing(1.2),
    whiteSpace: "break-spaces",
    textAlign: "left",
  },
  timeago: {
    color: "#6F6C99",
    fontSize: 11,
    fontWeight: 400,
  },
}));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Transaction({ hash, chainId }) {
  const allTransactions = useAllTransactions();
  const classes = useStyles();

  const tx = allTransactions?.[hash];

  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const addedUnixTs = tx?.confirmedTime;

  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === "undefined");

  if (!chainId) return null;

  const title = summary?.replace(/ .*/, "");
  return (
    <Box display="flex">
      <Box alignSelf="flex-start" marginRight={2}>
        {pending ? (
          <CircularProgress size={25} />
        ) : success ? (
          <CheckCircleOutlineIcon
            className={classnames(classes.icon, classes.success)}
          />
        ) : (
          <ErrorOutlineIcon
            className={classnames(classes.icon, classes.error)}
          />
        )}
      </Box>
      <Box width={300}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.summary}>
          {capitalizeFirstLetter(summary ?? hash)}
        </Typography>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography className={classes.timeago}>
            {timeAgo(addedUnixTs)}
          </Typography>
          <Link
            href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
            target="_blank"
          >
            <Typography className={classes.linkTypography}>
              See Transaction
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
