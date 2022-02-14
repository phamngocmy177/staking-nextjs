import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";

const styles = (theme) => ({
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  button: {
    height: 40,
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
  },
  buttonLabel: {
    fontSize: 22,
    color: "#898989",
    textTransform: "uppercase",
    fontWeight: 700,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "&:active": {},
  },
  buttonLabelSecondary: {
    fontSize: 20,
    color: theme.palette.background.paper,
    textTransform: "none",
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
  },
  activeLink: {
    fontWeight: 700,
    color: theme.colors.primary,
  },
});

const LinkWrapper = ({ to, target, children }) =>
  target === "_blank" ? (
    <a href={to} target={target}>
      {children}
    </a>
  ) : (
    <Link href={to} passHref prefetch={false}>
      {children}
    </Link>
  );

const HeaderLink = ({
  classes,
  children,
  to,
  target,
  secondary,
  handleClick,
}) => {
  const router = useRouter();

  return (
    <LinkWrapper to={to} target={target}>
      <Button
        classes={{
          root: secondary
            ? `${classes.button} ${classes.secondary}`
            : classes.button,
          label: classnames(
            secondary ? classes.buttonLabelSecondary : classes.buttonLabel,
            router.pathname === to ? classes.activeLink : null
          ),
        }}
        onClick={handleClick}
      >
        {children}
      </Button>
    </LinkWrapper>
  );
};

HeaderLink.propTypes = {
  children: PropTypes.any.isRequired,
  classes: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
  secondary: PropTypes.bool,
};

export default withStyles(styles)(HeaderLink);
