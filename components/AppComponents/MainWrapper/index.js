/**
 *
 * MainWrapper
 *
 */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    padding: theme.spacing(4, 0, 0, 0),
  },
  background: {
    [theme.breakpoints.up("md")]: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
}));

const MainWrapper = ({ children, enableBackground }) => {
  const classes = useStyles();
  return (
    <main
      className={classnames(
        classes.root,
        enableBackground ? classes.background : undefined
      )}
    >
      {children}
    </main>
  );
};

MainWrapper.propTypes = {};

export default MainWrapper;
