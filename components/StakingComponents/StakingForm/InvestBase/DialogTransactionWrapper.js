import React from "react";
import ResponsiveDialog from "../../../AppComponents/ResponsiveDialog";
import TransactionWrapper from "./TransactionWrapperv2";

const DialogTransactionWrapper = ({
  open,
  handleClose,
  transactionProps,
  withoutRetry = true,
  ...others
}) => (
  <ResponsiveDialog
    closeButton
    open={open}
    handleClose={handleClose}
    maxWidth="sm"
  >
    <TransactionWrapper
      {...others}
      {...transactionProps}
      withoutRetry={withoutRetry}
    />
  </ResponsiveDialog>
);

export default DialogTransactionWrapper;
