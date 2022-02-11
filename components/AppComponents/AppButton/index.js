import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Link from "next/link";
import { isNil } from "ramda";
import React from "react";
import messages from "./messages";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(1, 0, 1, 0),
    },
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
    position: "relative",
    width: "100%",
    textAlign: "center",
  },
  buttonLabel: {
    fontSize: "1rem",
    textTransform: "none",
    fontWeight: 700,
  },
  buttonLabelLarge: {
    fontSize: 18,
    textTransform: "none",
    fontWeight: 700,
  },
  buttonLarge: {
    minHeight: 56,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  successTextTypography: {
    textAlign: "center",
  },
  rounded: {
    borderRadius: theme.spacing(4),
  },
  elevation: {
    boxShadow: "0px 0px 20px #00000029",
  },
  dense: {
    padding: theme.spacing(0.75, 0.5),
  },
  outlined: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover": {
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    "&:focus": {
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
    },
  },
  text: {
    boxShadow: "none",
  },
  gutterBottom: {
    marginBottom: theme.spacing(1),
  },
}));

const ContentWrapper = ({
  disableWrapper,
  wrapperClass,
  loading,
  children,
  gutterBottom,
}) => {
  const classes = useStyles();
  return disableWrapper ? (
    children
  ) : (
    <div
      className={classNames(
        wrapperClass,
        classes.wrapper,
        gutterBottom ? classes.gutterBottom : undefined
      )}
    >
      {children}
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};

const LinkWrapper = ({ href, children }) =>
  isNil(href) ? children : <Link href={href}>{children}</Link>;

const KeytangoButton = ({
  label,
  successLabel,
  loading,
  success,
  disabled,
  rounded = true,
  color = "primary",
  // color = primaryColor[5],
  variant = "contained",
  fullWidth = true,
  onClick,
  wrapperClass,
  labelClass,
  disabledClass,
  href,
  disableWrapper,
  addElevation = true,
  dense,
  large = true,
  trackingClassName,
  gutterBottom,
  ...props
}) => {
  const classes = useStyles();
  return (
    <ContentWrapper
      disableWrapper={disableWrapper}
      wrapperClass={wrapperClass}
      success={success}
      successLabel={successLabel}
      loading={loading}
      gutterBottom={gutterBottom}
    >
      <LinkWrapper href={href}>
        <Button
          classes={{
            disabled: disabledClass,
            label: classNames(
              trackingClassName,
              labelClass ||
                (large ? classes.buttonLabelLarge : classes.buttonLabel)
            ),

            root: classNames(
              {
                [classes.buttonSuccess]: success,
                [classes.rounded]: rounded,
                [classes.elevation]: addElevation,
                [classes.dense]: dense,
                [classes.outlined]: variant === "outlined",
                [classes.buttonLarge]: large,
                [classes.text]: variant === "text",
              },
              trackingClassName
            ),
          }}
          fullWidth={fullWidth}
          variant={variant}
          disabled={disabled || loading || success}
          onClick={onClick}
          color={color}
          disableElevation
          {...props}
          aria-busy={loading ? "true" : "false"}
        >
          {label || messages.submitText}
        </Button>
      </LinkWrapper>
    </ContentWrapper>
  );
};

KeytangoButton.defaultProps = {
  successLabel: messages.successText,
  loading: false,
  success: false,
};

export default KeytangoButton;
