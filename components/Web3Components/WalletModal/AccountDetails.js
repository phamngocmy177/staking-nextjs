import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LinkIcon from "@material-ui/icons/OpenInNew";
import React from "react";
import { SUPPORTED_WALLETS } from "../../../ethereum/constants/wallet";
import { useActiveWeb3React } from "../../../ethereum/hooks/web3";
import { shorter } from "../../../ethereum/utils";
import {
  injected,
  walletconnect,
  walletlink,
} from "../../../ethereum/connectors";
import AppButton from "../../AppComponents/AppButton";
import Image from "next/image";
import {
  ExplorerDataType,
  getExplorerLink,
} from "../../../ethereum/utils/getEthplorerLink";
import { Identicon } from "../Web3StatusButton";

// const YourAccount = styled.div`
//   h5 {
//     margin: 0 0 1rem 0;
//     font-weight: 400;
//   }

//   h4 {
//     margin: 0;
//     font-weight: 500;
//   }
// `

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      alignItems: "flex-end",
    },
  },
  icon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
  walletNameTypography: {
    width: "initial",
    fontSize: "0.825rem",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
  },
  walletActionLabel: {
    fontSize: "0.825rem",
  },
  walletAction: {
    margin: theme.spacing(1),
  },
  infoCard: {
    borderRadius: "20px",
    position: "relative",
    display: "grid",
    gridRowGap: "12px",
    marginBottom: "20px",
  },

  addressLink: {
    fontSize: "0.825rem",
    display: "flex",
    alignItems: "center",
  },
  linkIcon: {
    fontSize: "0.88rem",
    marginLeft: theme.spacing(0.5),
  },
  accountControl: {
    display: "flex",
    alignItems: "center",
    minWidth: "0",
    width: "100%",
    fontWeight: "400",
    fontSize: "1.25rem",
    "& a:hover": {
      textDecoration: "underline",
    },
    "& p": {
      minWidth: "0",
      margin: "0",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  accountGroupingRow: {
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "400",
    "& div": {
      alignItems: "center",
    },
    display: "flex",
  },
}));

export function formatConnectorName(connector) {
  const { ethereum } = window;
  const isMetaMask = !!(ethereum && ethereum.isMetaMask);
  const name = Object.keys(SUPPORTED_WALLETS)
    .filter(
      (k) =>
        SUPPORTED_WALLETS[k].connector === connector &&
        (connector !== injected || isMetaMask === (k === "METAMASK"))
    )
    .map((k) => SUPPORTED_WALLETS[k].name)[0];
  return name;
}

export default function AccountDetails({ ENSName, openOptions }) {
  const { chainId, account, connector } = useActiveWeb3React();
  const classes = useStyles();

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <Box className={classes.iconWrapper}>
          <Identicon size={16} />
        </Box>
      );
    } else if (connector === walletconnect) {
      return (
        <Box className={classes.iconWrapper}>
          <Image
            src={SUPPORTED_WALLETS.WALLET_CONNECT.iconURL}
            alt={"Icon"}
            height={16}
            width={16}
          />
        </Box>
      );
    } else if (connector === walletlink) {
      return (
        <Box className={classes.iconWrapper}>
          <Image
            src={SUPPORTED_WALLETS.WALLET_LINK.iconURL}
            alt={"Icon"}
            height={16}
            width={16}
          />
        </Box>
      );
    }
    return null;
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.infoCard}>
        <Box className={classes.accountGroupingRow}>
          <Typography
            variant="caption"
            className={classes.walletNameTypography}
          >
            {`Connect with ${formatConnectorName(connector)}`}
          </Typography>
        </Box>
        <Box
          className={classes.accountGroupingRow}
          id="web3-account-identifier-row"
        ></Box>
        {ENSName ? (
          <Box className={classes.accountControl}>
            {getStatusIcon()}
            <p> {ENSName}</p>
          </Box>
        ) : (
          <Box className={classes.accountControl}>
            {getStatusIcon()}
            <p> {account && shorter(account)}</p>
          </Box>
        )}
        <Box className={classes.accountGroupingRow}>
          {ENSName ? (
            <>
              <Box className={classes.accountControl}>
                <div>
                  {/* {account && (
                      <Copy toCopy={account}>
                        <span style={{ marginLeft: "4px" }}>
                          <Typography>Copy Address</Typography>
                        </span>
                      </Copy>
                    )} */}
                  {chainId && account && (
                    <Link
                      className={classes.addressLink}
                      target="_blank"
                      hasENS={!!ENSName}
                      isENS={true}
                      href={getExplorerLink(
                        chainId,
                        ENSName,
                        ExplorerDataType.ADDRESS
                      )}
                    >
                      View on Explorer
                      <LinkIcon className={classes.linkIcon} />
                    </Link>
                  )}
                </div>
              </Box>
            </>
          ) : (
            <Box className={classes.accountControl}>
              <>
                {/* {account && (
                      <Copy toCopy={account}>
                        <span style={{ marginLeft: "4px" }}>
                          <Typography>Copy Address</Typography>
                        </span>
                      </Copy>
                    )} */}
                {chainId && account && (
                  <Link
                    target="_blank"
                    className={classes.addressLink}
                    hasENS={!!ENSName}
                    isENS={false}
                    href={getExplorerLink(
                      chainId,
                      account,
                      ExplorerDataType.ADDRESS
                    )}
                  >
                    View on Explorer
                    <LinkIcon className={classes.linkIcon} />
                  </Link>
                )}
              </>
            </Box>
          )}
        </Box>
      </Box>
      <Box className={classes.actions}>
        {connector !== injected && (
          <AppButton
            className={classes.walletAction}
            labelClass={classes.walletActionLabel}
            onClick={(e) => {
              e.stopPropagation();
              connector.close();
            }}
            label={"Disconnect"}
            large={false}
            rounded
            addElevation={false}
            disableWrapper
            fullWidth
          ></AppButton>
        )}
        <AppButton
          className={classes.walletAction}
          labelClass={classes.walletActionLabel}
          onClick={(e) => {
            e.stopPropagation();
            openOptions();
          }}
          label="Change"
          variant="outlined"
          large={false}
          rounded
          addElevation={false}
          disableWrapper
          fullWidth
        ></AppButton>
      </Box>
    </Box>
  );
}
