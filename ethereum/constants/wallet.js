import INJECTED_ICON_URL from "../../assets/images/icons/arrow-right.svg";
import METAMASK_ICON_URL from "../../assets/images/icons/metamask.png";
import WALLETLINK_ICON_URL from "../../assets/images/icons/walletlink.svg";
import WALLETCONNECT_ICON_URL from "../../assets/images/icons/walletConnectIcon.svg";
import { injected, walletconnect, walletlink } from "../connectors";

export const SUPPORTED_WALLETS = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconURL: INJECTED_ICON_URL,
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconURL: METAMASK_ICON_URL,
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "WalletConnect",
    iconURL: WALLETCONNECT_ICON_URL,
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: "WalletLink",
    iconURL: WALLETLINK_ICON_URL,
    description: "Connect to Coinbase WalletLink",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
};
