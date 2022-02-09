/**
 *
 * AppWrapper
 *
 */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100%",
    position: "relative",
  },
}));

const AppWrapper = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};

export default AppWrapper;
