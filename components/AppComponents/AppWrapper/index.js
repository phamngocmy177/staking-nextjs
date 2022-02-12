/**
 *
 * AppWrapper
 *
 */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    position: "relative",
    backgroundColor: theme.colors.mainBg,
  },
}));

const AppWrapper = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};

export default AppWrapper;
