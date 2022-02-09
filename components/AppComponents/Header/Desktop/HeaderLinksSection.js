import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { curry } from "ramda";
import React from "react";
import { mapIndexed } from "../../../utils";
import HeaderLink from "./HeaderLink";

const styles = (theme) => ({
  headerLinkRoot: {
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    display: "inline-block",
  },
  linksWrapper: {
    display: "flex",
    flexDirection: "row",
    paddingInlineStart: 0,
    overflow: "hidden",
  },
  navbarsWrapper: {
    margin: theme.spacing(0, 2),
    width: "68%",
    [theme.breakpoints.up("lg")]: {
      width: "72%",
    },
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});

const createHeaderLinkComponent = curry(
  (classes, { message, ...props }, key) => (
    <li key={key} className={classes.headerLinkRoot}>
      <HeaderLink {...props}>{message}</HeaderLink>
    </li>
  )
);

const HeaderLinksSection = (props) => {
  const { classes, headerLinks } = props;

  return (
    <Box
      className={classes.linksWrapper}
      component="ul"
      aria-label={"header.mainMenu"}
    >
      {mapIndexed(createHeaderLinkComponent(classes))(headerLinks)}
    </Box>
  );
};

HeaderLinksSection.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeaderLinksSection);
