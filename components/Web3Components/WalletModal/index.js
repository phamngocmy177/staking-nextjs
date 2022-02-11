import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import React, { useEffect, useState } from "react";
import usePrevious from "hooks/usePrevious";
import { injected } from "ethereum/connectors";
import { SUPPORTED_WALLETS } from "ethereum/constants/wallet";
import { APPLICATION_MODALS } from "state/application/actions";
import { useModalOpen, useWalletModalToggle } from "state/application/hooks";
import { MOBILE_QUERY } from "../../utils/responsive";
import ResponsiveDialog from "../../AppComponents/ResponsiveDialog";
import AccountDetails from "./AccountDetails";
import Option from "./Option";
import PendingView from "./PendingView";
import { event } from "../../../lib/gtag";
import { switchNetworkMetamask } from "../../../ethereum/hooks/web3";
import AppButton from "../../AppComponents/AppButton";

const WALLET_VIEWS = {
  OPTIONS: "options",
  OPTIONS_SECONDARY: "options_secondary",
  ACCOUNT: "account",
  PENDING: "pending",
};

export default function WalletModal() {
  const { active, account, connector, activate, error } = useWeb3React();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState();
  const [pendingError, setPendingError] = useState();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isOpen = useModalOpen(APPLICATION_MODALS.WALLET);
  const toggleWalletModal = useWalletModalToggle();
  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && isOpen) {
      toggleWalletModal();
    }
  }, [account, previousAccount, toggleWalletModal, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    isOpen,
    activePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (connector) => {
    let name = "";
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        name = SUPPORTED_WALLETS[key].name;
        return name;
      }
      return true;
    });
    // // log selected wallet
    event({
      category: "Wallet",
      action: "Change Wallet",
      label: name,
    });
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={(e) => {
                e.stopPropagation();
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={option.iconURL}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === "MetaMask") {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={"#E8831D"}
                header={"Install Metamask"}
                subheader={null}
                link={"https://metamask.io/"}
                icon={SUPPORTED_WALLETS.METAMASK.iconURL}
              />
            );
          } else {
            return null; //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === "MetaMask" && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === "Injected" && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={(e) => {
              e.stopPropagation();
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={option.iconURL}
          />
        )
      );
    });
  }

  const renderContent = () => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    if (error) {
      return (
        <React.Fragment>
          {error instanceof UnsupportedChainIdError ? (
            <div>
              <h5>Please connect to the appropriate Ethereum network.</h5>
              {isMetamask && (
                <AppButton
                  onClick={switchNetworkMetamask}
                  label="Switch to Ethereum Mainnet"
                ></AppButton>
              )}
            </div>
          ) : (
            <h5>Error connecting. Try refreshing the page.</h5>
          )}
        </React.Fragment>
      );
    }

    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      );
    }

    return (
      <React.Fragment>
        {walletView === WALLET_VIEWS.PENDING ? (
          <PendingView
            connector={pendingWallet}
            error={pendingError}
            setPendingError={setPendingError}
            tryActivation={tryActivation}
          />
        ) : (
          <Grid container>{getOptions()}</Grid>
        )}
      </React.Fragment>
    );
  };
  const renderTitle = () => {
    if (error) {
      return error instanceof UnsupportedChainIdError
        ? "Wrong Network"
        : "Error Connecting";
    }

    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return "Account";
    }

    return walletView !== WALLET_VIEWS.ACCOUNT ? "" : "Connect to a wallet";
  };

  return (
    <ResponsiveDialog
      fixedHeight={false}
      disableFullScreen
      maxWidth="xs"
      open={isOpen}
      handleClose={toggleWalletModal}
      closeButton
      title={renderTitle()}
      goBackButton={walletView !== WALLET_VIEWS.ACCOUNT}
      onGoBackClick={() => {
        setPendingError(false);
        setWalletView(WALLET_VIEWS.ACCOUNT);
      }}
    >
      {renderContent()}
    </ResponsiveDialog>
  );
}
