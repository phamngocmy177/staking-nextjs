import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Error from "@material-ui/icons/Error";
import { prop } from "ramda";
import React, { useState } from "react";
import { replaceWhiteSpaces } from "../../../utils";
import { REQUIRED } from "../constants";
import AssetSelectField from "./AssetSelectField";

const useStyles = makeStyles((theme) => ({
  maxButton: {
    borderRadius: 25,
    marginLeft: theme.spacing(1),
    "& .MuiButton-label": {
      fontSize: 20,
      textDecoration: "underline",
      [theme.breakpoints.down("sm")]: {
        fontSize: 16,
      },
    },
  },
  balanceTypography: {
    fontSize: 16,
    fontWeight: 400,
    marginRight: theme.spacing(1.5),
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
}));

const AppCurrencyInputField = ({
  input: { onChange, ...inputProps },
  meta: { touched, error, submitError, dirtySinceLastSubmit },
  children,
  submitFieldErrors,
  required,
  balance,
  depositAssets,
  selectedAsset,
  onChangeDepositAsset,
  ...others
}) => {
  const [usdValue, setUSDValue] = useState();
  const isSubmitError =
    submitFieldErrors && !dirtySinceLastSubmit && submitError;

  const classes = useStyles();
  const usdRate = prop("usdRate", selectedAsset);
  const symbol = prop("symbol", selectedAsset);

  const renderHelperText = () => {
    if (touched) {
      if (error && error === REQUIRED) {
        return `${others.label} ${REQUIRED}`;
      } else if (error || isSubmitError) {
        return error || isSubmitError;
      } else if (usdValue) {
        return `~ ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(usdValue)}`;
      }
    }

    return undefined;
  };

  return (
    <React.Fragment>
      <TextField
        error={(error || isSubmitError) && touched}
        fullWidth
        placeholder="00.00"
        id={replaceWhiteSpaces(`currencyInputField ${others.label}`)}
        margin="normal"
        {...others}
        {...inputProps}
        onChange={(e) => {
          if (usdRate) {
            setUSDValue(usdRate * e.target.value);
          }
          onChange(e);
        }}
        helperText={renderHelperText()}
        InputLabelProps={{ tabIndex: 0 }}
        FormHelperTextProps={{ tabIndex: 0 }}
        required={required}
        variant="outlined"
        aria-required={required ? "true" : "false"}
        type="number"
        InputProps={{
          startAdornment: symbol ? (
            <React.Fragment>
              <InputAdornment position="start">
                <AssetSelectField
                  depositAssets={depositAssets}
                  selectedAsset={selectedAsset}
                  onChange={onChangeDepositAsset}
                />
              </InputAdornment>
              <Divider orientation="vertical" flexItem />
            </React.Fragment>
          ) : undefined,
          endAdornment: (
            <InputAdornment>
              {(error || isSubmitError) && error && touched && (
                <Error color="error" />
              )}
              <Button
                color="primary"
                variant="text"
                disableElevation
                className={classes.maxButton}
                onClick={() => onChange(balance)}
              >
                max
              </Button>
            </InputAdornment>
          ),
        }}
      >
        {children}
      </TextField>
      <Typography
        variant="body1"
        align="right"
        className={classes.balanceTypography}
        gutterBottom
      >{`Your balance: ~${new Intl.NumberFormat("en-US", {
        maximumFractionDigits:
          selectedAsset.maximumFractionDigits || selectedAsset?.isNative
            ? 3
            : 0,
      }).format(balance || 0)} ${selectedAsset?.symbol}`}</Typography>
    </React.Fragment>
  );
};

AppCurrencyInputField.defaultProps = {
  meta: {
    touched: false,
    error: null,
    submitError: null,
  },
};

export default AppCurrencyInputField;
