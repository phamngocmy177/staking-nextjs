// @material-ui/core
import React from "react";
import { useWalletModalToggle } from "../../../state/application/hooks";
import AppButton from "../../AppComponents/AppButton";

const ConnectWalletButton = (props) => {
  const toggle = useWalletModalToggle();
  return (
    <AppButton
      label={"Connect Wallet"}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      large={true}
      disableWrapper
      {...props}
    ></AppButton>
  );
};

export default ConnectWalletButton;
