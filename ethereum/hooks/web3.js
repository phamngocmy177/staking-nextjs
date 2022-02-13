import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import Web3 from "web3";
import { useEffect, useState, useRef } from "react";
import { MOBILE_QUERY } from "components/utils/responsive";
import { injected } from "../connectors";
import { NETWORK_CONTEXT_NAME } from "../constants/general";

export function useActiveWeb3React() {
  const context = useWeb3ReactCore();
  const contextNetwork = useWeb3ReactCore(NETWORK_CONTEXT_NAME);
  return context.active ? context : contextNetwork;
}

const useWeb3 = () => {
  const { library } = useActiveWeb3React();
  const refEth = useRef(library);
  const [web3, setWeb3] = useState(new Web3(library.provider));

  useEffect(() => {
    if (library !== refEth.current) {
      setWeb3(new Web3(library));
      refEth.current = library;
    }
  }, [library]);

  return web3;
};

export default useWeb3;

export function useEagerConnect() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { activate, active } = useWeb3ReactCore(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error("Failed to activate after accounts changed", error);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}

export const switchNetworkMetamask = async () => {
  if (!window.ethereum) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x3" }],
    });
  } catch (error) {
    console.log("Switch network error", error);
  }
};
