import Grid from "@material-ui/core/Grid";
import createDecorator from "final-form-focus";
import PropTypes from "prop-types";
import { curry, reduce } from "ramda";
import React from "react";
import { Field, Form } from "react-final-form";
import { mapIndexed } from "../../utils";
import CurrencyInputField from "./CurrencyInputField/";
import TextField from "./TextField";
import AppButton from "../AppButton";

// import "./form-styles.css";
const formatsMap = {
  // checkbox: CheckboxField,
  // select: SelectField,
  // customFormat: NumberFormatField,
  currencyInput: CurrencyInputField,
  // radio: RadioField,
};

const composeValidators = (validators) => (value, allValues) => {
  if (validators) {
    return reduce(
      (error, validator) => error || validator(value, allValues),
      undefined
    )(validators);
  }

  return undefined;
};

const createFieldComponent = curry(
  ({ validate, ...fieldOptions }, key, submitFieldErrors) => (
    <Field
      key={key}
      index={key}
      {...fieldOptions}
      validate={composeValidators(validate)}
      component={formatsMap[fieldOptions.type] || TextField}
      submitFieldErrors={submitFieldErrors}
    />
  )
);

const ContentWrapper = ({ withGridWrapper, children }) =>
  withGridWrapper ? (
    <Grid container spacing={1}>
      {children}
    </Grid>
  ) : (
    children
  );

const focusOnError = createDecorator();

const AppForm = ({
  submitAction,
  formFields,
  submitButtonText,
  children,
  loading,
  success,
  successText,
  withoutSubmit,
  withGridWrapper,
  submitFieldErrors,
  pristine,
  initialValues,
  externalSubmit,
  className,
  trackingClassName,
  submitButtonClassName,
  disabled,
}) => (
  <Form
    onSubmit={withoutSubmit ? () => {} : submitAction}
    initialValues={initialValues}
    decorators={[focusOnError]}
  >
    {({ handleSubmit, pristine: formPristine, submitting }) => (
      <form onSubmit={handleSubmit} className={className} noValidate>
        <ContentWrapper withGridWrapper={withGridWrapper}>
          {mapIndexed(createFieldComponent)(formFields, submitFieldErrors)}
        </ContentWrapper>
        {withoutSubmit || externalSubmit ? null : (
          <React.Fragment>
            {children}
            <AppButton
              success={success}
              successLabel={successText}
              loading={loading}
              label={submitButtonText}
              trackingClassName={trackingClassName}
              className={submitButtonClassName}
              disabled={
                (pristine && formPristine) ||
                submitting ||
                loading ||
                success ||
                disabled
              }
              type="submit"
            />
          </React.Fragment>
        )}
      </form>
    )}
  </Form>
);

AppForm.defaultProps = {
  formFields: [],
  withGridWrapper: false,
  submitFieldErrors: false,
  pristine: true,
};

AppForm.propTypes = {
  formFields: PropTypes.array,
  submitButtonText: PropTypes.string,
  children: PropTypes.element,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  successText: PropTypes.string,
  withoutSubmit: PropTypes.bool,
  withGridWrapper: PropTypes.bool,
  submitFieldErrors: PropTypes.bool,
};

export default AppForm;

// export { default as CheckboxField } from "./CheckboxField";
// export { default as NumberFormatField } from "./NumberFormatField";
// export { default as SelectField } from "./SelectField";
export { default as TextField } from "./TextField";
