import { splitSignature } from "@ethersproject/bytes";
import { MaxUint256 } from "@ethersproject/constants";
import { useCallback, useMemo, useState } from "react";
import {
  useHasPendingApproval,
  useTransactionAdder,
} from "../../state/transactions/hooks";
import { usePairContract, useTokenContract } from "./useContract";
import { useTokenAllowance } from "./useTokenAllowance";
import { useActiveWeb3React } from "./web3";

export function useTransaction(contract) {
  const [txHash, setHash] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [attempting, setAttempting] = useState(false);
  const [attemptingText, setAttemptingText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [active, setActive] = useState(false);

  const addTransaction = useTransactionAdder();

  const sendTransaction = async (
    methodName,
    params,
    value,
    from,
    text,
    gasLimit //optional
  ) => {
    try {
      setActive(true);
      setError(false);
      setAttempting(true);
      setAttemptingText(`${text}...`);

      const transactionParams = {
        value,
        from,
      };

      if (gasLimit) {
        transactionParams["gasLimit"] = gasLimit;
      }

      const transactionResponse = await contract[methodName](
        ...params,
        transactionParams
      );

      addTransaction(transactionResponse, {
        summary: text,
      });
      setHash(transactionResponse.hash);
      setSuccess(true);
      setAttempting(false);
    } catch (e) {
      setAttempting(false);
      setError(true);
      let errorText;
      console;
      if (e.code === 4001) {
        errorText = "Transaction Rejected";
      } else if (e.message.indexOf("Can-not-withdrawn-now") !== -1) {
        errorText = `Claiming is not available yet. if the program's lock time has ended pleaes contact support`;
      } else if (
        e.message.indexOf("One withdraw allowed per user/token") !== -1
      ) {
        errorText = `You have a pending withdraw operation, please wait untill it's finished`;
      } else if (e.message.indexOf("Withdraw operation pending") !== -1) {
        errorText = `You have a pending withdraw operation, please wait untill it's finished`;
      } else {
        errorText = `Unknown error: ${e.message}`;
      }
      setErrorText(errorText);
      console.log("error", e.message);
    }
  };

  const resetState = () => {
    setError(false);
    setAttempting(false);
    setSuccess(false);
    setActive(false);
  };

  const toggleActive = () => {
    setActive((currActive) => !currActive);
  };

  return [
    sendTransaction,
    {
      txHash,
      success,
      error,
      attempting,
      errorText,
      resetState,
      attemptingText,
      toggleActive,
      active,
    },
  ];
}

export const APPROVAL_STATE = {
  UNKNOWN: "UNKNOWN",
  NOT_APPROVED: "NOT_APPROVED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
};

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(token, symbol, spender) {
  const { account } = useActiveWeb3React();
  const currentAllowance = useTokenAllowance(
    token,
    account ?? undefined,
    spender
  );
  const pendingApproval = useHasPendingApproval(token?.address, spender);

  // check the current approval status
  const approvalState = useMemo(() => {
    if (!spender) return APPROVAL_STATE.UNKNOWN;
    if (token?.isNative) return APPROVAL_STATE.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return APPROVAL_STATE.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is

    return currentAllowance.isZero()
      ? pendingApproval
        ? APPROVAL_STATE.PENDING
        : APPROVAL_STATE.NOT_APPROVED
      : APPROVAL_STATE.APPROVED;
  }, [currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async () => {
    if (approvalState !== APPROVAL_STATE.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }
    if (!token) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }

    return tokenContract
      .approve(spender, MaxUint256)
      .then((response) => {
        addTransaction(response, {
          summary: `Approve ${symbol}`,
          approval: { tokenAddress: token.address, spender: spender },
        });
      })
      .catch((error) => {
        console.debug("Failed to approve token", error);
        throw error;
      });
  }, [approvalState, token, tokenContract, spender, addTransaction]);

  return [approvalState, approve];
}

export function useSignTypedData(pairAddress, value, deadline, spender) {
  const { account, library, chainId } = useActiveWeb3React();

  const pairContract = usePairContract(pairAddress);

  const [signatureData, setSignatureData] = useState(null);

  async function onAttemptToApprove() {
    if (!pairContract || !library || !deadline) {
      // throw new Error("missing dependencies");
    }

    // if (isArgentWallet) {
    //   return approveCallback()
    // }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account);

    const EIP712Domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];
    const domain = {
      name: "Uniswap V2",
      version: "1",
      chainId: chainId,
      verifyingContract: pairAddress,
    };

    const Permit = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];
    const message = {
      owner: account,
      spender: spender,
      value:
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    };

    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: "Permit",
      message,
    });

    library
      .send("eth_signTypedData_v4", [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        });
      })
      .catch((error) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          // approveCallback();
        }
      });
  }

  return [onAttemptToApprove, signatureData];
}
