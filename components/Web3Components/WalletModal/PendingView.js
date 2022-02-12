import React from "react";
import Box from "@material-ui/core/Box";
import Option from "./Option";
import { injected } from "../../../ethereum/connectors";
import { SUPPORTED_WALLETS } from "../../../ethereum/constants/wallet";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";

// const ErrorButton = styled.div`
//   color: ${({ theme }) => theme.text1};
//   background-color: ${({ theme }) => theme.bg4};

// `

const useStyles = makeStyles((theme) => ({
  pendingSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    "& > *": {
      width: "100%",
    },
  },
  loadingWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loadingMessage: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: "12px",
    marginBottom: "20px",
    "& > *": {
      padding: "1rem",
    },
  },
  errorBorder: {
    // border: `1px solid ${theme.palette.dangerColor[0]}`,
    // color: theme.palette.dangerColor[0],
  },
  normalBorder: {
    color: "inherit",
    border: `1px solid ${theme.palette.text.primary}`,
  },
  loader: {
    marginRight: "1rem",
  },
  errorGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  errorButton: {
    marginLeft: "1rem",
    padding: "0.5rem",
    fontWeight: "600",
    userSelect: "none",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.primary.main,
    },
    fontSize: 12,
    borderRadius: theme.spacing(1),
    background: theme.palette.primary.light,
    color: theme.palette.text.primary,
  },
}));

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
}) {
  const isMetamask = window?.ethereum?.isMetaMask;
  const classes = useStyles();

  return (
    <Box className={classnames.pendingSection}>
      <Box className={classes.loadingMessage} error={error}>
        <Box
          className={classnames(
            classes.loadingWrapper,
            error ? classes.errorBorder : classes.normalBorder
          )}
        >
          {error ? (
            <Box className={classes.errorGroup}>
              <div>Error connecting</div>
              <Box
                className={classes.errorButton}
                onClick={() => {
                  setPendingError(false);
                  connector && tryActivation(connector);
                }}
              >
                <Typography>Try Again</Typography>
              </Box>
            </Box>
          ) : (
            <>
              <CircularProgress />
              <Typography>Initializing...</Typography>
            </>
          )}
        </Box>
      </Box>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key];
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== "MetaMask") {
              return null;
            }
            if (!isMetamask && option.name === "MetaMask") {
              return null;
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={option.iconURL}
            />
          );
        }
        return null;
      })}
    </Box>
  );
}
