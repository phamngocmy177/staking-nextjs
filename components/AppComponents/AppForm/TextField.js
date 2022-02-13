import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Error from "@material-ui/icons/Error";
import { replaceWhiteSpaces } from "../../utils";
import { REQUIRED } from "./constants";

const AppTextField = ({
  input: { onChange, ...inputProps },
  meta: { touched, error, submitError, dirtySinceLastSubmit },
  children,
  submitFieldErrors,
  childComponent,
  required,
  helperTextFunction,
  startAdornment,
  startAdornmentEndComponent,
  afterOnChange = () => {},
  ...others
}) => {
  const [helperText, setHelperText] = useState();
  const isSubmitError =
    submitFieldErrors && !dirtySinceLastSubmit && submitError;

  const renderHelperText = () => {
    if (touched) {
      if (error && error === REQUIRED) {
        return `${others.label} ${REQUIRED}`;
      } else if (error || isSubmitError) {
        return error || isSubmitError;
      } else if (helperText) {
        return helperText;
      }
    }

    return undefined;
  };

  return (
    <React.Fragment>
      <TextField
        error={(error || isSubmitError) && touched}
        fullWidth
        id={replaceWhiteSpaces(`textfield ${others.label}`)}
        margin="normal"
        {...others}
        {...inputProps}
        onChange={(e) => {
          onChange(e);
          if (helperTextFunction && typeof helperTextFunction === "function") {
            setHelperText(helperTextFunction(e.target.value));
          }
          afterOnChange(e);
        }}
        helperText={renderHelperText()}
        InputLabelProps={{ tabIndex: 0 }}
        FormHelperTextProps={{ tabIndex: 0 }}
        required={required}
        aria-required={required ? "true" : "false"}
        InputProps={{
          startAdornment: startAdornment ? (
            <React.Fragment>
              <InputAdornment position="start">{startAdornment}</InputAdornment>
              {startAdornmentEndComponent}
            </React.Fragment>
          ) : undefined,
          endAdornment:
            (error || isSubmitError) && error && touched ? (
              <InputAdornment>
                <Error color="error" />
              </InputAdornment>
            ) : undefined,
        }}
      >
        {children}
      </TextField>
      {childComponent}
    </React.Fragment>
  );
};

AppTextField.defaultProps = {
  meta: {
    touched: false,
    error: null,
    submitError: null,
  },
};

export default AppTextField;
