/*eslint-disable*/
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Hidden from "@material-ui/core/Hidden";
import Jazzicon from "@metamask/jazzicon";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import WalletConnectIcon from "assets/images/icons/walletConnectIcon.svg";
import Button from "@material-ui/core/Button";
import { injected, walletconnect } from "ethereum/connectors";
import { useActiveWeb3React } from "ethereum/hooks/web3";
import React, { useEffect, useRef } from "react";
import { useWalletModalToggle } from "state/application/hooks";
import { shorter } from "../../../ethereum/utils";
import AppButton from "../../AppComponents/AppButton";
import ConnectWalletButton from "../ConnectWalletButton";
import WalletModal from "../WalletModal";
import { formatConnectorName } from "../WalletModal/AccountDetails";
import { MOBILE_QUERY } from "../../utils/responsive";
import { switchNetworkMetamask } from "../../../ethereum/hooks/web3";

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      height: 30,
      width: 30,
    },
  },
  button: {
    borderRadius: 163,
    padding: theme.spacing(1),

    background: "#F5F5F5",
    justifyContent: "left",
    width: "100%",
  },
  contrastText: {
    color: theme.palette.primary.contrastText,
    fontSize: 18,
    fontWeight: 400,
    [theme.breakpoints.down("sm")]: {
      fontSize: 15,
    },
  },
  defaultText: {
    color: "black",
    fontSize: 18,
    fontWeight: 500,
    [theme.breakpoints.down("sm")]: {
      fontSize: 15,
    },
  },
}));

export const Identicon = ({ size = 44 }) => {
  const ref = useRef();
  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(
        Jazzicon(size, parseInt(account.slice(2, 10), 16))
      );
    }
  }, [account]);

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <div ref={ref}></div>;
};

// eslint-disable-next-line react/prop-types
const StatusIcon = ({ connector }) => {
  const classes = useStyles();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  if (connector === injected) {
    return (
      <Avatar alt={"WalletConnect"} className={classes.avatar}>
        <Identicon size={isMobile ? 30 : 44} />
      </Avatar>
    );
  } else if (connector === walletconnect) {
    return (
      <Avatar
        src={WalletConnectIcon}
        alt={"WalletConnect"}
        className={classes.avatar}
      />
    );
  }

  return null;
};

const Web3StatusButtonInner = ({ contrastText, withWallet }) => {
  const { account, connector, error } = useWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const classes = useStyles();
  const isMetamask = window.ethereum && window.ethereum.isMetaMask;

  if (account) {
    if (connector) {
      return (
        <Box display="flex" alignItems="center" width={isMobile ? 160 : 216}>
          <Button
            className={classes.button}
            onClick={(e) => {
              e.stopPropagation();
              toggleWalletModal();
            }}
          >
            <StatusIcon connector={connector}></StatusIcon>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography
                className={
                  contrastText ? classes.contrastText : classes.defaultText
                }
              >
                {shorter(account)}
              </Typography>
              <Hidden smDown>
                <Typography variant="caption">
                  {formatConnectorName(connector)}
                </Typography>
              </Hidden>
            </Box>
          </Button>
        </Box>
      );
    }
  } else if (error && error instanceof UnsupportedChainIdError && isMetamask) {
    //wrong network and metamask only
    //case: wrong network and walletconnect: now walletconnect doesn't detect wrong network, so no need to handle
    return (
      <AppButton
        label={"Switch Network"}
        variant="outlined"
        addElevation={false}
        disableWrapper
        style={{ width: 180 }}
        onClick={switchNetworkMetamask}
      />
    );
  } else if (error) {
    return (
      <AppButton
        label={"Error"}
        variant="outlined"
        addElevation={false}
        disableWrapper
        style={{ width: 180 }}
        onClick={toggleWalletModal}
      />
    );
  } else {
    return <ConnectWalletButton large={false} />;
  }
};

const Web3StatusButton = (props) => {
  return (
    <React.Fragment>
      <Web3StatusButtonInner {...props} />
      <WalletModal></WalletModal>
    </React.Fragment>
  );
};
export default Web3StatusButton;
