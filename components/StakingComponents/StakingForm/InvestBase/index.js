import React, { useEffect, useState } from "react";
import AppButton from "../../../AppComponents/AppButton";
import AppForm from "../../../AppComponents/AppForm";
import DialogTransactionWrapper from "./DialogTransactionWrapper";

import constants from "./constants";
import validations from "./validations";
import {
  useApproveCallback,
  APPROVAL_STATE,
} from "../../../../ethereum/hooks/useTransaction";

import { makeStyles } from "@material-ui/core/styles";
import { concat, isNil } from "ramda";
import { useTokenBalance } from "../../../../ethereum/hooks/useBalances";
const useStyles = makeStyles((theme) => ({
  form: {
    flexGrow: 1,
    width: "100%",
    "& .MuiInputAdornment-positionStart": {
      minWidth: 95,
      fontSize: 16,
      [theme.breakpoints.down("sm")]: {
        minWidth: 70,
        fontSize: 12,
      },
    },
    "& .MuiOutlinedInput-inputAdornedEnd": {
      paddingLeft: theme.spacing(1),
    },
    "& .MuiSelect-outlined.MuiSelect-outlined": {
      paddingLeft: theme.spacing(1),
    },
  },
}));

/* eslint-disable react/prefer-stateless-function */
function InvestBase({
  initialValues,
  minEntrance = 0,
  customValidations = [],
  depositAsset,
  onSubmit,
  address,
  FormTitleComponent,
  startFormFields = [],
  endFormFields = [],
  AboveSubmitButtonComponent,
  AboveEnterAmountComponent,
  overrideSubmitButtonText,
  disableApprovalFlow,
  disableSubmit,
  ...others
}) {
  const classes = useStyles();
  const [approvalSubmitted, setApprovalSubmitted] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [selectedDepositAsset, setSelectedDepositAsset] =
    useState(depositAsset);
  const [approvalState, approveCallback] = useApproveCallback(
    selectedDepositAsset,
    selectedDepositAsset?.symbol,
    address
  );
  const tokenBalance = useTokenBalance(selectedDepositAsset);
  useEffect(() => {
    if (approvalState === APPROVAL_STATE.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const showApproveFlow =
    approvalState === APPROVAL_STATE.NOT_APPROVED ||
    approvalState === APPROVAL_STATE.PENDING ||
    (approvalSubmitted && approvalState === APPROVAL_STATE.APPROVED);

  const approveSuccess = approvalState === APPROVAL_STATE.APPROVED;
  const approveLoading = approvalState === APPROVAL_STATE.PENDING;

  const handleSubmit = (values) => {
    onSubmit(values, selectedDepositAsset);
    setOpenTransactionModal(true);
  };

  const baseValidations = [
    validations.required,
    (value) =>
      parseFloat(value) >= parseFloat(minEntrance)
        ? undefined
        : `Minumum entrance is ${parseFloat(minEntrance).toFixed(
            selectedDepositAsset?.isNative ? 2 : 0
          )} ${selectedDepositAsset?.symbol}`,
    (value) =>
      parseFloat(value) > 0 ? undefined : `Value must be bigger than 0`,
    (value) =>
      parseFloat(value) <= parseFloat(tokenBalance)
        ? undefined
        : `Not enough ${selectedDepositAsset?.symbol} balance`,
  ];

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  return (
    <React.Fragment>
      <DialogTransactionWrapper
        {...others}
        open={openTransactionModal}
        handleClose={handleCloseTransactionModal}
      />
      {FormTitleComponent ? FormTitleComponent : undefined}
      {AboveEnterAmountComponent ? AboveEnterAmountComponent : undefined}
      <AppForm
        className={classes.form}
        formFields={[
          ...startFormFields,
          {
            ...constants.ENTER_AMMOUNT,
            selectedAsset: selectedDepositAsset,
            onChangeDepositAsset: (asset) => setSelectedDepositAsset(asset),
            balance: tokenBalance,
            validate: concat(baseValidations, customValidations),
          },
          ...endFormFields,
        ]}
        submitAction={handleSubmit}
        submitButtonText={
          isNil(overrideSubmitButtonText)
            ? showApproveFlow
              ? "2. Deposit"
              : "Deposit"
            : overrideSubmitButtonText
        }
        initialValues={initialValues}
        pristine
        disabled={disableSubmit || (showApproveFlow && !approveSuccess)}
      >
        {AboveSubmitButtonComponent ? AboveSubmitButtonComponent : undefined}
        {showApproveFlow && !disableApprovalFlow && (
          <AppButton
            loading={approveLoading}
            label={
              approveSuccess
                ? "Approved"
                : `1. Approve ${selectedDepositAsset?.symbol}`
            }
            onClick={approveCallback}
            success={approveSuccess}
            successLabel="Approve success"
            gutterBottom
          ></AppButton>
        )}
      </AppForm>
    </React.Fragment>
  );
}
export default InvestBase;
